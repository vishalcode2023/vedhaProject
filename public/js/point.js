document.addEventListener('DOMContentLoaded', () => {
    const data = document.querySelector('.btn');
    data.addEventListener('click', () => {
        data.innerHTML = 'Done';
    });
});
