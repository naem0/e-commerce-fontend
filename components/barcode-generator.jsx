"use client"

import { useEffect, useRef } from "react"

export default function BarcodeGenerator({ value, format = "CODE128", width = 2, height = 100, displayValue = true }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!value || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Generate CODE128 barcode pattern
    const generateBarcode = (text) => {
      // Simple CODE128 pattern generation
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
        "!": "10001101000",
        '"': "10001100010",
        "#": "11010001000",
        $: "11000101000",
        "%": "11000100010",
        "&": "10110111000",
        "'": "10110001110",
        "(": "10001101110",
        ")": "10111011000",
        "*": "10111000110",
        "+": "10001110110",
        ",": "11101110110",
        "-": "11010001110",
        ".": "11000101110",
        "/": "11011101000",
        ":": "11011100010",
        ";": "11011101110",
        "<": "11101011000",
        "=": "11101000110",
        ">": "11100010110",
        "?": "11101101000",
        "@": "11101100010",
        "[": "11100011010",
        "\\": "11101111010",
        "]": "11001000010",
        "^": "11110001010",
        _: "10100110000",
        "`": "10100001100",
        a: "10010110000",
        b: "10010000110",
        c: "10000101100",
        d: "10000100110",
        e: "10110010000",
        f: "10110000100",
        g: "10011010000",
        h: "10011000010",
        i: "10000110100",
        j: "10000110010",
        k: "11000010010",
        l: "11001010000",
        m: "11110111010",
        n: "11000010100",
        o: "10001111010",
        p: "10100111100",
        q: "10010111100",
        r: "10010011110",
        s: "10111100100",
        t: "10011110100",
        u: "10011110010",
        v: "11110100100",
        w: "11110010100",
        x: "11110010010",
        y: "11011011110",
        z: "11011110110",
        "{": "11110110110",
        "|": "10101111000",
        "}": "10100011110",
        "~": "10001011110",
      }

      // Start pattern for CODE128
      let binaryString = "11010010000" // Start Code B

      // Convert each character
      for (const char of text) {
        const pattern = patterns[char] || patterns["0"]
        binaryString += pattern
      }

      // Stop pattern
      binaryString += "1100011101011" // Stop pattern

      return binaryString
    }

    const binaryPattern = generateBarcode(value.toString())

    // Calculate canvas dimensions
    const totalWidth = binaryPattern.length * width
    canvas.width = totalWidth
    canvas.height = height + (displayValue ? 30 : 0)

    // Clear canvas
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw barcode
    ctx.fillStyle = "black"
    for (let i = 0; i < binaryPattern.length; i++) {
      if (binaryPattern[i] === "1") {
        ctx.fillRect(i * width, 0, width, height)
      }
    }

    // Draw text if enabled
    if (displayValue) {
      ctx.fillStyle = "black"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText(value, canvas.width / 2, height + 20)
    }
  }, [value, format, width, height, displayValue])

  if (!value) {
    return (
      <div className="flex items-center justify-center h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded">
        <span className="text-gray-500">No barcode</span>
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} className="bg-white" style={{ imageRendering: "pixelated" }} />
    </div>
  )
}
