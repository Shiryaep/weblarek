import { IBuyer, TBuyerErrors, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class BuyerModel {
  protected payment: TPayment | null = null;
  protected address: string = "";
  protected phone: string = "";
  protected email: string = "";

  constructor(protected events: IEvents) {}

  // Сохранение вида оплаты
  setPayment(value: TPayment | null): void {
    this.payment = value;
    this.events.emit("buyer:receivedPayment");
  }

  // Сохранение адреса
  setAddress(value: string): void {
    this.address = value;
    this.events.emit("buyer:receivedAddress");
  }

  // Сохранение телефона
  setPhone(value: string): void {
    this.phone = value;
    this.events.emit("buyer:receivedPhone");
  }

  // Сохранение email
  setEmail(value: string): void {
    this.email = value;
    this.events.emit("buyer:receivedEmail");
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
    this.events.emit("buyer:cleared");
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
