"use client"

import { useState, useEffect } from "react"
import { FormBuilder } from "@/components/form-builder"
import { FormFiller } from "@/components/form-filler"
import { ResponseViewer } from "@/components/response-viewer"
import { TemplateManager } from "@/components/template-manager"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useFormStore } from "@/lib/form-store"
import { useAutoSave } from "@/hooks/use-auto-save"
import { FilePlusIcon as FormPlus, FileText, BarChart3, Palette, Save, Clock } from "lucide-react"

export function FormBuilderApp() {
  const [activeTab, setActiveTab] = useState("builder")
  const [formId, setFormId] = useState("")
  const [loadFormId, setLoadFormId] = useState("")
  const { lastSaved, isAutoSaving } = useAutoSave()
  const { forms } = useFormStore()

  const handleFormCreated = (id: string) => {
    setFormId(id)
    setActiveTab("share")
  }

  const handleLoadForm = () => {
    if (loadFormId.trim()) {
      setActiveTab("filler")
    }
  }

  // Auto-load form from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlFormId = urlParams.get("formId")
    if (urlFormId) {
      setLoadFormId(urlFormId)
      setActiveTab("filler")
    }
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <FormPlus className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Form Builder Pro</h1>
              </div>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Advanced
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              {/* Auto-save indicator */}
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                {isAutoSaving ? (
                  <>
                    <Save className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : lastSaved ? (
                  <>
                    <Clock className="h-4 w-4" />
                    <span>Saved {lastSaved}</span>
                  </>
                ) : null}
              </div>

              <ThemeToggle />
            </div>
          </div>

          <p className="text-muted-foreground mt-2">Create, customize, and share forms with advanced features</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <FormPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Builder</span>
            </TabsTrigger>
            <TabsTrigger value="filler" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Filler</span>
            </TabsTrigger>
            <TabsTrigger value="responses" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Responses</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Templates</span>
            </TabsTrigger>
            <TabsTrigger value="share" className="flex items-center gap-2">
              <span className="hidden sm:inline">Share</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="mt-6">
            <FormBuilder onFormCreated={handleFormCreated} />
          </TabsContent>

          <TabsContent value="filler" className="mt-6">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Load Form</CardTitle>
                <CardDescription>Enter a form ID to fill out a form</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="form-id">Form ID</Label>
                    <Input
                      id="form-id"
                      placeholder="Enter form ID..."
                      value={loadFormId}
                      onChange={(e) => setLoadFormId(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleLoadForm} className="mt-6">
                    Load Form
                  </Button>
                </div>
              </CardContent>
            </Card>
            {loadFormId && <FormFiller formId={loadFormId} />}
          </TabsContent>

          <TabsContent value="responses" className="mt-6">
            <ResponseViewer />
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <TemplateManager />
          </TabsContent>

          <TabsContent value="share" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Share Your Form</CardTitle>
                <CardDescription>Your form has been created and is ready to share</CardDescription>
              </CardHeader>
              <CardContent>
                {formId ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Form ID</Label>
                      <div className="flex gap-2 mt-1">
                        <Input value={formId} readOnly />
                        <Button variant="outline" onClick={() => navigator.clipboard.writeText(formId)}>
                          Copy
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Shareable URL</Label>
                      <div className="flex gap-2 mt-1">
                        <Input value={`${window.location.origin}?formId=${formId}`} readOnly />
                        <Button
                          variant="outline"
                          onClick={() => navigator.clipboard.writeText(`${window.location.origin}?formId=${formId}`)}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setLoadFormId(formId)
                        setActiveTab("filler")
                      }}
                    >
                      Preview Form
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No form created yet. Go to Form Builder to create one.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
