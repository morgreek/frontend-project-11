export default class Feed {
  constructor(title = '', description = '', posts = [], rssLink = '') {
    this.title = title;
    this.description = description;
    this.posts = posts;
    this.rssLink = rssLink;
  }

  setTitle(title) {
    this.title = title;
  }

  setDescription(description) {
    this.description = description;
  }

  setRssLink(link) {
    this.rssLink = link;
  }

  replacePosts(posts) {
    this.posts = posts;
  }

  getFeedInfo() {
    return {
      title: this.title,
      description: this.description,
    };
  }

  getPosts() {
    return this.posts;
  }

  getRssLink() {
    return this.rssLink;
  }
}
