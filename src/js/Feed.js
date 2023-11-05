export default class Feed {
    constructor(title = '', description = '', posts = []) {
        this.title = title;
        this.description = description;
        this.posts = posts;
    }

    setTitle(title) {
        this.title = title;
    }

    setDescription(description) {
        this.description = description;
    }

    replacePosts(posts) {
        this.posts = posts;
    }

    getFeedInfo() {
        return {
            title: this.title,
            description: this.description,
        }
    }

    getPosts() {
        return this.posts;
    }
}