export class BlogService {
  static readingTime(text) {
    const wpm = 150;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);
    return time;
  }

  static getFirst10Words(text) {
    return text.trim().split(/\s+/).slice(0, 10).join(" ");
  }
}
