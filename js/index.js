const formSelector = document.querySelector('form');
const inputSelector = formSelector.querySelector('input');
const popUpSelector = document.querySelector('.pop-up');
const favoriteListSelector = document.querySelector('.favorite__list');

const state = {
    _urlRepositories: 'https://api.github.com/search/repositories?q=',
    termRepositories: ''
}
class FetchData {
    constructor(url) {
        this._url = url;
        this.data = [];
    }
    async fetchGetData(value) {
        const response = await fetch(this._url + value);
        const body = await response.json();
        this.data = body.items.slice(0, 5);
    }
    getData() {
        return this.data;
    }
    setData(value) {
        this.data = value;
    }
}

class FavoriteRepos {
    constructor() {
        this.repos = [];
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
    const fragment = document.createDocumentFragment();
    elements.map(el => {
        const elemntLi = document.createElement('li');
        elemntLi.classList.add('pop-up__item');
        elemntLi.textContent = el.name;
        elemntLi.addEventListener('click', () => {
            favorite.addRepo(el);
            inputSelector.value = '';
            createElementFavorite(favorite.getRepos(), favoriteListSelector);
            repositories.setData([]);
            parent.innerHTML = '';
        });
        fragment.appendChild(elemntLi)
    });
    parent.appendChild(fragment);
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

const repositories = new FetchData(state._urlRepositories);
const favorite = new FavoriteRepos();

inputSelector.addEventListener('input', debounce(async (e) => {
    const value = e.target.value;
    state.termRepositories = value.trim();

    if (!value.length || value === '') {
        repositories.setData([]);
        popUpSelector.innerHTML = '';
        return;
    }
    if (state.termRepositories !== value) {
        return;
    }
    await repositories.fetchGetData(value);
    const data = await repositories.getData();
    createElemntPopUp(data, popUpSelector);

}, 300));