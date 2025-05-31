"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useFormStore } from "@/lib/form-store"
import { FileText, Users, Calendar, MessageSquare, ShoppingCart, Heart } from "lucide-react"

const templates = [
  {
    id: "contact",
    title: "Contact Us",
    description: "Basic contact form with name, email, and message",
    icon: MessageSquare,
    category: "Business",
    fields: [
      { type: "text", label: "Full Name", required: true, placeholder: "Enter your full name" },
      { type: "email", label: "Email Address", required: true, placeholder: "Enter your email" },
      { type: "text", label: "Subject", required: true, placeholder: "What is this about?" },
      { type: "textarea", label: "Message", required: true, placeholder: "Your message..." },
    ],
  },
  {
    id: "registration",
    title: "Event Registration",
    description: "Registration form for events with attendee details",
    icon: Calendar,
    category: "Events",
    fields: [
      { type: "text", label: "First Name", required: true },
      { type: "text", label: "Last Name", required: true },
      { type: "email", label: "Email", required: true },
      { type: "phone", label: "Phone Number", required: true },
      { type: "select", label: "Ticket Type", required: true, options: ["Regular", "VIP", "Student"] },
      { type: "textarea", label: "Special Requirements", required: false },
    ],
  },
  {
    id: "survey",
    title: "Customer Survey",
    description: "Multi-question survey for customer feedback",
    icon: Users,
    category: "Research",
    fields: [
      {
        type: "radio",
        label: "How satisfied are you?",
        required: true,
        options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
      },
      {
        type: "select",
        label: "How did you hear about us?",
        required: true,
        options: ["Social Media", "Google", "Friend", "Advertisement", "Other"],
      },
      { type: "checkbox", label: "Would you recommend us?", required: false },
      { type: "textarea", label: "Additional Comments", required: false },
    ],
  },
  {
    id: "order",
    title: "Order Form",
    description: "Product order form with customer details",
    icon: ShoppingCart,
    category: "E-commerce",
    fields: [
      { type: "text", label: "Product Name", required: true },
      { type: "number", label: "Quantity", required: true },
      { type: "text", label: "Customer Name", required: true },
      { type: "email", label: "Email", required: true },
      { type: "textarea", label: "Shipping Address", required: true },
      { type: "select", label: "Payment Method", required: true, options: ["Credit Card", "PayPal", "Bank Transfer"] },
    ],
  },
  {
    id: "feedback",
    title: "Feedback Form",
    description: "General feedback collection form",
    icon: Heart,
    category: "Feedback",
    fields: [
      { type: "text", label: "Name", required: false },
      { type: "email", label: "Email", required: false },
      { type: "radio", label: "Overall Experience", required: true, options: ["Excellent", "Good", "Average", "Poor"] },
      { type: "textarea", label: "What did you like most?", required: false },
      { type: "textarea", label: "What could we improve?", required: false },
    ],
  },
  {
    id: "application",
    title: "Job Application",
    description: "Employment application form",
    icon: FileText,
    category: "HR",
    fields: [
      { type: "text", label: "Full Name", required: true },
      { type: "email", label: "Email", required: true },
      { type: "phone", label: "Phone", required: true },
      { type: "text", label: "Position Applied For", required: true },
      {
        type: "select",
        label: "Experience Level",
        required: true,
        options: ["Entry Level", "Mid Level", "Senior Level", "Executive"],
      },
      { type: "textarea", label: "Cover Letter", required: false },
    ],
  },
]

export function TemplateManager() {
  const { loadTemplate } = useFormStore()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = ["all", ...Array.from(new Set(templates.map((t) => t.category)))]

  const filteredTemplates =
    selectedCategory === "all" ? templates : templates.filter((t) => t.category === selectedCategory)

  const handleUseTemplate = (template: (typeof templates)[0]) => {
    loadTemplate(template)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Form Templates</h2>
          <p className="text-muted-foreground">Start with a pre-built template and customize as needed</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === "all" ? "All Templates" : category}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-all group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <template.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {template.category}
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">{template.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Includes {template.fields.length} fields:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.fields.slice(0, 4).map((field, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {field.label}
                      </Badge>
                    ))}
                    {template.fields.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.fields.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                <Button
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                  variant="outline"
                  onClick={() => handleUseTemplate(template)}
                >
                  Use This Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No templates found in this category</p>
        </div>
      )}
    </div>
  )
}
