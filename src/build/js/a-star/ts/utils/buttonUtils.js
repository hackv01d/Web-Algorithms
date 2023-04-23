export function disableButtons(buttons) {
    buttons.forEach(button => button.disabled = true);
}
export function enableButtons(buttons) {
    buttons.forEach(button => button.disabled = false);
}
export function updateOptBtnOnClick(event, optionsButtons) {
    optionsButtons.forEach(button => {
        if (button.classList.contains('selected-btn')) {
            button.classList.remove('selected-btn');
        }
    });
    const button = event.target;
    button.classList.add('selected-btn');
}
//# sourceMappingURL=buttonUtils.js.map