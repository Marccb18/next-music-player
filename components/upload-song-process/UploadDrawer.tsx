import { Upload } from "lucide-react"
import { Button } from "../primitives/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../primitives/drawer"

interface UploadDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedTrackName: string
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function UploadDrawer({
  isOpen,
  onOpenChange,
  selectedTrackName,
  onFileUpload,
}: UploadDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Subir archivo para</DrawerTitle>
            <DrawerDescription>{selectedTrackName}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200 relative">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-slate-700">Arrastra y suelta tu archivo aquí</p>
                <p className="text-sm text-slate-500">o haz clic para seleccionar archivo .mp3</p>
              </div>
              <input
                type="file"
                accept=".mp3,audio/mp3,audio/mpeg"
                onChange={onFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
} 