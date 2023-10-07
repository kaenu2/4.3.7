const formSelector = document.querySelector('form');
const inputSelector = formSelector.querySelector('input');
const popUpSelector = document.querySelector('.pop-up');

const _urlRepos = 'https://api.github.com/search/repositories?q=';
let test = '';
class Repos {
    constructor(_url) {
        this._url = _url;
        this.data = [];
    }

    async getRepos(value) {
        try {
            const response = await fetch(`${this._url}${value}`);
            const body = await response.json();
            if (body.items) {
                this.data = body.items.slice(0, 5);
            }
        } catch (e) {
            console.error(e.stack);
        }
    }
    getDate() {
        return this.data;
    }
}

function createElemntPopUp(elements, parent) {
    parent.innerHTML = '';
    elements.map(el => {
        const elemntLi = document.createElement('li');
        elemntLi.classList.add('pop-up__item');
        elemntLi.textContent = el.name;
        // elemntLi.addEventListener();
        parent.appendChild(elemntLi)
    });
}

// const a = new CreateElements();

const repo = new Repos(_urlRepos);



function debounce(callback, delay) {
    let time = false;

    return function() {
        if (time) return;

        callback.apply(this, arguments);
        time = true;
        setTimeout(() => time = false, delay);
    };
}


inputSelector.addEventListener('keyup', debounce(async (e) => {
    if (e.target.value === '') {
        popUpSelector.innerHTML = '';
        return;
    }
    if (test !== e.target.value && e.code !== 'Space') {
        test = e.target.value;
        await repo.getRepos(e.target.value);
        const data = await repo.getDate();
        createElemntPopUp(data, popUpSelector);
        return;
    }
}));



