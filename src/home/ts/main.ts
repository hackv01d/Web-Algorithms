import { welcomeInfo } from "./models/welcomeInfo.js";
import { ITitle } from "./interfaces/ITitle.js";
import { INavOptions } from "./interfaces/INavOptions.js";
import { animateHeader } from "./animation.js";
import { ElementClass }  from "./enums/elementClass.js";
import {
    toggleDisplayName,
    navigationButtonHandle,
    buttonStartHandle } from "./eventHandlers.js";

const mainScreen = document.querySelector(`.${ElementClass.mainScreen}`) as HTMLDivElement
const buttonStart = document.querySelector(`.${ElementClass.buttonStart}`) as HTMLButtonElement

const algorithmScreen = document.querySelector(`.${ElementClass.algorithmScreen}`) as HTMLDivElement
const navigationButtons = Array.from<HTMLDivElement>(document.querySelectorAll(`.${ElementClass.navigationButtons}`))

const elTitle = document.querySelector(`.${ElementClass.title}`) as HTMLDivElement
const elSubtitle = document.querySelector(`.${ElementClass.subtitle}`) as HTMLDivElement

const lettersOfTitle: string[] = Array.from(welcomeInfo.title)
const lettersOfSubtitle: string[] = Array.from(welcomeInfo.subtitle)

const titleStyleClass: string = ElementClass.titleStyle

export const titleInfo: ITitle = {
    wrapper: elTitle,
    letterArray: lettersOfTitle,
    lineBreakIndex: 6,
    styleClass: titleStyleClass,
    displaySpeed: 80,
    isLast: false
}

export const subtitleInfo: ITitle = {
    wrapper: elSubtitle,
    letterArray: lettersOfSubtitle,
    displaySpeed: 15,
    isLast: true
}

const navOptions: INavOptions = {
    buttons: navigationButtons,
    screen: algorithmScreen,
    currentScreenIndex: 0
}

animateHeader(buttonStart)

buttonStart.addEventListener('click', () => buttonStartHandle(mainScreen))
navigationButtons.forEach(element => element.addEventListener('mouseover', toggleDisplayName) )
navigationButtons.forEach(element => element.addEventListener('mouseleave', toggleDisplayName) )

navigationButtons.forEach(el => {
    el.addEventListener('click', (event: MouseEvent) => navigationButtonHandle(event, navOptions))
})