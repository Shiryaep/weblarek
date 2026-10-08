import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface IBasketActions {
  onCheckout: (event: MouseEvent) => void;
}

export interface IBasketData {
  items: HTMLElement[];
  total: number;
  isValid: boolean;
  isEmpty?: boolean;
}

export class Basket extends Component<IBasketData> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected checkoutButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IBasketActions) {
    super(container);
    this.listElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container,
    );
    this.totalElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );
    this.checkoutButtonElement = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );

    if (actions?.onCheckout) {
      this.checkoutButtonElement.addEventListener("click", actions.onCheckout);
    }
  }

  protected set items(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items);
  }

  protected set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }

  protected set isValid(value: boolean) {
    this.checkoutButtonElement.disabled = !value;
  }

  protected set isEmpty(value: boolean) {
    if (value) {
      this.listElement.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
      this.checkoutButtonElement.disabled = true;
    }
  }
}
