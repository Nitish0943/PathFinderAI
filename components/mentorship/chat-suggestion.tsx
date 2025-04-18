"use client"

import { motion } from "framer-motion"

interface ChatSuggestionProps {
  question: string
  onClick: () => void
}

export function ChatSuggestion({ question, onClick }: ChatSuggestionProps) {
  return (
    <motion.button
      className="px-3 py-2 rounded-full border border-indigo-800/50 bg-indigo-950/30 text-sm text-white hover:bg-indigo-900/30 transition-colors"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {question}
    </motion.button>
  )
}
