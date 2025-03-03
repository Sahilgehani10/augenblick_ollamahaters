import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Img2 from "../assets/Create-New-Image.png"
import { useNavigate } from "react-router-dom"
import { v4 as uuidV4 } from "uuid"
import { useState } from "react"
import { FileText, Plus } from "lucide-react"

export function Dialogbox() {
  const navigate = useNavigate()
  const [docName, setDocName] = useState<string>("")

  const createDoc = (docId: string) => {
    navigate(`/documents/${docId}`)
  }

  const handleSubmit = () => {
    if (!docName.trim()) return
    const id = uuidV4()
    localStorage.setItem(`document-name-for-${id}`, docName)
    createDoc(id)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="border-2 p-2 bg-white dark:bg-[#1e232c] border-violet-100 dark:border-violet-900/30 h-[200px] w-[160px] rounded-xl hover:border-violet-400 dark:hover:border-violet-700 hover:shadow-md transition-all duration-200 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 to-purple-50/80 dark:from-violet-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          <img
            className="h-full w-full cursor-pointer object-contain relative z-10"
            src={Img2 || "/placeholder.svg"}
            alt="Create new document"
          />
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] rounded-xl border-violet-200 dark:border-violet-800/30 shadow-xl bg-white dark:bg-[#1e232c]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-violet-700 to-purple-700 dark:from-violet-400 dark:to-purple-400 text-transparent bg-clip-text">
              Create a new document
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Enter a name for your document. Click create when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right font-medium text-gray-700 dark:text-gray-300">
              Name
            </Label>
            <Input
              id="name"
              className="col-span-3 border-violet-200 dark:border-violet-800/30 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600 focus:border-transparent"
              value={docName}
              onChange={(e) => {
                setDocName(e.target.value)
              }}
              placeholder="Untitled document"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

