export function removeAllClassesCell(className: string, table: HTMLTableElement) {
    for (const row of table.rows) {
        for (const cell of row.cells) {
            cell.classList.remove(className)
        }
    }
}