import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Position = {
  x: number
  y: number
  id: string
}

export type Player = Position & {
  team: 'home' | 'away'
  number?: string
  isSelected: boolean
}

export type CourtElement = Position & {
  type: 'ball' | 'screen' | 'marker' | 'coach'
  isSelected: boolean
}

export type Movement = {
  id: string
  startX: number
  startY: number
  endX: number
  endY: number
  type: 'dribble' | 'pass' | 'movement' | 'screen'
}

export type Play = {
  id: string
  name: string
  description: string
  steps: PlayStep[]
  createdAt: string
  updatedAt: string
  tags: string[]
}

export type PlayStep = {
  id: string
  players: Player[]
  elements: CourtElement[]
  movements: Movement[]
  note: string
}

export function createId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function downloadJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}