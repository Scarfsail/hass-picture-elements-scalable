import { html, css } from "lit"
import { customElement, property } from "lit/decorators.js";
import { ElementBase, ElementBaseConfig } from "./base";
import type { Layer } from "../cards/picture-elements-scalable";

interface PictureElementsScalableLayersConfig extends ElementBaseConfig {
    layers?: Layer[];
    _layerVisibility?: Map<number, boolean>;
}

@customElement("picture-elements-scalable-layers")
export class PictureElementsScalableLayersElement extends ElementBase<PictureElementsScalableLayersConfig> {
    @property({ attribute: false }) layers: Layer[] = [];
    @property({ attribute: false }) _layerVisibility: Map<number, boolean> = new Map();

    async setConfig(config: PictureElementsScalableLayersConfig): Promise<void> {
        await super.setConfig(config);
        
        // Get layers and visibility from config if passed directly
        if (config.layers) {
            this.layers = config.layers;
        }
        if (config._layerVisibility) {
            this._layerVisibility = config._layerVisibility;
        }
    }

    static styles = css`
        :host {
            display: block;
        }

        .layers-control {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
        }

        .layer-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 20px;
            transition: all 0.2s ease;
            border: 2px solid var(--divider-color);
            background: var(--card-background-color);
            color: var(--primary-text-color);
            cursor: pointer;
            font-family: inherit;
            font-size: 14px;
            font-weight: 500;
        }

        .layer-button:hover {
            background: var(--secondary-background-color);
        }

        .layer-button.active {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }

        .layer-button.inactive {
            background: var(--disabled-color);
            color: var(--disabled-text-color);
            border-color: var(--disabled-color);
            opacity: 0.6;
        }

        .layer-icon {
            width: 18px;
            height: 18px;
        }

        .layer-name {
            white-space: nowrap;
        }

        .empty-state {
            text-align: center;
            padding: 20px;
            color: var(--secondary-text-color);
            font-size: 14px;
        }

        .empty-state ha-icon {
            --mdc-icon-size: 24px;
            margin-bottom: 8px;
            opacity: 0.5;
        }
    `;

    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

    private _toggleLayer(layerIndex: number) {
        // Toggle visibility in our local map
        const currentVisibility = this._layerVisibility.get(layerIndex) ?? true;
        this._layerVisibility.set(layerIndex, !currentVisibility);
        
        // Dispatch event to parent card to update its state
        const event = new CustomEvent('layer-visibility-changed', {
            detail: { layerIndex, visible: !currentVisibility },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
        
        // Update display
        this.requestUpdate();
    }

    private _getLayerVisibility(layerIndex: number): boolean {
        return this._layerVisibility.get(layerIndex) ?? true;
    }

    protected override renderContent() {
        // Filter layers to only show those with showInToggles: true
        const toggleableLayers = this.layers?.filter(layer => layer.showInToggles) || [];

        if (toggleableLayers.length === 0) {
            return html`
                <div class="empty-state">
                    <ha-icon icon="mdi:layers"></ha-icon>
                    <div>No toggleable layers configured</div>
                </div>
            `;
        }

        return html`
            <div class="layers-control">
                ${toggleableLayers.map((layer, index) => {
                    const isVisible = this._getLayerVisibility(index);
                    return html`
                        <button
                            class="layer-button ${isVisible ? 'active' : 'inactive'}"
                            @click=${() => this._toggleLayer(index)}
                            type="button"
                        >
                            <ha-icon icon="${layer.icon}" class="layer-icon"></ha-icon>
                            <span class="layer-name">${layer.name}</span>
                        </button>
                    `;
                })}
            </div>
        `;
    }
}
