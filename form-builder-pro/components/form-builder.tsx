"use client"

import { useState, useCallback } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FieldPalette } from "@/components/field-palette"
import { FieldEditor } from "@/components/field-editor"
import { FormPreview } from "@/components/form-preview"
import { MultiStepManager } from "@/components/multi-step-manager"
import { UndoRedoControls } from "@/components/undo-redo-controls"
import { useFormStore } from "@/lib/form-store"
import { Trash2, Settings, GripVertical, Save, Layers, Eye } from "lucide-react"

interface FormBuilderProps {
  onFormCreated: (formId: string) => void
}

export function FormBuilder({ onFormCreated }: FormBuilderProps) {
  const {
    fields,
    selectedField,
    formTitle,
    formDescription,
    isMultiStep,
    steps,
    addField,
    removeField,
    reorderFields,
    selectField,
    setFormTitle,
    setFormDescription,
    saveForm,
  } = useFormStore()

  const [activeTab, setActiveTab] = useState("build")

  const handleDragEnd = useCallback(
    (result: any) => {
      if (!result.destination) return

      if (result.source.droppableId === "palette" && result.destination.droppableId === "form") {
        const fieldType = result.draggableId
        addField(fieldType, result.destination.index)
      } else if (result.source.droppableId === "form" && result.destination.droppableId === "form") {
        reorderFields(result.source.index, result.destination.index)
      }
    },
    [addField, reorderFields],
  )

  const handleSaveForm = () => {
    const formId = saveForm()
    onFormCreated(formId)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Field Palette */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Field Types</CardTitle>
                <Badge variant="outline">{fields.length} fields</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <FieldPalette />
            </CardContent>
          </Card>
        </div>

        {/* Form Builder */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Form Builder</CardTitle>
                {isMultiStep && (
                  <Badge variant="secondary">
                    <Layers className="h-3 w-3 mr-1" />
                    Multi-step
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <UndoRedoControls />
                <Button variant="outline" size="sm" onClick={handleSaveForm}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)] overflow-auto">
              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  placeholder="Form Title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full text-2xl font-bold border-none outline-none bg-transparent placeholder-muted-foreground"
                />
                <textarea
                  placeholder="Form Description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full text-muted-foreground border-none outline-none bg-transparent placeholder-muted-foreground resize-none"
                  rows={2}
                />
              </div>

              {isMultiStep && <MultiStepManager />}

              <Droppable droppableId="form">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] p-4 border-2 border-dashed rounded-lg transition-colors ${
                      snapshot.isDraggingOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                    }`}
                  >
                    {fields.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <p>Drag fields from the palette to build your form</p>
                      </div>
                    ) : (
                      fields.map((field, index) => (
                        <Draggable key={field.id} draggableId={field.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`mb-4 p-4 bg-card border rounded-lg transition-all ${
                                selectedField?.id === field.id ? "ring-2 ring-primary" : "hover:shadow-md"
                              } ${snapshot.isDragging ? "shadow-lg rotate-1" : ""}`}
                              onClick={() => selectField(field)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                  </div>
                                  <span className="font-medium">{field.label || `${field.type} Field`}</span>
                                  {field.required && (
                                    <Badge variant="destructive" className="text-xs">
                                      Required
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      selectField(field)
                                    }}
                                  >
                                    <Settings className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      removeField(field.id)
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {field.type} • {field.placeholder || "No placeholder"}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
        </div>
      </DragDropContext>

      {/* Properties Panel */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg">Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="build">
                  <Settings className="h-4 w-4 mr-1" />
                  Build
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="build" className="mt-4">
                {selectedField ? (
                  <FieldEditor field={selectedField} />
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Select a field to edit its properties</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="preview" className="mt-4">
                <FormPreview />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
