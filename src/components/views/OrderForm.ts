import { Form } from './Form';
import { ensureElement, ensureAllElements } from '../../utils/utils';
import { IEvents } from '../base/Events';

export interface IOrderFormData {
    payment: string | null;
    address: string;
}

export class OrderForm extends Form<IOrderFormData> {
    protected paymentButtons: HTMLButtonElement[];
    protected addressInputElement: HTMLInputElement;

    constructor(events: IEvents, container: HTMLFormElement) {
        super(events, container);

        this.paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);
        this.addressInputElement = ensureElement<HTMLInputElement>('input[name=address]', this.container);

        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.events.emit('order:change', { field: 'payment', value: button.name });
            });
        });
    }

    protected set payment(value: string | null) {
        this.paymentButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === value);
        });
    }

    protected set address(value: string) {
        this.addressInputElement.value = value;
    }
}