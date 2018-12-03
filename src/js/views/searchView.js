import { elements } from './base';
// import { AsyncResource } from 'async_hooks';

                            //it will auto return 
export const getInput = () => elements.searchInput.value;

//without {} it will have a implict return by default 
//clear the input 
export const clearInput = () => {
    elements.searchInput.value = "";
};

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit) {

        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

//clear HTML elements 
export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};
//
const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link results__link--active" href="#${recipe.recipe__id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>       
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);

};

//type: 'prev' or 'next'
const createButton = (page, type) => 
    `
        <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page - 1 : page + 1 }">
            <span>Page ${type === 'prev' ?  page - 1 : page + 1 }</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
            </svg>
        </button>
    `;

const renderButtons = (page, numbResults, resPerPage) => {
    //get how many pages we have, Math.ceil. if it is 4.1 ceil it to 5
    const pages = Math.ceil(numbResults / resPerPage);
    let button;
    if (page === 1 && pages > 1) {
        //only one button go to the next page
        button = createButton(page, 'next');
    } else if (page < pages){
        //Two button
        button = `${createButton(page, 'prev')}
                  ${createButton(page, 'next')}
                `
    } else if (page === pages && pages > 1) {
        //only button to go to prev page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    // render pagination
    renderButtons(page, recipes.length, resPerPage);
}