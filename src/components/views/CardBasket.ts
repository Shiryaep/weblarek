import { Card, ICard } from './Card';
import { ensureElement } from '../../utils/utils';

export interface ICardBasketActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICardBasketData extends ICard {
    index: number;
}

export class CardBasket extends Card<ICardBasketData> {
    protected indexElement: HTMLElement;
    protected deleteButtonElement: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardBasketActions) {
        super(container);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButtonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        if (actions?.onClick) {
            this.deleteButtonElement.addEventListener('click', actions.onClick);
        }
    }

    protected set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}