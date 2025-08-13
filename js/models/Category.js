export class Category {
  constructor(key, name, color = '#cccccc', icon = '') {
    this.key = key;
    this.name = name;
    this.color = color;
    this.icon = icon;
  }

  toJSON() {
    return {
      key: this.key,
      name: this.name,
      color: this.color,
      icon: this.icon
    };
  }
}
