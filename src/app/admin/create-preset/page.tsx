'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'

const PROVIDERS = ['OPENAI', 'FLUX_DEV', 'FLUX_PRO', 'FLUX_SCHNELL'] as const
const CATEGORIES = ['Portrait', 'Style', 'Fantasy', 'Art', 'Transform', 'Abstract'] as const
const BADGE_COLORS = ['blue', 'green', 'red', 'purple', 'yellow', 'pink', 'gray'] as const

export default function CreatePresetPage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    prompt: '',
    badge: '',
    badgeColor: 'blue',
    credits: 1,
    category: 'Portrait',
    provider: 'OPENAI' as const,
    owner: '',
    isActive: true,
    slider_img: '',
    gallery: '',
    inputFields: '',
    variables: ''
  })

  // Show loading while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4 mx-auto"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  // Check if user is signed in
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please Sign In</h1>
          <p className="text-gray-400">You need to be signed in to access this page</p>
        </div>
      </div>
    )
  }

  // Admin check
  const userEmail = user?.emailAddresses?.[0]?.emailAddress
  const requiredEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
  
  console.log('Debug - User email:', userEmail)
  console.log('Debug - Required email:', requiredEmail)
  console.log('Debug - User object:', user)
  
  if (!user || userEmail !== requiredEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-2">Admin access required</p>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-left">
            <p className="text-sm text-gray-300 mb-1">
              <span className="text-gray-500">Your email:</span> {userEmail || 'Not logged in'}
            </p>
            <p className="text-sm text-gray-300">
              <span className="text-gray-500">Required email:</span> {requiredEmail || 'Not configured'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      // Parse JSON fields if provided
      let parsedSliderImg = null
      let parsedGallery = null
      let parsedInputFields = null
      let parsedVariables = null

      if (formData.slider_img.trim()) {
        try {
          parsedSliderImg = JSON.parse(formData.slider_img)
        } catch {
          setMessage('Invalid JSON in slider_img field')
          setIsSubmitting(false)
          return
        }
      }

      if (formData.gallery.trim()) {
        try {
          parsedGallery = JSON.parse(formData.gallery)
        } catch {
          setMessage('Invalid JSON in gallery field')
          setIsSubmitting(false)
          return
        }
      }

      if (formData.inputFields.trim()) {
        try {
          parsedInputFields = JSON.parse(formData.inputFields)
        } catch {
          setMessage('Invalid JSON in input fields')
          setIsSubmitting(false)
          return
        }
      }

      if (formData.variables.trim()) {
        try {
          parsedVariables = JSON.parse(formData.variables)
        } catch {
          setMessage('Invalid JSON in variables field')
          setIsSubmitting(false)
          return
        }
      }

      const response = await fetch('/api/admin/create-preset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slider_img: parsedSliderImg,
          gallery: parsedGallery,
          inputFields: parsedInputFields,
          variables: parsedVariables
        })
      })

      const result = await response.json()

      if (response.ok) {
        setMessage('✅ Preset created successfully!')
        // Reset form
        setFormData({
          title: '',
          description: '',
          slug: '',
          prompt: '',
          badge: '',
          badgeColor: 'blue',
          credits: 1,
          category: 'Portrait',
          provider: 'OPENAI',
          owner: '',
          isActive: true,
          slider_img: '',
          gallery: '',
          inputFields: '',
          variables: ''
        })
      } else {
        setMessage(`❌ Error: ${result.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    setFormData(prev => ({ ...prev, slug }))
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-2xl font-bold text-white mb-6">Create New Preset</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Slug *
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="ml-2 text-xs text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    Generate from title
                  </button>
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  pattern="[a-z0-9-_]+"
                  title="Only lowercase letters, numbers, hyphens, and underscores"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Prompt *</label>
              <textarea
                required
                value={formData.prompt}
                onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                rows={4}
                placeholder="Use {{variable}} for dynamic replacements"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Owner (Credit Attribution)</label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData(prev => ({ ...prev, owner: e.target.value }))}
                placeholder="e.g., Capturedbyvishal, Faruk Creative"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
              />
            </div>

            {/* Badge & Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Badge *</label>
                <input
                  type="text"
                  required
                  value={formData.badge}
                  onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                  placeholder="NEW, HOT, PRO"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Badge Color *</label>
                <select
                  value={formData.badgeColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, badgeColor: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {BADGE_COLORS.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Provider & Credits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Provider *</label>
                <select
                  value={formData.provider}
                  onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {PROVIDERS.map(provider => (
                    <option key={provider} value={provider}>{provider}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Credits *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.credits}
                  onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* JSON Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Optional JSON Fields</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Slider Images (JSON)</label>
                <textarea
                  value={formData.slider_img}
                  onChange={(e) => setFormData(prev => ({ ...prev, slider_img: e.target.value }))}
                  rows={3}
                  placeholder='[["before1.jpg", "after1.jpg"], ["before2.jpg", "after2.jpg"]]'
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Gallery (JSON)</label>
                <textarea
                  value={formData.gallery}
                  onChange={(e) => setFormData(prev => ({ ...prev, gallery: e.target.value }))}
                  rows={3}
                  placeholder='["image1.jpg", "image2.jpg", "image3.jpg"]'
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm placeholder-gray-500"
                />
                <p className="mt-1 text-xs text-gray-400">Gallery of previously created images using this preset</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Input Fields (JSON)</label>
                <textarea
                  value={formData.inputFields}
                  onChange={(e) => setFormData(prev => ({ ...prev, inputFields: e.target.value }))}
                  rows={3}
                  placeholder='[{"name": "style", "type": "text", "placeholder": "Enter style..."}]'
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Variables (JSON)</label>
                <textarea
                  value={formData.variables}
                  onChange={(e) => setFormData(prev => ({ ...prev, variables: e.target.value }))}
                  rows={3}
                  placeholder='{"defaultStyle": "realistic", "quality": "high"}'
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm placeholder-gray-500"
                />
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-800 rounded"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-300">
                Active (preset visible to users)
              </label>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-3 rounded-md border ${message.startsWith('✅') 
                ? 'bg-green-900/20 text-green-400 border-green-800' 
                : 'bg-red-900/20 text-red-400 border-red-800'
              }`}>
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Create Preset ✨'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}