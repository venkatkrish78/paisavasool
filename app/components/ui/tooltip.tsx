"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
}

export function Tooltip({
  children,
  content,
  side = "top",
  align = "center",
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const childRef = React.useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (childRef.current) {
      const rect = childRef.current.getBoundingClientRect()
      
      let x = rect.left + rect.width / 2
      let y = rect.top
      
      if (side === "bottom") {
        y = rect.bottom
      } else if (side === "left") {
        x = rect.left
        y = rect.top + rect.height / 2
      } else if (side === "right") {
        x = rect.right
        y = rect.top + rect.height / 2
      }
      
      if (align === "start") {
        if (side === "top" || side === "bottom") {
          x = rect.left
        } else {
          y = rect.top
        }
      } else if (align === "end") {
        if (side === "top" || side === "bottom") {
          x = rect.right
        } else {
          y = rect.bottom
        }
      }
      
      setPosition({ x, y })
    }
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  return (
    <div className="relative inline-block">
      <div
        ref={childRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-flex cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className="fixed z-50 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm dark:bg-gray-700 animate-in fade-in-0 zoom-in-95"
          style={{
            transform: `translate(${
              side === "left"
                ? "-100%"
                : side === "right"
                ? "0"
                : "-50%"
            }, ${
              side === "top"
                ? "-100%"
                : side === "bottom"
                ? "0"
                : "-50%"
            })`,
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          {content}
        </div>
      )}
    </div>
  )
}