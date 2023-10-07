const formSelector = document.querySelector('form');
const inputSelector = formSelector.querySelector('input');
const popUpSelector = document.querySelector('.pop-up');
const favoriteListSelector = document.querySelector('.favorite__list');

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
    setDate(value) {
        this.data = value;
    }
}

class FavoriteRepos {
    constructor(parentSelector) {
        this.repos = [];
        this.parentSelector = parentSelector;
    }

    addRepo(repo) {
        this.repos.push(repo);
    }
    removeRepo(id) {
        this.repos = this.repos.filter(repo => repo.id !== id);
    }

    getRepos() {
        return this.repos;
    }

}

function createElemntPopUp(elements, parent) {
    parent.innerHTML = '';
    elements.map(el => {
        const elemntLi = document.createElement('li');
        elemntLi.classList.add('pop-up__item');
        elemntLi.textContent = el.name;
        elemntLi.addEventListener('click', () => {
            favorite.addRepo(el);
            inputSelector.value = '';
            createElementFavorite(favorite.getRepos(), favoriteListSelector);
            repo.setDate([]);
            parent.innerHTML = '';
        });
        parent.appendChild(elemntLi)
    });
}

function createElementFavorite(elements, parent) {
    parent.innerHTML = '';
    if (elements.length) {
        elements.map(el => {
            const {name, id} = el;
            const elementLi = document.createElement('li');
            elementLi.classList.add('favorite__item', 'item');

            const elementDivLeft = document.createElement('div');
            const elementDivRight = document.createElement('div');
            elementDivLeft.classList.add('item__info', 'info-item');
            elementDivRight.classList.add('item__btn', 'btn-icon');

            const elementPName = document.createElement('p');
            const elementPOwner = document.createElement('p');
            const elementPStars = document.createElement('p');

            const elementBtnClose = document.createElement('button');

            elementPName.textContent = `Name: ${name}`;
            elementPOwner.textContent = `Owner: ${id}`;
            elementPStars.textContent = 'Stars: 1300';

            elementBtnClose.classList.add('btn-icon__close');
            elementBtnClose.ariaLabel = 'Удалить из важных';
            elementBtnClose.addEventListener('click', async (e) => {
                favorite.removeRepo(id);
                createElementFavorite(favorite.getRepos(), favoriteListSelector);
            });

            elementDivLeft.appendChild(elementPName);
            elementDivLeft.appendChild(elementPOwner);
            elementDivLeft.appendChild(elementPStars);
            elementDivRight.appendChild(elementBtnClose);

            elementDivLeft.appendChild(elementPStars);

            elementLi.appendChild(elementDivLeft);
            elementLi.appendChild(elementDivRight);

            parent.appendChild(elementLi);
        })
    }
}

function debounce(callback, delay) {
    let time = false;

    return function() {
        if (time) return;

        callback.apply(this, arguments);
        time = true;
        setTimeout(() => time = false, delay);
    };
}


const repo = new Repos(_urlRepos);
const favorite = new FavoriteRepos('asd');

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



