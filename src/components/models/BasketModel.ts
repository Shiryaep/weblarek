import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class BasketModel {
  protected _items: IProduct[] = [];
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  // Получение массива товаров в корзине
  getItems(): IProduct[] {
    return this._items;
  }

  // Добавление товара в корзину
  addItem(item: IProduct): void {
    if (!this.hasItem(item.id)) {
      this._items.push(item);
      this.events.emit("basket:changed", { items: this._items });
    }
  }

  // Удаление товара из корзины
  removeItem(id: string): void {
    this._items = this._items.filter((item) => item.id !== id);
    this.events.emit("basket:changed", { items: this._items });
  }

  // Очистка корзины
  clear(): void {
    this._items = [];
    this.events.emit("basket:changed", { items: this._items });
  }

  // Получение стоимости всех товаров в корзине
  getTotalPrice(): number {
    return this._items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  // Получение количества товаров в корзине
  getCount(): number {
    return this._items.length;
  }

  // Проверка наличия товара в корзине по id
  hasItem(id: string): boolean {
    return this._items.some((item) => item.id === id);
  }
}
