/**
 * Serialize class names
 * @param  {...string} classes A list of class names
 * @returns {string} Serialized class names.
 */
export const classNames = (...classes) => classes.filter(Boolean).join(" ");

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function renameFile(originalFile, newName) {
  return new File([originalFile], newName, {
    type: originalFile.type,
    lastModified: originalFile.lastModified,
  });
}
