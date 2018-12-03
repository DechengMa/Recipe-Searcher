import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        const key = '43c26b19ddded5a8eec0c765402115a1';
        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
        } catch (error) {
            console.log(error);
        }
        
    }
}