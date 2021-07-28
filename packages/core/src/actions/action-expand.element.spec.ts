/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { html } from 'lit';
import '@cds/core/actions/register.js';
import { CdsActionExpand } from '@cds/core/actions';
import { componentIsStable, createTestElement, removeTestElement } from '@cds/core/test';

describe('cds-action-expand', () => {
  let testElement: HTMLElement;
  let component: CdsActionExpand;

  beforeEach(async () => {
    testElement = await createTestElement(html`<cds-action-expand></cds-action-expand>`);
    component = testElement.querySelector<CdsActionExpand>('cds-action-expand');
  });

  afterEach(() => {
    removeTestElement(testElement);
  });

  it('should create the component', async () => {
    await componentIsStable(component);
    expect(component).toBeTruthy();
  });

  it('should set default angle icon', async () => {
    await componentIsStable(component);
    expect(component.shadowRoot.querySelector('cds-icon').shape).toBe('angle');
  });

  it('should set appropriate aria-label from expand state', async () => {
    await componentIsStable(component);
    expect(component.getAttribute('aria-label')).toBe('Expand');

    component.expanded = true;
    await componentIsStable(component);
    expect(component.getAttribute('aria-label')).toBe('Close');
  });

  it('should set appropriate aria-expanded value from expand state', async () => {
    await componentIsStable(component);
    expect(component.getAttribute('aria-expanded')).toBe('false');

    component.expanded = true;
    await componentIsStable(component);
    expect(component.getAttribute('aria-expanded')).toBe('true');
  });

  it('should set the proper direction for expanding on the cross axis', async () => {
    await componentIsStable(component);
    expect(component.shadowRoot.querySelector('cds-icon').direction).toBe('right');

    component.expanded = true;
    await componentIsStable(component);
    expect(component.shadowRoot.querySelector('cds-icon').direction).toBe('left');
  });

  it('should set the proper direction for expanding on the main axis', async () => {
    component.direction = 'main';
    await componentIsStable(component);
    expect(component.shadowRoot.querySelector('cds-icon').direction).toBe('right');

    component.expanded = true;
    await componentIsStable(component);
    expect(component.shadowRoot.querySelector('cds-icon').direction).toBe('down');
  });
});
