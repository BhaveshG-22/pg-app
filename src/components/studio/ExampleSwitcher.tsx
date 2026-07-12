"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

export type StudioExample = {
  id: string
  label: string
  sublabel?: string
  before: string
  after: string
}

type Props = {
  examples: StudioExample[]
  activeId: string
  onSelect: (example: StudioExample) => void
}

export function ExampleSwitcher({ examples, activeId, onSelect }: Props) {
  if (examples.length < 2) return null

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold tracking-wide text-[var(--fog)]">
        SEE IT ON DIFFERENT SHOTS
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {examples.map((example) => {
          const active = example.id === activeId
          return (
            <div key={example.id} className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => onSelect(example)}
                aria-pressed={active}
                aria-label={`Show example: ${example.label}`}
                className={cn("studio-example-thumb", active && "active")}
              >
                <Image src={example.after} alt={example.label} width={104} height={70} className="object-cover" />
              </button>
              <span className={cn("text-[12px] leading-none", active ? "text-[var(--paper)]" : "text-[var(--fog)]")}>
                {example.label}
                {example.sublabel ? ` · ${example.sublabel}` : ""}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
