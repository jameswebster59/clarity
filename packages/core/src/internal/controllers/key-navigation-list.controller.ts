import { ReactiveControllerHost } from 'lit';
import { getNextKeyListItem, validKeyNavigationCode } from '../utils/keycodes.js';
import { getFlattenedFocusableItems } from '../utils/traversal.js';

export interface KeyNavigationListConfig {
  shadowRoot?: boolean;
  keyListItems?: string;
  layout?: 'both' | 'horizontal' | 'vertical';
  manageFocus?: boolean;
  manageTabindex?: boolean;
  loop?: boolean;
  dir?: string;
}

/**
 * Provides key list naviation behavior
 * https://webaim.org/techniques/keyboard/
 */
export class KeyNavigationListController {
  private get listItems() {
    return (this.host as any)[this.config.keyListItems] as NodeListOf<HTMLElement>;
  }

  private get hostRoot() {
    return this.config.shadowRoot ? this.host.shadowRoot : this.host;
  }

  constructor(private host: ReactiveControllerHost & HTMLElement, private config?: KeyNavigationListConfig) {
    this.config = {
      shadowRoot: true,
      keyListItems: 'keyListItems',
      layout: 'horizontal',
      manageFocus: true,
      manageTabindex: true,
      loop: false,
      dir: this.host.getAttribute('rtl'),
      ...config,
    };
    host.addController(this);
  }

  async hostConnected() {
    await this.host.updateComplete;

    this.hostRoot.addEventListener('click', (e: any) => {
      const activeItem = this.getActiveItem(e);
      if (activeItem) {
        this.setActiveCell(e, activeItem);
      }
    });

    this.hostRoot.addEventListener('keydown', (e: any) => {
      if (validKeyNavigationCode(e)) {
        const activeItem = this.getActiveItem(e);
        if (activeItem) {
          const { next, previous } = getNextKeyListItem(activeItem, Array.from(this.listItems), {
            ...this.config,
            code: e.code,
          });
          this.setActiveCell(e, this.listItems[next], this.listItems[previous]);
        }
      }
    });
  }

  initializeKeyList() {
    if (this.config.manageFocus && this.config.manageTabindex) {
      Array.from(this.listItems).forEach((i: HTMLElement) => i.setAttribute('tabindex', '-1'));
      const firstCell = this.listItems[0];
      firstCell?.setAttribute('tabindex', '0');
    }
  }

  private getActiveItem(e: Event) {
    return Array.from(this.listItems).find(
      c => c === (e.target as HTMLElement).closest(this.listItems[0].tagName.toLocaleLowerCase()) ?? c === e.target
    );
  }

  private setActiveCell(e: any, activeItem: HTMLElement, prev?: HTMLElement) {
    const previousItem = prev ?? Array.from(this.listItems).find(c => c.getAttribute('tabindex') === '0');
    if (this.config.manageFocus) {
      if (previousItem && this.config.manageTabindex) {
        previousItem.setAttribute('tabindex', '-1');
      }

      if (this.config.manageTabindex) {
        activeItem.setAttribute('tabindex', '0');
      }

      const items = getFlattenedFocusableItems(activeItem);
      const item = items[0] ?? activeItem;
      item.focus();
      e.preventDefault();
    }

    activeItem.dispatchEvent(
      new CustomEvent('cdsKeyChange', {
        bubbles: true,
        detail: {
          activeItem,
          previousItem,
          code: e.code,
          metaKey: e.ctrlKey || e.metaKey,
          keyListItems: this.config.keyListItems,
        },
      })
    );
  }
}