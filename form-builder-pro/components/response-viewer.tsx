"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormStore } from "@/lib/form-store"
import { Download, Eye, Search, Filter, Calendar, BarChart3 } from "lucide-react"

interface FormSubmission {
  id: string
  formId: string
  formTitle: string
  data: Record<string, any>
  submittedAt: string
}

export function ResponseViewer() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [selectedForm, setSelectedForm] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null)
  const { forms } = useFormStore()

  useEffect(() => {
    // Load submissions from localStorage
    const savedSubmissions = localStorage.getItem("submissions")
    if (savedSubmissions) {
      const submissionsData = JSON.parse(savedSubmissions)
      const submissionsList = Object.entries(submissionsData).map(([id, data]: [string, any]) => ({
        id,
        ...data,
      }))
      setSubmissions(submissionsList)
    }
  }, [])

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesForm = selectedForm === "all" || submission.formId === selectedForm
    const matchesSearch =
      searchTerm === "" ||
      Object.values(submission.data).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesForm && matchesSearch
  })

  const exportToCSV = () => {
    if (filteredSubmissions.length === 0) return

    const headers = ["Submission ID", "Form", "Submitted At", ...Object.keys(filteredSubmissions[0].data)]
    const rows = filteredSubmissions.map((submission) => [
      submission.id,
      submission.formTitle || submission.formId,
      new Date(submission.submittedAt).toLocaleString(),
      ...Object.values(submission.data),
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `form-responses-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const getFormStats = () => {
    const stats = {
      total: submissions.length,
      thisWeek: submissions.filter((s) => {
        const submittedDate = new Date(s.submittedAt)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return submittedDate > weekAgo
      }).length,
      byForm: {} as Record<string, number>,
    }

    submissions.forEach((submission) => {
      stats.byForm[submission.formId] = (stats.byForm[submission.formId] || 0) + 1
    })

    return stats
  }

  const stats = getFormStats()

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Responses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.thisWeek}</p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{Object.keys(stats.byForm).length}</p>
                <p className="text-sm text-muted-foreground">Active Forms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Form Responses</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToCSV} disabled={filteredSubmissions.length === 0}>
                <Download className="h-4 w-4 mr-1" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Search Responses</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search in responses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="w-48">
              <Label htmlFor="form-filter">Filter by Form</Label>
              <Select value={selectedForm} onValueChange={setSelectedForm}>
                <SelectTrigger>
                  <SelectValue placeholder="All Forms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Forms</SelectItem>
                  {Object.entries(stats.byForm).map(([formId, count]) => {
                    const form = forms[formId]
                    return (
                      <SelectItem key={formId} value={formId}>
                        {form?.title || formId} ({count})
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="table" className="w-full">
            <TabsList>
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="detail">Detail View</TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="mt-4">
              {filteredSubmissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No responses found</p>
                  <p className="text-sm">Responses will appear here when users submit your forms</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Form</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Response Data</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{submission.formTitle || "Untitled Form"}</p>
                              <p className="text-sm text-muted-foreground">{submission.formId}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{new Date(submission.submittedAt).toLocaleDateString()}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(submission.submittedAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {Object.entries(submission.data)
                                .slice(0, 2)
                                .map(([key, value]) => (
                                  <div key={key} className="text-sm">
                                    <span className="font-medium">{key}:</span> {String(value).slice(0, 50)}
                                    {String(value).length > 50 && "..."}
                                  </div>
                                ))}
                              {Object.keys(submission.data).length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{Object.keys(submission.data).length - 2} more
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(submission)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="detail" className="mt-4">
              {selectedSubmission ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Response Details</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline">{selectedSubmission.formTitle || "Untitled Form"}</Badge>
                      <Badge variant="secondary">{new Date(selectedSubmission.submittedAt).toLocaleString()}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(selectedSubmission.data).map(([key, value]) => (
                        <div key={key} className="border-b pb-3">
                          <Label className="text-sm font-medium text-muted-foreground">{key}</Label>
                          <p className="mt-1">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a response from the table to view details</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
