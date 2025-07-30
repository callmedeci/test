export interface BodyProgressEntry {
  id: string;
  user_id: string;
  date: string; // ISO format like "2025-07-21"
  weight_kg: number;
  body_fat_percentage: number;
  waist_cm: number;
  notes?: string;
}

export type MockUserProgress = BodyProgressEntry[];

export interface MonthOption {
  value: string;
  label: string;
  year: number;
  month: number;
}