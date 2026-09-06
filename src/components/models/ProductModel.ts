import { IProduct } from "../../types";

export class ProductModel {
  protected items: IProduct[] = [];
  protected preview: string | null = null;

  constructor() {}

  // Сохранение массива товаров
  setItems(items: IProduct[]): void {
    this.items = items;
  }

  // Получение массива товаров
  getItems(): IProduct[] {
    return this.items;
  }

  // Получение одного товара по id
  getProductById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  // Сохранение товара для подробного отображения
  setPreview(id: string): void {
    this.preview = id;
  }

  // Получение товара для подробного отображения
  getPreview(): IProduct | null {
    return this.preview ? (this.getProductById(this.preview) ?? null) : null;
  }
}
