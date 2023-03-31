import { ITitle } from "./interfaces/ITitle";
import { INavOptions } from "./interfaces/INavOptions";
import { animateHeader } from "./animation";
import {
    toggleDisplayName,
    navigationButtonHandle,
    buttonStartHandle } from "./event-handlers";

const mainScreen = document.querySelector('.main-screen') as HTMLDivElement
const buttonStart = document.querySelector('.button-start') as HTMLButtonElement

const navigationButtons = Array.from<HTMLDivElement>(document.querySelectorAll('.nav-btn div'))
const algorithmScreen = document.querySelector('.algorithms-screen') as HTMLDivElement

const elTitle = document.querySelector('.title') as HTMLDivElement
const elSubtitle = document.querySelector('.subtitle') as HTMLDivElement

const lettersOfTitle = Array.from("Привет! Я Алготрон")
const lettersOfSubtitle = Array.from("Твой гид в мире алгоритмов.")

const showModeName = 'anim-letter'

export const titleInfo: ITitle = {
    wrapper: elTitle,
    letterArray: lettersOfTitle,
    lineBreakIndex: 6,
    showModeName: showModeName,
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

buttonStart.addEventListener('click', () => {
    buttonStartHandle(mainScreen)
})

navigationButtons.forEach(element => { element.addEventListener('mouseover', toggleDisplayName) })
navigationButtons.forEach(element => { element.addEventListener('mouseleave', toggleDisplayName) })

navigationButtons.forEach(el => {
    el.addEventListener('click', (event: MouseEvent) => {
        navigationButtonHandle(event, navOptions)
    })
})