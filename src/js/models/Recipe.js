import axios from 'axios';
import { key } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        
        try {
            const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
            alert('Something went wrong :(');
        }
    }

    calcTime() {
        // Assuming that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g', 'jars', 'packages'];
        
        const newIngredients = this.ingredients.map(el => {

            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // Remove parentheses
            ingredient = ingredient.replace(/["'\(\)]/g, ' ');

            // Parse ingreidents into count, unit and ingredient

            const arrIng = ingredient.split(/\s+/);

            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;

            if (unitIndex > -1){
                // These is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2]
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex); 

                let count; 
                if (arrCount.length === 1) {    
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    // eval("4 + 1/2") --> 4.5 

                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrIng[0], 10)){
                // There is NO unit, but 1st is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    // ingredient = ingredient
                    ingredient: arrIng.slice(1).join(' ')
                }

            } else if (unitIndex === -1) {
                // These is not unit
                objIng = {
                    count: 1,
                    unit: '',
                    // ingredient = ingredient
                    ingredient
                }
            }

            return objIng;
        });

        this.ingredients = newIngredients;
    }

    updateServings (type) {
        const newServing = type === 'dec' ? this.servings - 1 : this.servings + 1;
        // console.log(newServing);
        
        this.ingredients.forEach(ing => {
            ing.count *= (newServing / this.servings);
        })

        this.servings = newServing;
        
    }
}

