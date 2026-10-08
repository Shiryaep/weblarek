import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface IHeaderActions {
    onClick: (event: MouseEvent) => void;
}

export interface IHeaderData {
    counter: number;
}

export class Header extends Component<IHeaderData> {
    protected counterElement: HTMLElement;
    protected basketButtonElement: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IHeaderActions) {
        super(container);
        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this.basketButtonElement = ensureElement<HTMLButtonElement>('.header__basket', this.container);

        if (actions?.onClick) {
            this.basketButtonElement.addEventListener('click', actions.onClick);
        }
    }

    protected set counter(value: number) {
        this.counterElement.textContent = String(value);
    }
}