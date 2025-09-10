import { LitElement, html, css } from "lit-element";
import { customElement, property } from "lit/decorators.js";
import { sharedStyles } from "./shared-styles";
import { DragDropMixin } from "./drag-drop-mixin";
import type { HomeAssistant } from "../../../hass-frontend/src/types";
import "./editor-element";

interface PictureElement {
    type: string;
    style: any;
    entity?: string;
    tap_action?: any;
    left?: string | number;
    right?: string | number;
    top?: string | number;
    bottom?: string | number;
    width?: string | number;
    height?: string | number;
}

@customElement("editor-elements")
export class EditorElements extends LitElement {
    @property({ attribute: false }) hass!: HomeAssistant;
    @property({ type: Array }) elements: PictureElement[] = [];
    @property({ attribute: false }) expandedElements: Set<number> = new Set();

    static styles = [
        sharedStyles,
        css`
            :host {
                display: block;
            }
        `
    ];

    protected render() {
        return html`
            <div class="elements-section">
                <div class="section-header">
                    <div class="section-title">
                        <ha-icon icon="mdi:puzzle"></ha-icon>
                        Elements (${this.elements.length})
                    </div>
                    <button class="add-button" @click=${this._addElement}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        Add Element
                    </button>
                </div>

                ${this.elements.length === 0 
                    ? this._renderEmptyState()
                    : html`
                        <ha-sortable 
                            handle-selector=".handle"
                            draggable-selector=".element-item"
                            @item-moved=${(ev: any) => this._handleElementsReorder(ev)}
                            group="elements"
                            .disabled=${false}
                        >
                            <div class="elements-list">
                                ${this.elements.map((element, index) => html`
                                    <editor-element
                                        class="element-item"
                                        .hass=${this.hass}
                                        .element=${element as PictureElement}
                                        .index=${index}
                                        .isExpanded=${this.expandedElements.has(index)}
                                        @element-toggle=${this._handleElementToggle}
                                        @element-update=${this._handleElementUpdate}
                                        @element-remove=${this._handleElementRemove}
                                    ></editor-element>
                                `)}
                            </div>
                        </ha-sortable>
                    `
                }
            </div>
        `;
    }

    private _renderEmptyState() {
        return html`
            <div class="empty-state">
                <ha-icon icon="mdi:puzzle"></ha-icon>
                <div class="empty-state-title">No elements created</div>
                <div class="empty-state-subtitle">
                    Elements are the interactive components displayed on your picture
                </div>
            </div>
        `;
    }

    private _addElement() {
        const event = new CustomEvent('elements-add', {
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }

    private _handleElementToggle(e: CustomEvent) {
        const event = new CustomEvent('elements-toggle', {
            detail: e.detail,
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }

    private _handleElementUpdate(e: CustomEvent) {
        const event = new CustomEvent('elements-update', {
            detail: e.detail,
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }

    private _handleElementRemove(e: CustomEvent) {
        const event = new CustomEvent('elements-remove', {
            detail: e.detail,
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }

    private _handleElementsReorder(e: CustomEvent) {
        e.stopPropagation();
        const { oldIndex, newIndex } = e.detail;
        const reorderedElements = DragDropMixin.reorderArray(this.elements, oldIndex, newIndex);
        
        const event = new CustomEvent('elements-reorder', {
            detail: { elements: reorderedElements },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }
}
