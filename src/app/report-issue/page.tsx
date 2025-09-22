'use client'

import { useState } from 'react'
import { Upload, X, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ReportIssuePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    issueTitle: '',
    issueCategory: '',
    detailedDescription: '',
    severity: 'low'
  })
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return
    const newFiles = Array.from(files).slice(0, 3 - uploadedFiles.length)
    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData, uploadedFiles)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-content-bg">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-sidebar-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-sidebar-foreground mb-2">Report an Issue</h1>
          <p className="text-muted-foreground">
            Help us improve by reporting bugs or requesting features.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-sidebar-foreground mb-2">
                Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Your name"
                className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sidebar-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-sidebar-foreground mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sidebar-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-sidebar-foreground mb-2">
              Issue Title *
            </label>
            <input
              type="text"
              name="issueTitle"
              value={formData.issueTitle}
              onChange={handleInputChange}
              placeholder="Brief description of the issue"
              className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sidebar-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sidebar-foreground mb-2">
              Category *
            </label>
            <select
              name="issueCategory"
              value={formData.issueCategory}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sidebar-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select category</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="performance">Performance Issue</option>
              <option value="ui">UI/UX Issue</option>
              <option value="account">Account Issue</option>
              <option value="billing">Billing Issue</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-sidebar-foreground mb-2">
              Description *
            </label>
            <textarea
              name="detailedDescription"
              value={formData.detailedDescription}
              onChange={handleInputChange}
              placeholder="Please describe the issue in detail..."
              rows={6}
              className="w-full px-3 py-2 border border-border rounded-lg bg-card text-sidebar-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sidebar-foreground mb-2">
              Severity
            </label>
            <div className="space-y-2">
              {[
                { value: 'low', label: 'Low - Minor inconvenience' },
                { value: 'medium', label: 'Medium - Significant issue' },
                { value: 'high', label: 'High - Critical blocker' }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="severity"
                    value={option.value}
                    checked={formData.severity === option.value}
                    onChange={handleInputChange}
                    className="text-primary"
                  />
                  <span className="text-sm text-sidebar-foreground">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-sidebar-foreground mb-2">
              Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.gif"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload screenshots ({uploadedFiles.length}/3)
                </p>
              </label>
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span className="text-sm text-sidebar-foreground truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Submit Report
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 text-muted-foreground hover:text-sidebar-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}