"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ChevronUp, FileText, Paperclip, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  attachments?: { name: string; type: string }[]
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [files, setFiles] = useState<FileList | undefined>(undefined)
  const [isTyping, setIsTyping] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files)
      setFileName(e.target.files[0].name)
    }
  }

  const clearFile = () => {
    setFiles(undefined)
    setFileName(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() && !files) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      attachments: files ? [{ name: files[0].name, type: files[0].type }] : undefined,
    }

    setMessages((prev) => [...prev, newMessage])
    setInput("")
    clearFile()
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false)
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I can see your message" +
          (files ? " and PDF file" : "") +
          ". This is a frontend-only demo, so I can't actually process your request yet.",
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1500)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Sidebar */}
      <div className="hidden md:block w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-r border-slate-200 dark:border-slate-700">
        <div className="p-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg text-white">
            <Sparkles className="w-5 h-5" />
            <h2 className="font-medium">AI Assistant</h2>
          </div>

          <div className="mt-6">
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-2">
              Recent Chats
            </h3>
            <div className="space-y-1">
              {[1, 2, 3].map((i) => (
                <button
                  key={i}
                  className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Chat {i}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AI Assistant
          </h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Sparkles className="w-5 h-5 text-indigo-500" />
            </Button>
          </div>
        </header>

        {/* Chat container */}
        <div className="flex-1 overflow-y-auto p-6 pb-32">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-medium text-slate-800 dark:text-slate-200 mb-3">
                Upload a PDF and start chatting
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-md">
                Ask questions about your document or start a conversation
              </p>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-5 py-3.5 shadow-sm",
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-tr-none"
                          : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700",
                      )}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      {message.attachments?.map((attachment, index) => (
                        <div key={index} className="mt-2 flex items-center text-sm opacity-90">
                          <FileText className="w-4 h-4 mr-1.5" />
                          <span>{attachment.name}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-none px-5 py-3.5 shadow-sm border border-slate-200 dark:border-slate-700">
                      <div className="flex space-x-1">
                        <span
                          className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-pulse"
                          style={{ animationDelay: "0ms" }}
                        ></span>
                        <span
                          className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-pulse"
                          style={{ animationDelay: "300ms" }}
                        ></span>
                        <span
                          className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-pulse"
                          style={{ animationDelay: "600ms" }}
                        ></span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 p-4 md:p-6">
          <div className="max-w-3xl mx-auto">
            <AnimatePresence>
              {fileName && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mb-3 flex items-center bg-slate-100 dark:bg-slate-800 rounded-full py-1.5 px-4 text-sm w-fit"
                >
                  <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                  <span className="text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{fileName}</span>
                  <button
                    onClick={clearFile}
                    className="ml-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex items-end gap-3">
              <div className="relative flex-1">
                <input
                  className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 dark:text-slate-200 shadow-sm"
                  value={input}
                  placeholder="Message..."
                  onChange={(e) => setInput(e.target.value)}
                />
                <div className="absolute right-4 bottom-3.5">
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-slate-400 hover:text-indigo-500 transition-colors"
                  >
                    <Paperclip className="w-5 h-5" />
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="application/pdf"
                    ref={fileInputRef}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 p-0 shadow-lg shadow-indigo-500/25"
                disabled={!input.trim() && !files}
              >
                <ChevronUp className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
