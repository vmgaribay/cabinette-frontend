/**
 * getCSSVar
 *
 * Utility function to retrieve the value of a CSS variable from a given element.
 * - Returns trimmed value of CSS variable.
 * - Defaults to reading from document root.
 *
 * @param {string} name - Name of the CSS variable.
 * @param {HTMLElement} [el=document.documentElement] - Element from which to read variable.
 * @returns {string} Value of the CSS variable (empty string if not found).
 */
export function getCSSVar(
  name: string,
  el: HTMLElement = document.documentElement,
) {
  if (typeof window !== "undefined") {
    return getComputedStyle(el).getPropertyValue(name).trim();
  }
  return "";
}
