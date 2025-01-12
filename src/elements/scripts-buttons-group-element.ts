import { html, nothing } from "lit"
import { customElement } from "lit/decorators.js";
import { ElementBase, ElementBaseConfig } from "./base";

interface ScriptButtonDefinition {
    entity: string;
    title: string;
    left: number;
    top: number;
}

interface ScriptButtonsGroupElementConfig extends ElementBaseConfig {
    scripts: ScriptButtonDefinition[];
}


@customElement("scripts-buttons-group-element")
export class ScriptButtonsGroupElement extends ElementBase<ScriptButtonsGroupElementConfig> {
    private _runScript(entity: string) {
        // Implement the script running logic here
        console.log(`Running script for entity: ${entity}`);
        this.hass?.callService('script', 'turn_on', { entity_id: entity });
    }
    private _stopScript(entity: string) {
        // Implement the script running logic here
        console.log(`Stopping script for entity: ${entity}`);
        this.hass?.callService('script', 'turn_off', { entity_id: entity });
    }

    protected override renderContent() {
        if (!this._config || !this.hass)
            return nothing;
        /*
    <ha-icon-button icon="mdi:play" @click=${() => this._runScript(scriptButton.entity)}></ha-icon-button>
    <span>${scriptButton.title}</span>
*/

        const runningScriptButton = this._config.scripts.find(scriptButton => this.hass?.states[scriptButton.entity]?.state == "on");
        if (runningScriptButton) {
            const runningScript = this.hass.states[runningScriptButton.entity];
            return html`
                <div style="position:relative">
                    <div>Probíhá: ${runningScriptButton.title}</div>
                    <div>${runningScript.attributes["last_action"]}</div>
                    <div>
                        <ha-button raised class="warning" @click=${() => this._stopScript(runningScriptButton.entity)}>
                            ${`Zrušit ${runningScriptButton.title}`}
                        </ha-button>
                    </div>
                </div>
            `
        }

        return html`
            <div style="position:relative">
                ${this._config?.scripts.map(scriptButton => html`
                    <div style="position:absolute;left:${scriptButton.left}px;top:${scriptButton.top}px">
                        <ha-button raised @click=${() => this._runScript(scriptButton.entity)} style="--mdc-theme-primary: var(--dark-grey-color); ">${scriptButton.title}</ha-button>
                    </div>
                `)}
            </div>
        `
    }
}