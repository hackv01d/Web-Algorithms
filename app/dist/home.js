const mainScreen = document.querySelector('.main-screen');
const buttonStartHandle = document.querySelector('.button-start');
const navigationButtons = Array.from(document.querySelectorAll('.nav-btn div'));
const elTitle = document.querySelector('.title');
const elSubtitle = document.querySelector('.subtitle');
const lettersOfTitle = Array.from("Привет! Я Алготрон");
const lettersOfSubtitle = Array.from("Твой гид в мире алгоритмов.");
const showModeName = 'anim-letter';
const titleInfo = {
    wrapper: elTitle,
    letterArray: lettersOfTitle,
    lineBreakIndex: 6,
    showModeName: showModeName,
    displaySpeed: 80,
    isLast: false
};
const subtitleInfo = {
    wrapper: elSubtitle,
    letterArray: lettersOfSubtitle,
    displaySpeed: 15,
    isLast: true
};
function makeSpanWith(letter, className) {
    let span = document.createElement('span');
    span.textContent = letter;
    span.classList.add(className);
    return span;
}
function animateText(title) {
    let curIndex = 0;
    let currentSpan;
    let animationInterval = setInterval(() => {
        if (currentSpan != undefined)
            currentSpan.classList.remove(title.showModeName);
        currentSpan = makeSpanWith(title.letterArray[curIndex], title.showModeName);
        title.wrapper.appendChild(currentSpan);
        if (curIndex == title.lineBreakIndex)
            title.wrapper.appendChild(document.createElement('br'));
        if (curIndex == title.letterArray.length - 1) {
            stopAnimationInterval();
            if (!title.isLast)
                animateText(subtitleInfo);
            else
                currentSpan.classList.remove(title.showModeName);
        }
        curIndex += 1;
    }, title.displaySpeed);
    function stopAnimationInterval() {
        clearInterval(animationInterval);
    }
}
animateText(titleInfo);
buttonStartHandle.addEventListener('click', () => {
    mainScreen.style.transform = 'translateX(-100vw)';
});
function toggleDisplayName(event) {
    let target = event.target;
    let elContentName = target.nextElementSibling;
    let curMode = elContentName.style.display;
    if (event.type == 'mouseover') {
        elContentName.style.display = 'block';
    }
    else {
        elContentName.style.display = 'none';
    }
}
navigationButtons.forEach(element => { element.addEventListener('mouseover', toggleDisplayName); });
navigationButtons.forEach(element => { element.addEventListener('mouseleave', toggleDisplayName); });
//# sourceMappingURL=home.js.map