import { useNavigate } from "react-router-dom"
import Img1 from "../assets/Google-Docs-logo.png"
import { FileText, File } from "lucide-react"

export const Docs = ({ documentId, docName }: { documentId: string; docName: string }) => {
  const navigate = useNavigate()

  const openDoc = (id: string) => {
    navigate(`/documents/${id}`)
  }

  return (
    <div
      onClick={() => openDoc(documentId)}
      className="group relative flex flex-col bg-white dark:bg-[#1e232c] rounded-xl overflow-hidden border border-violet-100 dark:border-violet-900/30 hover:border-violet-300 dark:hover:border-violet-700 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      {/* Document Preview */}
      <div className="relative p-6 flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Base document icon */}
          <File className="absolute inset-0 w-full h-full text-violet-200 dark:text-violet-800/30 transform transition-transform duration-200 group-hover:scale-110" />

          {/* Google Docs logo overlay */}
          <img
            src={Img1 || "/placeholder.svg"}
            alt="Google Docs Icon"
            className="relative w-12 h-12 object-contain transform transition-transform duration-200 group-hover:scale-110"
          />
        </div>
      </div>

      {/* Document Info */}
      <div className="relative p-4 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-4 h-4 text-violet-500 dark:text-violet-400" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Document</span>
        </div>
        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate w-full text-center">
          {docName || "Untitled"}
        </h3>
      </div>

      {/* Interactive elements */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </div>
  )
}

