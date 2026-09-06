import { IProduct } from "../../types";
import { IEvents } from "../base/Events"

export class ProductModel {
  protected _items: IProduct[] = [];
  protected _preview: string | null = null;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  // Сохранение массива товаров
  setItems(items: IProduct[]): void {
    this._items = items;
    this.events.emit("products:changed", { items: this._items });
  }

  // Получение массива товаров
  getItems(): IProduct[] {
    return this._items;
  }

  // Получение одного товара по id
  getProductById(id: string): IProduct | undefined {
    return this._items.find((item) => item.id === id);
  }

  // Сохранение товара для подробного отображения
  setPreview(id: string): void {
    this._preview = id;
    this.events.emit("preview:changed", { product: this.getProductById(id) });
  }

  // Получение товара для подробного отображения
  getPreview(): IProduct | null {
    return this._preview ? (this.getProductById(this._preview) ?? null) : null;
  }
}
