export function disableButtons(buttons: HTMLButtonElement[]) {
    buttons.forEach(button => button.disabled = true)
}

export function enableButtons(buttons: HTMLButtonElement[]) {
    buttons.forEach(button => button.disabled = false)
}

export function updateOptBtnOnClick(event: MouseEvent, optionsButtons: HTMLButtonElement[]): void {
    optionsButtons.forEach(button => button.className = 'unselected-btn')
    const button = event.target as HTMLButtonElement
    button.className = 'selected-btn'
}