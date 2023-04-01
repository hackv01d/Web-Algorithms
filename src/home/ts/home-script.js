var mainScreen = document.querySelector('.main-screen');
var buttonStart = document.querySelector('.button-start');
var navigationButtons = Array.from(document.querySelectorAll('.nav-btn div'));
var algorithmScreen = document.querySelector('.algorithms-screen');
var elTitle = document.querySelector('.title');
var elSubtitle = document.querySelector('.subtitle');
var lettersOfTitle = Array.from("Привет! Я Алготрон");
var lettersOfSubtitle = Array.from("Твой гид в мире алгоритмов.");
var showModeName = 'anim-letter';
var titleInfo = {
    wrapper: elTitle,
    letterArray: lettersOfTitle,
    lineBreakIndex: 6,
    showModeName: showModeName,
    displaySpeed: 80,
    isLast: false
};
var subtitleInfo = {
    wrapper: elSubtitle,
    letterArray: lettersOfSubtitle,
    displaySpeed: 15,
    isLast: true
};
function makeSpanWith(letter, className) {
    var span = document.createElement('span');
    span.textContent = letter;
    span.classList.add(className);
    return span;
}
function animateHeader(title) {
    var curIndex = 0;
    var currentSpan;
    var animationInterval = setInterval(function () {
        if (currentSpan != undefined)
            currentSpan.classList.remove(title.showModeName);
        currentSpan = makeSpanWith(title.letterArray[curIndex], title.showModeName);
        title.wrapper.appendChild(currentSpan);
        if (curIndex == title.lineBreakIndex)
            title.wrapper.appendChild(document.createElement('br'));
        if (curIndex == title.letterArray.length - 1) {
            stopAnimationInterval();
            if (!title.isLast)
                animateHeader(subtitleInfo);
            else {
                currentSpan.classList.remove(title.showModeName);
                buttonStart.style.opacity = "1";
            }
        }
        curIndex += 1;
    }, title.displaySpeed);
    function stopAnimationInterval() {
        clearInterval(animationInterval);
    }
}
animateHeader(titleInfo);
buttonStart.addEventListener('click', function () {
    mainScreen.style.transform = 'translateX(-100vw)';
});
function toggleDisplayName(event) {
    var target = event.target;
    var elContentName = target.nextElementSibling;
    if (event.type == 'mouseover') {
        elContentName.style.opacity = "1";
    }
    else {
        elContentName.style.opacity = '0';
    }
}
navigationButtons.forEach(function (element) { element.addEventListener('mouseover', toggleDisplayName); });
navigationButtons.forEach(function (element) { element.addEventListener('mouseleave', toggleDisplayName); });
var currentScreenIndex = 0;
navigationButtons.forEach(function (element) {
    element.addEventListener('click', function (event) {
        var target = event.target;
        var newScreenIndex = navigationButtons.indexOf(target);
        algorithmScreen.style.transform = "translateY(-".concat(newScreenIndex * 100, "vh)");
        currentScreenIndex = newScreenIndex;
    });
});
