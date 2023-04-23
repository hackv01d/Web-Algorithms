import { makeSpanWith } from "./utils/elementUtils.js";
import { titleInfo, subtitleInfo } from "./main.js";
export function animateHeader(button, title = titleInfo) {
    let curIndex = 0;
    let curSpan;
    const animationInterval = setInterval(() => {
        if (curSpan !== undefined && title.styleClass !== undefined) {
            curSpan.classList.remove(title.styleClass);
        }
        curSpan = makeSpanWith(title.letterArray[curIndex], title.styleClass);
        title.wrapper.appendChild(curSpan);
        if (curIndex === title.lineBreakIndex) {
            title.wrapper.appendChild(document.createElement('br'));
        }
        if (curIndex === title.letterArray.length - 1) {
            stopAnimationInterval();
            if (!title.isLast)
                animateHeader(button, subtitleInfo);
            else {
                button.style.opacity = "1";
                return;
            }
        }
        curIndex += 1;
    }, title.displaySpeed);
    function stopAnimationInterval() {
        clearInterval(animationInterval);
    }
}
//# sourceMappingURL=animation.js.map