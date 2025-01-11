import { LitElement, TemplateResult, css, html, nothing } from "lit"
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../../../hass-frontend/src/types";
import type { HassEntity } from "home-assistant-js-websocket";
import { evalJsTemplate, subscribeRenderTemplate } from "../../utils";

export interface ElementBaseConfig {
    style: any;
    top: number;
    left: number;
}


export abstract class ElementBase<TConfig extends ElementBaseConfig = ElementBaseConfig> extends LitElement {
    @property({ attribute: false }) public hass?: HomeAssistant;

    @state() protected _config?: TConfig;

    async setConfig(config: TConfig) {
        this._config = config;

        if (config.style) {
            Object.keys(config.style).forEach((prop) => {
                this.style.setProperty(prop, config.style![prop]);
            });
        }

    }

    protected async subscribeRenderTemplate(template: string, onChange: (result: string) => void) {
        if (!this.hass) {
            console.error("Error: Home Assistant object not provided.");
            return;
        }
        if (!template.includes('{{')) {
            onChange(template);
            return;
        }

        await subscribeRenderTemplate(this.hass.connection, template, onChange);
    }
    protected evalJsTemplate(jsTemplate: string, entity?: HassEntity): string {
        if (!jsTemplate)
            return jsTemplate;
        
        if (!this.hass) {
            console.error("Error: Home Assistant object not provided.");
            return "Error: Home Assistant object not provided.";
        }
        return evalJsTemplate(this, this.hass, entity, jsTemplate)
    }
    protected async evaluateTemplate(template: string): Promise<string> {
        if (!template.includes('{{'))
            return template;

        if (!this.hass || !template) {
            const err = "Home Assistant object or template not provided."
            console.error(err);
            return err;
        }

        try {
            // Call the template API to evaluate the template
            const response = await this.hass.callApi("POST", "template", {
                template: template,
            });

            return response as string;
        } catch (err) {
            console.error("Error evaluating template:", err);
            return "Error evaluating template.";
        }
    }

    protected render() {
        if (!this._config || !this.hass) {
            return nothing;
        }

        return html`            
            ${this.renderContent()}
        `
    }

    protected abstract renderContent(): TemplateResult | typeof nothing
}