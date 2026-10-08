import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface ISuccessActions {
    onClose: (event: MouseEvent) => void;
}

export interface ISuccessData {
    total: number;
}

export class Success extends Component<ISuccessData> {
    protected descriptionElement: HTMLElement;
    protected closeButtonElement: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ISuccessActions) {
        super(container);
        this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.closeButtonElement = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        if (actions?.onClose) {
            this.closeButtonElement.addEventListener('click', actions.onClose);
        }
    }

    protected set total(value: number) {
        this.descriptionElement.textContent = `Списано ${value} синапсов`;
    }
}