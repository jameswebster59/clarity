import { ReactiveControllerHost } from 'lit';

/**
 * List items default to `content-visibility: auto` for lazy initial render.
 * On scroll set all row items to `content-visibility: visible` for eager render.
 * This allows fast first render and smooth eager rendering anytime after for items within a bounded scroll box.
 */
export class ScrollableVisibilityController {
  constructor(private host: ReactiveControllerHost & HTMLElement) {
    this.host.addController(this);
  }

  async hostConnected() {
    await this.host.updateComplete;
    this.host.shadowRoot.addEventListener(
      'scroll',
      () => this.host.style.setProperty('--row-content-visibility', 'visibile'),
      { once: true, capture: true }
    );
  }
}