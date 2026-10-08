import { Component } from '../base/Component';

export interface IGallery {
    items: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
    constructor(container: HTMLElement) {
        super(container);
    }

    protected set items(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}