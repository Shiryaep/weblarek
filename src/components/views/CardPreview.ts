import { Card, ICard } from "./Card";
import { ensureElement } from "../../utils/utils";

export interface ICardPreviewActions {
  onClick: (event: MouseEvent) => void;
}

export interface ICardPreviewData extends ICard {
  description: string;
  isDisabled: boolean;
  image: string;
  buttonText?: string;
}

export class CardPreview extends Card<ICardPreviewData> {
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardPreviewActions) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );

    if (actions?.onClick) {
      this.buttonElement.addEventListener("click", actions.onClick);
    }
  }

  protected set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  protected set isDisabled(value: boolean) {
    this.buttonElement.disabled = value;
  }

  protected set image(image: string) {
    this.setImage(this.imageElement, image, this.titleElement.textContent);
  }

  protected set category(value: string) {
    this.categoryElement.textContent = value;
  }

  protected set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }
}
