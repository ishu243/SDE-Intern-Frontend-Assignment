"use client"

import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import type { FormField, FormStep } from "@/types/form"

interface FormState {
  fields: FormField[]
  selectedField: FormField | null
  formTitle: string
  formDescription: string
  isMultiStep: boolean
  steps: FormStep[]
  currentStep: number
  previewMode: "desktop" | "tablet" | "mobile"
  forms: Record<string, any>
}

interface FormStore extends FormState {
  // History for undo/redo
  history: FormState[]
  historyIndex: number
  canUndo: boolean
  canRedo: boolean

  // Actions
  addField: (type: string, index?: number) => void
  removeField: (id: string) => void
  updateField: (id: string, updates: Partial<FormField>) => void
  reorderFields: (fromIndex: number, toIndex: number) => void
  selectField: (field: FormField | null) => void
  setPreviewMode: (mode: "desktop" | "tablet" | "mobile") => void
  setFormTitle: (title: string) => void
  setFormDescription: (description: string) => void

  // Multi-step
  toggleMultiStep: () => void
  addStep: (title: string) => void
  removeStep: (id: string) => void
  updateStep: (id: string, updates: Partial<FormStep>) => void

  // Form management
  saveForm: () => string
  loadForm: (formId: string) => void
  loadTemplate: (template: any) => void
  clearForm: () => void

  // History
  undo: () => void
  redo: () => void
  saveToHistory: () => void
}

const createField = (type: string): FormField => {
  const id = `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const baseField: FormField = {
    id,
    type,
    label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
    required: false,
  }

  switch (type) {
    case "select":
    case "radio":
      return { ...baseField, options: ["Option 1", "Option 2", "Option 3"] }
    case "email":
      return { ...baseField, placeholder: "Enter your email address" }
    case "phone":
      return { ...baseField, placeholder: "Enter your phone number" }
    case "date":
      return { ...baseField, placeholder: "Select a date" }
    case "number":
      return { ...baseField, placeholder: "Enter a number" }
    case "textarea":
      return { ...baseField, placeholder: "Enter your message..." }
    default:
      return { ...baseField, placeholder: `Enter ${type}...` }
  }
}

const initialState: FormState = {
  fields: [],
  selectedField: null,
  formTitle: "",
  formDescription: "",
  isMultiStep: false,
  steps: [],
  currentStep: 0,
  previewMode: "desktop",
  forms: {},
}

export const useFormStore = create<FormStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,
    history: [initialState],
    historyIndex: 0,
    canUndo: false,
    canRedo: false,

    saveToHistory: () => {
      const state = get()
      const currentState: FormState = {
        fields: state.fields,
        selectedField: state.selectedField,
        formTitle: state.formTitle,
        formDescription: state.formDescription,
        isMultiStep: state.isMultiStep,
        steps: state.steps,
        currentStep: state.currentStep,
        previewMode: state.previewMode,
        forms: state.forms,
      }

      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push(currentState)

      // Limit history to 50 items
      if (newHistory.length > 50) {
        newHistory.shift()
      }

      set({
        history: newHistory,
        historyIndex: newHistory.length - 1,
        canUndo: newHistory.length > 1,
        canRedo: false,
      })
    },

    undo: () => {
      const state = get()
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1
        const previousState = state.history[newIndex]
        set({
          ...previousState,
          historyIndex: newIndex,
          canUndo: newIndex > 0,
          canRedo: true,
          history: state.history,
        })
      }
    },

    redo: () => {
      const state = get()
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1
        const nextState = state.history[newIndex]
        set({
          ...nextState,
          historyIndex: newIndex,
          canUndo: true,
          canRedo: newIndex < state.history.length - 1,
          history: state.history,
        })
      }
    },

    addField: (type: string, index?: number) => {
      const newField = createField(type)
      set((state) => {
        const newFields = [...state.fields]
        if (index !== undefined) {
          newFields.splice(index, 0, newField)
        } else {
          newFields.push(newField)
        }
        return { fields: newFields, selectedField: newField }
      })
      get().saveToHistory()
    },

    removeField: (id: string) => {
      set((state) => ({
        fields: state.fields.filter((field) => field.id !== id),
        selectedField: state.selectedField?.id === id ? null : state.selectedField,
      }))
      get().saveToHistory()
    },

    updateField: (id: string, updates: Partial<FormField>) => {
      set((state) => ({
        fields: state.fields.map((field) => (field.id === id ? { ...field, ...updates } : field)),
        selectedField: state.selectedField?.id === id ? { ...state.selectedField, ...updates } : state.selectedField,
      }))
      get().saveToHistory()
    },

    reorderFields: (fromIndex: number, toIndex: number) => {
      set((state) => {
        const newFields = [...state.fields]
        const [movedField] = newFields.splice(fromIndex, 1)
        newFields.splice(toIndex, 0, movedField)
        return { fields: newFields }
      })
      get().saveToHistory()
    },

    selectField: (field: FormField | null) => {
      set({ selectedField: field })
    },

    setPreviewMode: (mode: "desktop" | "tablet" | "mobile") => {
      set({ previewMode: mode })
    },

    setFormTitle: (title: string) => {
      set({ formTitle: title })
    },

    setFormDescription: (description: string) => {
      set({ formDescription: description })
    },

    toggleMultiStep: () => {
      set((state) => {
        const newIsMultiStep = !state.isMultiStep
        return {
          isMultiStep: newIsMultiStep,
          steps: newIsMultiStep ? [{ id: "step_1", title: "Step 1", fields: [] }] : [],
        }
      })
      get().saveToHistory()
    },

    addStep: (title: string) => {
      set((state) => ({
        steps: [...state.steps, { id: `step_${Date.now()}`, title, fields: [] }],
      }))
      get().saveToHistory()
    },

    removeStep: (id: string) => {
      set((state) => ({
        steps: state.steps.filter((step) => step.id !== id),
      }))
      get().saveToHistory()
    },

    updateStep: (id: string, updates: Partial<FormStep>) => {
      set((state) => ({
        steps: state.steps.map((step) => (step.id === id ? { ...step, ...updates } : step)),
      }))
      get().saveToHistory()
    },

    saveForm: () => {
      const state = get()
      const formId = `form_${Date.now()}`

      const formData = {
        id: formId,
        title: state.formTitle,
        description: state.formDescription,
        fields: state.fields,
        isMultiStep: state.isMultiStep,
        steps: state.steps,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Save to localStorage
      const savedForms = JSON.parse(localStorage.getItem("forms") || "{}")
      savedForms[formId] = formData
      localStorage.setItem("forms", JSON.stringify(savedForms))

      // Update store
      set((state) => ({
        forms: { ...state.forms, [formId]: formData },
      }))

      return formId
    },

    loadForm: (formId: string) => {
      const savedForms = JSON.parse(localStorage.getItem("forms") || "{}")
      const formData = savedForms[formId]

      if (formData) {
        set({
          fields: formData.fields || [],
          formTitle: formData.title || "",
          formDescription: formData.description || "",
          isMultiStep: formData.isMultiStep || false,
          steps: formData.steps || [],
          selectedField: null,
        })
        get().saveToHistory()
      }
    },

    loadTemplate: (template: any) => {
      const templateFields = template.fields.map((field: any) => ({
        ...createField(field.type),
        ...field,
        id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }))

      set({
        fields: templateFields,
        formTitle: template.title,
        formDescription: template.description,
        selectedField: null,
        isMultiStep: false,
        steps: [],
      })
      get().saveToHistory()
    },

    clearForm: () => {
      set({
        ...initialState,
        forms: get().forms,
      })
      get().saveToHistory()
    },
  })),
)

// Load forms from localStorage on initialization
if (typeof window !== "undefined") {
  const savedForms = localStorage.getItem("forms")
  if (savedForms) {
    useFormStore.setState({ forms: JSON.parse(savedForms) })
  }
}

// Keyboard shortcuts
if (typeof window !== "undefined") {
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
      e.preventDefault()
      useFormStore.getState().undo()
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
      e.preventDefault()
      useFormStore.getState().redo()
    }
  })
}
