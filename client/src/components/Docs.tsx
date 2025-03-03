import { useNavigate } from "react-router-dom";
import Img1 from "../assets/Google-Docs-logo.png";

export const Docs = ({ documentId, docName }: { documentId: string, docName: string }) => {
    const navigate = useNavigate();

    const openDoc = (id: string) => {
        navigate(`/documents/${id}`);
    };

    return (
        <div 
            className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer relative"
            onClick={() => {openDoc(documentId); }}
        >
            {/* Document card content */}
            <div className="p-4 pb-2 flex justify-center">
                <img 
                    src={Img1} 
                    alt="Google Docs Icon" 
                    className="w-full max-w-[80px] h-auto"
                />
            </div>
            
            {/* Document name */}
            <div className="px-4 pb-4 text-center">
                <div className="text-gray-800 dark:text-gray-200 font-medium text-sm truncate">
                    {docName || "Untitled"}
                </div>
            </div>
            
            {/* Highlight border on hover */}
            <div className="absolute inset-0 border-2 border-transparent rounded-lg transition-colors duration-300 group-hover:border-[#7b2cbf]/30 pointer-events-none"></div>
        </div>
    );
};