export function updateSpeedLabel(elInput, elLabel) {
    if (elInput.value === elInput.min) {
        elLabel.textContent = "low";
    }
    else if (elInput.value === elInput.max) {
        elLabel.textContent = "high";
    }
    else {
        elLabel.textContent = "medium";
    }
}
//# sourceMappingURL=labelUtil.js.map