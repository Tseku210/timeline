import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { nanoid } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(number: number, min: number, max: number) {
  return Math.max(min, Math.min(number, max));
}

export function generateId() {
  return nanoid();
}
