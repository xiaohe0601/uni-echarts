import { defaultTo } from "./helpers";

export type EventType = string | symbol;

export type Handler<T = unknown> = (event: T) => void;
export type WildcardHandler<T = Record<string, unknown>> = (topic: keyof T, event: T[keyof T]) => void;

export type EventHandlerList<T = unknown> = Array<Handler<T>>;
export type WildCardEventHandlerList<T = Record<string, unknown>> = Array<WildcardHandler<T>>;

export type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<
  keyof Events | "*",
  EventHandlerList<Events[keyof Events]> | WildCardEventHandlerList<Events>
>;

/* eslint-disable ts/method-signature-style */

export interface Emitter<Events extends Record<EventType, unknown>> {
  events: EventHandlerMap<Events>;

  on<Topic extends keyof Events>(topic: Topic, handler: Handler<Events[Topic]>): void;

  on(topic: "*", handler: WildcardHandler<Events>): void;

  off<Topic extends keyof Events>(topic: Topic, handler?: Handler<Events[Topic]>): void;

  off(topic: "*", handler: WildcardHandler<Events>): void;

  emit<Topic extends keyof Events>(topic: Topic, event: Events[Topic]): void;

  emit<Topic extends keyof Events>(topic: undefined extends Events[Topic] ? Topic : never): void;
}

/* eslint-enable ts/method-signature-style */

export function mitt<Events extends Record<EventType, unknown>>(
  events?: EventHandlerMap<Events>
): Emitter<Events> {
  type GenericEventHandler =
    | Handler<Events[keyof Events]>
    | WildcardHandler<Events>;

  const _events = defaultTo(events, new Map());

  return {
    events: _events,

    on<Topic extends keyof Events>(topic: Topic, handler: GenericEventHandler) {
      const handlers: Array<GenericEventHandler> | undefined = _events.get(topic);

      if (handlers) {
        handlers.push(handler);
      } else {
        _events.set(topic, [handler] as EventHandlerList<Events[keyof Events]>);
      }
    },

    off<Topic extends keyof Events>(topic: Topic, handler?: GenericEventHandler) {
      const handlers: Array<GenericEventHandler> | undefined = _events.get(topic);

      if (handlers) {
        if (handler) {
          handlers.splice(handlers.indexOf(handler) >>> 0, 1);
        } else {
          _events.set(topic, []);
        }
      }
    },

    emit<Topic extends keyof Events>(topic: Topic, event?: Events[Topic]) {
      const handlers = _events.get(topic);

      if (handlers) {
        for (const handler of (handlers as EventHandlerList<Events[keyof Events]>).slice()) {
          handler(event!);
        }
      }

      const hdlrs = _events.get("*");

      if (hdlrs) {
        for (const handler of (hdlrs as WildCardEventHandlerList<Events>).slice()) {
          handler(topic, event!);
        }
      }
    }
  };
}