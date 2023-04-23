export function makeSpanWith(letter, className) {
    const span = document.createElement('span');
    span.textContent = letter;
    if (className !== undefined)
        span.classList.add(className);
    return span;
}
//# sourceMappingURL=elementUtils.js.map