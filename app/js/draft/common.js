document.addEventListener('DOMContentLoaded',function () {
    let box = document.querySelector('.box');
    box.style.border = '5px solid red';
    let list = document.querySelectorAll('.menu__item');

    list.forEach( elem => {
        elem.innerText = 'Hello Babel';
    })
});