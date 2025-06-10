"use client";

import type React from "react";
import { ChevronUp, FileText, Paperclip, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface IMessage {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
}

export default function ChatbotPage() {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [input, setInput] = useState("");

    const handleChatInput = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setMessages((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                role: "user",
                content: input,
            },
        ]);
        setInput("");

        // show typing indicator

        // call LLM API here
    };

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
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                        >
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
                                Upload a PDF containing your trade data
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md">
                                Ask questions about your trade performance or
                                start a conversation typical trading related
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
                                        className={cn(
                                            "flex",
                                            message.role === "user"
                                                ? "justify-end"
                                                : "justify-start"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "max-w-[80%] rounded-2xl px-5 py-3.5 shadow-sm",
                                                message.role === "user"
                                                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-tr-none"
                                                    : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700"
                                            )}
                                        >
                                            <div className="whitespace-pre-wrap">
                                                {message.content}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {false && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex justify-start"
                                    >
                                        <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-none px-5 py-3.5 shadow-sm border border-slate-200 dark:border-slate-700">
                                            <div className="flex space-x-1">
                                                <span
                                                    className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-pulse"
                                                    style={{
                                                        animationDelay: "0ms",
                                                    }}
                                                ></span>
                                                <span
                                                    className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-pulse"
                                                    style={{
                                                        animationDelay: "300ms",
                                                    }}
                                                ></span>
                                                <span
                                                    className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-pulse"
                                                    style={{
                                                        animationDelay: "600ms",
                                                    }}
                                                ></span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Input area */}
                <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 p-4 md:p-6">
                    <div className="max-w-3xl mx-auto">
                        <form
                            className="flex items-end gap-3"
                            onSubmit={(e) => handleChatInput(e)}
                        >
                            <div className="relative flex-1">
                                <input
                                    className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 dark:text-slate-200 shadow-sm"
                                    value={input}
                                    placeholder="Message..."
                                    name="chat-input"
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <div className="absolute right-4 bottom-3.5">
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer text-slate-400 hover:text-indigo-500 transition-colors"
                                    >
                                        <Paperclip className="w-5 h-5" />
                                    </label>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 p-0 shadow-lg shadow-indigo-500/25"
                            >
                                <ChevronUp className="w-5 h-5" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
