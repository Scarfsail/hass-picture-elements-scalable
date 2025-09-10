import { html, TemplateResult } from "lit-element";
import { ifDefined } from "lit/directives/if-defined.js";

export interface SortableOptions {
    handleSelector?: string;
    draggableSelector?: string;
    group?: string;
    disabled?: boolean;
}

export interface SortableEventDetail {
    oldIndex: number;
    newIndex: number;
    item: any;
}

export class DragDropMixin {
    /**
     * Creates a standardized drag handle
     */
    static createDragHandle(disabled: boolean = false): TemplateResult {
        return html`
            <ha-icon-button class="handle" .disabled=${disabled}>
                <ha-icon icon="mdi:drag"></ha-icon>
            </ha-icon-button>
        `;
    }

    /**
     * Creates a sortable container with standard options
     */
    static createSortableContainer(
        content: TemplateResult,
        onItemMoved: (event: CustomEvent) => void,
        options: SortableOptions = {}
    ): TemplateResult {
        const defaultOptions = {
            handleSelector: ".handle",
            draggableSelector: ".item",
            group: "default",
            disabled: false,
            ...options
        };

        return html`
            <ha-sortable
                handle-selector=${ifDefined(defaultOptions.handleSelector)}
                draggable-selector=${ifDefined(defaultOptions.draggableSelector)}
                group=${ifDefined(defaultOptions.group)}
                .disabled=${defaultOptions.disabled}
                @item-moved=${onItemMoved}
            >
                ${content}
            </ha-sortable>
        `;
    }

    /**
     * Processes item moved event and returns standardized data
     */
    static processItemMoved(event: CustomEvent): SortableEventDetail {
        const { oldIndex, newIndex } = event.detail;
        return {
            oldIndex,
            newIndex,
            item: event.detail.item
        };
    }

    /**
     * Reorders an array based on drag operation
     */
    static reorderArray<T>(array: T[], oldIndex: number, newIndex: number): T[] {
        const newArray = [...array];
        const [removed] = newArray.splice(oldIndex, 1);
        newArray.splice(newIndex, 0, removed);
        return newArray;
    }

    /**
     * Creates a sortable item wrapper with consistent styling
     */
    static createSortableItem(content: TemplateResult, dragHandle: TemplateResult): TemplateResult {
        return html`
            <div class="sortable-item">
                ${dragHandle}
                <div class="sortable-content">
                    ${content}
                </div>
            </div>
        `;
    }
}
