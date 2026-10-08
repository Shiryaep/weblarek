import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";

export interface ICard {
  title: string;
  category: string;
  price: number | null;
}

export class Card<T = object> extends Component<ICard & T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.container,
    );
    this.priceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.container,
    );
  }

  protected set title(title: string) {
    this.titleElement.textContent = title;
  }

  protected set price(value: number | null) {
    this.priceElement.textContent =
      value !== null ? `${value} синапсов` : "Бесценно";
  }
}
