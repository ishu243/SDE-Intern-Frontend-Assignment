"use client"

import type React from "react"
import { useState } from "react"
import type { FormField } from "@/types/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface FormRendererProps {
  fields: FormField[]
  data: Record<string, any>
  onChange: (data: Record<string, any>) => void
  onSubmit?: (data: Record<string, any>) => void
  preview?: boolean
}

export function FormRenderer({ fields, data, onChange, onSubmit, preview = false }: FormRendererProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || value === "")) {
      return `${field.label} is required`
    }

    if (field.validation) {
      const { minLength, maxLength, pattern } = field.validation

      if (minLength && value && value.length < minLength) {
        return `${field.label} must be at least ${minLength} characters`
      }

      if (maxLength && value && value.length > maxLength) {
        return `${field.label} must be no more than ${maxLength} characters`
      }

      if (pattern && value && !new RegExp(pattern).test(value)) {
        return `${field.label} format is invalid`
      }
    }

    if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address"
    }

    if (field.type === "phone" && value && !/^[+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ""))) {
      return "Please enter a valid phone number"
    }

    return null
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    const newData = { ...data, [fieldId]: value }
    onChange(newData)

    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    fields.forEach((field) => {
      const error = validateField(field, data[field.id])
      if (error) {
        newErrors[field.id] = error
      }
    })

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0 && onSubmit) {
      onSubmit(data)
    }
  }

  const renderField = (field: FormField) => {
    const value = data[field.id] || ""
    const error = errors[field.id]

    const fieldProps = {
      id: field.id,
      placeholder: field.placeholder,
      required: field.required,
      "aria-describedby": field.helpText ? `${field.id}-help` : undefined,
      "aria-invalid": !!error,
    }

    let fieldElement: React.ReactNode

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
        fieldElement = (
          <Input
            {...fieldProps}
            type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={error ? "border-destructive" : ""}
          />
        )
        break

      case "number":
        fieldElement = (
          <Input
            {...fieldProps}
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={error ? "border-destructive" : ""}
          />
        )
        break

      case "textarea":
        fieldElement = (
          <Textarea
            {...fieldProps}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={error ? "border-destructive" : ""}
            rows={4}
          />
        )
        break

      case "select":
        fieldElement = (
          <Select value={value} onValueChange={(val) => handleFieldChange(field.id, val)}>
            <SelectTrigger className={error ? "border-destructive" : ""}>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
        break

      case "radio":
        fieldElement = (
          <RadioGroup
            value={value}
            onValueChange={(val) => handleFieldChange(field.id, val)}
            className={error ? "border border-destructive rounded p-2" : ""}
          >
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )
        break

      case "checkbox":
        fieldElement = (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={value || false}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
            />
            <Label htmlFor={field.id}>{field.label}</Label>
          </div>
        )
        break

      case "date":
        fieldElement = (
          <Input
            {...fieldProps}
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={error ? "border-destructive" : ""}
          />
        )
        break

      default:
        fieldElement = (
          <Input
            {...fieldProps}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={error ? "border-destructive" : ""}
          />
        )
    }

    return (
      <div key={field.id} className="space-y-2">
        {field.type !== "checkbox" && (
          <Label htmlFor={field.id} className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}

        {fieldElement}

        {field.helpText && (
          <p id={`${field.id}-help`} className="text-sm text-muted-foreground">
            {field.helpText}
          </p>
        )}

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }

  if (fields.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No fields to display</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map(renderField)}

      {!preview && (
        <Button type="submit" className="w-full">
          Submit Form
        </Button>
      )}
    </form>
  )
}
