/*  eslint-disable no-undef */
import { defaultTo, isEmpty, lowerFirst, upperFirst } from "./helpers";
import { mitt } from "./mitt";
import { getDeviceInfo } from "./uni";

const SHORT_HEX_REGEX = /#([0-9a-f])([0-9a-f])([0-9a-f])\b/gi;

export class UniCanvas {

  tagName = "canvas";

  attrs = {};

  constructor(canvasId, context, canvasNode) {
    this.canvasId = canvasId;
    this.context = context;
    this.canvasNode = canvasNode;

    if (canvasNode == null) {
      this._setupContext(context);
    }

    this._emitter = mitt();
  }

  get width() {
    if (this.canvasNode == null) {
      return this.getAttribute("width");
    }

    return this.canvasNode.width;
  }

  set width(value) {
    if (this.canvasNode == null) {
      this.setAttribute("width", value);
      return;
    }

    this.canvasNode.width = value;
  }

  get height() {
    if (this.canvasNode == null) {
      return this.getAttribute("height");
    }

    return this.canvasNode.height;
  }

  set height(value) {
    if (this.canvasNode == null) {
      this.setAttribute("height", value);
      return;
    }

    this.canvasNode.height = value;
  }

  _setupContext(context) {
    const styles = [
      "fillStyle",
      "fontSize",
      "globalAlpha",
      "lineCap",
      "lineDash",
      "lineJoin",
      "lineWidth",
      "miterLimit",
      "strokeStyle",
      "textAlign",
      "textBaseline",
      "opacity",
      "shadowOffsetX",
      "shadowOffsetY",
      "shadowBlur",
      "shadowColor",
      "font"
    ];

    const shadow = {
      offsetX: 0,
      offsetY: 0,
      blur: 0,
      color: "#000000"
    };

    for (const key of styles) {
      // eslint-disable-next-line accessor-pairs
      Object.defineProperty(context, key, {
        set(value) {
          if (key === "opacity") {
            context.setGlobalAlpha(value);
            return;
          }

          if (key === "font") {
            context.setFontSize(UniCanvas.parseFontSize(value));
            return;
          }

          if (key.indexOf("shadow") === 0) {
            if (key !== "shadowColor") {
              shadow[lowerFirst(key.slice(6))] = value;
            } else {
              shadow.color = UniCanvas.normalizeColor(context, value);

              context.setShadow(
                shadow.offsetX,
                shadow.offsetY,
                shadow.blur,
                shadow.color
              );
            }
            return;
          }

          if (key === "fillStyle" || key === "strokeStyle") {
            value = UniCanvas.normalizeColor(context, value);
          }

          context[`set${upperFirst(key)}`](value);
        }
      });
    }

    const _drawImage = context.drawImage;
    context.drawImage = (...args) => {
      _drawImage(args[0].src, ...args.slice(1));
    };

    if (context.strokeText == null) {
      context.strokeText = (...args) => {
        context.fillText(...args);
      };
    }

    if (context.createRadialGradient == null) {
      context.createRadialGradient = (...args) => {
        return context.createCircularGradient(...args.slice(-3));
      };
    }

    if (context.measureText == null || getDeviceInfo().osName === "harmonyos") {
      const strlen = (str) => {
        let len = 0;

        for (let i = 0; i < str.length; i += 1) {
          const unicode = str.charCodeAt(i);

          if (unicode > 0 && unicode < 128) {
            len += 1;
          } else {
            len += 2;
          }
        }

        return len;
      };

      context.measureText = (text, font) => {
        const fontSize = defaultTo(
          context.state && context.state.fontSize,
          UniCanvas.parseFontSize(font),
          12
        ) / 2;

        const factor = fontSize >= 16 ? 1.3 : 1;

        return {
          width: strlen(text) * fontSize * factor
        };
      };
    }
  }

  getContext(type) {
    if (type === "2d") {
      return this.context;
    }
  }

  setAttribute(key, value) {
    this.attrs[key] = value;
  }

  getAttribute(key) {
    return this.attrs[key];
  }

  addEventListener(type, listener) {
    this._emitter.on(type, listener);
  }

  removeEventListener(type, listener) {
    this._emitter.off(type, listener);
  }

  dispatchEvent(type, event) {
    if (typeof type === "object") {
      this._emitter.emit(type.type, type);
    } else {
      this._emitter.emit(type, event);
    }

    return true;
  }

  attachEvent() {
    // noop
  }

  detachEvent() {
    // noop
  }

  toTempFilePath(options = {}) {
    const opts = {};

    if (this.canvasNode != null) {
      opts.canvas = this.canvasNode;
    } else {
      opts.canvasId = this.canvasId;
    }

    return uni.canvasToTempFilePath({
      ...opts,
      ...options
    });
  }

  static parseFontSize(font) {
    return Number.parseFloat(defaultTo(font, "").match(/([\d.]+)px/)[1]);
  }

  static normalizeColor(context, color) {
    if (typeof color === "string") {
      // #ifdef MP-TOUTIAO
      SHORT_HEX_REGEX.lastIndex = 0;

      if (SHORT_HEX_REGEX.test(color)) {
        return color.replace(SHORT_HEX_REGEX, "#$1$1$2$2$3$3");
      }
      // #endif
    }

    return color;
  }

  static dispatch(handler, event, touch) {
    handler.dispatch(event, {
      zrX: touch.x,
      zrY: touch.y,
      zrDelta: touch.wheelDelta,
      preventDefault: () => {},
      stopImmediatePropagation: () => {},
      stopPropagation: () => {}
    });
  }

}

export class UniImage {

  tagName = "img";

  constructor() {
    this._src = null;
    this.width = 0;
    this.height = 0;
  }

  get src() {
    return this._src;
  }

  set src(value) {
    this._src = value;

    uni.getImageInfo({
      src: value,
      success: (res) => {
        this.width = res.width;
        this.height = res.height;

        if (this.onload) {
          this.onload(res);
        }
      },
      fail: (err) => {
        if (this.onerror) {
          this.onerror(err);
        }
      }
    });
  }

}

export function setupEchartsCanvas(echarts, { canvas, node }) {
  echarts.registerPreprocessor((option) => {
    if (option == null) {
      return;
    }

    if (option.series != null) {
      if (Array.isArray(option.series)) {
        if (!isEmpty(option.series)) {
          for (const item of option.series) {
            item.progressive = 0;
          }
        }
      } else if (typeof option.series === "object") {
        option.series.progressive = 0;
      }
    }
  });

  const loadImage = (src, onload, onerror) => {
    if (node != null && node.createImage) {
      const image = node.createImage();
      image.onload = onload;
      image.onerror = onerror;
      image.src = src;
      return image;
    }

    const image = new UniImage();
    image.onload = onload;
    image.onerror = onerror;
    image.src = src;
    return image;
  };

  echarts.setPlatformAPI({
    loadImage: node != null ? loadImage : undefined,
    createCanvas() {
      return canvas;
    }
  });
}