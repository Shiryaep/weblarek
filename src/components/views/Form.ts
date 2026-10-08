import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export interface IFormState {
    valid: boolean;
    errors: string;
}

export abstract class Form<T> extends Component<IFormState & T> {
    protected submitButtonElement: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLFormElement) {
        super(container);
        this.submitButtonElement = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (event: Event) => {
            const target = event.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            const formName = (this.container as HTMLFormElement).name;
            this.events.emit(`${formName}:change`, { field, value });
        });

        this.container.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            const formName = (this.container as HTMLFormElement).name;
            this.events.emit(`${formName}:submit`);
        });
    }

    protected set valid(value: boolean) {
        this.submitButtonElement.disabled = !value;
    }

    protected set errors(value: string) {
        this.errorsElement.textContent = value;
    }
}