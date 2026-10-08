import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class BasketModel {
  protected items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  // Получение массива товаров в корзине
  getItems(): IProduct[] {
    return this.items;
  }

  // Добавление товара в корзину
  addItem(item: IProduct): void {
    if (!this.hasItem(item.id)) {
      this.items.push(item);
      this.events.emit("basket:changed");
    }
  }

  // Удаление товара из корзины
  removeItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.events.emit("basket:changed");
  }

  // Очистка корзины
  clear(): void {
    this.items = [];
    this.events.emit("basket:changed");
  }

  // Получение стоимости всех товаров в корзине
  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  // Получение количества товаров в корзине
  getCount(): number {
    return this.items.length;
  }

  // Проверка наличия товара в корзине по id
  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
