export function makeSpanWith(letter: string, className: (string | undefined)): HTMLSpanElement {
    const span = document.createElement('span')
    span.textContent = letter
    if (className !== undefined) span.classList.add(className)
    return span
}