"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Printer, Download } from "lucide-react"
import BarcodeGenerator from "./barcode-generator"

export default function BarcodePrinter({ product, onClose }) {
  const [settings, setSettings] = useState({
    quantity: 1,
    showProductName: true,
    showPrice: true,
    showSKU: false,
    paperSize: "58mm",
    barcodeFormat: "CODE128",
    barcodeWidth: 2,
    barcodeHeight: 60,
  })

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    const printContent = generatePrintContent()

    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
    printWindow.close()
  }

  const handleDownload = () => {
    const content = generatePrintContent()
    const blob = new Blob([content], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `barcode-${product.name.replace(/\s+/g, "-")}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateBarcodeCanvas = (value) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    // Generate CODE128 barcode pattern
    const generateBarcode = (text) => {
      const patterns = {
        0: "11011001100",
        1: "11001101100",
        2: "11001100110",
        3: "10010011000",
        4: "10010001100",
        5: "10001001100",
        6: "10011001000",
        7: "10011000100",
        8: "10001100100",
        9: "11001001000",
        A: "11001000100",
        B: "11000100100",
        C: "10110011100",
        D: "10011011100",
        E: "10011001110",
        F: "10111001000",
        G: "10011101000",
        H: "10011100100",
        I: "11001110010",
        J: "11001011100",
        K: "11001001110",
        L: "11011100100",
        M: "11001110100",
        N: "11101101110",
        O: "11101001100",
        P: "11100101100",
        Q: "11100100110",
        R: "11101100100",
        S: "11100110100",
        T: "11100110010",
        U: "11011011000",
        V: "11011000110",
        W: "11000110110",
        X: "10100011000",
        Y: "10001011000",
        Z: "10001000110",
        " ": "10110001000",
      }

      let binaryString = "11010010000" // Start Code B

      for (const char of text) {
        const pattern = patterns[char] || patterns["0"]
        binaryString += pattern
      }

      binaryString += "1100011101011" // Stop pattern
      return binaryString
    }

    const binaryPattern = generateBarcode(value.toString())
    const totalWidth = binaryPattern.length * settings.barcodeWidth

    canvas.width = totalWidth
    canvas.height = settings.barcodeHeight

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "black"
    for (let i = 0; i < binaryPattern.length; i++) {
      if (binaryPattern[i] === "1") {
        ctx.fillRect(i * settings.barcodeWidth, 0, settings.barcodeWidth, settings.barcodeHeight)
      }
    }

    return canvas.toDataURL()
  }

  const generatePrintContent = () => {
    const barcodeImage = generateBarcodeCanvas(product.barcode)

    const labels = Array.from({ length: settings.quantity }, (_, index) => {
      return `
        <div class="label" style="
          width: ${settings.paperSize === "58mm" ? "58mm" : "80mm"};
          border: 1px solid #ddd;
          padding: 8px;
          margin: 4px;
          text-align: center;
          font-family: Arial, sans-serif;
          page-break-inside: avoid;
          background: white;
        ">
          ${settings.showProductName ? `<div style="font-size: 12px; font-weight: bold; margin-bottom: 4px; word-wrap: break-word;">${product.name}</div>` : ""}
          <div style="margin: 8px 0;">
            <img src="${barcodeImage}" alt="Barcode" style="max-width: 100%; height: auto;" />
          </div>
          <div style="font-size: 10px; margin-bottom: 2px; font-family: monospace;">${product.barcode}</div>
          ${settings.showPrice ? `<div style="font-size: 11px; font-weight: bold;">$${product.price.toFixed(2)}</div>` : ""}
          ${settings.showSKU && product.sku ? `<div style="font-size: 9px; color: #666;">SKU: ${product.sku}</div>` : ""}
        </div>
      `
    }).join("")

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Barcode Labels - ${product.name}</title>
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
          body {
            font-family: Arial, sans-serif;
            margin: 10px;
          }
          .labels-container {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
          }
          .label {
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
          <h3>Barcode Labels for: ${product.name}</h3>
          <p>Quantity: ${settings.quantity} | Paper Size: ${settings.paperSize} | Format: ${settings.barcodeFormat}</p>
          <button onclick="window.print()" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Print Labels</button>
        </div>
        <div class="labels-container">
          ${labels}
        </div>
      </body>
      </html>
    `
  }

  return (
    <div className="space-y-6">
      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Barcode Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 p-4 text-center bg-white">
            <div className="inline-block border border-gray-400 p-3 text-black bg-white">
              {settings.showProductName && <div className="text-sm font-bold mb-2">{product.name}</div>}
              <div className="mb-2">
                <BarcodeGenerator
                  value={product.barcode}
                  format={settings.barcodeFormat}
                  width={settings.barcodeWidth}
                  height={settings.barcodeHeight}
                  displayValue={false}
                />
              </div>
              <div className="text-xs mb-1 font-mono">{product.barcode}</div>
              {settings.showPrice && <div className="text-sm font-bold">${product.price.toFixed(2)}</div>}
              {settings.showSKU && product.sku && <div className="text-xs">SKU: {product.sku}</div>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Print Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="100"
                value={settings.quantity}
                onChange={(e) => setSettings((prev) => ({ ...prev, quantity: Number.parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div>
              <Label htmlFor="paperSize">Paper Size</Label>
              <Select
                value={settings.paperSize}
                onValueChange={(value) => setSettings((prev) => ({ ...prev, paperSize: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="58mm">58mm (Thermal)</SelectItem>
                  <SelectItem value="80mm">80mm (Thermal)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="barcodeWidth">Bar Width</Label>
              <Input
                id="barcodeWidth"
                type="number"
                min="1"
                max="5"
                value={settings.barcodeWidth}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, barcodeWidth: Number.parseInt(e.target.value) || 2 }))
                }
              />
            </div>
            <div>
              <Label htmlFor="barcodeHeight">Bar Height</Label>
              <Input
                id="barcodeHeight"
                type="number"
                min="30"
                max="100"
                value={settings.barcodeHeight}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, barcodeHeight: Number.parseInt(e.target.value) || 60 }))
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="barcodeFormat">Barcode Format</Label>
            <Select
              value={settings.barcodeFormat}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, barcodeFormat: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CODE128">CODE128</SelectItem>
                <SelectItem value="CODE39">CODE39</SelectItem>
                <SelectItem value="EAN13">EAN13</SelectItem>
                <SelectItem value="UPC">UPC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="showProductName"
                checked={settings.showProductName}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showProductName: checked }))}
              />
              <Label htmlFor="showProductName">Show Product Name</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="showPrice"
                checked={settings.showPrice}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showPrice: checked }))}
              />
              <Label htmlFor="showPrice">Show Price</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="showSKU"
                checked={settings.showSKU}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showSKU: checked }))}
              />
              <Label htmlFor="showSKU">Show SKU</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download HTML
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print Labels
          </Button>
        </div>
      </div>
    </div>
  )
}
