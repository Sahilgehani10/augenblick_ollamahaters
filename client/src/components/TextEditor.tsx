"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { TOOLBAR_OPTIONS, SAVE_INTERVAL_MS } from "../constants"
import { io, type Socket } from "socket.io-client"
import { useParams } from "react-router-dom"
import Groq from "groq-sdk"
import { useAuth, useUser } from "@clerk/clerk-react"
import { Save, FileText, Users, History, Lightbulb, Wand2 } from "lucide-react"

interface ActiveUser {
  userId: string
  name: string
  imageUrl: string
}

const groq = new Groq({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
})
const SERVER_URL = "http://localhost:3000"

const useDebounce = (callback: Function, delay: number) => {
  const timer = useRef<NodeJS.Timeout>()
  return (...args: any[]) => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => callback(...args), delay)
  }
}

export const TextEditor = () => {
  const [socket, setSocket] = useState<Socket>()
  const [quill, setQuill] = useState<Quill>()
  const [suggestions, setSuggestions] = useState<string>("")
  const [aiTemplate] = useState("Please correct and suggest improvements for:\n\n{text}")
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([])
  const [documentVersions, setDocumentVersions] = useState<any[]>([])
  const [showVersions, setShowVersions] = useState(false)
  const [showUsers, setShowUsers] = useState(true)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const { id: documentId } = useParams()
  const { getToken } = useAuth()
  const { user: clerkUser } = useUser()
  const debouncedFetch = useDebounce(fetchCorrections, 1000)
  const [setPosition] = useState({ top: 0, left: 0 }) // Fixed: Added setPosition to state
  const cursorPositionRef = useRef<{ index: number; length: number }>({ index: 0, length: 0 })

  // Save document as a Word file
  const handleSave = () => {
    if (!quill) return
    const plainText = quill.getText()
    const blob = new Blob([plainText], { type: "application/msword" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "document.doc"
    a.click()
    URL.revokeObjectURL(url)
  }

  // New function: Generate a template using AI and insert it into the editor.
  const handleGenerateTemplate = async () => {
    if (!quill) return
    // Prompt the user for the type of template they want
    const templateType = prompt("Enter the type of template you want to generate:")
    if (!templateType) return

    try {
      // Request AI to generate a template based on the specified type.
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Generate a detailed template for a ${templateType} document.`,
          },
        ],
        model: "mixtral-8x7b-32768",
        max_tokens: 2000,
      })
      const generatedTemplate = chatCompletion.choices[0]?.message?.content?.trim()
      if (generatedTemplate) {
        // Insert the generated template at the current cursor position.
        const selection = quill.getSelection()
        const index = selection ? selection.index : quill.getLength()
        quill.insertText(index, generatedTemplate)
        quill.setSelection(index + generatedTemplate.length)
      }
    } catch (error) {
      console.error("Error generating template:", error)
    }
  }

  // Request document versions from the server
  const fetchDocumentVersions = useCallback(async () => {
    if (socket) {
      console.log("Requesting document versions from server...")
      socket.emit("get-document-versions")
    }
  }, [socket])

  useEffect(() => {
    fetchDocumentVersions()
  }, [fetchDocumentVersions])

  useEffect(() => {
    const skt = io(SERVER_URL)

    skt.on("connect", () => console.log("Connected to server"))
    skt.on("connect_error", (err) => {
      console.error("Connection error:", err)
      if (quill) {
        quill.enable()
        quill.setText("Connection error. Please refresh.")
      }
    })

    setSocket(skt)
    return () => {
      skt.disconnect()
    }
  }, [quill]) // Added quill as a dependency

  // Authenticate with Clerk and listen for active users
  useEffect(() => {
    if (!socket || !clerkUser) return
    console.log("Client: clerkUser available, proceeding with authentication")

    getToken()
      .then((token) => {
        console.log("Client: Sending authentication token", token)
        socket.emit("authenticate", token)
      })
      .catch((err) => {
        console.error("Failed to get token:", err)
      })

    socket.on("active-users", (users: ActiveUser[]) => {
      console.log("Received active users:", users)
      setActiveUsers(users)
    })

    return () => {
      socket.off("active-users")
    }
  }, [socket, clerkUser, getToken])

  // Setup the Quill editor and add image upload support via the toolbar
  const wrapperRef = useCallback(
    (wrapper: HTMLDivElement) => {
      if (!wrapper) return
      wrapper.innerHTML = ""

      const editor = document.createElement("div")
      wrapper.append(editor)

      const qul = new Quill(editor, {
        theme: "snow",
        modules: { toolbar: TOOLBAR_OPTIONS },
      })

      qul.root.style.color = "black"
      qul.disable()
      qul.setText("Loading...")
      setQuill(qul)

      // Image upload handler via toolbar image button
      qul.getModule("toolbar").addHandler("image", () => {
        const input = document.createElement("input")
        input.setAttribute("type", "file")
        input.setAttribute("accept", "image/*")
        input.click()

        input.onchange = () => {
          if (input.files && input.files[0]) {
            const file = input.files[0]
            const reader = new FileReader()
            reader.onload = () => {
              const imageUrl = reader.result as string
              const range = qul.getSelection()
              if (range) {
                qul.insertEmbed(range.index, "image", imageUrl)
              } else {
                qul.insertEmbed(qul.getLength(), "image", imageUrl)
              }
            }
            reader.readAsDataURL(file)
          }
        }
      })

      // Track cursor position for potential positioning
      qul.on("selection-change", (range) => {
        if (range) {
          cursorPositionRef.current = range
          const bounds = qul.getBounds(range.index)
          setPosition({
            top: bounds.top + bounds.height + 10,
            left: bounds.left,
          })
        }
      })
    },
    [setPosition],
  ) // Fixed: Added setPosition as a dependency

  // Send and receive document changes
  useEffect(() => {
    if (!socket || !quill) return

    const sendHandler = (delta: any, oldContents: any, source: string) => {
      if (source === "user") {
        socket.emit("send-changes", delta)
      }
    }

    const receiveHandler = (delta: any) => {
      const selection = quill.getSelection()
      quill.off("text-change", sendHandler)
      quill.updateContents(delta, "api")
      quill.on("text-change", sendHandler)
      if (selection) {
        setTimeout(() => quill.setSelection(selection), 0)
      }
    }

    quill.on("text-change", sendHandler)
    socket.on("receive-changes", receiveHandler)

    return () => {
      quill.off("text-change", sendHandler)
      socket.off("receive-changes", receiveHandler)
    }
  }, [socket, quill])

  // Load document from server
  useEffect(() => {
    if (!socket || !quill) return

    const loadHandler = (document: any) => {
      quill.setContents(document)
      quill.enable()
    }

    socket.on("load-document", loadHandler)
    socket.emit("get-document", {
      documentId,
      documentName: localStorage.getItem(`document-name-for-${documentId}`) || "Untitled",
    })

    return () => {
      socket.off("load-document", loadHandler)
    }
  }, [socket, quill, documentId])

  // Auto-save document periodically
  useEffect(() => {
    if (!socket || !quill) return

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents())
    }, SAVE_INTERVAL_MS)

    return () => {
      clearInterval(interval)
      localStorage.clear()
    }
  }, [socket, quill])

  // Listen for document version updates from the server
  useEffect(() => {
    if (!socket || !documentId) return
    console.log("Requesting document versions from server...")
    socket.emit("get-document-versions")

    const handleDocumentVersions = (versions: any[]) => {
      console.log("Received document versions from server:", versions)
      setDocumentVersions(versions)
    }

    socket.on("document-versions", handleDocumentVersions)

    return () => {
      socket.off("document-versions", handleDocumentVersions)
    }
  }, [socket, documentId])

  // AI corrections using Groq API (using custom aiTemplate)
  async function fetchCorrections(text: string) {
    try {
      if (!text.trim() || text === "Loading...") {
        setSuggestions("")
        return
      }
      const prompt = aiTemplate.replace("{text}", text)
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "mixtral-8x7b-32768",
      })
      setSuggestions(chatCompletion.choices[0]?.message?.content || "No suggestions")
    } catch (error) {
      console.error("Groq API Error:", error)
      setSuggestions("Error fetching suggestions. Please try again.")
    }
  }

  // Trigger AI corrections on text-change
  useEffect(() => {
    if (!quill) return

    const handler = (delta: any, oldContents: any, source: string) => {
      if (source !== "user") return
      debouncedFetch(quill.getText())
    }

    quill.on("text-change", handler)
    return () => quill.off("text-change", handler)
  }, [quill, debouncedFetch])

  // Existing keydown handler for Tab-triggered autocomplete remains unchanged
  useEffect(() => {
    const handleTabKey = async (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault()
        if (!quill) return
        const selection = quill.getSelection()
        if (!selection) return
        const cursorPos = selection.index
        const textBeforeCursor = quill.getText(0, cursorPos)
        const words = textBeforeCursor.split(/\s+/)
        const lastWord = words[words.length - 1]
        if (!lastWord) return

        try {
          const chatCompletion = await groq.chat.completions.create({
            messages: [
              {
                role: "user",
                content: `Suggest a completion for the word "${lastWord}":`,
              },
            ],
            model: "mixtral-8x7b-32768",
            max_tokens: 2000,
          })
          const suggestionText = chatCompletion.choices[0]?.message?.content?.trim()
          if (suggestionText) {
            const startIndex = textBeforeCursor.lastIndexOf(lastWord)
            quill.deleteText(startIndex, lastWord.length)
            quill.insertText(startIndex, suggestionText + " ")
            quill.setSelection(startIndex + suggestionText.length + 1)
          }
        } catch (error) {
          console.error("Autocomplete error:", error)
        }
      }
    }

    document.addEventListener("keydown", handleTabKey)
    return () => document.removeEventListener("keydown", handleTabKey)
  }, [quill])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-2 rounded-lg shadow-md">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-700 to-purple-700 dark:from-violet-400 dark:to-purple-400 text-transparent bg-clip-text">
              Collaborative Editor
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUsers(!showUsers)}
              className={`p-2 rounded-full ${showUsers ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"} hover:bg-violet-200 dark:hover:bg-violet-800/40 transition-colors`}
              title="Toggle Users Panel"
            >
              <Users className="h-5 w-5" />
            </button>

            <button
              onClick={() => setShowVersions(!showVersions)}
              className={`p-2 rounded-full ${showVersions ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"} hover:bg-violet-200 dark:hover:bg-violet-800/40 transition-colors`}
              title="Toggle Versions Panel"
            >
              <History className="h-5 w-5" />
            </button>

            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className={`p-2 rounded-full ${showSuggestions ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"} hover:bg-violet-200 dark:hover:bg-violet-800/40 transition-colors`}
              title="Toggle AI Suggestions"
            >
              <Lightbulb className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6 flex flex-col gap-6">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md"
          >
            <Save className="h-4 w-4" />
            Save as Word
          </button>

          <button
            onClick={handleGenerateTemplate}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md"
          >
            <Wand2 className="h-4 w-4" />
            Generate Template
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Editor */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-violet-100 dark:border-violet-900/20 h-[500px] overflow-y-auto">
                <div ref={wrapperRef} className="h-full"></div>
            </div>


            {/* AI Suggestions */}
            {showSuggestions && suggestions && (
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-violet-100 dark:border-violet-900/20 p-5 animate-fade-in max-h-[300px] overflow-y-auto">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 p-2 rounded-lg">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-transparent bg-clip-text">
                    AI Suggestions
                  </h3>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {suggestions || "Start typing to get suggestions..."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Side Panels */}
          <div className="lg:w-80 flex flex-col gap-6">
            {/* Active Users */}
            {showUsers && (
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-violet-100 dark:border-violet-900/20 p-5 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 text-transparent bg-clip-text">
                    Currently Editing
                  </h3>
                </div>

                {activeUsers.length > 0 ? (
                  <div className="space-y-3">
                    {activeUsers.map((user) => (
                      <div
                        key={user.userId}
                        className="flex items-center gap-3 p-2 rounded-lg bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/20"
                      >
                        <img
                          src={user.imageUrl || "/placeholder.svg"}
                          alt={user.name}
                          className="w-10 h-10 rounded-full border-2 border-violet-200 dark:border-violet-700"
                        />
                        <span className="font-medium text-gray-800 dark:text-gray-200">{user.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 italic">No other users are currently editing.</p>
                )}
              </div>
            )}

            {/* Document Versions */}
            {showVersions && (
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-violet-100 dark:border-violet-900/20 p-5 max-h-[500px] overflow-y-auto animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 p-2 rounded-lg">
                    <History className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 text-transparent bg-clip-text">
                    Document Versions
                  </h3>
                </div>

                {documentVersions.length > 0 ? (
                  <div className="space-y-4">
                    {documentVersions.map((version, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/20"
                      >
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Version {index + 1}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {new Date(version.createdAt).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Updated by: {version.updatedBy || "Unknown"}
                        </p>
                        <button
                          onClick={() => {
                            if (quill) {
                              quill.setContents(version.data)
                            }
                          }}
                          className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                        >
                          Restore Version
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 italic">No document versions available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextEditor

