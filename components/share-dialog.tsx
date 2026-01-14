"use client"

import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ShareCard, ShareCardData } from './share-card'
import { toPng } from 'html-to-image'
import { Download, Share2, Copy, Check, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: ShareCardData
  translations: {
    dialogTitle: string
    dialogDescription: string
    downloadButton: string
    copyButton: string
    copySuccess: string
    copyError: string
    downloadError: string
    generating: string
    // ShareCard translations
    card: {
      title: string
      configuration: string
      model: string
      parameters: string
      precision: string
      gpu: string
      gpuCount: string
      concurrency: string
      contextLength: string
      memoryBreakdown: string
      modelMemory: string
      kvCache: string
      activation: string
      computation: string
      totalMemory: string
      poweredBy: string
      website: string
    }
  }
}

export function ShareDialog({ open, onOpenChange, data, translations }: ShareDialogProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const generateImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null

    try {
      setIsGenerating(true)

      // Generate PNG with high quality
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#ffffff'
      })

      // Convert data URL to Blob
      const response = await fetch(dataUrl)
      const blob = await response.blob()

      return blob
    } catch (error) {
      console.error('Failed to generate image:', error)
      toast({
        title: translations.downloadError,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      })
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    const blob = await generateImage()
    if (!blob) return

    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `llm-config-${data.modelName.replace(/\s+/g, '-')}-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleCopyToClipboard = async () => {
    const blob = await generateImage()
    if (!blob) return

    try {
      // Copy image to clipboard (only works in secure contexts)
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ])

        setIsCopied(true)
        toast({
          title: translations.copySuccess,
          description: '✓'
        })

        setTimeout(() => setIsCopied(false), 2000)
      } else {
        // Fallback: just download if clipboard API not available
        handleDownload()
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      toast({
        title: translations.copyError,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            {translations.dialogTitle}
          </DialogTitle>
          <DialogDescription>
            {translations.dialogDescription}
          </DialogDescription>
        </DialogHeader>

        {/* Preview */}
        <div className="flex justify-center my-4 bg-gray-100 p-4 rounded-lg">
          <div style={{ transform: 'scale(0.8)', transformOrigin: 'top center' }}>
            <ShareCard ref={cardRef} data={data} translations={translations.card} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleCopyToClipboard}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : isCopied ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {isCopied ? translations.copySuccess : translations.copyButton}
          </Button>
          <Button onClick={handleDownload} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {translations.generating}
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                {translations.downloadButton}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
