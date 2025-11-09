import { LitElement, TemplateResult, css, html, nothing } from "lit"
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../../../hass-frontend/src/types";
import type { HassEntity } from "home-assistant-js-websocket";
import { handleAction } from "../../utils/handle-action";
import { ElementBase, ElementBaseConfig } from "./element-base";

export interface ElementEntityBaseConfig extends ElementBaseConfig {
    entity: string;
}


export abstract class ElementEntityBase<TConfig extends ElementEntityBaseConfig = ElementEntityBaseConfig> extends ElementBase<TConfig> {
    static styles = css`
        :host {
            cursor: pointer;
        }
    `

    async setConfig(config: TConfig) {
        await super.setConfig(config);

        if (!config.entity) {
            throw Error("Entity required");
        }
    }

    private _handleTap(): void {
        // If tap_action is defined, use it
        if (this._config?.tap_action) {
            handleAction(this, this.hass!, this._config!, "tap");
        } else if (this.showMoreInfoOnClick) {
            // Otherwise, fall back to the default showMoreInfo behavior if enabled
            this._showMoreInfo();
        }
    }

    private _showMoreInfo() {
        const entityId = this._config?.entity;
        const event = new CustomEvent("hass-more-info", {
            detail: { entityId: entityId },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }

    protected showMoreInfoOnClick = true;

    protected override renderContent() {
        if (!this._config || !this.hass) {
            return nothing;
        }

        if (!this._config.entity) {
            return html`Entity is not defined`
        }

        const entity = this.hass.states[this._config.entity]

        if (!entity) {
            return html`Entity not found: ${this._config.entity}`
        }

        return html`
        <div @click=${this._handleTap}>
            ${this.renderEntityContent(entity)}
        </div>`
    }

    protected abstract renderEntityContent(entity: HassEntity): TemplateResult | typeof nothing
}