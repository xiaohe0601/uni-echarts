export type EventType = string | symbol;

export type Handler<T = unknown> = (event: T) => void;

export type WildcardHandler<T = Record<string, unknown>> = (
  type: keyof T,
  event: T[keyof T]
) => void;

export type EventHandlerList<T = unknown> = Array<Handler<T>>;

export type WildCardEventHandlerList<T = Record<string, unknown>> = Array<
  WildcardHandler<T>
>;

export type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<
  keyof Events | "*",
  EventHandlerList<Events[keyof Events]> | WildCardEventHandlerList<Events>
>;

export interface Emitter<Events extends Record<EventType, unknown>> {
  events: EventHandlerMap<Events>;

  on: (<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>) => void) & ((type: "*", handler: WildcardHandler<Events>) => void);

  off: (<Key extends keyof Events>(
    type: Key,
    handler?: Handler<Events[Key]>
  ) => void) & ((type: "*", handler: WildcardHandler<Events>) => void);

  emit: (<Key extends keyof Events>(type: Key, event: Events[Key]) => void) & (<Key extends keyof Events>(
    type: undefined extends Events[Key] ? Key : never
  ) => void);
}

export declare function mitt<Events extends Record<EventType, unknown>>(
  events?: EventHandlerMap<Events>
): Emitter<Events>;