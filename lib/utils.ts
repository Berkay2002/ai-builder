import { type ClassValue,clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAppIdFromHeaders(req: Request): string | null {
  return req.headers.get("Adorable-App-Id");
}