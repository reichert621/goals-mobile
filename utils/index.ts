import { type ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function times(n: number) {
  return Array.from({ length: n }).map((_, i) => i);
}

export const days = times(366).map((i) => {
  return dayjs().startOf("year").add(i, "days").format("YYYY-MM-DD");
});
export const weeks = times(53).map((i) => {
  return dayjs().startOf("year").add(i, "weeks").format("YYYY-MM-DD");
});
export const months = times(12).map((i) => {
  return dayjs().startOf("year").add(i, "months").format("YYYY-MM-DD");
});
