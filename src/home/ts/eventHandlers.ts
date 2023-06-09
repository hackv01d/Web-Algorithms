import { INavOptions } from "./interfaces/INavOptions.js";

export function toggleDisplayName(event: MouseEvent): void {
    const target = event.target as HTMLDivElement
    const parent = target.closest('.nav-btn') as HTMLSpanElement

    let elContentName = parent.querySelector('span') as HTMLSpanElement
    event.type === 'mouseover' ? elContentName.style.opacity = '1' : elContentName.style.opacity = '0'
}

export function navigationButtonHandle(event: MouseEvent, options: INavOptions): void {
    const target = event.target as HTMLDivElement
    const newScreenIndex = options.buttons.indexOf(target)

    options.screen.style.transform = `translateY(-${newScreenIndex * 100}vh)`
    options.currentScreenIndex = newScreenIndex
}

export function buttonStartHandle(options: INavOptions, screen: HTMLDivElement): void {
    screen.style.transform = 'translateX(-100vw)'
}

export function logoButtonHandle(screen: HTMLDivElement): void {
    screen.style.transform = 'translateX(0)'
}