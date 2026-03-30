import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getImageUrl = (imagePath?: string | null, fallbackHeight = '48', fallbackWidth = '48') => {
  if (!imagePath) return `/placeholder.svg?height=${fallbackHeight}&width=${fallbackWidth}`;
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
}
