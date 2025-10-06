// Simple clsx implementation
function clsx(...args) {
  return args
    .flat()
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function cn(...inputs) {
  return clsx(...inputs)
}

export default cn