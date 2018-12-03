import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base'

/** Global state of the app
 *  - Search object 
 *  
 */
const state = {};

const controlSearch = async () => {
    // 1 Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2 New search object and add to state
        state.search = new Search(query);

        // 3 Prepare UI
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        // 4 Search for recipes
        await state.search.getResults();

        // 5 Render result in UIs
        clearLoader();
        searchView.renderResults(state.search.result);
        // console.log(state.search.result)

    }
}

document.querySelector('.search').addEventListener('submit', e => {
    // prevent the page to reload when clicked
    e.preventDefault();
    controlSearch();
})

elements.searchResPages.addEventListener('click', e => {
    const button = e.target.closest('.btn-inline');
    if (button) {
                                                    //10 is normal ,if 2 is 0101010101010
        const goToPage = parseInt(button.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
})

