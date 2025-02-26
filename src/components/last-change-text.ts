import { LitElement, html, css } from 'lit-element';
import { customElement, property, state } from "lit/decorators.js";
import dayjs from 'dayjs';
import { Utils } from '../utils/utils';
import type { HassEntity } from 'home-assistant-js-websocket';

@customElement('last-change-text')
class LastChangeText extends LitElement {

  @property({ attribute: false }) public entity?: HassEntity;
  @state() private _currentTime = new Date(); // State to force re-renders
  private _timer?: number;

  static styles = css`
    /* Add component styles here */
        :host {
            font-size: 11px;
            white-space: nowrap;
        }
  `;

  connectedCallback() {
    super.connectedCallback();
    // Set up interval to update _currentTime every second
    this._timer = window.setInterval(() => {
      this._currentTime = new Date();
    }, 1000);
  }

  disconnectedCallback() {
    // Clean up timer when component is removed
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = undefined;
    }
    super.disconnectedCallback();
  }

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
