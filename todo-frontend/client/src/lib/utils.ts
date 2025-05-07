import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format, isValid, parseISO } from "date-fns";
import { TodoStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "No date";

  const dateObj = typeof date === "string" ? parseISO(date) : date;
  
  if (!isValid(dateObj)) return "Invalid date";
  
  return format(dateObj, "MMM dd, yyyy");
}

export function formatDateRelative(date: string | Date | null | undefined): string {
  if (!date) return "No date";

  const dateObj = typeof date === "string" ? parseISO(date) : date;
  
  if (!isValid(dateObj)) return "Invalid date";
  
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function getStatusColor(status: TodoStatus): string {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "in-progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "pending":
    default:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
  }
}

export function getStatusDisplay(status: TodoStatus): string {
  switch (status) {
    case "completed":
      return "Completed";
    case "in-progress":
      return "In Progress";
    case "pending":
    default:
      return "Pending";
  }
}

export function handleApiError(error: unknown): string {
  if (typeof error === 'string') return error;
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return "An unexpected error occurred";
}
