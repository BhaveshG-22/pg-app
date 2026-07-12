"use client"

import { useState } from "react"
import { Upload, Sparkles } from "lucide-react"
import { StatefulButton } from "@/components/ui/stateful-button"
import { cn } from "@/lib/utils"

export type StudioInputField = {
  name?: string
  label: string
  placeholder: string
  type?: string
  required?: boolean
  defaultValue?: string
}

const OTHER_IDEAS_PLACEHOLDERS = [
  "e.g. keep the taxi yellow too, add slight film grain…",
  "e.g. make the lighting warmer, add a subtle vignette…",
  "e.g. keep my glasses on, add some motion blur in the background…",
  "e.g. more dramatic shadows, slightly desaturate the background…",
  "e.g. keep my hairstyle exactly as is, add soft rim lighting…",
  "e.g. add a bit of haze, push the color grade toward teal and orange…",
]

function pickRandomPlaceholder() {
  return OTHER_IDEAS_PLACEHOLDERS[Math.floor(Math.random() * OTHER_IDEAS_PLACEHOLDERS.length)]
}

type Props = {
  selectedImage: string | null
  selectedFileName?: string | null
  selectedFileSize?: number | null
  onFileSelected: (file: File) => void
  onOpenPreviousImages: () => void
  onTryExample: () => void
  canTryExample: boolean
  inputFields: StudioInputField[]
  inputValues: Record<string, string>
  onInputChange: (key: string, value: string) => void
  otherIdeas: string
  onOtherIdeasChange: (value: string) => void
  onGenerate: () => void
  isGenerating: boolean
  jobStatus: string
  creditsRequired: number
  canGenerate: boolean
}

function formatSize(bytes?: number | null) {
  if (!bytes) return null
  const mb = bytes / (1024 * 1024)
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`
}

export function CreatePanel({
  selectedImage,
  selectedFileName,
  selectedFileSize,
  onFileSelected,
  onOpenPreviousImages,
  onTryExample,
  canTryExample,
  inputFields,
  inputValues,
  onInputChange,
  otherIdeas,
  onOtherIdeasChange,
  onGenerate,
  isGenerating,
  jobStatus,
  creditsRequired,
  canGenerate,
}: Props) {
  const [dragOver, setDragOver] = useState(false)
  const [ideasPlaceholder] = useState(pickRandomPlaceholder)

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFileSelected(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileSelected(file)
    e.target.value = ""
  }

  const status =
    jobStatus === "COMPLETED"
      ? "completed"
      : jobStatus === "FAILED"
        ? "failed"
        : jobStatus === "RUNNING"
          ? "running"
          : jobStatus === "QUEUED"
            ? "queued"
            : jobStatus === "PENDING"
              ? "loading"
              : "idle"

  return (
    <div className="studio-panel p-6 space-y-6 lg:sticky lg:top-6">
      <h3 className="text-lg font-bold text-[var(--paper)]">Create yours</h3>

      {/* Step 1: photo */}
      <div className="space-y-3">
        <p className="text-xs font-semibold tracking-wide text-[var(--fog)]">
          <span className="text-[var(--red)]">1</span> · YOUR PHOTO
        </p>

        {selectedImage ? (
          <div className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--graphite-2)] p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedImage} alt="Selected" className="h-14 w-14 rounded-lg object-cover flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--paper)]">
                {selectedFileName || "Selected image"}
              </p>
              {selectedFileSize ? (
                <p className="text-xs text-[var(--fog)]">{formatSize(selectedFileSize)}</p>
              ) : null}
            </div>
            <label className="text-sm font-medium text-[var(--red)] cursor-pointer flex-shrink-0 rounded-md border border-[var(--red)] px-3 py-1.5 hover:bg-[var(--red)] hover:text-white transition-colors">
              Change
              <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
            </label>
          </div>
        ) : (
          <label
            className={cn("studio-dropzone block", dragOver && "drag-over")}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
            <Upload className="mx-auto h-8 w-8 text-[var(--fog)] mb-3" />
            <p className="text-sm font-medium text-[var(--paper)] mb-1">
              Drop a photo or click to browse
            </p>
            <p className="text-xs text-[var(--fog)]">PNG · JPG · WEBP, up to 10 MB</p>
          </label>
        )}

        <div className="flex flex-wrap gap-x-3 text-xs text-[var(--fog)]">
          <button type="button" onClick={onOpenPreviousImages} className="underline hover:text-[var(--paper)]">
            Choose from a previous upload
          </button>
          {canTryExample && (
            <>
              <span>·</span>
              <button type="button" onClick={onTryExample} className="text-[var(--red)] hover:text-[var(--red-deep)]">
                No photo handy? Try the example above →
              </button>
            </>
          )}
        </div>
      </div>

      {/* Step 2: extra ideas */}
      <div className="space-y-3">
        <p className="text-xs font-semibold tracking-wide text-[var(--fog)]">
          <span className="text-[var(--red)]">2</span> · EXTRA IDEAS (OPTIONAL)
        </p>

        {inputFields.map((field, index) => {
          const fieldKey = field.name || `input_${index}`
          const fieldValue = fieldKey in inputValues ? inputValues[fieldKey] : field.defaultValue || ""
          return (
            <div key={fieldKey} className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--paper)]">
                {field.label} {field.required && <span className="text-[var(--red)]">*</span>}
              </label>
              <input
                type={field.type === "number" ? "number" : "text"}
                placeholder={field.placeholder}
                value={fieldValue}
                onChange={(e) => onInputChange(fieldKey, e.target.value)}
                maxLength={200}
                className="w-full rounded-lg border border-[var(--line)] bg-[var(--graphite-2)] px-3 py-2.5 text-sm text-[var(--paper)] placeholder:text-[var(--fog)] focus:outline-none focus:border-[var(--red)] transition-colors"
              />
            </div>
          )
        })}

        <textarea
          placeholder={ideasPlaceholder}
          value={otherIdeas}
          onChange={(e) => onOtherIdeasChange(e.target.value)}
          maxLength={200}
          rows={3}
          className="w-full rounded-lg border border-[var(--line)] bg-[var(--graphite-2)] px-3 py-2.5 text-sm text-[var(--paper)] placeholder:text-[var(--fog)] resize-none focus:outline-none focus:border-[var(--red)] transition-colors"
        />
      </div>

      {/* Generate */}
      <div className="space-y-3">
        <StatefulButton
          onClick={onGenerate}
          disabled={!selectedImage || isGenerating || !canGenerate}
          disabledTooltip={!selectedImage ? "Please upload an image before generation" : undefined}
          status={status}
          className="w-full !bg-[var(--red)] hover:!bg-[var(--red-deep)] !text-white"
        >
          Generate <Sparkles className="h-4 w-4" />
          <span className="text-white/70 text-xs ml-1">· {creditsRequired} credit{creditsRequired !== 1 ? "s" : ""}</span>
        </StatefulButton>

        <p className="text-center text-xs text-[var(--fog)]">~20 sec render · 2048px HD · yours to keep</p>

        <div className="border-t border-[var(--line)] pt-3">
          <p className="text-xs text-[var(--fog)]">
            <span className="font-semibold text-[var(--paper)]">Tip:</span> the result mirrors the
            example on the left — your subject takes the place of the figure shown.
          </p>
        </div>
      </div>
    </div>
  )
}
