import type { LovelaceCardConfig } from "../../hass-frontend/src/data/lovelace/config/card";
import type { LovelaceCard } from "../../hass-frontend/src/panels/lovelace/types";

export type CreateCardElement = ((config: LovelaceCardConfig) => LovelaceCard) | null;

export async function getCreateCardElement(): Promise<CreateCardElement> {
    if ((window as any).loadCardHelpers) {
        const helpers = await (window as any).loadCardHelpers() as { createCardElement(config: LovelaceCardConfig): LovelaceCard }
        return helpers.createCardElement;
    }
    return null;
}