import { welcomeInfo } from "./models/welcomeInfo.js";
import { animateHeader } from "./animation.js";
import { ElementClass } from "./enums/elementClass.js";
import { toggleDisplayName, navigationButtonHandle, buttonStartHandle, logoButtonHandle } from "./eventHandlers.js";
const logoButton = document.querySelector(`.${ElementClass.logoButton}`);
const mainScreen = document.querySelector(`.${ElementClass.mainScreen}`);
const buttonStart = document.querySelector(`.${ElementClass.buttonStart}`);
const algorithmScreen = document.querySelector(`.${ElementClass.algorithmScreen}`);
const navigationButtons = Array.from(document.querySelectorAll(`.${ElementClass.navigationButtons}`));
const elTitle = document.querySelector(`.${ElementClass.title}`);
const elSubtitle = document.querySelector(`.${ElementClass.subtitle}`);
const lettersOfTitle = Array.from(welcomeInfo.title);
const lettersOfSubtitle = Array.from(welcomeInfo.subtitle);
const titleStyleClass = ElementClass.titleStyle;
export const titleInfo = {
    wrapper: elTitle,
    letterArray: lettersOfTitle,
    lineBreakIndex: 6,
    styleClass: titleStyleClass,
    displaySpeed: 80,
    isLast: false
};
export const subtitleInfo = {
    wrapper: elSubtitle,
    letterArray: lettersOfSubtitle,
    displaySpeed: 15,
    isLast: true
};
const navOptions = {
    buttons: navigationButtons,
    screen: algorithmScreen,
    currentScreenIndex: 0,
};
animateHeader(buttonStart);
logoButton.addEventListener('click', () => logoButtonHandle(mainScreen));
buttonStart.addEventListener('click', () => buttonStartHandle(navOptions, mainScreen));
navigationButtons.forEach(element => element.addEventListener('mouseover', toggleDisplayName));
navigationButtons.forEach(element => element.addEventListener('mouseleave', toggleDisplayName));
navigationButtons.forEach(el => {
    el.addEventListener('click', (event) => navigationButtonHandle(event, navOptions));
});
//# sourceMappingURL=main.js.map