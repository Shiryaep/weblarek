import { IBuyer, TBuyerErrors, TPayment } from "../../types";

export class BuyerModel {
  protected payment: TPayment | null = null;
  protected address: string = "";
  protected phone: string = "";
  protected email: string = "";

  constructor() {}

  // Сохранение вида оплаты
  setPayment(value: TPayment | null): void {
    this.payment = value;
  }

  // Сохранение адреса
  setAddress(value: string): void {
    this.address = value;
  }

  // Сохранение телефона
  setPhone(value: string): void {
    this.phone = value;
  }

  // Сохранение email
  setEmail(value: string): void {
    this.email = value;
  }

  // Получение всех данных покупателя
  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  // Очистка данных покупателя
  clear(): void {
    this.payment = null;
    this.address = "";
    this.phone = "";
    this.email = "";
  }

  // Валидация данных
  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};

    if (!this.payment) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this.email) {
      errors.email = "Укажите email";
    }
    if (!this.phone) {
      errors.phone = "Укажите телефон";
    }
    if (!this.address) {
      errors.address = "Укажите адрес";
    }

    return errors;
  }
}
