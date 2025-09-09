"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Camera, X, Scan } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function BarcodeScanner({ onScan, isOpen, onClose }) {
  const { toast } = useToast()
  const [manualBarcode, setManualBarcode] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [stream, setStream] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const intervalRef = useRef(null)

  // Cleanup function
  const cleanup = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsScanning(false)
  }

  // Start camera scanning
  const startScanning = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }

      setIsScanning(true)

      // Start scanning for barcodes
      intervalRef.current = setInterval(() => {
        scanFrame()
      }, 500) // Scan every 500ms
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  // Scan current video frame for barcode
  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    // Simple barcode detection (this is a basic implementation)
    // In a real application, you would use a library like QuaggaJS or ZXing
    const detectedBarcode = detectBarcodeFromImageData(imageData)

    if (detectedBarcode) {
      handleBarcodeDetected(detectedBarcode)
    }
  }

  // Basic barcode detection (placeholder - replace with actual barcode library)
  const detectBarcodeFromImageData = (imageData) => {
    // This is a placeholder function
    // In a real implementation, you would use a proper barcode detection library
    // For now, we'll return null to indicate no barcode detected
    return null
  }

  // Handle barcode detection
  const handleBarcodeDetected = (barcode) => {
    cleanup()
    onScan(barcode)
    onClose()
    toast({
      title: "Barcode Scanned",
      description: `Detected barcode: ${barcode}`,
    })
  }

  // Handle manual barcode entry
  const handleManualScan = () => {
    if (manualBarcode.trim()) {
      onScan(manualBarcode.trim())
      setManualBarcode("")
      onClose()
    }
  }

  // Handle Enter key press for manual input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleManualScan()
    }
  }

  // Cleanup on component unmount or dialog close
  useEffect(() => {
    if (!isOpen) {
      cleanup()
    }
    return cleanup
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Scan className="mr-2 h-5 w-5" />
            Barcode Scanner
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Manual Barcode Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Enter Barcode Manually</label>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter or scan barcode..."
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
              />
              <Button onClick={handleManualScan} disabled={!manualBarcode.trim()}>
                Scan
              </Button>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">OR</div>

          {/* Camera Scanner */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Use Camera Scanner</label>

            {!isScanning ? (
              <Button onClick={startScanning} className="w-full">
                <Camera className="mr-2 h-4 w-4" />
                Start Camera Scanner
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <video ref={videoRef} className="w-full h-48 bg-black rounded" autoPlay playsInline muted />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute inset-0 border-2 border-red-500 rounded pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-1 bg-red-500"></div>
                  </div>
                </div>
                <Button onClick={cleanup} variant="outline" className="w-full bg-transparent">
                  <X className="mr-2 h-4 w-4" />
                  Stop Scanner
                </Button>
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500 text-center">Position the barcode within the red line for scanning</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
