import { useState, useEffect } from "react";
import { Docs } from "./Docs";
import { io } from "socket.io-client";
import { UserButton, SignedIn } from "@clerk/clerk-react";
import { ThemeToggle } from "./ThemeToggle";
import { Dialogbox } from "./Dialogbox";

interface DocumentType {
  _id: string;
  name: string;
  data: {
    ops: any[];
  };
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0f1319] dark:text-gray-100 transition-colors duration-200">
      {/* Navbar with Search and User Button */}
      <div className="flex items-center justify-between bg-white shadow-sm dark:bg-[#161b22] dark:shadow-md p-3 transition-colors duration-200">
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <div className="bg-blue-500 p-2 rounded mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xl font-semibold dark:text-white">Docs</span>
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
              placeholder="Search"
              className="block w-full pl-10 pr-3 py-2 bg-white rounded-md border-gray-200 border dark:border-none focus:ring-2 focus:ring-[#7b2cbf] text-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center">
          {/* Theme Toggle Button */}
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
        {/* New Document Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            Start a new document
          </h2>
          <div><Dialogbox/></div>
          <div className="relative group cursor-pointer">
            
            {/* Highlight on hover */}
            <div className="absolute inset-0 border-2 border-transparent rounded-lg transition-colors duration-300 group-hover:border-[#c77dff]/30 pointer-events-none"></div>
          </div>
        </div>

        {/* Recent Documents Section */}
        {documents.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              Recent documents
            </h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {documents.map((docs) => (
                <Docs
                  documentId={docs._id}
                  docName={docs.name}
                  key={docs._id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};