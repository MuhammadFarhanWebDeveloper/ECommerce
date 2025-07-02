"use client"

import type * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus } from "lucide-react"

interface QuantityInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

export function QuantityInput({
  value,
  onChange,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  className,
  ...props
}: QuantityInputProps) {
  const handleDecrement = () => {
    const newValue = Math.max(min, value - step)
    onChange(newValue)
  }

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step)
    onChange(newValue)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    if (rawValue === "") {
      onChange(0) // Treat empty input as 0 for internal logic
      return
    }
    const numValue = Number.parseFloat(rawValue)
    if (!isNaN(numValue)) {
      onChange(Math.max(min, Math.min(max, numValue)))
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={value <= min}
        className="bg-black text-white"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="text" // Use text to allow non-numeric input temporarily and prevent browser number controls
        value={value}
        onChange={handleChange}
        className="w-20 text-center"
        {...props}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={value >= max}
        className="bg-black text-white"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
