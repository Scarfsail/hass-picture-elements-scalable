import { LitElement, html } from "lit-element"
import { CreateCardElement, getCreateCardElement } from "../utils"
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../../hass-frontend/src/types";
import type { Lovelace, LovelaceCard } from "../../hass-frontend/src/panels/lovelace/types";
import type { LovelaceCardConfig } from "../../hass-frontend/src/data/lovelace/config/card";

interface PictureElementsScalableConfig extends LovelaceCardConfig {
    elements: PictureElement[];
    image: string;
    style: any
    image_width: number;
    image_height: number;
    max_scale?: number;
    min_scale?: number;
    card_size?: number;
}
interface PictureElement {
    type: string;
    style: any;
    entity: string;
    tap_action: any;
    left: string | number;
    top: string | number;
}


@customElement("picture-elements-scalable")
export class PictureElementsScalable extends LitElement implements LovelaceCard {
    private resizeObserver: ResizeObserver;

    private config?: PictureElementsScalableConfig;


    //@property({ attribute: false }) public hass?: HomeAssistant;
    @state() private _createCardElement: CreateCardElement = null;

    @property({ attribute: false }) hass?: HomeAssistant;

    getCardSize() {
        return this.config?.card_size ?? 1;
    }


    constructor() {
        super();
        this.resizeObserver = new ResizeObserver(this.onResize.bind(this));
    }

    async setConfig(config: PictureElementsScalableConfig) {
        this.config = config;
        this._createCardElement = await getCreateCardElement();

    }

    private card?: LovelaceCard;

    private previousViewport = { width: 0, height: 0 };
    render() {

        if (!this.config) {
            return "Config is not defined";
        }
        const clientRect = this.getBoundingClientRect();
        //console.log("RenderY", clientRect);
        const contentHeight = this.config.image_height;
        const contentWidth = this.config.image_width;

        const fitIntoHeight = clientRect.height;
        const fitIntoWidth = clientRect.width;

        // Get the dimensions of the viewport (the visible area)
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        let visibleHeight = 0;
        let visibleWidth = 0;


        if (this.previousViewport.width != viewportWidth || this.previousViewport.height != viewportHeight) {
            this.previousViewport.width = viewportWidth;
            this.previousViewport.height = viewportHeight;
            this.requestUpdate();
            console.log("Viewport changed");
        } else {
            // Calculate the visible height and width
            visibleHeight = Math.max(0, Math.min(viewportHeight, clientRect.bottom) - Math.max(0, clientRect.top));
            visibleWidth = Math.max(0, Math.min(viewportWidth, clientRect.right) - Math.max(0, clientRect.left));
        }
        //console.log('X rect.width, visible.width ; rect.height, visible.height:', clientRect.width, visibleWidth, clientRect.height, visibleHeight);
        const scale = this.getScale(fitIntoHeight, fitIntoWidth, contentWidth, contentHeight)
        if (this.config.max_scale) {
            scale.scaleX = Math.min(scale.scaleX, this.config.max_scale);
            scale.scaleY = Math.min(scale.scaleY, this.config.max_scale);
        }
        if (this.config.min_scale) {
            scale.scaleX = Math.max(scale.scaleX, this.config.min_scale);
            scale.scaleY = Math.max(scale.scaleY, this.config.min_scale);
        }
        this.style.setProperty("position", "relative");

        this.card = this.card || this.createPictureCardElement(this.config);

        if (this.card)
            this.card.hass = this.hass;

        if (visibleHeight == 0)
            return html`
                ${this.card}
            `

        return html`
            <div style="overflow:none; width:${visibleWidth}px; height:${visibleHeight}px">
                <div style="transform: scale(${scale.scaleX}, ${scale.scaleY}); transform-origin: 0px 0px; width:${contentWidth}px; height:${contentHeight}px;">
                    ${this.card}
                </div>
            </div>
        `
        /*


        return html`
            <div style="overflow:none; width:${fitIntoWidth}px; height:${fitIntoHeight}px">
                <div style="transform: scale(${scale.scaleX}, ${scale.scaleY}); transform-origin: 0px 0px; width:${contentWidth}px; height:${contentHeight}px;">                    
                ${this.lovelace?.editMode
                ? html`<hui-card-options .hass=${this.hass} .lovelace=${this.lovelace} .path=${[this.index!, 0] as any} .card=${this.cards[0]}>
                        ${this.cards[0]}
                    </hui-card-options>`
                : html`<div>${this.cards[0]}</div>`
            }
                </div>
            </div>
            `
  */  }
    createPictureCardElement(config: PictureElementsScalableConfig) {

        const cardConfig = {
            type: "picture-elements",
            image: config.image,
            elements: config.elements.map(el => ({
                ...el, style: {
                    ...el.style,
                    /*color: "transparent",*/
                    transform: "none",
                    left: typeof el.left === "string" ? el.left : `${el.left}px`,
                    top: typeof el.top === "string" ? el.top : `${el.top}px`,
                }
            })),
            style: config.style
        };

        return this._createCardElement?.(cardConfig);
    }
    connectedCallback() {
        super.connectedCallback();
        const element = document.querySelector("home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("partial-panel-resolver")?.querySelector("ha-panel-lovelace")?.shadowRoot?.querySelector("hui-root")?.shadowRoot?.querySelector("div");
        if (element)
            this.resizeObserver.observe(element);
        console.log("Connected");
    }

    disconnectedCallback() {
        this.resizeObserver.disconnect();
        super.disconnectedCallback();
        console.log("Disconnected");
    }

    onResize() {
        this.requestUpdate();
    }

    getScale(fitIntoHeight: number, fitIntoWidth: number, contentWidth: number, contentHeight: number) {
        let scaleW = fitIntoWidth / contentWidth;
        let scaleH = fitIntoHeight / contentHeight;
        /*
        if (scaleW < scaleH) //Max ratio between sides is 45:55 -  the shorter side will be bigger than the screen to match the ratio 45:55
            scaleW = Math.max(scaleH * 0.40, scaleW);
        else
            scaleH = Math.max(scaleW * 0.40, scaleH);
        */
        // console.log(`Fit into W:${fitIntoWidth}, H:${fitIntoHeight}  ;  Content W:${contentWidth}, H: ${contentHeight}  ;  Scale W: ${scaleW}, H:${scaleH}`)
        return { scaleX: scaleW, scaleY: scaleH }
    }
}
