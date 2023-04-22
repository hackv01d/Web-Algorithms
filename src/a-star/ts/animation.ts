export function animBackgroundCell(cell: HTMLTableCellElement, styleClass: string, duration: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(() => {
            cell.className = styleClass
            resolve()
        }, 100 - duration)
    })
}