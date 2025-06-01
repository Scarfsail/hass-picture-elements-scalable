import { LitElement, html, css } from "lit-element";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../../hass-frontend/src/types";
import type { LovelaceCardEditor } from "../../hass-frontend/src/panels/lovelace/types";
import type { PictureElementsScalableConfig } from "./picture-elements-scalable";


@customElement("picture-elements-scalable-editor")
export class PictureElementsScalableEditor extends LitElement implements LovelaceCardEditor {
    @property({ attribute: false }) public hass!: HomeAssistant;
    @state() private _config!: PictureElementsScalableConfig;
    @state() private _editingIndex: number | null = null;
    @state() private _editingElement: any = null;

    public setConfig(config: PictureElementsScalableConfig): void {
        this._config = { ...config };
        if (!this._config.elements) {
            this._config.elements = [];
        }
    }

    get _image(): string {
        return this._config?.image || "";
    }

    get _image_width(): number {
        return this._config?.image_width || 1360;
    }

    get _image_height(): number {
        return this._config?.image_height || 849;
    }

    get _max_scale(): number {
        return this._config?.max_scale || 1;
    }

    get _min_scale(): number {
        return this._config?.min_scale || 0.1;
    }

    get _card_size(): number {
        return this._config?.card_size || 1;
    }

    render() {
        if (!this.hass || !this._config) {
            return html``;
        }

        return html`
            <div class="card-config">
                <!-- Basic Configuration -->
                <div class="config-section">
                    <ha-textfield
                        label="Image Path"
                        .value=${this._image}
                        .configValue=${"image"}
                        @input=${this._valueChanged}
                        placeholder="/local/path/to/image.png"
                    ></ha-textfield>

                    <div class="side-by-side">
                        <ha-textfield
                            label="Image Width"
                            .value=${this._image_width}
                            .configValue=${"image_width"}
                            @input=${this._valueChanged}
                            type="number"
                        ></ha-textfield>

                        <ha-textfield
                            label="Image Height"
                            .value=${this._image_height}
                            .configValue=${"image_height"}
                            @input=${this._valueChanged}
                            type="number"
                        ></ha-textfield>
                    </div>

                    <div class="side-by-side">
                        <ha-textfield
                            label="Min Scale"
                            .value=${this._min_scale}
                            .configValue=${"min_scale"}
                            @input=${this._valueChanged}
                            type="number"
                            step="0.1"
                        ></ha-textfield>

                        <ha-textfield
                            label="Max Scale"
                            .value=${this._max_scale}
                            .configValue=${"max_scale"}
                            @input=${this._valueChanged}
                            type="number"
                            step="0.1"
                        ></ha-textfield>
                    </div>

                    <ha-textfield
                        label="Card Size"
                        .value=${this._card_size}
                        .configValue=${"card_size"}
                        @input=${this._valueChanged}
                        type="number"
                    ></ha-textfield>
                </div>

                <!-- Elements Configuration -->
                <div class="config-section">
                    <div class="header">
                        <div class="header-title">Elements</div>
                        <ha-icon-button @click=${this._addElement} class="add-element">
                            <ha-icon icon="mdi:plus"></ha-icon>
                        </ha-icon-button>
                    </div>

                    ${this._config.elements.length === 0 
                        ? html`
                            <div class="empty-state">
                                <ha-icon icon="mdi:shape-plus"></ha-icon>
                                <div class="empty-state-text">No elements</div>
                                <div class="empty-state-subtext">
                                    Elements define interactive areas on your image
                                </div>
                            </div>
                        `
                        : html`
                            <div class="elements-list">
                                ${this._config.elements.map((element, index) => html`
                                    <div class="element-row ${this._editingIndex === index ? 'editing' : ''}">
                                        ${this._editingIndex === index 
                                            ? this._renderEditingElement(index)
                                            : this._renderElementInfo(element, index)
                                        }
                                    </div>
                                `)}
                            </div>
                        `
                    }
                </div>
            </div>
        `;
    }

    private _renderElementInfo(element: any, index: number) {
        return html`
            <div class="element-info">
                <div class="element-primary">
                    ${this._getElementDisplayName(element)}
                </div>
                <div class="element-secondary">
                    ${this._getElementSecondaryInfo(element)}
                </div>
            </div>
            <div class="element-actions">
                <ha-icon-button @click=${() => this._editElement(index)}>
                    <ha-icon icon="mdi:pencil"></ha-icon>
                </ha-icon-button>
                <ha-icon-button @click=${() => this._removeElement(index)}>
                    <ha-icon icon="mdi:delete"></ha-icon>
                </ha-icon-button>
            </div>
        `;
    }

    private _editElement(index: number): void {
        this._editingIndex = index;
        this._editingElement = {...this._config.elements[index]}; // Deep clone
    }

    private _renderEditingElement(index: number) {
        return html`
            <div class="element-editor">
                <ha-yaml-editor
                    .hass=${this.hass}
                    .defaultValue=${this._editingElement}
                    @value-changed=${this._editingElementChanged}
                ></ha-yaml-editor>
            </div>
            <div class="element-actions">
                <ha-icon-button @click=${this._cancelEdit} class="back-button">
                    <ha-icon icon="mdi:arrow-left"></ha-icon>
                </ha-icon-button>
            </div>
        `;
    }

    private _getElementDisplayName(element: any): string {
        if (element.type) {
            return element.type.replace('custom:', '');
        }
        return 'Unknown Element';
    }

    private _getElementSecondaryInfo(element: any): string {
        const parts = [];
        
        if (element.entity) {
            parts.push(`Entity: ${element.entity}`);
        }
        if (element.icon) {
            parts.push(`Icon: ${element.icon}`);
        }
        if (element.left !== undefined && element.top !== undefined) {
            parts.push(`Position: ${element.left}, ${element.top}`);
        }
        
        return parts.join(' • ') || 'No additional info';
    }

    private _cancelEdit(): void {
        this._editingIndex = null;
        this._editingElement = null;
    }

    private _editingElementChanged(ev: any): void {
        this._editingElement = ev.detail.value;
        
        // Apply changes immediately to the config
        if (this._editingIndex !== null && this._editingElement) {
            const elements = [...this._config.elements];
            elements[this._editingIndex] = this._editingElement;

            this._config = {
                ...this._config,
                elements,
            };

            this._configChanged();
        }
    }

    private _valueChanged(ev:any): void {
        if (!this._config || !this.hass) {
            return;
        }

        const target = ev.target;
        const configValue = target.configValue;
        const value = target.value;

        if (configValue) {
            this._config = {
                ...this._config,
                [configValue]: target.type === "number" ? Number(value) : value,
            };
        }

        this._configChanged();
    }

    private _addElement(): void {
        const newElement = {
            type: "icon",
            icon: "mdi:home",
            left: 100,
            top: 100,
            style: {}
        };

        this._config = {
            ...this._config,
            elements: [...this._config.elements, newElement],
        };

        this._configChanged();
    }

    private _removeElement(index: number): void {
        const elements = [...this._config.elements];
        elements.splice(index, 1);

        this._config = {
            ...this._config,
            elements,
        };

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

    static styles = css`
        .card-config {
            padding: 0;
            height: calc(100vh - 300px);
            overflow-y: auto;
        }

        .config-section {
            margin-bottom: 24px;
            padding: 16px;
        }

        .side-by-side {
            display: flex;
            gap: 16px;
        }

        .side-by-side ha-textfield {
            flex: 1;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }

        .header-title {
            font-size: 16px;
            font-weight: 500;
            color: var(--primary-text-color);
        }

        .add-element {
            --mdc-icon-button-size: 40px;
            --mdc-icon-size: 20px;
        }

        .elements-list {
            border: 1px solid var(--divider-color);
            border-radius: 8px;
            overflow: hidden;
        }

        .element-row {
            display: flex;
            align-items: flex-start;
            padding: 0 16px;
            border-bottom: 1px solid var(--divider-color);
            background: var(--card-background-color);
            min-height: 40px;
        }

        .element-row:last-child {
            border-bottom: none;
        }

        .element-row:hover:not(.editing) {
            background: var(--secondary-background-color);
        }

        .element-row.editing {
            background: var(--secondary-background-color);
            padding: 8px 16px;
        }

        .element-editor {
            flex: 1;
            margin-right: 16px;
        }


        .element-info {
            flex: 1;
            min-width: 0;
        }

        .element-primary {
            font-weight: 500;
            color: var(--primary-text-color);
            margin-bottom: 4px;
        }

        .element-secondary {
            font-size: 12px;
            color: var(--secondary-text-color);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .element-actions {
            display: flex;
            gap: 8px;
            align-self: flex-start;
        }

        .element-actions ha-icon-button {
            --mdc-icon-button-size: 32px;
            --mdc-icon-size: 16px;
        }

        .back-button {
            --mdc-theme-primary: var(--primary-color);
        }

        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: var(--secondary-text-color);
        }

        .empty-state ha-icon {
            --mdc-icon-size: 48px;
            margin-bottom: 16px;
            opacity: 0.5;
        }

        .empty-state-text {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 8px;
        }

        .empty-state-subtext {
            font-size: 14px;
            opacity: 0.7;
        }

        ha-textfield, ha-textarea {
            width: 100%;
            margin-bottom: 16px;
        }

        ha-textfield:last-child, ha-textarea:last-child {
            margin-bottom: 0;
        }
    `;
}
