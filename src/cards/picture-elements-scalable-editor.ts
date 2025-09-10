import { LitElement, html, css } from "lit-element";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../../hass-frontend/src/types";
import type { LovelaceCardEditor } from "../../hass-frontend/src/panels/lovelace/types";
import type { PictureElementsScalableConfig, Layer } from "./picture-elements-scalable";
import { sharedStyles } from "./editor-components/shared-styles";
import "./editor-components/editor-layers";

@customElement("picture-elements-scalable-editor")
export class PictureElementsScalableEditor extends LitElement implements LovelaceCardEditor {
    @property({ attribute: false }) public hass!: HomeAssistant;
    @state() private _config!: PictureElementsScalableConfig;
    @state() private _expandedLayers: Set<number> = new Set();

    static styles = [
        sharedStyles,
        css`
            .basic-config {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }

            .basic-config ha-textfield {
                width: 100%;
            }
        `
    ];

    public setConfig(config: PictureElementsScalableConfig): void {
        // Handle backward compatibility: migrate old groups structure to new layers structure
        if ((config as any).groups && !config.layers?.length) {
            // Create a default layer containing all existing groups
            const defaultLayer: Layer = {
                name: 'Default Layer',
                icon: 'mdi:layers',
                visible: true,
                showInToggles: false,
                groups: (config as any).groups.map((group: any) => ({
                    group_name: group.group_name,
                    elements: group.elements || []
                }))
            };
            
            this._config = {
                ...config,
                layers: [defaultLayer]
            };
        } else {
            this._config = { 
                ...config,
                layers: config.layers || []
            };
        }
    }

    protected render() {
        if (!this._config) {
            return html`<div>Loading...</div>`;
        }

        return html`
            <div class="card-config">
                <!-- Basic Configuration Section -->
                <div class="config-section">
                    <div class="section-header">
                        <div class="section-title">
                            <ha-icon icon="mdi:cog"></ha-icon>
                            Basic Configuration
                        </div>
                    </div>
                    <div class="basic-config">
                        <ha-textfield
                            label="Image URL"
                            .value=${this._config.image || ""}
                            @input=${this._imageChanged}
                            placeholder="https://example.com/image.png"
                        ></ha-textfield>
                        <ha-textfield
                            label="Image Width"
                            type="number"
                            .value=${this._config.image_width || 1360}
                            @input=${this._imageWidthChanged}
                        ></ha-textfield>
                        <ha-textfield
                            label="Image Height"
                            type="number"
                            .value=${this._config.image_height || 849}
                            @input=${this._imageHeightChanged}
                        ></ha-textfield>
                        <ha-textfield
                            label="Max Scale"
                            type="number"
                            step="0.1"
                            .value=${this._config.max_scale || 3}
                            @input=${this._maxScaleChanged}
                        ></ha-textfield>
                    </div>
                </div>

                <!-- Layers Section -->
                <editor-layers
                    .hass=${this.hass}
                    .layers=${this._config.layers}
                    .expandedLayers=${this._expandedLayers}
                    @layers-add=${this._addLayer}
                    @layers-toggle=${this._toggleLayer}
                    @layers-update=${this._updateLayer}
                    @layers-remove=${this._removeLayer}
                    @layers-reorder=${this._reorderLayers}
                ></editor-layers>
            </div>
        `;
    }

    private _addLayer(): void {
        const newLayer: Layer = {
            name: "New Layer",
            icon: "mdi:layer-group",
            visible: true,
            showInToggles: true,
            groups: []
        };

        this._config = {
            ...this._config,
            layers: [...this._config.layers, newLayer]
        };

        // Expand the new layer automatically
        this._expandedLayers.add(this._config.layers.length - 1);
        
        this._configChanged();
    }

    private _toggleLayer(ev: CustomEvent): void {
        const { index } = ev.detail;
        if (this._expandedLayers.has(index)) {
            this._expandedLayers.delete(index);
        } else {
            this._expandedLayers.add(index);
        }
        this.requestUpdate();
    }

    private _updateLayer(ev: CustomEvent): void {
        const { index, property, value } = ev.detail;
        const layers = [...this._config.layers];
        layers[index] = {
            ...layers[index],
            [property]: value
        };

        this._config = {
            ...this._config,
            layers
        };

        this._configChanged();
    }

    private _removeLayer(ev: CustomEvent): void {
        const { index } = ev.detail;
        const layers = [...this._config.layers];
        layers.splice(index, 1);

        this._config = {
            ...this._config,
            layers
        };

        // Update expanded layers indices
        const newExpanded = new Set<number>();
        for (const expandedIndex of this._expandedLayers) {
            if (expandedIndex < index) {
                newExpanded.add(expandedIndex);
            } else if (expandedIndex > index) {
                newExpanded.add(expandedIndex - 1);
            }
        }
        this._expandedLayers = newExpanded;

        this._configChanged();
    }

    private _reorderLayers(ev: CustomEvent): void {
        const { layers } = ev.detail;
        
        this._config = {
            ...this._config,
            layers
        };

        this._configChanged();
    }

    // Basic config change handlers
    private _imageChanged(ev: any): void {
        this._config = { ...this._config, image: ev.target.value };
        this._configChanged();
    }

    private _imageWidthChanged(ev: any): void {
        this._config = { ...this._config, image_width: parseInt(ev.target.value) || 1360 };
        this._configChanged();
    }

    private _imageHeightChanged(ev: any): void {
        this._config = { ...this._config, image_height: parseInt(ev.target.value) || 849 };
        this._configChanged();
    }

    private _maxScaleChanged(ev: any): void {
        this._config = { ...this._config, max_scale: parseFloat(ev.target.value) || 3 };
        this._configChanged();
    }

    private _configChanged(): void {
        const event = new CustomEvent("config-changed", {
            detail: { config: this._config },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }
}
