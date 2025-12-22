/**
 * 事件节点
 */
export interface IEventNode<M> {
    id: string;
    type: keyof M;
    listener: M[keyof M];
    target?: any | null;
}

/**
 * 注销事件回调
 */
export type IOffEventCallback = () => void;

/**
 * 事件管理类
 */
export class EventManager<M extends Record<keyof M, any> = any> {
    private _id = 0;
    public generateId(): string {
        return `${this._id++}`;
    }

    private _eventNodesMapByType = new Map<keyof M, IEventNode<M>[]>();
    private _eventNodeMapById = new Map<string, IEventNode<M>>();

    /**
     * 注册事件
     * @param type 事件类型
     * @param listener 事件监听器
     * @param target 上下文目标
     * @returns [注销事件回调, 事件id]
     */
    public on<T extends keyof M>(type: T, listener: M[T], target: any | null = null): [IOffEventCallback, string] {
        const eventNode: IEventNode<M> = {
            id: this.generateId(),
            type: type,
            listener: listener,
            target: target,
        };

        this._registerEventNode(eventNode);

        const offEventCallback = () => this._offById(eventNode.id);

        return [offEventCallback, eventNode.id] as const;
    }

    /**
     * 注销事件
     * @param type 事件类型
     * @param listener 事件监听器
     * @param target 上下文目标
     */
    public off<T extends keyof M>(type: T, listener: M[T], target?: any | null): void;
    /**
     * 注销事件
     * @param id 事件id
     */
    public off<T extends keyof M>(id: string): void;
    public off(...args: any[]): void {
        if (args.length === 1 && typeof args[0] === "string") {
            const id = args[0];
            this._offById(id);
            return;
        }

        const [type, listener, target] = args;
        this._off(type, listener, target);
    }

    private _off<T extends keyof M>(type: T, listener: M[T], target: any | null = null): void {
        const eventNodes = this._eventNodesMapByType.get(type);
        if (!eventNodes) return;

        const eventNode = eventNodes.find(
            (eventNode) => eventNode.listener === listener && eventNode.target === target
        );
        if (!eventNode) return;

        this._unregisterEventNode(eventNode);
    }

    private _offById(id: string): void {
        const eventNode = this._eventNodeMapById.get(id);
        if (!eventNode) return;

        this._unregisterEventNode(eventNode);
    }

    private _registerEventNode(eventNode: IEventNode<M>): void {
        const eventNodes = this._eventNodesMapByType.get(eventNode.type);
        if (eventNodes) {
            eventNodes.push(eventNode);
        } else {
            this._eventNodesMapByType.set(eventNode.type, [eventNode]);
        }

        this._eventNodeMapById.set(eventNode.id, eventNode);
    }
    private _unregisterEventNode(eventNode: IEventNode<M>): void {
        const eventNodes = this._eventNodesMapByType.get(eventNode.type);
        if (!eventNodes) return;

        const index = eventNodes.indexOf(eventNode);
        if (index === -1) return;

        eventNodes.splice(index, 1);
        if (eventNodes.length === 0) {
            this._eventNodesMapByType.delete(eventNode.type);
        }

        this._eventNodeMapById.delete(eventNode.id);
    }

    /**
     * 发射事件
     * @param type 事件类型
     * @param data 参数, 可多个
     */
    public emit<T extends keyof M>(type: T, ...data: Parameters<M[T]>): void {
        const eventNodes = this._eventNodesMapByType.get(type);
        if (!eventNodes || eventNodes.length === 0) return;

        const nodesToExecute = [...eventNodes];
        for (const eventNode of nodesToExecute) {
            if (eventNode.target) {
                eventNode.listener.call(eventNode.target, ...data);
            } else {
                eventNode.listener(...data);
            }
        }
    }

    /**
     * 获取指定事件类型的所有事件节点
     * @param type 事件类型
     * @returns 所有事件节点
     */
    public getAll(type: keyof M): IEventNode<M>[] {
        return this._eventNodesMapByType.get(type) ?? [];
    }

    /**
     * 注销指定事件类型的所有事件
     * @param type 事件类型
     */
    public offAll(type: keyof M): void;
    /**
     * 注销所有事件
     */
    public offAll(): void;
    public offAll(type?: keyof M): void {
        if (type === undefined) {
            this._eventNodesMapByType.clear();
            this._eventNodeMapById.clear();
            return;
        }

        const eventNodes = this._eventNodesMapByType.get(type);
        if (!eventNodes) return;

        this._eventNodesMapByType.delete(type);

        for (const eventNode of eventNodes) {
            this._eventNodeMapById.delete(eventNode.id);
        }
    }
}
