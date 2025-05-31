"use client"

import { useEffect, useState } from "react"
import { useFormStore } from "@/lib/form-store"

export function useAutoSave() {
  const [lastSaved, setLastSaved] = useState<string>("")
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const { fields, formTitle, formDescription, isMultiStep, steps } = useFormStore()

  useEffect(() => {
    const autoSave = async () => {
      setIsAutoSaving(true)

      // Simulate save delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const formData = {
        fields,
        formTitle,
        formDescription,
        isMultiStep,
        steps,
        lastSaved: new Date().toISOString(),
      }

      localStorage.setItem("auto-save-draft", JSON.stringify(formData))

      setIsAutoSaving(false)
      setLastSaved(new Date().toLocaleTimeString())
    }

    // Auto-save every 10 seconds if there are changes
    const interval = setInterval(() => {
      if (fields.length > 0 || formTitle || formDescription) {
        autoSave()
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [fields, formTitle, formDescription, isMultiStep, steps])

  // Load auto-saved draft on mount
  useEffect(() => {
    const draft = localStorage.getItem("auto-save-draft")
    if (draft) {
      try {
        const draftData = JSON.parse(draft)
        if (draftData.lastSaved) {
          const savedTime = new Date(draftData.lastSaved)
          const now = new Date()
          const diffMinutes = (now.getTime() - savedTime.getTime()) / (1000 * 60)

          if (diffMinutes < 60) {
            // Only show if saved within last hour
            setLastSaved(savedTime.toLocaleTimeString())
          }
        }
      } catch (error) {
        console.error("Failed to load auto-save draft:", error)
      }
    }
  }, [])

  return { lastSaved, isAutoSaving }
}
