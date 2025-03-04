import { useState, useEffect } from "react";
import { Docs } from "./Docs";
import { io } from "socket.io-client";
import { UserButton, SignedIn } from "@clerk/clerk-react";
import { ThemeToggle } from "./ThemeToggle";
import { Dialogbox } from "./Dialogbox";
import { Link } from "react-router-dom";

interface DocumentType {
  _id: string;
  name: string;
  data: {
    ops: any[];
  };
  activeUsers: any[];
  __v: number;
}

export const LandingPage = () => {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_URL);
    socket.emit("get-all-documents");

    socket.on("all-documents", (allDocuments) => {
      setDocuments(allDocuments);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0f1319] dark:text-gray-100 transition-colors duration-200">
      {/* Navbar with Search and User Button */}
      <div className="flex items-center justify-between bg-white shadow-sm dark:bg-[#161b22] dark:shadow-md p-3 transition-colors duration-200">
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <Link to="/">
            <span className="text-xl font-semibold dark:text-white">Collab Edit</span>
            </Link>
          </div>
        </div>

        <div className="flex-grow mx-4 max-w-2xl">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search documents..."
              className="block w-full pl-10 pr-3 py-2 bg-white rounded-md border-gray-200 border dark:border-none focus:ring-2 focus:ring-[#7b2cbf] text-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center">
          <ThemeToggle />
          <SignedIn>
            <div className="ml-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1 transition-colors">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "shadow-lg rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-[#7b2cbf]",
                  },
                }}
              />
            </div>
          </SignedIn>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            Start a new document
          </h2>
          <div><Dialogbox/></div>
        </div>

        {filteredDocuments.length > 0 ? (
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              {searchQuery ? `Search results for "${searchQuery}"` : "Recent documents"}
            </h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredDocuments.map((docs) => (
                <Docs
                  documentId={docs._id}
                  docName={docs.name}
                  key={docs._id}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No documents found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};