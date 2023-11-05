export default class FeedPost {
    constructor(title, decsription, link) {
        this.title = title;
        this.decsription = decsription;
        this.link = link;
    }

    getTitle() {
        return this.title;
    }

    getDescription() {
        return this.decsription;
    }
    
    getUrl() {
        return this.link;
    }
}