"use client";

import Image from "next/image";
import { PromptInput, PromptInputTextarea } from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import { ArrowUp, SquareIcon, Paperclip, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { compressImage, CompressedImage } from "@/lib/image-compression";

interface PromptInputBasicProps {
  onSubmit?: (e?: React.FormEvent<HTMLFormElement>) => void;
  onSubmitWithImages?: (text: string, images: CompressedImage[]) => void;
  isGenerating?: boolean;
  input?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  stop: () => void;
}

export function PromptInputBasic({
  onSubmit: handleSubmit,
  onSubmitWithImages,
  stop,
  isGenerating = false,
  input = "",
  onValueChange,
  disabled,
}: PromptInputBasicProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoading(isGenerating);
  }, [isGenerating]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsCompressing(true);
    const newImages: CompressedImage[] = [];

    for (const file of Array.from(files)) {
      if (file.type.startsWith("image/")) {
        try {
          const compressed = await compressImage(file);
          newImages.push(compressed);
        } catch (error) {
          console.error("Failed to compress image:", error);
        }
      }
    }

    setImages((prev) => [...prev, ...newImages]);
    setIsCompressing(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitWithData = () => {
    if (onSubmitWithImages && (input.trim() || images.length > 0)) {
      onSubmitWithImages(input, images);
      setImages([]);
    } else if (handleSubmit) {
      handleSubmit();
    }
  };

  return (
    <div className="relative w-full">
      {images.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2 rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
          {images.map((image, index) => (
            <div key={index} className="group relative">
              <Image src={image.data} alt={`Upload ${index + 1}`} width={64} height={64} className="h-16 w-16 rounded border object-cover" />
              <button
                onClick={() => removeImage(index)}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 rounded-b bg-black/50 p-1 text-center text-xs text-white">
                {Math.round(image.compressedSize / 1024)}KB
              </div>
            </div>
          ))}
        </div>
      )}

      <PromptInput value={input} onValueChange={(value) => onValueChange?.(value)} isLoading={isLoading || isCompressing} onSubmit={handleSubmitWithData} className="w-full rounded-lg border border-gray-300 bg-transparent shadow-sm transition-all duration-200 ease-in-out focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-200">
        <PromptInputTextarea placeholder={isGenerating ? "Adorable is working..." : isCompressing ? "Compressing images..." : "Type your message here..."} className="bg-transparent pr-20 dark:bg-transparent" disabled={disabled} />
      </PromptInput>

      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />

      <div className="absolute bottom-3 right-3 flex gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => fileInputRef.current?.click()} disabled={isGenerating || disabled}>
          <Paperclip className="h-4 w-4" />
        </Button>

        {isGenerating ? (
          <Button variant={"default"} size="icon" className="h-8 w-8 rounded-full" onClick={stop}>
            <SquareIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant={"default"}
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={isGenerating || disabled || (input.trim() === "" && images.length === 0)}
            onClick={handleSubmitWithData}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}


