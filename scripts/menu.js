const header = document.querySelector('.header');
const burger = header ? header.querySelector('.burger') : null;
const menu = document.getElementById('menu');

if (header && burger && menu) {
    header.classList.add('header--js');

    function setOpen(open) {
        burger.setAttribute('aria-expanded', String(open));
        menu.classList.toggle('is-open', open);
    }

    burger.addEventListener('click', function () {
        setOpen(burger.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', function (e) {
        if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
            setOpen(false);
            burger.focus();
        }
    });

    window.matchMedia('(min-width: 701px)').addEventListener('change', function (e) {
        if (e.matches) setOpen(false);
    });
}