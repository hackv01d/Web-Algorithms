import { INavOptions } from "./interfaces/INavOptions";

export function toggleDisplayName(event: MouseEvent): void {
    const target = event.target as HTMLDivElement
    const elContentName = target.nextElementSibling as HTMLSpanElement

    if (event.type == 'mouseover') {
        elContentName.style.opacity = "1"
    } else {
        elContentName.style.opacity = '0'
    }
}

export function navigationButtonHandle(event: MouseEvent, options: INavOptions): void {
    const target = event.target as HTMLDivElement
    const newScreenIndex = options.buttons.indexOf(target)

    options.screen.style.transform = `translateY(-${newScreenIndex * 100}vh)`
    options.currentScreenIndex = newScreenIndex
}

export function buttonStartHandle(screen: HTMLDivElement): void {
    screen.style.transform = 'translateX(-100vw)'
}