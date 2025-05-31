"use client"

import { Droppable, Draggable } from "@hello-pangea/dnd"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Type, AlignLeft, ChevronDown, CheckSquare, Calendar, Hash, Mail, Phone, Radio } from "lucide-react"

const fieldTypes = [
  { id: "text", label: "Text Input", icon: Type, description: "Single line text" },
  { id: "textarea", label: "Textarea", icon: AlignLeft, description: "Multi-line text" },
  { id: "select", label: "Dropdown", icon: ChevronDown, description: "Select from options" },
  { id: "checkbox", label: "Checkbox", icon: CheckSquare, description: "Yes/No choice" },
  { id: "radio", label: "Radio Group", icon: Radio, description: "Single choice" },
  { id: "date", label: "Date Picker", icon: Calendar, description: "Date selection" },
  { id: "number", label: "Number", icon: Hash, description: "Numeric input" },
  { id: "email", label: "Email", icon: Mail, description: "Email address" },
  { id: "phone", label: "Phone", icon: Phone, description: "Phone number" },
]

export function FieldPalette() {
  return (
    <Droppable droppableId="palette" isDropDisabled={true}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
          {fieldTypes.map((fieldType, index) => (
            <Draggable key={fieldType.id} draggableId={fieldType.id} index={index}>
              {(provided, snapshot) => (
                <Card
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`p-3 cursor-grab active:cursor-grabbing transition-all hover:shadow-md ${
                    snapshot.isDragging ? "shadow-lg rotate-2 ring-2 ring-primary" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-primary/10 rounded">
                      <fieldType.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{fieldType.label}</span>
                        <Badge variant="secondary" className="text-xs">
                          {fieldType.id}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{fieldType.description}</p>
                    </div>
                  </div>
                </Card>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
