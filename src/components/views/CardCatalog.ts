import { Card, ICard } from "./Card";
import { ensureElement, isCategoryKey } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";

export interface ICardPreviewData extends ICard {
  image: string;
}

export interface ICardCatalogActions {
  onClick: (event: MouseEvent) => void;
}

export class CardCatalog extends Card<ICardPreviewData> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardCatalogActions) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );

    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }
  }

  protected set image(image: string) {
    this.setImage(this.imageElement, image, this.titleElement.textContent);
  }

  protected set category(value: string) {
    this.categoryElement.textContent = value;

    if (isCategoryKey(value)) {
      this.categoryElement.className = `card__category ${categoryMap[value]}`;
    } else {
      this.categoryElement.className = 'card__category';
    }
  }
}
