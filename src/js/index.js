import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

import { elements, renderLoader, clearLoader } from './views/base'


/** Global state of the app
 *  - Search object 
 *  
 */
const state = {};

/**
 * Search Controller
 */

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

        try {
            // 4 Search for recipes
            await state.search.getResults();

            // 5 Render result in UIs
            clearLoader();
            searchView.renderResults(state.search.result);

        } catch (error) {
            console.log(error);
            alert('Something went wrong :(');
            clearLoader();
        }
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

/**
 * Recipe Controller
 */
 const controlRecipe = async() => {
     const id = window.location.hash.replace('#', '');

     if (id) {
        // Prepare UI
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) {searchView.highlightSelected(id);}

        // Create new recipe object 
        state.recipe = new Recipe(id);

        try {
            // Get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
            
        } catch (error) {
            console.log(error);
            alert('Something went wrong :(');
        }   
     }
 }

 /**
  * List controller
  */
 const controlList = () => {
     // Create new list if not exist 
     if (!state.list) state.list = new List();

     // Add each ingredient to list and UI
     state.recipe.ingredients.forEach(el => {
         const item = state.list.addItem(el.count, el.unit, el.ingredient);
         listView.renderItem(item);
     })
 }

// Handle delete and update
elements.shopping.addEventListener('click', e => {
                        //closet is more specific
    const id = e.target.closest('.shopping__item').dataset.itemid;
    
    // // Handle the delete event
    if (e.target.matches('.shopping__delete, .shopping__delete *')){
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val)
    }   
    window.l = state.list;
    
});




/**
 *  Like controller 
 */

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked the recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list 
        likesView.renderLike(newLike);

    // User has liked the recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore likes recipes on page load
window.addEventListener('load', () => {
     //TESTING
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();

    // Toggle button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the exist 
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

//  window.addEventListener('hashchange', controlRecipe);
//                          fire when page is loaded 
//  window.addEventListener('load', controlRecipe);
 ['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
 
 //Handle recipe event clicked
 elements.recipe.addEventListener('click', e => {
                        // select .btn-decrease or any childs of .btn-decrease
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked   
        if (state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
        
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if(e.target.matches('.recipe__btn, .recipe__btn *')) {
        controlList();
    } else if(e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
 });
 
