import { html } from "lit"
import { customElement } from "lit/decorators.js";
import { ElementBase, ElementBaseConfig } from "./base";
import { HassEntity } from "home-assistant-js-websocket";
import { keyed } from 'lit/directives/keyed.js';

interface BadgeElementsConfig extends ElementBaseConfig {
    entities: string[];

}
interface Badge {
    entity: string;
    element: any;
}
@customElement("badge-elements")
export class BadgeElements extends ElementBase<BadgeElementsConfig> {

    private badges?: Badge[];

    protected override renderContent() {
        if (!this.badges) {
            this.badges = this._config!.entities.map(entity => {
                const element = document.createElement('hui-entity-badge') as any
                element.setConfig({ entity: entity, show_name: true });
                return {
                    "entity": entity,
                    "element": element
                }
            })


        }
        for (const badge of this.badges) {
            badge.element.hass = this.hass;
        }

        return html`
            <div style="display: flex; flex-wrap: wrap;gap: 5px">
                ${this.badges.map(badge => keyed(badge.entity, html`${badge.element}`))}
            </div>
        `;
    }
}