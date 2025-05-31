"use client"

import { Button } from "@/components/ui/button"
import { useFormStore } from "@/lib/form-store"
import { Undo, Redo } from "lucide-react"

export function UndoRedoControls() {
  const { canUndo, canRedo, undo, redo } = useFormStore()

  return (
    <div className="flex gap-1">
      <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
        <Undo className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)">
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  )
}
