import { defaultTo } from "./helpers";

export function mitt(events) {
  const _events = defaultTo(events, new Map());

  return {
    events: _events,

    on(topic, handler) {
      const handlers = _events.get(topic);

      if (handlers) {
        handlers.push(handler);
      } else {
        _events.set(topic, [handler]);
      }
    },

    off(topic, handler) {
      const handlers = _events.get(topic);

      if (handlers) {
        if (handler) {
          handlers.splice(handlers.indexOf(handler) >>> 0, 1);
        } else {
          _events.set(topic, []);
        }
      }
    },

    emit(topic, event) {
      const handlers = _events.get(topic);

      if (handlers) {
        for (const handler of handlers.slice()) {
          handler(event);
        }
      }

      const hdlrs = _events.get("*");

      if (hdlrs) {
        for (const handler of hdlrs.slice()) {
          handler(event);
        }
      }
    }
  };
}