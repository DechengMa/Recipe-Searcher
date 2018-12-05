

export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);

        // Persist data in localStorage
        this.persistdata();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // Persist data in localStorage
        this.persistdata();
    }
    
    // Check whether a recipe is liked 
    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistdata() {
                                        //Must be string
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
                        // Convert string back to array
        const storage = JSON.parse(localStorage.getItem('likes'));

        // Restoring likes from the localstorage
        if (storage) this.likes = storage;
    }
}