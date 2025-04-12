"use client"

import { useEffect, useRef } from "react"

export function InventoryStatusChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // This is a placeholder for a chart library like Chart.js
    // In a real implementation, you would use a proper charting library
    const ctx = chartRef.current?.getContext("2d")
    if (ctx) {
      // Draw a simple placeholder pie chart
      const centerX = chartRef.current!.width / 2
      const centerY = chartRef.current!.height / 2
      const radius = Math.min(centerX, centerY) - 10

      const data = [
        { value: 60, color: "#22c55e" }, // Optimal stock
        { value: 25, color: "#eab308" }, // Low stock
        { value: 10, color: "#ef4444" }, // Out of stock
        { value: 5, color: "#3b82f6" }, // Overstock
      ]

      let startAngle = 0

      data.forEach((segment) => {
        const segmentAngle = (segment.value / 100) * 2 * Math.PI

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + segmentAngle)
        ctx.closePath()

        ctx.fillStyle = segment.color
        ctx.fill()

        startAngle += segmentAngle
      })

      // Draw a white circle in the middle for a donut chart effect
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI)
      ctx.fillStyle = "white"
      ctx.fill()

      // In dark mode, we'd need to adjust this
      if (document.documentElement.classList.contains("dark")) {
        ctx.fillStyle = "hsl(240 10% 3.9%)"
        ctx.fill()
      }
    }
  }, [])

  return (
    <div className="flex flex-col space-y-4">
      <div className="aspect-square w-full max-w-[300px] mx-auto">
        <canvas ref={chartRef} width={300} height={300}></canvas>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span>Optimal Stock (60%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <span>Low Stock (25%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span>Out of Stock (10%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span>Overstock (5%)</span>
        </div>
      </div>
    </div>
  )
}
