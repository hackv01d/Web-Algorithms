export function disableButtons(buttons: HTMLButtonElement[]): void {
    buttons.forEach(button => button.disabled = true)
}

export function enableButtons(buttons: HTMLButtonElement[]): void {
    buttons.forEach(button => button.disabled = false)
}

export function updateOptBtnOnClick(event: MouseEvent, optionsButtons: HTMLButtonElement[]): void {
    optionsButtons.forEach(button => button.className = 'setup-btn')
    const button = event.target as HTMLButtonElement
    button.classList.add('selected-btn')
}