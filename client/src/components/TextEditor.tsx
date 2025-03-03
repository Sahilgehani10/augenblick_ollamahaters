

import { useState, useEffect, useCallback, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { TOOLBAR_OPTIONS, SAVE_INTERVAL_MS } from '../constants';
import { io, Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import Groq from "groq-sdk";
import { useAuth, useUser } from "@clerk/clerk-react";

interface ActiveUser {
  userId: string;
  name: string;
  imageUrl: string;
}

const groq = new Groq({ 
  apiKey: "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", 
  dangerouslyAllowBrowser: true 
});
const SERVER_URL = "http://localhost:3000";

const useDebounce = (callback: Function, delay: number) => {
  const timer = useRef<NodeJS.Timeout>();
  return (...args: any[]) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => callback(...args), delay);
  };
};

export const TextEditor = () => {
    const [socket, setSocket] = useState<Socket>();
    const [quill, setQuill] = useState<Quill>();
    const [suggestions, setSuggestions] = useState<string>("");
    const [autocompleteOpen, setAutocompleteOpen] = useState(false);
    const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(0);
    const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
    const { id: documentId } = useParams();
    const { getToken } = useAuth();
    const { user: clerkUser } = useUser();
    const debouncedFetch = useDebounce(fetchCorrections, 1000);
    const debouncedAutocomplete = useDebounce(fetchAutocomplete, 500);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [documentVersions, setDocumentVersions] = useState<any[]>([]);
    const cursorPositionRef = useRef<{ index: number; length: number }>({ index: 0, length: 0 });

    const handleSave = () => {
        if (!quill) return;
        const plainText = quill.getText();
        const blob = new Blob([plainText], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.doc';
        a.click();
        URL.revokeObjectURL(url);
    };
    const fetchDocumentVersions = useCallback(async () => {
        if (socket) {
            console.log("Requesting document versions from server...");
          socket.emit("get-document-versions");
        }
      }, [socket]);
      
      useEffect(() => {
        fetchDocumentVersions();
      }, [fetchDocumentVersions]);

    useEffect(() => {
        const skt = io(SERVER_URL);
        
        skt.on("connect", () => console.log("Connected to server"));
        skt.on("connect_error", (err) => {
            console.error("Connection error:", err);
            if (quill) {
                quill.enable();
                quill.setText("Connection error. Please refresh.");
            }
        });

        setSocket(skt);
        return () => { skt.disconnect(); };
    }, [quill]);
    
    // Authenticate as soon as clerkUser is available and set up active users listener
    useEffect(() => {
        if (!socket || !clerkUser) return;
        console.log("Client: clerkUser available, proceeding with authentication");

        getToken().then(token => {  
            console.log("Client: Sending authentication token", token);
            socket.emit("authenticate", token);
        }).catch(err => {
            console.error("Failed to get token:", err);
        });
    
        socket.on("active-users", (users: ActiveUser[]) => {
            console.log("Received active users:", users);
            setActiveUsers(users);
        });
    
        return () => {
            socket.off("active-users");
        };
    }, [socket, clerkUser, getToken]);
    
    const wrapperRef = useCallback((wrapper: HTMLDivElement) => {
        if (!wrapper) return;
        wrapper.innerHTML = '';
        
        const editor = document.createElement("div");
        wrapper.append(editor);

        const qul = new Quill(editor, {
            theme: "snow",
            modules: { toolbar: TOOLBAR_OPTIONS }
        });
        
        qul.root.style.color = "black";
        qul.disable();
        qul.setText("Loading...");
        setQuill(qul);

        qul.on('selection-change', (range) => {
            if (range) {
                cursorPositionRef.current = range;
                const bounds = qul.getBounds(range.index);
                setPosition({
                    top: bounds.top + bounds.height + 10,
                    left: bounds.left
                });
            }
        });
    }, []);

    useEffect(() => {
        if (!socket || !quill) return;
      
        const sendHandler = (delta: any, oldContents: any, source: string) => {
          if (source === 'user') {
            socket.emit("send-changes", delta);
          }
        };
      
        const receiveHandler = (delta: any) => {
          const selection = quill.getSelection();
          quill.updateContents(delta);
          if (selection) {
            setTimeout(() => quill.setSelection(selection), 0);
          }
        };
      
        quill.on("text-change", sendHandler);
        socket.on("receive-changes", receiveHandler);
      
        return () => {
          quill.off("text-change", sendHandler);
          socket.off("receive-changes", receiveHandler);
        };
      }, [socket, quill]);

    useEffect(() => {
        if (!socket || !quill) return;

        const loadHandler = (document: any) => {
            quill.setContents(document);
            quill.enable();
        };

        socket.on("load-document", loadHandler);
        socket.emit("get-document", { 
            documentId,
            documentName: localStorage.getItem(`document-name-for-${documentId}`) || "Untitled"
        });

        return () => { socket.off("load-document", loadHandler); };
    }, [socket, quill, documentId]);

    useEffect(() => {
        if (!socket || !quill) return;
        
        const interval = setInterval(() => {
            socket.emit("save-document", quill.getContents());
        }, SAVE_INTERVAL_MS);

        return () => {
            clearInterval(interval);
            localStorage.clear();
        };
    }, [socket, quill]);
    //versions
    useEffect(() => {
        if (!socket || !documentId) return;
      
        // Emit the get-document event first
        socket.emit("get-document", {
          documentId,
          documentName: localStorage.getItem(`document-name-for-${documentId}`) || "Untitled",
        });
      
        // Fetch versions after joining the document
        console.log("Requesting document versions from server...");
        socket.emit("get-document-versions");
      
        const handleDocumentVersions = (versions: any[]) => {
          console.log("Received document versions from server:", versions);
          setDocumentVersions(versions);
        };
      
        socket.on("document-versions", handleDocumentVersions);
      
        return () => {
          socket.off("document-versions", handleDocumentVersions);
        };
      }, [socket, documentId]);

    

    async function fetchCorrections(text: string) {
        try {
            if (!text.trim() || text === "Loading...") {
                setSuggestions("");
                return;
            }
            const chatCompletion = await groq.chat.completions.create({
                messages: [{
                    role: "user",
                    content: `Please correct and suggest improvements for:\n\n${text}`
                }],
                model: "mixtral-8x7b-32768"
            });
            setSuggestions(chatCompletion.choices[0]?.message?.content || "No suggestions");
        } catch (error) {
            console.error("Groq API Error:", error);
            setSuggestions("Error fetching suggestions. Please try again.");
        }
    }

    async function fetchAutocomplete(lastWord: string) {
        try {
            if (!lastWord.trim()) {
                setAutocompleteOpen(false);
                return;
            }
            const chatCompletion = await groq.chat.completions.create({
                messages: [{
                    role: "user",
                    content: `Suggest 3 autocompletions for the word "${lastWord}":`
                }],
                model: "mixtral-8x7b-32768",
                max_tokens: 50
            });
            const newSuggestions = chatCompletion.choices[0]?.message?.content
                ?.split('\n')
                .filter(line => line.trim())
                .map(line => line.replace(/^\d+\.\s*/, '').trim())
                .slice(0, 3) || [];
            setAutocompleteSuggestions(newSuggestions);
            setAutocompleteOpen(newSuggestions.length > 0);
        } catch (error) {
            console.error("Autocomplete error:", error);
            setAutocompleteOpen(false);
        }
    }

    useEffect(() => {
        if (!quill) return;

        const handler = (delta: any) => {
            debouncedFetch(quill.getText());

            const cursorPos = cursorPositionRef.current.index;
            const textBeforeCursor = quill.getText().slice(0, cursorPos);
            const words = textBeforeCursor.split(/\s+/);
            const lastWord = words[words.length - 1];

            if (lastWord && lastWord.length > 2) {
                debouncedAutocomplete(lastWord);
            } else {
                setAutocompleteOpen(false);
            }
        };

        quill.on("text-change", handler);
        return () => quill.off("text-change", handler);
    }, [quill, debouncedFetch, debouncedAutocomplete]);

    useEffect(() => {
        if (!autocompleteOpen || !quill) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedSuggestion(prev => Math.min(prev + 1, autocompleteSuggestions.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedSuggestion(prev => Math.max(prev - 1, 0));
            } else if ((e.key === 'Enter' || e.key === 'Tab') && autocompleteOpen) {
                e.preventDefault();
                const suggestion = autocompleteSuggestions[selectedSuggestion];
                if (suggestion) {
                    const cursorPos = cursorPositionRef.current.index;
                    quill.insertText(cursorPos, suggestion + ' ');
                    quill.setSelection(cursorPos + suggestion.length + 1);
                    setAutocompleteOpen(false);
                }
            } else if (e.key === 'Escape') {
                setAutocompleteOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [autocompleteOpen, autocompleteSuggestions, selectedSuggestion, quill]);

    return (
        <div style={styles.editorContainer}>
            <button style={styles.saveButton} onClick={handleSave}>
                Save as Word File
            </button>
            {/*activeusers*/}
            <div style={styles.activeUsersContainer}>
  <h4 style={styles.activeUsersHeading}>Currently Editing:</h4>
  {activeUsers.length > 0 ? (
    activeUsers.map((user) => (
      <div key={user.userId} style={styles.userBadge}>
        <img
          src={user.imageUrl}
          alt={user.name}
          style={styles.userAvatar}
        />
        <span style={styles.userName}>{user.name}</span>
      </div>
    ))
  ) : (
    <p>No other users are currently editing.</p>
  )}
</div>
            {/*versions*/}
            <div style={styles.versionsContainer}>
      <h4 style={styles.versionsHeading}>Document Versions:</h4>
      {documentVersions.map((version, index) => (
        <div key={index} style={styles.versionItem}>
          <p style={styles.versionInfo}>
            Version {index + 1} - {new Date(version.createdAt).toLocaleString()}
          </p>
          <p style={styles.versionUser}>Updated by: {version.updatedBy}</p>
          <button
            style={styles.restoreButton}
            onClick={() => {
              if (quill) {
                quill.setContents(version.data);
              }
            }}
          >
            Restore
          </button>
        </div>
      ))}
    </div>
            {/*editor*/}
            <div ref={wrapperRef} style={styles.editor}></div>
            
            {suggestions && (
                <div style={styles.suggestionsContainer}>
                    <h3 style={styles.suggestionsHeader}>AI Suggestions:</h3>
                    <p style={styles.suggestionsText}>
                        {suggestions || "Start typing to get suggestions..."}
                    </p>
                </div>
            )}

            {autocompleteOpen && autocompleteSuggestions.length > 0 && (
                <div style={{
                    ...styles.autocompleteContainer,
                    top: position.top,
                    left: position.left
                }}>
                    {autocompleteSuggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            style={{
                                ...styles.autocompleteItem,
                                backgroundColor: index === selectedSuggestion ? '#f0f0f0' : 'white'
                            }}
                            onMouseEnter={() => setSelectedSuggestion(index)}
                            onClick={() => {
                                if (quill) {
                                    const cursorPos = cursorPositionRef.current.index;
                                    quill.insertText(cursorPos, suggestion + ' ');
                                    quill.setSelection(cursorPos + suggestion.length + 1);
                                    setAutocompleteOpen(false);
                                }
                            }}
                        >
                            {suggestion}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    editorContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '1rem',
        padding: '2rem',
        height: '100vh',
        backgroundColor: '#f0f2f5',
        position: 'relative' as const,
    },
    saveButton: {
        alignSelf: 'flex-end',
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    activeUsersContainer: {
        position: 'fixed' as const,
        top: '1rem',
        right: '1rem',
        backgroundColor: 'white',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 1000,
        maxWidth: '250px'
    },
    activeUsersHeading: {
        margin: '0 0 1rem 0',
        fontSize: '1rem',
        color: '#2c3e50'
    },
    userBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        margin: '0.5rem 0',
        padding: '0.25rem',
        borderRadius: '4px'
    },
    userAvatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%'
    },
    userName: {
        fontSize: '0.9rem',
        color: '#34495e'
    },
    editor: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    suggestionsContainer: {
        flex: 1,
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflowY: 'auto' as const,
        maxHeight: '90vh'
    },
    suggestionsHeader: {
        margin: '0 0 1rem 0',
        color: '#2c3e50',
        borderBottom: '2px solid #3498db',
        paddingBottom: '0.5rem'
    },
    suggestionsText: {
        margin: 0,
        lineHeight: '1.6',
        color: '#34495e',
        whiteSpace: 'pre-wrap' as const
    },
    autocompleteContainer: {
        position: 'absolute' as const,
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 1000,
        minWidth: '250px'
    },
    autocompleteItem: {
        padding: '8px 12px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        ':hover': {
            backgroundColor: '#f5f5f5'
        }
    },
    versionsContainer: {
        position: 'fixed' as const,
        top: '1rem',
        left: '1rem',
        backgroundColor: 'white',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 1000,
        maxWidth: '300px',
        maxHeight: '400px',
        overflowY: 'auto' as const,
      },
      versionsHeading: {
        margin: '0 0 1rem 0',
        fontSize: '1rem',
        color: '#2c3e50',
      },
      versionItem: {
        marginBottom: '1rem',
        padding: '0.5rem',
        borderBottom: '1px solid #ddd',
      },
      versionInfo: {
        margin: '0 0 0.5rem 0',
        fontSize: '0.9rem',
        color: '#34495e',
      },
      versionUser: {
        margin: '0 0 0.5rem 0',
        fontSize: '0.8rem',
        color: '#7f8c8d',
      },
      restoreButton: {
        padding: '0.25rem 0.5rem',
        fontSize: '0.8rem',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      },
    
};

export default TextEditor;
