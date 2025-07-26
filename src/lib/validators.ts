import { z } from 'zod';

// Common validators
export const emailValidator = z.string().email('Invalid email address');

export const passwordValidator = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(100, 'Password must be less than 100 characters');

export const nameValidator = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters');

// Memo validators
export const memoTitleValidator = z
  .string()
  .min(1, 'Title is required')
  .max(200, 'Title must be less than 200 characters');

export const memoContentValidator = z
  .string()
  .min(1, 'Content is required')
  .max(10000, 'Content must be less than 10000 characters');

export const tagValidator = z
  .string()
  .min(1, 'Tag cannot be empty')
  .max(30, 'Tag must be less than 30 characters')
  .regex(/^[a-zA-Z0-9가-힣\s-]+$/, 'Tag contains invalid characters');

export const categoryValidator = z.string().min(1, 'Category is required');

// Audio validators
export const audioFileValidator = z
  .instanceof(File)
  .refine((file) => file.size <= 100 * 1024 * 1024, 'File size must be less than 100MB')
  .refine(
    (file) => ['audio/webm', 'audio/mp3', 'audio/wav', 'audio/m4a'].includes(file.type),
    'Invalid audio file type'
  );

// Search validators
export const searchQueryValidator = z
  .string()
  .min(1, 'Search query is required')
  .max(200, 'Search query is too long');

// Utility functions
export function validateEmail(email: string): boolean {
  try {
    emailValidator.parse(email);
    return true;
  } catch {
    return false;
  }
}

export function validatePassword(password: string): boolean {
  try {
    passwordValidator.parse(password);
    return true;
  } catch {
    return false;
  }
}

export function sanitizeTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, '-');
}

export function sanitizeSearchQuery(query: string): string {
  return query.trim().replace(/[^\w\s가-힣]/g, '');
}