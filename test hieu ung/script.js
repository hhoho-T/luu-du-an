const body = document.querySelector('body');
body.addEventListener('mousemove', (event) => {
    let x = event.clientX;
    let y = event.clientY;
    let span = document.createElement('span');
    span.style.left = x + 'px';
    span.style.top = y + 'px';
    body.appendChild(span);
    setTimeout(function() {
        span.remove();
        }, 500);
    })