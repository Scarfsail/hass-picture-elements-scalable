/**
 * Global coordination system for cross-container drag & drop
 * Mimics the old version's _pendingAdd approach but works across components
 */

interface PendingMove {
    type: 'element' | 'group';
    data: any;
    sourceInfo: {
        layerIndex?: number;
        groupIndex?: number;
        elementIndex: number;
    };
    targetInfo: {
        layerIndex?: number;
        groupIndex?: number;
        elementIndex: number;
    };
    timestamp: number;
}

export class CrossContainerCoordinator {
    private static instance: CrossContainerCoordinator;
    private pendingMove: PendingMove | null = null;
    private configUpdateCallback: ((config: any) => void) | null = null;

    private constructor() {}

    public static getInstance(): CrossContainerCoordinator {
        if (!CrossContainerCoordinator.instance) {
            CrossContainerCoordinator.instance = new CrossContainerCoordinator();
        }
        return CrossContainerCoordinator.instance;
    }

    public setConfigUpdateCallback(callback: (config: any) => void): void {
        this.configUpdateCallback = callback;
    }

    public recordAdd(type: 'element' | 'group', targetInfo: any): void {
        // Don't record if we're in the middle of a cross-container move
        if (this.pendingMove && (Date.now() - this.pendingMove.timestamp) < 100) {
            return;
        }

        this.pendingMove = {
            type,
            data: null,
            sourceInfo: { elementIndex: -1 },
            targetInfo,
            timestamp: Date.now()
        };
    }

    public recordRemove(type: 'element' | 'group', sourceInfo: any, removedData: any): boolean {
        // Check if we have a pending add within 100ms (cross-container move)
        if (this.pendingMove && 
            this.pendingMove.type === type && 
            (Date.now() - this.pendingMove.timestamp) < 100) {
            
            // This is a cross-container move
            this.pendingMove.data = removedData;
            this.pendingMove.sourceInfo = sourceInfo;
            
            // Perform the cross-container move
            if (type === 'element') {
                this.performCrossContainerElementMove();
            } else if (type === 'group') {
                this.performCrossContainerGroupMove();
            }
            
            this.pendingMove = null;
            return true; // Indicates this was a cross-container move
        }
        
        return false; // Normal remove, not cross-container
    }

    private performCrossContainerElementMove(): void {
        if (!this.pendingMove || !this.configUpdateCallback) return;

        const move = this.pendingMove;

        // Trigger config update through callback
        this.configUpdateCallback({
            type: 'cross-container-element-move',
            sourceInfo: move.sourceInfo,
            targetInfo: move.targetInfo,
            element: move.data
        });
    }

    private performCrossContainerGroupMove(): void {
        if (!this.pendingMove || !this.configUpdateCallback) return;

        const move = this.pendingMove;

        // Trigger config update through callback
        this.configUpdateCallback({
            type: 'cross-container-group-move',
            sourceInfo: move.sourceInfo,
            targetInfo: move.targetInfo,
            group: move.data
        });
    }

    public clearPending(): void {
        this.pendingMove = null;
    }
}