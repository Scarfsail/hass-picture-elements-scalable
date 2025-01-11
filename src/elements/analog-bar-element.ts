import { LitElement, html, css, nothing } from 'lit-element';
import { customElement, property, state } from "lit/decorators.js";
import dayjs from 'dayjs';
import { Utils } from '../utils/utils';
import type { HassEntity } from 'home-assistant-js-websocket';
import { ElementEntityBase, ElementEntityBaseConfig } from './base';
import { styleMap } from 'lit/directives/style-map.js';

interface AnalogBarConfig extends ElementEntityBaseConfig {
  value: number;
  min: number;
  max: number;
  height: number;
  width: number;
  border_color: string;
  active_color: string;
  bg_color: string;
  fontSize: number;
  value_position?: "bottom" | "scaleTop" | "scaleBottom"
}

@customElement('analog-bar-element')
class AnalogBar extends ElementEntityBase<AnalogBarConfig> {
  //@state() private activeColor: string = "#ffffff";
  override async setConfig(config: AnalogBarConfig) {
    await super.setConfig(config);
    //this.subscribeRenderTemplate(config.activeColor, (value) => this.activeColor = value);
    //this.activeColor = await this.evaluateTemplate(config.activeColor);
  }
 
  protected override renderEntityContent(entity: HassEntity) {
    if (!entity || !this._config)
      return nothing;
    const p = this._config;
    const val = +entity.state;
    const calculateHeight = (value: number) => p.height * Math.abs(1 / (p.max - p.min) * (value - p.min));

    const valueHeight = isNaN(val) ? 0 : calculateHeight(val);

    const valuesPosition = p.value_position ?? "bottom";
    const getValueVerticalPosition = (height: number) => ({
      bottom: valuesPosition == "bottom" ? "1px" : valuesPosition == "scaleTop" ? `${p.height - height - 2}px` : undefined,
      top: valuesPosition == "scaleBottom" ? `${p.height - height - 2}px` : undefined
    })
    
    const activeColor = this.evalJsTemplate(p.active_color, entity) ?? "#404854";
    const borderColor = this._config?.border_color ?? "gray";
    const bgColor = this._config?.bg_color ?? "rgba(0, 0, 0, 0.7)";

    return html`
      <div style=${styleMap({ fontSize: `${p.fontSize}px`, position: "relative", width: `${p.width}px`, height: `${p.height}px` })}>
        <div style=${styleMap({
          position: "absolute",
          left: `0px`,
          top: `0px`,
          width: `${p.width}px`,
          height: `${p.height}px`,
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor:borderColor
        })}></div>

        <div style=${styleMap({
          position: "absolute",
          left: `1px`,
          top: "1px",
          width: `${p.width-1}px`,
          bottom: "1px",

          height: `${p.height - 1}px`,
          background: activeColor
        })}></div>
        
        <div style=${styleMap({
          position: "absolute",
          left: "1px",
          top: "1px",
          width: `${p.width - 1}px`,
          height: `${p.height - valueHeight - 1}px`,
          background: bgColor
        })}></div>

        ${p.fontSize > 0 ?
        html`<div style=${styleMap({ position: "absolute", left: `4px`, width: `${p.width - 4}px`, ...getValueVerticalPosition(valueHeight) })}>
            <span>${entity.state}<span style="font-size:50%">${entity.attributes.unit_of_measurement}</span></span>
        </div>`: null}
    </div>
    `;
  }
}
