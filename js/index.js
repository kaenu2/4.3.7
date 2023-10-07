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
            const {name, id, owner, stargazers_count: stargazersCount} = el;
            const content = `
                <li class="favorite__item item">
                    <div class="item__info info-item">
                        <p>Name: ${name}</p>
                        <p>Owner: ${owner.login}</p>
                        <p>Stars: ${stargazersCount}</p>
                    </div>
                    <div class="item__btn btn-icon">
                        <button class="btn-icon__close" aria-label="Удалить из важных" onclick="removeFavorite(${id})"></button>
                    </div>
                </li>
            `;
            parent.insertAdjacentHTML('beforeend', content);
        })
    }
}

function removeFavorite(id) {
    favorite.removeRepo(id);
    createElementFavorite(favorite.getRepos(), favoriteListSelector);
}

function debounce(callback, delay) {
    let time;

    return function() {
        clearTimeout(time);
        time = setTimeout(() => callback.apply(this, arguments), delay)
    };
}


const repo = new Repos(_urlRepos);
const favorite = new FavoriteRepos('asd');

inputSelector.addEventListener('keyup', debounce(async (e) => {
    if (e.target.value === '') {
        popUpSelector.innerHTML = '';
        return;
    }
    if (test.trim() !== e.target.value.trim() && e.code !== 'Space') {
        test = e.target.value;
        await repo.getRepos(e.target.value);
        const data = await repo.getDate();
        createElemntPopUp(data, popUpSelector);
        return;
    }
}, 400));

formSelector.addEventListener('submit', (e) => {
    e.preventDefault();
})