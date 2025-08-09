"use client";

import React from "react";
import { Button } from "./ui/button";

interface ExampleButtonProps {
  text: string;
  promptText: string;
  onClick: (text: string) => void;
  className?: string;
}

export function ExampleButton({ text, promptText, onClick, className }: ExampleButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={`rounded-full transition-all duration-200 hover:border-gray-300 hover:bg-gray-100 ${className || ""}`}
      onClick={() => onClick(promptText)}
      type="button"
    >
      {text}
    </Button>
  );
}


