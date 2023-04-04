export function animBackgroundCell(cell: HTMLTableCellElement, styleClass: string, duration: number = 10): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(() => {
            cell.className = styleClass
            resolve()
        }, duration)
    })
}