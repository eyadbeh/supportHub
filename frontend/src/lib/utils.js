/**
 * Utility functions and helpers.
 *
 * Examples:
 *   - cn() — classname merger (for shadcn/ui)
 *   - formatDate()
 *   - formatTicketNumber()
 */
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes safely.
 * Required by shadcn/ui components.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
