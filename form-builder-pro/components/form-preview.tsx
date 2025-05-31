"use client"

import { useState } from "react"
import { useFormStore } from "@/lib/form-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormRenderer } from "@/components/form-renderer"
import { Monitor, Tablet, Smartphone } from "lucide-react"

export function FormPreview() {
  const { previewMode, setPreviewMode, fields, formTitle, formDescription } = useFormStore()
  const [previewData, setPreviewData] = useState<Record<string, any>>({})

  const previewModes = [
    { id: "desktop", label: "Desktop", icon: Monitor, width: "w-full" },
    { id: "tablet", label: "Tablet", icon: Tablet, width: "w-[768px]" },
    { id: "mobile", label: "Mobile", icon: Smartphone, width: "w-[375px]" },
  ]

  const currentMode = previewModes.find((mode) => mode.id === previewMode) || previewModes[0]

  return (
    <div className="space-y-4">
      <div className="flex gap-1">
        {previewModes.map((mode) => (
          <Button
            key={mode.id}
            variant={previewMode === mode.id ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode(mode.id as any)}
          >
            <mode.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <div className={`mx-auto transition-all duration-300 ${currentMode.width}`}>
              <div className="bg-card border rounded-lg p-6 shadow-sm">
                {formTitle && <h2 className="text-2xl font-bold mb-2">{formTitle}</h2>}
                {formDescription && <p className="text-muted-foreground mb-6">{formDescription}</p>}

                <FormRenderer fields={fields} data={previewData} onChange={setPreviewData} preview={true} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
