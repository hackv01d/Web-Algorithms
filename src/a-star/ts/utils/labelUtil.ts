export function updateSpeedLabel(elInput: HTMLInputElement, elLabel: HTMLLabelElement): void {
    if (elInput.value === elInput.min) {
        elLabel.textContent = "low"
    } else if (elInput.value === elInput.max) {
        elLabel.textContent = "high"
    } else {
        elLabel.textContent = "medium"
    }
}