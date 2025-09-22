'use client'

import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function CTADialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-12 py-4 h-16 text-xl font-semibold"
        >
          <Play className="mr-3 h-6 w-6" />
          Watch Demo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>PixelGlow Demo</DialogTitle>
        </DialogHeader>
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <Play className="h-12 w-12 text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Demo video coming soon</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}