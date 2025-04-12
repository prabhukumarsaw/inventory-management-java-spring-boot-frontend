"use client"

import { useEffect, useRef } from "react"

export function SalesChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // This is a placeholder for a chart library like Chart.js
    // In a real implementation, you would use a proper charting library
    const ctx = chartRef.current?.getContext("2d")
    if (ctx) {
      const width = chartRef.current!.width
      const height = chartRef.current!.height
      const padding = 40

      // Sample data for last 7 days
      const data = [42, 58, 69, 53, 62, 79, 87]
      const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

      const maxValue = Math.max(...data) * 1.1 // Add 10% padding
      const barWidth = (width - padding * 2) / data.length - 10

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Draw axes
      ctx.beginPath()
      ctx.moveTo(padding, padding)
      ctx.lineTo(padding, height - padding)
      ctx.lineTo(width - padding, height - padding)
      ctx.strokeStyle = "#94a3b8" // slate-400
      ctx.stroke()

      // Draw bars
      data.forEach((value, index) => {
        const x = padding + index * (barWidth + 10) + 5
        const barHeight = (value / maxValue) * (height - padding * 2)
        const y = height - padding - barHeight

        // Bar
        ctx.fillStyle = "#3b82f6" // blue-500
        ctx.fillRect(x, y, barWidth, barHeight)

        // Label
        ctx.fillStyle = "#64748b" // slate-500
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(labels[index], x + barWidth / 2, height - padding / 2)

        // Value
        ctx.fillStyle = "#64748b" // slate-500
        ctx.fillText(value.toString(), x + barWidth / 2, y - 5)
      })

      // In dark mode, we'd need to adjust colors
      if (document.documentElement.classList.contains("dark")) {
        // This is just a placeholder for the real implementation
        // You would need to adjust all colors for dark mode
      }
    }
  }, [])

  return (
    <div className="w-full">
      <canvas ref={chartRef} width={800} height={300}></canvas>
    </div>
  )
}
