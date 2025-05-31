"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useFormStore } from "@/lib/form-store"
import { Plus, Trash2, ChevronRight } from "lucide-react"

export function MultiStepManager() {
  const { steps, addStep, removeStep, updateStep, toggleMultiStep, isMultiStep } = useFormStore()
  const [newStepTitle, setNewStepTitle] = useState("")

  const handleAddStep = () => {
    if (newStepTitle.trim()) {
      addStep(newStepTitle.trim())
      setNewStepTitle("")
    }
  }

  if (!isMultiStep) {
    return (
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Multi-step Form</h3>
              <p className="text-sm text-muted-foreground">Break your form into multiple steps</p>
            </div>
            <Button onClick={toggleMultiStep}>Enable Multi-step</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Form Steps</CardTitle>
        <Button variant="outline" size="sm" onClick={toggleMultiStep}>
          Disable Multi-step
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new step */}
        <div className="flex gap-2">
          <Input
            placeholder="Step title..."
            value={newStepTitle}
            onChange={(e) => setNewStepTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddStep()}
          />
          <Button onClick={handleAddStep} disabled={!newStepTitle.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Steps list */}
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-2 p-2 border rounded">
              <Badge variant="outline">{index + 1}</Badge>
              <Input
                value={step.title}
                onChange={(e) => updateStep(step.id, { title: e.target.value })}
                className="flex-1"
              />
              <Button variant="ghost" size="sm" onClick={() => removeStep(step.id)} disabled={steps.length <= 1}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {steps.length > 0 && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <span>{step.title}</span>
                {index < steps.length - 1 && <ChevronRight className="h-3 w-3 mx-1" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
