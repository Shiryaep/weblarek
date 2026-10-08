import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export interface IContactsFormData {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
    protected emailInputElement: HTMLInputElement;
    protected phoneInputElement: HTMLInputElement;

    constructor(events: IEvents, container: HTMLFormElement) {
        super(events, container);
        
        this.emailInputElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInputElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    }

    protected set email(value: string) {
        this.emailInputElement.value = value;
    }

    protected set phone(value: string) {
        this.phoneInputElement.value = value;
    }
}