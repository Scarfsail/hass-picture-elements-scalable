import { LitElement, html, css } from "lit-element";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../../hass-frontend/src/types";
import type { LovelaceCardEditor } from "../../hass-frontend/src/panels/lovelace/types";
import type { PictureElementsScalableConfig } from "./picture-elements-scalable";


@customElement("picture-elements-scalable-editor")
export class PictureElementsScalableEditor extends LitElement implements LovelaceCardEditor {
    @property({ attribute: false }) public hass!: HomeAssistant;
    @state() private _config!: PictureElementsScalableConfig;
    @state() private _editingGroupIndex: number | null = null;
    @state() private _editingElementIndex: number | null = null;
    @state() private _editingElement: any = null;
    @state() private _pendingAdd: { groupIndex: number; index: number; timestamp: number } | null = null;

    public setConfig(config: PictureElementsScalableConfig): void {
        this._config = { ...config };
        if (!this._config.groups) {
            this._config.groups = [];
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

                <!-- Groups Configuration -->
                <div class="config-section">
                    <div class="header">
                        <div class="header-title">Element Groups</div>
                        <ha-icon-button @click=${this._addGroup} class="add-element">
                            <ha-icon icon="mdi:plus"></ha-icon>
                        </ha-icon-button>
                    </div>

                    ${this._config.groups.length === 0 
                        ? html`
                            <div class="empty-state">
                                <ha-icon icon="mdi:shape-plus"></ha-icon>
                                <div class="empty-state-text">No groups</div>
                                <div class="empty-state-subtext">
                                    Groups help organize elements by area or function
                                </div>
                            </div>
                        `
                        : html`
                            <div class="groups-list">
                                ${this._config.groups.map((group, groupIndex) => html`
                                    <ha-expansion-panel .expanded=${false}>
                                        <div slot="header" class="group-header-content">
                                            <ha-textfield
                                                label="Group Name"
                                                .value=${group.group_name}
                                                @input=${(ev: any) => this._groupNameChanged(ev, groupIndex)}
                                                @click=${(ev: any) => ev.stopPropagation()}
                                                placeholder="e.g., Living Room"
                                            ></ha-textfield>
                                            <div class="group-header-actions">
                                                <span class="element-count">${group.elements?.length || 0} elements</span>
                                                <ha-icon-button @click=${(ev: any) => this._removeGroupClick(ev, groupIndex)}>
                                                    <ha-icon icon="mdi:delete"></ha-icon>
                                                </ha-icon-button>
                                            </div>
                                        </div>
                                        <div class="group-content">
                                            <div class="elements-header">
                                                <span>Elements</span>
                                                <ha-icon-button @click=${() => this._addElementToGroup(groupIndex)} class="add-element-small">
                                                    <ha-icon icon="mdi:plus"></ha-icon>
                                                </ha-icon-button>
                                            </div>
                                            ${group.elements && group.elements.length > 0
                                                ? html`
                                                    <ha-sortable 
                                                        handle-selector=".handle"
                                                        draggable-selector=".element-row"
                                                        @item-moved=${(ev: any) => this._elementMoved(ev, groupIndex)}
                                                        @item-added=${(ev: any) => this._elementAdded(ev, groupIndex)}
                                                        @item-removed=${(ev: any) => this._elementRemoved(ev, groupIndex)}
                                                        group="elements"
                                                        .disabled=${false}
                                                    >
                                                        <div class="elements-list">
                                                            ${group.elements.map((element, elementIndex) => html`
                                                                <div class="element-row ${this._editingGroupIndex === groupIndex && this._editingElementIndex === elementIndex ? 'editing' : ''}">
                                                                    ${this._editingGroupIndex === groupIndex && this._editingElementIndex === elementIndex
                                                                        ? this._renderEditingElement(groupIndex, elementIndex)
                                                                        : this._renderElementInfo(element, groupIndex, elementIndex)
                                                                    }
                                                                </div>
                                                            `)}
                                                        </div>
                                                    </ha-sortable>
                                                `
                                                : html`
                                                    <ha-sortable 
                                                        handle-selector=".handle"
                                                        draggable-selector=".element-row"
                                                        @item-moved=${(ev: any) => this._elementMoved(ev, groupIndex)}
                                                        @item-added=${(ev: any) => this._elementAdded(ev, groupIndex)}
                                                        @item-removed=${(ev: any) => this._elementRemoved(ev, groupIndex)}
                                                        group="elements"
                                                        .disabled=${false}
                                                    >
                                                        <div class="empty-elements">
                                                            No elements in this group
                                                        </div>
                                                    </ha-sortable>
                                                `
                                            }
                                        </div>
                                    </ha-expansion-panel>
                                `)}
                            </div>
                        `
                    }
                </div>
            </div>
        `;
    }

    private _renderElementInfo(element: any, groupIndex: number, elementIndex: number) {
        return html`
            <ha-icon-button class="handle" .disabled=${false}>
                <ha-icon icon="mdi:drag-horizontal"></ha-icon>
            </ha-icon-button>
            <div class="element-info">
                <div class="element-primary">
                    ${this._getElementDisplayName(element)}
                </div>
                <div class="element-secondary">
                    ${this._getElementSecondaryInfo(element)}
                </div>
            </div>
            <div class="element-actions">
                <ha-icon-button @click=${() => this._removeElement(groupIndex, elementIndex)}>
                    <ha-icon icon="mdi:delete"></ha-icon>
                </ha-icon-button>
                <ha-icon-button @click=${() => this._editElement(groupIndex, elementIndex)}>
                    <ha-icon icon="mdi:pencil"></ha-icon>
                </ha-icon-button>
            </div>
        `;
    }

    private _editElement(groupIndex: number, elementIndex: number): void {
        this._editingGroupIndex = groupIndex;
        this._editingElementIndex = elementIndex;
        this._editingElement = {...this._config.groups[groupIndex].elements[elementIndex]};
    }

    private _renderEditingElement(groupIndex: number, elementIndex: number) {
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
        this._editingGroupIndex = null;
        this._editingElementIndex = null;
        this._editingElement = null;
    }

    private _editingElementChanged(ev: any): void {
        this._editingElement = ev.detail.value;
        
        if (this._editingGroupIndex !== null && this._editingElementIndex !== null && this._editingElement) {
            const groups = [...this._config.groups];
            const elements = [...groups[this._editingGroupIndex].elements];
            elements[this._editingElementIndex] = this._editingElement;
            groups[this._editingGroupIndex] = {
                ...groups[this._editingGroupIndex],
                elements
            };

            this._config = {
                ...this._config,
                groups,
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

    private _addGroup(): void {
        const newGroup = {
            group_name: "New Group",
            elements: []
        };

        this._config = {
            ...this._config,
            groups: [...this._config.groups, newGroup],
        };

        this._configChanged();
    }

    private _removeGroup(groupIndex: number): void {
        const groups = [...this._config.groups];
        groups.splice(groupIndex, 1);

        this._config = {
            ...this._config,
            groups,
        };

        this._configChanged();
    }

    private _removeGroupClick(ev: any, groupIndex: number): void {
        ev.stopPropagation(); // Prevent expansion panel from toggling
        this._removeGroup(groupIndex);
    }

    private _groupNameChanged(ev: any, groupIndex: number): void {
        const groups = [...this._config.groups];
        groups[groupIndex] = {
            ...groups[groupIndex],
            group_name: ev.target.value
        };

        this._config = {
            ...this._config,
            groups,
        };

        this._configChanged();
    }

    private _addElementToGroup(groupIndex: number): void {
        const newElement = {
            type: "icon",
            icon: "mdi:home",
            left: 100,
            top: 100,
            style: {}
        };

        const groups = [...this._config.groups];
        const elements = [...(groups[groupIndex].elements || [])];
        elements.push(newElement);
        groups[groupIndex] = {
            ...groups[groupIndex],
            elements
        };

        this._config = {
            ...this._config,
            groups,
        };

        this._configChanged();
    }

    private _removeElement(groupIndex: number, elementIndex: number): void {
        const groups = [...this._config.groups];
        const elements = [...groups[groupIndex].elements];
        elements.splice(elementIndex, 1);
        groups[groupIndex] = {
            ...groups[groupIndex],
            elements
        };

        this._config = {
            ...this._config,
            groups,
        };

        this._configChanged();
    }

    private _elementAdded(ev: any, groupIndex: number): void {
        // Store the added element info for cross-group moves
        this._pendingAdd = {
            groupIndex,
            index: ev.detail.index,
            timestamp: Date.now()
        };
    }

    private _elementRemoved(ev: any, groupIndex: number): void {
        const removedIndex = ev.detail.index;
        
        // Check if we have a pending add (cross-group move)
        if (this._pendingAdd && (Date.now() - this._pendingAdd.timestamp) < 100) {
            const sourceGroupIndex = groupIndex;
            const targetGroupIndex = this._pendingAdd.groupIndex;
            const targetIndex = this._pendingAdd.index;
            
            const groups = [...this._config.groups];
            
            // Get the element that was removed
            const sourceElements = [...groups[sourceGroupIndex].elements];
            const [movedElement] = sourceElements.splice(removedIndex, 1);
            
            // Add to target group
            const targetElements = [...groups[targetGroupIndex].elements];
            targetElements.splice(targetIndex, 0, movedElement);
            
            // Update both groups
            groups[sourceGroupIndex] = {
                ...groups[sourceGroupIndex],
                elements: sourceElements
            };
            
            groups[targetGroupIndex] = {
                ...groups[targetGroupIndex],
                elements: targetElements
            };
            
            this._config = {
                ...this._config,
                groups,
            };
            
            this._configChanged();
            
            // Clear pending add
            this._pendingAdd = null;
        }
    }

    private _elementMoved(ev: any, groupIndex: number): void {
        ev.stopPropagation();
        
        const { oldIndex, newIndex } = ev.detail;

        const groups = [...this._config.groups];
        
        // Moving within the same group
        const elements = [...groups[groupIndex].elements];
        const [movedElement] = elements.splice(oldIndex, 1);
        elements.splice(newIndex, 0, movedElement);
        
        groups[groupIndex] = {
            ...groups[groupIndex],
            elements
        };

        this._config = {
            ...this._config,
            groups,
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

        .groups-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .group-container {
            border: 1px solid var(--divider-color);
            border-radius: 8px;
            margin-bottom: 16px;
            overflow: hidden;
        }

        .group-header-content {
            display: flex;
            align-items: center;
            gap: 16px;
            width: 100%;
            padding: 8px 0;
        }

        .group-header-content ha-textfield {
            flex: 1;
            margin-bottom: 0;
        }

        .group-header-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .element-count {
            font-size: 14px;
            color: var(--secondary-text-color);
            white-space: nowrap;
        }

        .group-content {
            padding: 16px;
            padding-top: 0;
        }

        .group-header {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px;
            background: var(--secondary-background-color);
            border-bottom: 1px solid var(--divider-color);
        }

        .group-header ha-textfield {
            flex: 1;
            margin-bottom: 0;
        }

        .group-elements {
            padding: 16px;
        }

        .elements-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            font-size: 14px;
            font-weight: 500;
            color: var(--secondary-text-color);
        }

        .add-element-small {
            --mdc-icon-button-size: 32px;
            --mdc-icon-size: 16px;
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
            align-items: stretch;
            display: flex;
            min-height: 20px;
        }

        .element-row.editing .element-editor {
            flex: 1;
            margin-right: 16px;
            max-width: calc(100% - 48px); /* Reserve space for back button */
            overflow: hidden;
        }

        .element-row.editing .element-editor ha-yaml-editor {
            width: 100%;
            max-width: 100%;
            overflow: auto;
        }

        .element-row.editing .element-actions {
            flex-shrink: 0;
            align-self: flex-start;
            position: sticky;
            top: 8px;
        }

        .handle {
            --mdc-icon-button-size: 32px;
            --mdc-icon-size: 16px;
            cursor: grab;
            color: var(--secondary-text-color);
            margin-right: 8px;
        }

        .handle:hover {
            color: var(--primary-text-color);
        }

        .handle[disabled] {
            cursor: not-allowed;
            opacity: 0.3;
        }

        .element-row.sortable-ghost {
            opacity: 0.5;
        }

        .element-row.sortable-chosen .handle {
            cursor: grabbing;
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
