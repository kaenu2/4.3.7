const formSelector = document.querySelector('form');
const inputSelector = formSelector.querySelector('input');
const popUpSelector = document.querySelector('.pop-up');
const favoriteListSelector = document.querySelector('.favorite__list');
const errorSelector = document.querySelector('.error-message');
const noResultMsSelector = document.querySelector('.no-result');

const store = {
    _urlRepositories: 'https://api.github.com/search/repositories?q=',
    termRepositories: '',
}
class FetchData {
    constructor(url) {
        this._url = url;
        this.data = [];
        this.itemsCount = 0;
    }
    async fetchGetData(value) {
        try {
            const response = await fetch(this._url + value);
            if (response.ok) {
                const body = await response.json();
                this.itemsCount = await body.total_count;
                this.data = body.items.slice(0, 20);
            } else {
                throw new Error();
            }
        } catch (e) {
            throw new Error(e);
        }
    }
    getData() {
        return this.data;
    }
    clearDate() {
        this.data = [];
    }
    getItemsCount() {
        return this.itemsCount;
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


function createElemntPopUp(elements, parent, listSelector) {
    parent.innerHTML = '';
    const fragment = document.createDocumentFragment();
    elements.map(el => {
        const elemntLi = document.createElement('li');
        elemntLi.classList.add('pop-up__item');
        elemntLi.textContent = el.name;
        elemntLi.addEventListener('click', () => {
            favorite.addRepo(el);
            createElementFavorite(favorite.getRepos(), listSelector);
            repositories.clearDate();
            clearPopUp(inputSelector, parent, store.termRepositories);
        });
        fragment.appendChild(elemntLi);
    });
    parent.appendChild(fragment);
}
function clearPopUp(inputSelector, parentSelector, term) {
    inputSelector.value = '';
    term = '';
    parentSelector.innerHTML = '';
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
    let timeoutID;

    return function() {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(() => callback.apply(this, arguments), delay)
    };
}
async function onChengeInputSearch(event, term, nodeElement, nodeElementList) {
    const target = event.target;
    const value = target.value;
    term = value.trim();

    if (!value) {
        repositories.clearDate();
        nodeElement.innerHTML = '';
        return;
    }
    if (term !== value) return;

    try {
        await repositories.fetchGetData(value);
        const favoriteRepositories = favorite.getRepos();
        const data = await repositories.getData();
        const getItemsCount = await repositories.getItemsCount();
        const newDate = filterArray(data, favoriteRepositories);
        if (!getItemsCount) {
            addMessage(noResultMsSelector, 'no-result--visable');
        }
        createElemntPopUp(newDate, nodeElement, nodeElementList);
    } catch (e) {
        addMessage(errorSelector, 'error-message--visable');
        addMessage(target, 'search__input--border-red');
    }
}
function filterArray(date, sortArr) {
    let res = JSON.parse(JSON.stringify(date));
    for (let i = 0; i < sortArr.length; i++) {
        const el = sortArr[i];
        for (let j = 0; j < res.length; j++) {
            const el2 = res[j];
            if (el.id === el2.id) {
                res.splice(j, 1);
            }
        }
    }
    return res.slice(0,5);
}

function removeMessage(nodeElement, className) {
    nodeElement.classList.remove(className);
}
function addMessage(nodeElement, className) {
    nodeElement.classList.add(className);
}

const repositories = new FetchData(store._urlRepositories);
const favorite = new FavoriteRepos();

onChengeInputSearch = debounce(onChengeInputSearch, 400);

inputSelector.addEventListener('input',  (e) => {
    removeMessage(e.target,'search__input--border-red');
    removeMessage(errorSelector,'error-message--visable');
    removeMessage(noResultMsSelector, 'no-result--visable');
    onChengeInputSearch(e, store.termRepositories, popUpSelector, favoriteListSelector);
});





