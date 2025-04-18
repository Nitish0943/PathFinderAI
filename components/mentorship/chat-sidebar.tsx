"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PlusCircle, MessageSquare, Settings, X, Trash2, Clock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatDistanceToNow } from "date-fns"

interface ChatSidebarProps {
  onClose: () => void
}

// Mock chat history with Indian context
const chatHistory = [
  {
    id: 1,
    title: "IT career in Bengaluru",
    preview: "What skills are in demand for IT jobs in Bengaluru?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: 2,
    title: "Resume for TCS",
    preview: "Can you help me optimize my resume for TCS?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 3,
    title: "IIT placements",
    preview: "How to prepare for campus placements at IIT?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
]

export function ChatSidebar({ onClose }: ChatSidebarProps) {
  const [searchValue, setSearchValue] = useState("")

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-blue-400" />
          AI Career Guide
        </h2>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Button className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white">
        <PlusCircle className="mr-2 h-4 w-4" />
        New Conversation
      </Button>

      <div className="relative mb-4">
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search conversations..."
          className="bg-blue-950/30 border-blue-800/50 text-white placeholder:text-gray-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {chatHistory.map((chat) => (
          <motion.div
            key={chat.id}
            className="p-3 rounded-lg hover:bg-blue-900/30 cursor-pointer group"
            whileHover={{ x: 5 }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/50 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{chat.title}</h3>
                <p className="text-xs text-gray-400 truncate">{chat.preview}</p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <Clock className="mr-1 h-3 w-3" />
                  {formatDistanceToNow(new Date(chat.timestamp), { addSuffix: true })}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-400" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-blue-800/30">
        <Button variant="outline" className="w-full border-blue-800/50 bg-blue-950/30 text-white hover:bg-blue-900/30">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  )
}
