"use client"

import { useState, useEffect } from "react"
import { FormRenderer } from "@/components/form-renderer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface FormFillerProps {
  formId: string
}

export function FormFiller({ formId }: FormFillerProps) {
  const [formData, setFormData] = useState<any>(null)
  const [submissionData, setSubmissionData] = useState<Record<string, any>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedForms = localStorage.getItem("forms")
    if (savedForms) {
      const forms = JSON.parse(savedForms)
      const form = forms[formId]
      if (form) {
        setFormData(form)
      }
    }
    setLoading(false)
  }, [formId])

  const handleSubmit = (data: Record<string, any>) => {
    const submissions = JSON.parse(localStorage.getItem("submissions") || "{}")
    const submissionId = Date.now().toString()

    submissions[submissionId] = {
      formId,
      formTitle: formData?.title || "Untitled Form",
      data,
      submittedAt: new Date().toISOString(),
    }

    localStorage.setItem("submissions", JSON.stringify(submissions))
    setIsSubmitted(true)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">Loading form...</div>
        </CardContent>
      </Card>
    )
  }

  if (!formData) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-destructive">Form not found. Please check the form ID.</div>
        </CardContent>
      </Card>
    )
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-green-700">Form Submitted Successfully!</h2>
            <p className="text-muted-foreground">Thank you for your submission.</p>
            <Button onClick={() => setIsSubmitted(false)}>Submit Another Response</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{formData.title || "Form"}</CardTitle>
        {formData.description && <p className="text-muted-foreground">{formData.description}</p>}
      </CardHeader>
      <CardContent>
        <FormRenderer
          fields={formData.fields}
          data={submissionData}
          onChange={setSubmissionData}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  )
}
