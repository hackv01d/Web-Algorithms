export let points = [];
const radiusCircle = 22;
const baseColorCircle = 'white';
let canvas = document.getElementById('canv');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.addEventListener('click', function (event) {
    let x = event.clientX - canvas.offsetLeft;
    let y = event.clientY - canvas.offsetTop;
    ctx.beginPath();
    ctx.arc(x, y, radiusCircle, 0, Math.PI * 2, false);
    ctx.fillStyle = baseColorCircle;
    ctx.fill();
    ctx.closePath();
    points.push({ x, y });
});
