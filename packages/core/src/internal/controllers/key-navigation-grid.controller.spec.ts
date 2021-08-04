/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { html, LitElement } from 'lit';
import { query } from 'lit/decorators/query.js';
import { queryAll } from 'lit/decorators/query-all.js';
import { registerElementSafely } from '@cds/core/internal';
import { createTestElement, removeTestElement, componentIsStable } from '@cds/core/test';
import { KeyNavigationGridController } from './key-navigation-grid.controller.js';

class GridKeyNavigationControllerTestElement extends LitElement {
  @query('section') keyGrid: HTMLElement;
  @queryAll('section > div') keyGridRows: NodeListOf<HTMLElement>;
  @queryAll('section > div > *') keyGridCells: NodeListOf<HTMLElement>;

  keyNavigationGridController = new KeyNavigationGridController(this);

  render() {
    return html`
      <section>
        <div>
          <button>0</button>
          <button>1</button>
          <button>2</button>
        </div>
        <div>
          <button>3</button>
          <button>4</button>
          <button>5</button>
        </div>
        <div>
          <button>6</button>
          <button>7</button>
          <button>8</button>
        </div>
        <div>
          <button>9</button>
          <button>10</button>
          <button>11</button>
        </div>
        <div>
          <button>12</button>
          <button>13</button>
          <button>14</button>
        </div>
        <div>
          <div>15</div>
          <div><button>16</button></div>
          <div><button>17-1</button><button>17-2</button></div>
        </div>
      </section>
    `;
  }
}

registerElementSafely('grid-key-navigation-controller-test-element', GridKeyNavigationControllerTestElement);

describe('grid-column-size.controller', () => {
  let component: GridKeyNavigationControllerTestElement;
  let element: HTMLElement;

  beforeEach(async () => {
    element = await createTestElement(
      html`<grid-key-navigation-controller-test-element></grid-key-navigation-controller-test-element>`
    );
    component = element.querySelector<GridKeyNavigationControllerTestElement>(
      'grid-key-navigation-controller-test-element'
    );
    component.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })); // trigger initialization
  });

  afterEach(() => {
    removeTestElement(element);
  });

  it('should set tabindex -1 on grid cells and 0 for the first cell', async () => {
    // await componentIsStable(component);
    // component.keyNavigationGridController.initialize();

    await componentIsStable(component);
    expect(component.keyGridCells[0].getAttribute('tabindex')).toBe('0');
    expect(component.keyGridCells[8].getAttribute('tabindex')).toBe('-1');
  });

  it('should set activate a cell on left click', async () => {
    // await componentIsStable(component);
    // component.keyNavigationGridController.initialize();

    await componentIsStable(component);
    component.keyGridCells[2].dispatchEvent(new MouseEvent('mousedown', { bubbles: true, buttons: 1 }));
    expect(component.keyGridCells[0].getAttribute('tabindex')).toBe('-1');
    expect(component.keyGridCells[1].getAttribute('tabindex')).toBe('-1');
    expect(component.keyGridCells[2].getAttribute('tabindex')).toBe('0');
  });

  it('should support arrow key navigation', async () => {
    // await componentIsStable(component);
    // component.keyNavigationGridController.initialize();

    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight' }));
    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight' }));
    await componentIsStable(component);

    expect(component.keyGridCells[0].getAttribute('tabindex')).toBe('-1');
    expect(component.keyGridCells[1].getAttribute('tabindex')).toBe('-1');
    expect(component.keyGridCells[2].getAttribute('tabindex')).toBe('0');

    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft' }));
    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft' }));
    await componentIsStable(component);

    expect(component.keyGridCells[0].getAttribute('tabindex')).toBe('0');
    expect(component.keyGridCells[1].getAttribute('tabindex')).toBe('-1');
    expect(component.keyGridCells[2].getAttribute('tabindex')).toBe('-1');

    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown' }));
    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown' }));
    await componentIsStable(component);

    expect(component.keyGridCells[0].getAttribute('tabindex')).toBe('-1');
    expect(component.keyGridCells[3].getAttribute('tabindex')).toBe('-1');
    expect(component.keyGridCells[6].getAttribute('tabindex')).toBe('0');

    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp' }));
    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp' }));
    await componentIsStable(component);

    expect(component.keyGridCells[0].getAttribute('tabindex')).toBe('0');
    expect(component.keyGridCells[3].getAttribute('tabindex')).toBe('-1');
    expect(component.keyGridCells[6].getAttribute('tabindex')).toBe('-1');
  });

  it('should support key navigation shortcuts from wcag spec', async () => {
    // https://www.w3.org/TR/wai-aria-practices/examples/grid/dataGrids.html#kbd_label
    // await componentIsStable(component);
    // component.keyNavigationGridController.initialize();

    // last in row
    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'End' }));
    await componentIsStable(component);
    expect(component.keyGridCells[0].getAttribute('tabindex')).toBe('-1');
    expect(component.keyGridCells[1].getAttribute('tabindex')).toBe('-1');
    expect(component.keyGridCells[2].getAttribute('tabindex')).toBe('0');

    // first in row
    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'Home' }));
    await componentIsStable(component);
    expect(component.keyGridCells[0].getAttribute('tabindex')).toBe('0');
    expect(component.keyGridCells[1].getAttribute('tabindex')).toBe('-1');
    expect(component.keyGridCells[2].getAttribute('tabindex')).toBe('-1');

    // last cell in grid
    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'End', ctrlKey: true, metaKey: true }));
    await componentIsStable(component);
    expect(component.keyGridCells[0].getAttribute('tabindex')).toBe('-1');
    expect(component.keyGridCells[17].getAttribute('tabindex')).toBe('0');

    // first cell in grid
    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'Home', ctrlKey: true, metaKey: true }));
    await componentIsStable(component);
    expect(component.keyGridCells[0].getAttribute('tabindex')).toBe('0');
    expect(component.keyGridCells[17].getAttribute('tabindex')).toBe('-1');

    // page down (every 5th cell)
    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'PageDown' }));
    await componentIsStable(component);
    expect(component.keyGridCells[0].getAttribute('tabindex')).toBe('-1');
    expect(component.keyGridCells[12].getAttribute('tabindex')).toBe('0');

    // page up (every 5th cell)
    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'PageUp' }));
    await componentIsStable(component);
    expect(component.keyGridCells[0].getAttribute('tabindex')).toBe('0');
    expect(component.keyGridCells[12].getAttribute('tabindex')).toBe('-1');
  });

  it('should not page beyond index when using page up or page down', async () => {
    // await componentIsStable(component);
    // component.keyNavigationGridController.initialize();

    // limit reached should focus first available cell
    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'PageUp' }));
    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'PageUp' }));
    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'PageUp' }));
    await componentIsStable(component);
    expect(component.keyGridCells[0].getAttribute('tabindex')).toBe('0');
    expect(component.keyGridCells[12].getAttribute('tabindex')).toBe('-1');
    expect(component.keyGridCells[15].getAttribute('tabindex')).toBe('-1');

    // limit reached should focus last available cell
    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'PageDown' }));
    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'PageDown' }));
    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'PageDown' }));
    await componentIsStable(component);
    expect(component.keyGridCells[0].getAttribute('tabindex')).toBe('-1');
    expect(component.keyGridCells[12].getAttribute('tabindex')).toBe('-1');
    expect(component.keyGridCells[15].getAttribute('tabindex')).toBe('0');
  });

  it('should invert directions when in RTL mode', async () => {
    await componentIsStable(component);
    component.dir = 'rtl';
    // component.keyNavigationGridController.initialize();

    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft' }));
    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft' }));
    await componentIsStable(component);
    expect(component.keyGridCells[0].getAttribute('tabindex')).toBe('-1');
    expect(component.keyGridCells[1].getAttribute('tabindex')).toBe('-1');
    expect(component.keyGridCells[2].getAttribute('tabindex')).toBe('0');

    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight' }));
    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight' }));
    await componentIsStable(component);
    expect(component.keyGridCells[0].getAttribute('tabindex')).toBe('0');
    expect(component.keyGridCells[1].getAttribute('tabindex')).toBe('-1');
    expect(component.keyGridCells[2].getAttribute('tabindex')).toBe('-1');
  });

  it('should focus first focusable item if more than one focusable item exists within cell', async () => {
    // await componentIsStable(component);
    // component.keyNavigationGridController.initialize();

    await componentIsStable(component);
    component.keyGrid.dispatchEvent(new KeyboardEvent('keydown', { code: 'End', ctrlKey: true, metaKey: true }));
    await componentIsStable(component);
    expect(component.keyGridCells[17].getAttribute('tabindex')).toBe('0');
    expect(component.shadowRoot.activeElement).toEqual(component.keyGridCells[17].querySelectorAll('button')[0]);
    expect(component.shadowRoot.activeElement).not.toEqual(component.keyGridCells[17].querySelectorAll('button')[1]);
  });
});
