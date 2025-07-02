"use client";
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

export default function ColorSelector({
  colors,
  className,
  setSelectedColor,
  selectedColor,
  disabledColors,
}: {
  colors: ProductColor[];
  className?: string;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  disabledColors?: string[];
}) {
  return (
    <RadioGroup
      value={selectedColor}
      onValueChange={setSelectedColor}
      className={className}
    >
      {colors.map(({ name, hex }, index) => {
        const isDisabled = disabledColors?.includes(hex);

        return (
          <div
            key={index}
            className={`relative p-1 w-fit rounded-full ${
              selectedColor === hex && !isDisabled && "border border-red-700"
            } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <RadioGroupItem
              value={hex}
              id={`color-${hex}`}
              className="sr-only peer"
              disabled={isDisabled}
            />
            <Label
              htmlFor={`color-${hex}`}
              className={`w-6 h-6 rounded-full border border-gray-700 ring-offset-2 ring-black ${
                isDisabled ? "pointer-events-none" : "cursor-pointer"
              }`}
              style={{ backgroundColor: hex }}
            />
          </div>
        );
      })}
    </RadioGroup>
  );
}
