import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class OrderModel {
  protected _payment: TPayment | null = null;
  protected _address: string = "";
  protected _phone: string = "";
  protected _email: string = "";
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  // Сохранение вида оплаты
  setPayment(value: TPayment): void {
    this._payment = value;
    this.events.emit("order:paymentChanged", { payment: value });
  }

  // Сохранение адреса
  setAddress(value: string): void {
    this._address = value;
    this.events.emit("order:addressChanged", { address: value });
  }

  // Сохранение телефона
  setPhone(value: string): void {
    this._phone = value;
    this.events.emit("order:phoneChanged", { phone: value });
  }

  // Сохранение email
  setEmail(value: string): void {
    this._email = value;
    this.events.emit("order:emailChanged", { email: value });
  }

  // Получение всех данных покупателя
  getData(): IBuyer {
    return {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address,
    } as IBuyer;
  }

  // Очистка данных покупателя
  clear(): void {
    this._payment = null;
    this._address = "";
    this._phone = "";
    this._email = "";
    this.events.emit("order:cleared", {});
  }

  // Валидация данных
  validate(): Partial<Record<keyof IBuyer, string>> | null {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this._payment) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this._email) {
      errors.email = "Укажите email";
    }
    if (!this._phone) {
      errors.phone = "Укажите телефон";
    }
    if (!this._address) {
      errors.address = "Укажите адрес";
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }
}
