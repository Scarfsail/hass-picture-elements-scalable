import { LitElement, html, css } from 'lit-element';
import { customElement, property, state } from "lit/decorators.js";
import dayjs from 'dayjs';
import { Utils } from '../utils/utils';
import type { HassEntity } from 'home-assistant-js-websocket';

@customElement('last-change-text')
class LastChangeText extends LitElement {

  @property({ attribute: false }) public entity?: HassEntity;

  static styles = css`
    /* Add component styles here */
        :host {
            font-size: 11px;
            white-space: nowrap;
        }
  `;
  render() {
    if (!this.entity)
      return html`<div>No entity defined</div>`

    const lastChanged = this.entity.attributes["state_last_changed"] ?? this.entity.last_changed;

    return html`
      <div>
        ${Utils.formatDurationFromTo(lastChanged)}
      </div>
    `;
  }
}
