export function animBackgroundCell(cell, styleClass, duration) {
    return new Promise(resolve => {
        setTimeout(() => {
            cell.className = styleClass;
            resolve();
        }, 100 - duration);
    });
}
//# sourceMappingURL=animation.js.map