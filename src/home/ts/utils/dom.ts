export function makeSpanWith(letter: string, className: string): HTMLSpanElement {
    const span = document.createElement('a')
    span.textContent = letter
    span.classList.add(className)
    return span
}