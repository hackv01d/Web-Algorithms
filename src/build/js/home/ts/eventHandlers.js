export function toggleDisplayName(event) {
    const target = event.target;
    const parent = target.closest('.nav-btn');
    let elContentName = parent.querySelector('span');
    event.type === 'mouseover' ? elContentName.style.opacity = '1' : elContentName.style.opacity = '0';
}
export function navigationButtonHandle(event, options) {
    const target = event.target;
    const newScreenIndex = options.buttons.indexOf(target);
    options.screen.style.transform = `translateY(-${newScreenIndex * 100}vh)`;
    options.currentScreenIndex = newScreenIndex;
}
export function buttonStartHandle(options, screen) {
    screen.style.transform = 'translateX(-100vw)';
}
export function logoButtonHandle(screen) {
    screen.style.transform = 'translateX(0)';
}
//# sourceMappingURL=eventHandlers.js.map