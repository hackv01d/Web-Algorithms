export function removeClassFromAllCells(className, table) {
    for (const row of table.rows) {
        for (const cell of row.cells) {
            cell.classList.remove(className);
        }
    }
}
//# sourceMappingURL=cellUtils.js.map