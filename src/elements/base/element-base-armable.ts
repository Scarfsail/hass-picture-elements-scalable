import { LitElement, TemplateResult, css, html, nothing } from "lit"
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../../../hass-frontend/src/types";
import "../../components/last-change-text";

import { AlarmoSensorAndArea, getAlarmoSensorAndArea, getAlarmoSensorState } from "../../utils/alarmo";
import { ElementBase, ElementBaseConfig } from "./element-base";



export abstract class ElementBaseArmable<TConfig extends ElementBaseConfig = ElementBaseConfig> extends ElementBase<TConfig> {
    @state() private _alarmoArea?: AlarmoSensorAndArea;

    protected updated(changedProperties: Map<string | number | symbol, unknown>) {
        if (changedProperties.has('hass') && !changedProperties.get('hass')) {
            // hass has been assigned for the first time
            console.log("hass object assigned for the first time", this.hass);
            if (this._config && this.hass) {
                getAlarmoSensorAndArea(this.hass, this._config.entity).then((alarmoArea) => this._alarmoArea = alarmoArea);
            }
        }
    }

    protected getAlarmoSensorState() {
        return getAlarmoSensorState(this.hass, this._alarmoArea);
    }


}