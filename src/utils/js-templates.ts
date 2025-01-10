import type { HassEntity } from "home-assistant-js-websocket";
import { HomeAssistant } from "../../hass-frontend/src/types";
import { html } from "lit";

const jsTemplateRegex = new RegExp('\\[\\[\\[([^]*)\\]\\]\\]', 'gm');



export function evalJsTemplate(thisArg: any, hass: HomeAssistant, entity: HassEntity | undefined, jsTemplate: any): any {
    const regMatches = jsTemplateRegex.exec(jsTemplate)
    jsTemplateRegex.lastIndex = 0;
    if (!regMatches || regMatches.length < 2)
        return jsTemplate;

    const func = regMatches[1];    
    try {
        return new Function('states', 'entity', 'user', 'hass', 'html',
            `'use strict'; ${func}`)
            .call(thisArg, hass.states, entity, hass.user, hass, html);
    } catch (err) {
        console.error(`Error evaluating template (${func}):`, err);
        return "Error evaluating template.";
    }
}