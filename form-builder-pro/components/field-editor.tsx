"use client"

import { useState } from "react"
import type { FormField } from "@/types/form"
import { useFormStore } from "@/lib/form-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface FieldEditorProps {
  field: FormField
}

export function FieldEditor({ field }: FieldEditorProps) {
  const { updateField } = useFormStore()
  const [options, setOptions] = useState(field.options || [])

  const handleUpdate = (updates: Partial<FormField>) => {
    updateField(field.id, updates)
  }

  const addOption = () => {
    const newOptions = [...options, `Option ${options.length + 1}`]
    setOptions(newOptions)
    handleUpdate({ options: newOptions })
  }

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index)
    setOptions(newOptions)
    handleUpdate({ options: newOptions })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
    handleUpdate({ options: newOptions })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Field Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={field.label}
              onChange={(e) => handleUpdate({ label: e.target.value })}
              placeholder="Field label"
            />
          </div>

          <div>
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              value={field.placeholder || ""}
              onChange={(e) => handleUpdate({ placeholder: e.target.value })}
              placeholder="Placeholder text"
            />
          </div>

          <div>
            <Label htmlFor="helpText">Help Text</Label>
            <Textarea
              id="helpText"
              value={field.helpText || ""}
              onChange={(e) => handleUpdate({ helpText: e.target.value })}
              placeholder="Additional help text"
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="required"
              checked={field.required}
              onCheckedChange={(checked) => handleUpdate({ required: checked })}
            />
            <Label htmlFor="required">Required field</Label>
          </div>
        </CardContent>
      </Card>

      {/* Validation Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Validation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(field.type === "text" || field.type === "textarea") && (
            <>
              <div>
                <Label htmlFor="minLength">Minimum Length</Label>
                <Input
                  id="minLength"
                  type="number"
                  value={field.validation?.minLength || ""}
                  onChange={(e) =>
                    handleUpdate({
                      validation: {
                        ...field.validation,
                        minLength: Number.parseInt(e.target.value) || undefined,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="maxLength">Maximum Length</Label>
                <Input
                  id="maxLength"
                  type="number"
                  value={field.validation?.maxLength || ""}
                  onChange={(e) =>
                    handleUpdate({
                      validation: {
                        ...field.validation,
                        maxLength: Number.parseInt(e.target.value) || undefined,
                      },
                    })
                  }
                />
              </div>
            </>
          )}

          {field.type === "text" && (
            <div>
              <Label htmlFor="pattern">Pattern (Regex)</Label>
              <Input
                id="pattern"
                value={field.validation?.pattern || ""}
                onChange={(e) =>
                  handleUpdate({
                    validation: {
                      ...field.validation,
                      pattern: e.target.value || undefined,
                    },
                  })
                }
                placeholder="e.g., ^[A-Za-z]+$"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Options for select, radio, checkbox */}
      {(field.type === "select" || field.type === "radio") && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Options</CardTitle>
            <Button size="sm" onClick={addOption}>
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                <Button variant="outline" size="sm" onClick={() => removeOption(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
