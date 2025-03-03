import { useState, useEffect, useCallback, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { TOOLBAR_OPTIONS, SAVE_INTERVAL_MS } from '../constants';
import { io, Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import Groq from "groq-sdk";

// 🔹 Server Configuration
const groq = new Groq({ 
  apiKey: "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", 
  dangerouslyAllowBrowser: true 
});
const SERVER_URL = "http://localhost:3000";

// 🔹 Debounce Hook
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
    const { id: documentId } = useParams();
    const debouncedFetch = useDebounce(fetchCorrections, 1000);
    const debouncedAutocomplete = useDebounce(fetchAutocomplete, 500);

    // 🔹 Autocomplete position tracking
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const cursorPositionRef = useRef<{ index: number; length: number }>({ index: 0, length: 0 });

    // 🔹 Save File Function: Retrieves plain text and saves as a Word file (.doc)
    const handleSave = () => {
        if (!quill) return;
        // Get only the plain text (without HTML tags)
        const plainText = quill.getText();
        // Create a Blob using the plain text and a MIME type recognized by Word
        const blob = new Blob([plainText], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.doc'; // Word file extension
        a.click();
        URL.revokeObjectURL(url);
    };

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

    const wrapperRef = useCallback((wrapper: HTMLDivElement) => {
        if (!wrapper) return;
        wrapper.innerHTML = '';
        
        const editor = document.createElement("div");
        wrapper.append(editor);

        const qul = new Quill(editor, {
            theme: "snow",
            modules: { toolbar: TOOLBAR_OPTIONS }
        });
        
        // Force the editor text to always be black.
        qul.root.style.color = "black";

        qul.disable();
        qul.setText("Loading...");
        setQuill(qul);

        // 🔹 Track cursor position
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

    // 🔹 Text Change Handlers
    useEffect(() => {
        if (!socket || !quill) return;

        const sendHandler = (delta: any) => {
            socket.emit("send-changes", delta);
        };

        const receiveHandler = (delta: any) => {
            quill.updateContents(delta);
        };

        quill.on("text-change", sendHandler);
        socket.on("receive-changes", receiveHandler);

        return () => {
            quill.off("text-change", sendHandler);
            socket.off("receive-changes", receiveHandler);
        };
    }, [socket, quill]);

    // 🔹 Document Loading
    useEffect(() => {
        if (!socket || !quill) return;

        const loadHandler = (document: any) => {
            quill.setContents(document);
            quill.enable();
        };

        socket.on("load-document", loadHandler);
        socket.emit("get-document", { 
            documentId,
<<<<<<< HEAD
            documentName: localStorage.getItem(documentNameFor_${documentId}) || "Untitled",
=======
            documentName: localStorage.getItem(`documentNameFor_${documentId}`) || "Untitled"
>>>>>>> 483b92b182953a231ea4dadba7e5b4ca7eefc010
        });

        return () => { socket.off("load-document", loadHandler); };
    }, [socket, quill, documentId]);

    // 🔹 Auto-Save
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

    // 🔹 AI Suggestions
    async function fetchCorrections(text: string) {
        try {
            if (!text.trim() || text === "Loading...") {
                setSuggestions("");
                return;
            }

            const chatCompletion = await groq.chat.completions.create({
                messages: [{
                    role: "user",
<<<<<<< HEAD
                    content: Please correct and suggest improvements for:\n\n${text}
=======
                    content: `Please correct and suggest improvements for:\n\n${text}`
>>>>>>> 483b92b182953a231ea4dadba7e5b4ca7eefc010
                }],
                model: "mixtral-8x7b-32768"
            });

            setSuggestions(chatCompletion.choices[0]?.message?.content || "No suggestions");
        } catch (error) {
            console.error("Groq API Error:", error);
            setSuggestions("Error fetching suggestions. Please try again.");
        }
    }

    // 🔹 Autocomplete Function
    async function fetchAutocomplete(text: string) {
        try {
            if (!text.trim()) return;
            
            const chatCompletion = await groq.chat.completions.create({
                messages: [{
                    role: "user",
<<<<<<< HEAD
                    content: Suggest 3 autocompletions for this text: "${text}"
=======
                    content: `Suggest 3 autocompletions for this text: "${text}"`
>>>>>>> 483b92b182953a231ea4dadba7e5b4ca7eefc010
                }],
                model: "mixtral-8x7b-32768",
                max_tokens: 50
            });

            const suggestions = chatCompletion.choices[0]?.message?.content
                ?.split('\n')
                .filter(line => line.trim())
                .map(line => line.replace(/^\d+\.\s*/, '').trim())
                .slice(0, 3) || [];

            setAutocompleteSuggestions(suggestions);
            setAutocompleteOpen(suggestions.length > 0);
        } catch (error) {
            console.error("Autocomplete error:", error);
            setAutocompleteOpen(false);
        }
    }

    // 🔹 Handle Text Changes for Autocomplete
    useEffect(() => {
        if (!quill) return;

        const handler = (delta: any) => {
            debouncedFetch(quill.getText());
            
            // Get current text around cursor
            const cursorPos = cursorPositionRef.current.index;
            const text = quill.getText().slice(0, cursorPos);
            const lastWord = text.split(/\s+/).pop();
            
            if (lastWord && lastWord.length > 2) {
                debouncedAutocomplete(text);
            } else {
                setAutocompleteOpen(false);
            }
        };

        quill.on("text-change", handler);
        return () => quill.off("text-change", handler);
    }, [quill, debouncedFetch, debouncedAutocomplete]);

    // 🔹 Handle Keyboard Navigation, including Tab for autocomplete
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
            {/* Save Button */}
            <button style={styles.saveButton} onClick={handleSave}>
                Save as Word File
            </button>
            <div ref={wrapperRef} style={styles.editor}></div>
            
            {/* Suggestions Panel */}
            {suggestions && (
                <div style={styles.suggestionsContainer}>
                    <h3 style={styles.suggestionsHeader}>AI Suggestions:</h3>
                    <p style={styles.suggestionsText}>
                        {suggestions || "Start typing to get suggestions..."}
                    </p>
                </div>
            )}

            {/* Autocomplete Dropdown */}
            {autocompleteOpen && (
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

// 🔹 Updated Styles
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
        minWidth: '200px'
    },
    autocompleteItem: {
        padding: '8px 12px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        ':hover': {
            backgroundColor: '#f5f5f5'
        }
    }
};

<<<<<<< HEAD
export default TextEditor;
=======
export default TextEditor;
>>>>>>> 483b92b182953a231ea4dadba7e5b4ca7eefc010
