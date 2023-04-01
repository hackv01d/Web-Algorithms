export function updateOptBtnOnClick(event: MouseEvent, optionsButtons: HTMLButtonElement[]) {
    optionsButtons.forEach(button => button.style.backgroundColor = '#57565670')
    const button = event.target as HTMLButtonElement
    button.style.backgroundColor = 'rgba(28,27,27,0.44)'
}

export function animCell(cell: HTMLTableCellElement, color: string): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(() => {
            cell.style.backgroundColor = color
            resolve()
        }, 40)
    })
}