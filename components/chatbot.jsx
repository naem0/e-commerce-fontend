"use client"

import { useState, useEffect, useRef } from "react"

export default function Chatbot({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: "system", content: "আপনি কিভাবে সাহায্য চাইবেন?" },
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage() {
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsOpen(true)

    // Backend API কল (যা আমরা পরে করবো)
    try {
      const res = await fetch( process.env.NEXT_PUBLIC_API_URL + "/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          user,
          messages,
        }),
      })
      console.log("Response:", res)
      const data = await res.json()
        console.log("Data:", data)
      if (data?.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }])
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "দুঃখিত, উত্তর পাওয়া যায়নি।" }])
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "সার্ভার সমস্যা, পরে চেষ্টা করুন।" }])
    }
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-8 right-8 z-50 rounded-full bg-green-600 p-4 text-white shadow-lg hover:bg-green-700"
        aria-label="Open chat"
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-8 z-50 flex h-96 w-80 flex-col rounded-lg border border-gray-300 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-300 p-3 font-semibold">
            <span>সাহায্য চ্যাট</span>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
              ✖️
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
            {messages
              .filter((m) => m.role !== "system")
              .map((m, i) => (
                <div
                  key={i}
                  className={`rounded-md p-2 ${
                    m.role === "user" ? "bg-green-100 text-right" : "bg-gray-200 text-left"
                  }`}
                >
                  {m.content}
                </div>
              ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex border-t border-gray-300 p-2">
            <input
              type="text"
              placeholder="আপনার মেসেজ লিখুন..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="ml-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              পাঠাও
            </button>
          </div>
        </div>
      )}
    </>
  )
}
