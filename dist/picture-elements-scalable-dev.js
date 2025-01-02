/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _a;
const t$2 = globalThis, e$2 = t$2.ShadowRoot && (void 0 === t$2.ShadyCSS || t$2.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s$1 = Symbol(), o$3 = /* @__PURE__ */ new WeakMap();
let n$3 = class n {
  constructor(t2, e2, o2) {
    if (this._$cssResult$ = true, o2 !== s$1) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t2, this.t = e2;
  }
  get styleSheet() {
    let t2 = this.o;
    const s2 = this.t;
    if (e$2 && void 0 === t2) {
      const e2 = void 0 !== s2 && 1 === s2.length;
      e2 && (t2 = o$3.get(s2)), void 0 === t2 && ((this.o = t2 = new CSSStyleSheet()).replaceSync(this.cssText), e2 && o$3.set(s2, t2));
    }
    return t2;
  }
  toString() {
    return this.cssText;
  }
};
const r$5 = (t2) => new n$3("string" == typeof t2 ? t2 : t2 + "", void 0, s$1), i$3 = (t2, ...e2) => {
  const o2 = 1 === t2.length ? t2[0] : e2.reduce((e3, s2, o3) => e3 + ((t3) => {
    if (true === t3._$cssResult$) return t3.cssText;
    if ("number" == typeof t3) return t3;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t3 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s2) + t2[o3 + 1], t2[0]);
  return new n$3(o2, t2, s$1);
}, S$1 = (s2, o2) => {
  if (e$2) s2.adoptedStyleSheets = o2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet);
  else for (const e2 of o2) {
    const o3 = document.createElement("style"), n3 = t$2.litNonce;
    void 0 !== n3 && o3.setAttribute("nonce", n3), o3.textContent = e2.cssText, s2.appendChild(o3);
  }
}, c$2 = e$2 ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
  let e2 = "";
  for (const s2 of t3.cssRules) e2 += s2.cssText;
  return r$5(e2);
})(t2) : t2;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: i$2, defineProperty: e$1, getOwnPropertyDescriptor: r$4, getOwnPropertyNames: h$1, getOwnPropertySymbols: o$2, getPrototypeOf: n$2 } = Object, a$1 = globalThis, c$1 = a$1.trustedTypes, l$1 = c$1 ? c$1.emptyScript : "", p$1 = a$1.reactiveElementPolyfillSupport, d$1 = (t2, s2) => t2, u$1 = { toAttribute(t2, s2) {
  switch (s2) {
    case Boolean:
      t2 = t2 ? l$1 : null;
      break;
    case Object:
    case Array:
      t2 = null == t2 ? t2 : JSON.stringify(t2);
  }
  return t2;
}, fromAttribute(t2, s2) {
  let i2 = t2;
  switch (s2) {
    case Boolean:
      i2 = null !== t2;
      break;
    case Number:
      i2 = null === t2 ? null : Number(t2);
      break;
    case Object:
    case Array:
      try {
        i2 = JSON.parse(t2);
      } catch (t3) {
        i2 = null;
      }
  }
  return i2;
} }, f$1 = (t2, s2) => !i$2(t2, s2), y$1 = { attribute: true, type: String, converter: u$1, reflect: false, hasChanged: f$1 };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a$1.litPropertyMetadata ?? (a$1.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
class b extends HTMLElement {
  static addInitializer(t2) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t2);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t2, s2 = y$1) {
    if (s2.state && (s2.attribute = false), this._$Ei(), this.elementProperties.set(t2, s2), !s2.noAccessor) {
      const i2 = Symbol(), r3 = this.getPropertyDescriptor(t2, i2, s2);
      void 0 !== r3 && e$1(this.prototype, t2, r3);
    }
  }
  static getPropertyDescriptor(t2, s2, i2) {
    const { get: e2, set: h2 } = r$4(this.prototype, t2) ?? { get() {
      return this[s2];
    }, set(t3) {
      this[s2] = t3;
    } };
    return { get() {
      return e2 == null ? void 0 : e2.call(this);
    }, set(s3) {
      const r3 = e2 == null ? void 0 : e2.call(this);
      h2.call(this, s3), this.requestUpdate(t2, r3, i2);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t2) {
    return this.elementProperties.get(t2) ?? y$1;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d$1("elementProperties"))) return;
    const t2 = n$2(this);
    t2.finalize(), void 0 !== t2.l && (this.l = [...t2.l]), this.elementProperties = new Map(t2.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d$1("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d$1("properties"))) {
      const t3 = this.properties, s2 = [...h$1(t3), ...o$2(t3)];
      for (const i2 of s2) this.createProperty(i2, t3[i2]);
    }
    const t2 = this[Symbol.metadata];
    if (null !== t2) {
      const s2 = litPropertyMetadata.get(t2);
      if (void 0 !== s2) for (const [t3, i2] of s2) this.elementProperties.set(t3, i2);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t3, s2] of this.elementProperties) {
      const i2 = this._$Eu(t3, s2);
      void 0 !== i2 && this._$Eh.set(i2, t3);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s2) {
    const i2 = [];
    if (Array.isArray(s2)) {
      const e2 = new Set(s2.flat(1 / 0).reverse());
      for (const s3 of e2) i2.unshift(c$2(s3));
    } else void 0 !== s2 && i2.push(c$2(s2));
    return i2;
  }
  static _$Eu(t2, s2) {
    const i2 = s2.attribute;
    return false === i2 ? void 0 : "string" == typeof i2 ? i2 : "string" == typeof t2 ? t2.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var _a2;
    this._$ES = new Promise((t2) => this.enableUpdating = t2), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (_a2 = this.constructor.l) == null ? void 0 : _a2.forEach((t2) => t2(this));
  }
  addController(t2) {
    var _a2;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t2), void 0 !== this.renderRoot && this.isConnected && ((_a2 = t2.hostConnected) == null ? void 0 : _a2.call(t2));
  }
  removeController(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.delete(t2);
  }
  _$E_() {
    const t2 = /* @__PURE__ */ new Map(), s2 = this.constructor.elementProperties;
    for (const i2 of s2.keys()) this.hasOwnProperty(i2) && (t2.set(i2, this[i2]), delete this[i2]);
    t2.size > 0 && (this._$Ep = t2);
  }
  createRenderRoot() {
    const t2 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S$1(t2, this.constructor.elementStyles), t2;
  }
  connectedCallback() {
    var _a2;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostConnected) == null ? void 0 : _a3.call(t2);
    });
  }
  enableUpdating(t2) {
  }
  disconnectedCallback() {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostDisconnected) == null ? void 0 : _a3.call(t2);
    });
  }
  attributeChangedCallback(t2, s2, i2) {
    this._$AK(t2, i2);
  }
  _$EC(t2, s2) {
    var _a2;
    const i2 = this.constructor.elementProperties.get(t2), e2 = this.constructor._$Eu(t2, i2);
    if (void 0 !== e2 && true === i2.reflect) {
      const r3 = (void 0 !== ((_a2 = i2.converter) == null ? void 0 : _a2.toAttribute) ? i2.converter : u$1).toAttribute(s2, i2.type);
      this._$Em = t2, null == r3 ? this.removeAttribute(e2) : this.setAttribute(e2, r3), this._$Em = null;
    }
  }
  _$AK(t2, s2) {
    var _a2;
    const i2 = this.constructor, e2 = i2._$Eh.get(t2);
    if (void 0 !== e2 && this._$Em !== e2) {
      const t3 = i2.getPropertyOptions(e2), r3 = "function" == typeof t3.converter ? { fromAttribute: t3.converter } : void 0 !== ((_a2 = t3.converter) == null ? void 0 : _a2.fromAttribute) ? t3.converter : u$1;
      this._$Em = e2, this[e2] = r3.fromAttribute(s2, t3.type), this._$Em = null;
    }
  }
  requestUpdate(t2, s2, i2) {
    if (void 0 !== t2) {
      if (i2 ?? (i2 = this.constructor.getPropertyOptions(t2)), !(i2.hasChanged ?? f$1)(this[t2], s2)) return;
      this.P(t2, s2, i2);
    }
    false === this.isUpdatePending && (this._$ES = this._$ET());
  }
  P(t2, s2, i2) {
    this._$AL.has(t2) || this._$AL.set(t2, s2), true === i2.reflect && this._$Em !== t2 && (this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Set())).add(t2);
  }
  async _$ET() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t3) {
      Promise.reject(t3);
    }
    const t2 = this.scheduleUpdate();
    return null != t2 && await t2, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var _a2;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [t4, s3] of this._$Ep) this[t4] = s3;
        this._$Ep = void 0;
      }
      const t3 = this.constructor.elementProperties;
      if (t3.size > 0) for (const [s3, i2] of t3) true !== i2.wrapped || this._$AL.has(s3) || void 0 === this[s3] || this.P(s3, this[s3], i2);
    }
    let t2 = false;
    const s2 = this._$AL;
    try {
      t2 = this.shouldUpdate(s2), t2 ? (this.willUpdate(s2), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
        var _a3;
        return (_a3 = t3.hostUpdate) == null ? void 0 : _a3.call(t3);
      }), this.update(s2)) : this._$EU();
    } catch (s3) {
      throw t2 = false, this._$EU(), s3;
    }
    t2 && this._$AE(s2);
  }
  willUpdate(t2) {
  }
  _$AE(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
      var _a3;
      return (_a3 = t3.hostUpdated) == null ? void 0 : _a3.call(t3);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t2)), this.updated(t2);
  }
  _$EU() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t2) {
    return true;
  }
  update(t2) {
    this._$Ej && (this._$Ej = this._$Ej.forEach((t3) => this._$EC(t3, this[t3]))), this._$EU();
  }
  updated(t2) {
  }
  firstUpdated(t2) {
  }
}
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[d$1("elementProperties")] = /* @__PURE__ */ new Map(), b[d$1("finalized")] = /* @__PURE__ */ new Map(), p$1 == null ? void 0 : p$1({ ReactiveElement: b }), (a$1.reactiveElementVersions ?? (a$1.reactiveElementVersions = [])).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1 = globalThis, i$1 = t$1.trustedTypes, s = i$1 ? i$1.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0, e = "$lit$", h = `lit$${Math.random().toFixed(9).slice(2)}$`, o$1 = "?" + h, n$1 = `<${o$1}>`, r$3 = document, l = () => r$3.createComment(""), c = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2, a = Array.isArray, u = (t2) => a(t2) || "function" == typeof (t2 == null ? void 0 : t2[Symbol.iterator]), d = "[ 	\n\f\r]", f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, v = /-->/g, _ = />/g, m = RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), p = /'/g, g = /"/g, $ = /^(?:script|style|textarea|title)$/i, y = (t2) => (i2, ...s2) => ({ _$litType$: t2, strings: i2, values: s2 }), x = y(1), T = Symbol.for("lit-noChange"), E = Symbol.for("lit-nothing"), A = /* @__PURE__ */ new WeakMap(), C = r$3.createTreeWalker(r$3, 129);
function P(t2, i2) {
  if (!a(t2) || !t2.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== s ? s.createHTML(i2) : i2;
}
const V = (t2, i2) => {
  const s2 = t2.length - 1, o2 = [];
  let r3, l2 = 2 === i2 ? "<svg>" : 3 === i2 ? "<math>" : "", c2 = f;
  for (let i3 = 0; i3 < s2; i3++) {
    const s3 = t2[i3];
    let a2, u2, d2 = -1, y2 = 0;
    for (; y2 < s3.length && (c2.lastIndex = y2, u2 = c2.exec(s3), null !== u2); ) y2 = c2.lastIndex, c2 === f ? "!--" === u2[1] ? c2 = v : void 0 !== u2[1] ? c2 = _ : void 0 !== u2[2] ? ($.test(u2[2]) && (r3 = RegExp("</" + u2[2], "g")), c2 = m) : void 0 !== u2[3] && (c2 = m) : c2 === m ? ">" === u2[0] ? (c2 = r3 ?? f, d2 = -1) : void 0 === u2[1] ? d2 = -2 : (d2 = c2.lastIndex - u2[2].length, a2 = u2[1], c2 = void 0 === u2[3] ? m : '"' === u2[3] ? g : p) : c2 === g || c2 === p ? c2 = m : c2 === v || c2 === _ ? c2 = f : (c2 = m, r3 = void 0);
    const x2 = c2 === m && t2[i3 + 1].startsWith("/>") ? " " : "";
    l2 += c2 === f ? s3 + n$1 : d2 >= 0 ? (o2.push(a2), s3.slice(0, d2) + e + s3.slice(d2) + h + x2) : s3 + h + (-2 === d2 ? i3 : x2);
  }
  return [P(t2, l2 + (t2[s2] || "<?>") + (2 === i2 ? "</svg>" : 3 === i2 ? "</math>" : "")), o2];
};
class N {
  constructor({ strings: t2, _$litType$: s2 }, n3) {
    let r3;
    this.parts = [];
    let c2 = 0, a2 = 0;
    const u2 = t2.length - 1, d2 = this.parts, [f2, v2] = V(t2, s2);
    if (this.el = N.createElement(f2, n3), C.currentNode = this.el.content, 2 === s2 || 3 === s2) {
      const t3 = this.el.content.firstChild;
      t3.replaceWith(...t3.childNodes);
    }
    for (; null !== (r3 = C.nextNode()) && d2.length < u2; ) {
      if (1 === r3.nodeType) {
        if (r3.hasAttributes()) for (const t3 of r3.getAttributeNames()) if (t3.endsWith(e)) {
          const i2 = v2[a2++], s3 = r3.getAttribute(t3).split(h), e2 = /([.?@])?(.*)/.exec(i2);
          d2.push({ type: 1, index: c2, name: e2[2], strings: s3, ctor: "." === e2[1] ? H : "?" === e2[1] ? I : "@" === e2[1] ? L : k }), r3.removeAttribute(t3);
        } else t3.startsWith(h) && (d2.push({ type: 6, index: c2 }), r3.removeAttribute(t3));
        if ($.test(r3.tagName)) {
          const t3 = r3.textContent.split(h), s3 = t3.length - 1;
          if (s3 > 0) {
            r3.textContent = i$1 ? i$1.emptyScript : "";
            for (let i2 = 0; i2 < s3; i2++) r3.append(t3[i2], l()), C.nextNode(), d2.push({ type: 2, index: ++c2 });
            r3.append(t3[s3], l());
          }
        }
      } else if (8 === r3.nodeType) if (r3.data === o$1) d2.push({ type: 2, index: c2 });
      else {
        let t3 = -1;
        for (; -1 !== (t3 = r3.data.indexOf(h, t3 + 1)); ) d2.push({ type: 7, index: c2 }), t3 += h.length - 1;
      }
      c2++;
    }
  }
  static createElement(t2, i2) {
    const s2 = r$3.createElement("template");
    return s2.innerHTML = t2, s2;
  }
}
function S(t2, i2, s2 = t2, e2) {
  var _a2, _b;
  if (i2 === T) return i2;
  let h2 = void 0 !== e2 ? (_a2 = s2._$Co) == null ? void 0 : _a2[e2] : s2._$Cl;
  const o2 = c(i2) ? void 0 : i2._$litDirective$;
  return (h2 == null ? void 0 : h2.constructor) !== o2 && ((_b = h2 == null ? void 0 : h2._$AO) == null ? void 0 : _b.call(h2, false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s2, e2)), void 0 !== e2 ? (s2._$Co ?? (s2._$Co = []))[e2] = h2 : s2._$Cl = h2), void 0 !== h2 && (i2 = S(t2, h2._$AS(t2, i2.values), h2, e2)), i2;
}
class M {
  constructor(t2, i2) {
    this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i2;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t2) {
    const { el: { content: i2 }, parts: s2 } = this._$AD, e2 = ((t2 == null ? void 0 : t2.creationScope) ?? r$3).importNode(i2, true);
    C.currentNode = e2;
    let h2 = C.nextNode(), o2 = 0, n3 = 0, l2 = s2[0];
    for (; void 0 !== l2; ) {
      if (o2 === l2.index) {
        let i3;
        2 === l2.type ? i3 = new R(h2, h2.nextSibling, this, t2) : 1 === l2.type ? i3 = new l2.ctor(h2, l2.name, l2.strings, this, t2) : 6 === l2.type && (i3 = new z(h2, this, t2)), this._$AV.push(i3), l2 = s2[++n3];
      }
      o2 !== (l2 == null ? void 0 : l2.index) && (h2 = C.nextNode(), o2++);
    }
    return C.currentNode = r$3, e2;
  }
  p(t2) {
    let i2 = 0;
    for (const s2 of this._$AV) void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i2), i2 += s2.strings.length - 2) : s2._$AI(t2[i2])), i2++;
  }
}
class R {
  get _$AU() {
    var _a2;
    return ((_a2 = this._$AM) == null ? void 0 : _a2._$AU) ?? this._$Cv;
  }
  constructor(t2, i2, s2, e2) {
    this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t2, this._$AB = i2, this._$AM = s2, this.options = e2, this._$Cv = (e2 == null ? void 0 : e2.isConnected) ?? true;
  }
  get parentNode() {
    let t2 = this._$AA.parentNode;
    const i2 = this._$AM;
    return void 0 !== i2 && 11 === (t2 == null ? void 0 : t2.nodeType) && (t2 = i2.parentNode), t2;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t2, i2 = this) {
    t2 = S(this, t2, i2), c(t2) ? t2 === E || null == t2 || "" === t2 ? (this._$AH !== E && this._$AR(), this._$AH = E) : t2 !== this._$AH && t2 !== T && this._(t2) : void 0 !== t2._$litType$ ? this.$(t2) : void 0 !== t2.nodeType ? this.T(t2) : u(t2) ? this.k(t2) : this._(t2);
  }
  O(t2) {
    return this._$AA.parentNode.insertBefore(t2, this._$AB);
  }
  T(t2) {
    this._$AH !== t2 && (this._$AR(), this._$AH = this.O(t2));
  }
  _(t2) {
    this._$AH !== E && c(this._$AH) ? this._$AA.nextSibling.data = t2 : this.T(r$3.createTextNode(t2)), this._$AH = t2;
  }
  $(t2) {
    var _a2;
    const { values: i2, _$litType$: s2 } = t2, e2 = "number" == typeof s2 ? this._$AC(t2) : (void 0 === s2.el && (s2.el = N.createElement(P(s2.h, s2.h[0]), this.options)), s2);
    if (((_a2 = this._$AH) == null ? void 0 : _a2._$AD) === e2) this._$AH.p(i2);
    else {
      const t3 = new M(e2, this), s3 = t3.u(this.options);
      t3.p(i2), this.T(s3), this._$AH = t3;
    }
  }
  _$AC(t2) {
    let i2 = A.get(t2.strings);
    return void 0 === i2 && A.set(t2.strings, i2 = new N(t2)), i2;
  }
  k(t2) {
    a(this._$AH) || (this._$AH = [], this._$AR());
    const i2 = this._$AH;
    let s2, e2 = 0;
    for (const h2 of t2) e2 === i2.length ? i2.push(s2 = new R(this.O(l()), this.O(l()), this, this.options)) : s2 = i2[e2], s2._$AI(h2), e2++;
    e2 < i2.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i2.length = e2);
  }
  _$AR(t2 = this._$AA.nextSibling, i2) {
    var _a2;
    for ((_a2 = this._$AP) == null ? void 0 : _a2.call(this, false, true, i2); t2 && t2 !== this._$AB; ) {
      const i3 = t2.nextSibling;
      t2.remove(), t2 = i3;
    }
  }
  setConnected(t2) {
    var _a2;
    void 0 === this._$AM && (this._$Cv = t2, (_a2 = this._$AP) == null ? void 0 : _a2.call(this, t2));
  }
}
class k {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t2, i2, s2, e2, h2) {
    this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t2, this.name = i2, this._$AM = e2, this.options = h2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = E;
  }
  _$AI(t2, i2 = this, s2, e2) {
    const h2 = this.strings;
    let o2 = false;
    if (void 0 === h2) t2 = S(this, t2, i2, 0), o2 = !c(t2) || t2 !== this._$AH && t2 !== T, o2 && (this._$AH = t2);
    else {
      const e3 = t2;
      let n3, r3;
      for (t2 = h2[0], n3 = 0; n3 < h2.length - 1; n3++) r3 = S(this, e3[s2 + n3], i2, n3), r3 === T && (r3 = this._$AH[n3]), o2 || (o2 = !c(r3) || r3 !== this._$AH[n3]), r3 === E ? t2 = E : t2 !== E && (t2 += (r3 ?? "") + h2[n3 + 1]), this._$AH[n3] = r3;
    }
    o2 && !e2 && this.j(t2);
  }
  j(t2) {
    t2 === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 ?? "");
  }
}
class H extends k {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t2) {
    this.element[this.name] = t2 === E ? void 0 : t2;
  }
}
class I extends k {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t2) {
    this.element.toggleAttribute(this.name, !!t2 && t2 !== E);
  }
}
class L extends k {
  constructor(t2, i2, s2, e2, h2) {
    super(t2, i2, s2, e2, h2), this.type = 5;
  }
  _$AI(t2, i2 = this) {
    if ((t2 = S(this, t2, i2, 0) ?? E) === T) return;
    const s2 = this._$AH, e2 = t2 === E && s2 !== E || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, h2 = t2 !== E && (s2 === E || e2);
    e2 && this.element.removeEventListener(this.name, this, s2), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
  }
  handleEvent(t2) {
    var _a2;
    "function" == typeof this._$AH ? this._$AH.call(((_a2 = this.options) == null ? void 0 : _a2.host) ?? this.element, t2) : this._$AH.handleEvent(t2);
  }
}
class z {
  constructor(t2, i2, s2) {
    this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i2, this.options = s2;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2) {
    S(this, t2);
  }
}
const j = t$1.litHtmlPolyfillSupport;
j == null ? void 0 : j(N, R), (t$1.litHtmlVersions ?? (t$1.litHtmlVersions = [])).push("3.2.1");
const B = (t2, i2, s2) => {
  const e2 = (s2 == null ? void 0 : s2.renderBefore) ?? i2;
  let h2 = e2._$litPart$;
  if (void 0 === h2) {
    const t3 = (s2 == null ? void 0 : s2.renderBefore) ?? null;
    e2._$litPart$ = h2 = new R(i2.insertBefore(l(), t3), t3, void 0, s2 ?? {});
  }
  return h2._$AI(t2), h2;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let r$2 = class r extends b {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var _a2;
    const t2 = super.createRenderRoot();
    return (_a2 = this.renderOptions).renderBefore ?? (_a2.renderBefore = t2.firstChild), t2;
  }
  update(t2) {
    const s2 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t2), this._$Do = B(s2, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var _a2;
    super.connectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(true);
  }
  disconnectedCallback() {
    var _a2;
    super.disconnectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(false);
  }
  render() {
    return T;
  }
};
r$2._$litElement$ = true, r$2["finalized"] = true, (_a = globalThis.litElementHydrateSupport) == null ? void 0 : _a.call(globalThis, { LitElement: r$2 });
const i = globalThis.litElementPolyfillSupport;
i == null ? void 0 : i({ LitElement: r$2 });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t = (t2) => (e2, o2) => {
  void 0 !== o2 ? o2.addInitializer(() => {
    customElements.define(t2, e2);
  }) : customElements.define(t2, e2);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const o = { attribute: true, type: String, converter: u$1, reflect: false, hasChanged: f$1 }, r$1 = (t2 = o, e2, r3) => {
  const { kind: n3, metadata: i2 } = r3;
  let s2 = globalThis.litPropertyMetadata.get(i2);
  if (void 0 === s2 && globalThis.litPropertyMetadata.set(i2, s2 = /* @__PURE__ */ new Map()), s2.set(r3.name, t2), "accessor" === n3) {
    const { name: o2 } = r3;
    return { set(r4) {
      const n4 = e2.get.call(this);
      e2.set.call(this, r4), this.requestUpdate(o2, n4, t2);
    }, init(e3) {
      return void 0 !== e3 && this.P(o2, void 0, t2), e3;
    } };
  }
  if ("setter" === n3) {
    const { name: o2 } = r3;
    return function(r4) {
      const n4 = this[o2];
      e2.call(this, r4), this.requestUpdate(o2, n4, t2);
    };
  }
  throw Error("Unsupported decorator location: " + n3);
};
function n2(t2) {
  return (e2, o2) => "object" == typeof o2 ? r$1(t2, e2, o2) : ((t3, e3, o3) => {
    const r3 = e3.hasOwnProperty(o3);
    return e3.constructor.createProperty(o3, r3 ? { ...t3, wrapped: true } : t3), r3 ? Object.getOwnPropertyDescriptor(e3, o3) : void 0;
  })(t2, e2, o2);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function r2(r3) {
  return n2({ ...r3, state: true, attribute: false });
}
var __defProp$6 = Object.defineProperty;
var __getOwnPropDesc$4 = Object.getOwnPropertyDescriptor;
var __decorateClass$6 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$4(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$6(target, key, result);
  return result;
};
let PictureElementsScalable = class extends r$2 {
  constructor() {
    super();
    this._helpers = null;
    this.previousViewport = { width: 0, height: 0 };
    this.resizeObserver = new ResizeObserver(this.onResize.bind(this));
  }
  getCardSize() {
    return 1;
  }
  async setConfig(config) {
    this.config = config;
    if (window.loadCardHelpers) {
      const helpers = await window.loadCardHelpers();
      this._helpers = helpers;
    }
  }
  render() {
    if (!this.config) {
      return "Config is not defined";
    }
    const clientRect = this.getBoundingClientRect();
    const contentHeight = this.config.imageHeight;
    const contentWidth = this.config.imageWidth;
    const fitIntoHeight = clientRect.height;
    const fitIntoWidth = clientRect.width;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    let visibleHeight = 0;
    let visibleWidth = 0;
    if (this.previousViewport.width != viewportWidth || this.previousViewport.height != viewportHeight) {
      this.previousViewport.width = viewportWidth;
      this.previousViewport.height = viewportHeight;
      this.requestUpdate();
      console.log("Viewport changed");
    } else {
      visibleHeight = Math.max(0, Math.min(viewportHeight, clientRect.bottom) - Math.max(0, clientRect.top));
      visibleWidth = Math.max(0, Math.min(viewportWidth, clientRect.right) - Math.max(0, clientRect.left));
    }
    const scale = this.getScale(fitIntoHeight, fitIntoWidth, contentWidth, contentHeight);
    this.style.setProperty("position", "relative");
    this.card = this.card || this.createCardElement(this.config);
    if (this.card)
      this.card.hass = this.hass;
    if (visibleHeight == 0)
      return x`
                ${this.card}
            `;
    return x`
            <div style="overflow:none; width:${visibleWidth}px; height:${visibleHeight}px">
                <div style="transform: scale(${scale.scaleX}, ${scale.scaleY}); transform-origin: 0px 0px; width:${contentWidth}px; height:${contentHeight}px;">
                    ${this.card}
                </div>
            </div>
        `;
  }
  createCardElement(config) {
    var _a2;
    const cardConfig = {
      type: "picture-elements",
      image: config.image,
      elements: config.elements.map((el) => ({
        ...el,
        style: {
          ...el.style,
          /*color: "transparent",*/
          transform: "none",
          left: typeof el.left === "string" ? el.left : `${el.left}px`,
          top: typeof el.top === "string" ? el.top : `${el.top}px`
        }
      })),
      style: config.style
    };
    return (_a2 = this._helpers) == null ? void 0 : _a2.createCardElement(cardConfig);
  }
  connectedCallback() {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
    super.connectedCallback();
    const element = (_i = (_h = (_g = (_f = (_e = (_d = (_c = (_b = (_a2 = document.querySelector("home-assistant")) == null ? void 0 : _a2.shadowRoot) == null ? void 0 : _b.querySelector("home-assistant-main")) == null ? void 0 : _c.shadowRoot) == null ? void 0 : _d.querySelector("partial-panel-resolver")) == null ? void 0 : _e.querySelector("ha-panel-lovelace")) == null ? void 0 : _f.shadowRoot) == null ? void 0 : _g.querySelector("hui-root")) == null ? void 0 : _h.shadowRoot) == null ? void 0 : _i.querySelector("div");
    if (element)
      this.resizeObserver.observe(element);
    console.log("Connected");
  }
  disconnectedCallback() {
    this.resizeObserver.disconnect();
    super.disconnectedCallback();
    console.log("Disconnected");
  }
  onResize() {
    this.requestUpdate();
  }
  getScale(fitIntoHeight, fitIntoWidth, contentWidth, contentHeight) {
    let scaleW = fitIntoWidth / contentWidth;
    let scaleH = fitIntoHeight / contentHeight;
    return { scaleX: scaleW, scaleY: scaleH };
  }
};
__decorateClass$6([
  r2()
], PictureElementsScalable.prototype, "_helpers", 2);
__decorateClass$6([
  n2({ attribute: false })
], PictureElementsScalable.prototype, "hass", 2);
PictureElementsScalable = __decorateClass$6([
  t("picture-elements-scalable")
], PictureElementsScalable);
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var dayjs_min$1 = { exports: {} };
var dayjs_min = dayjs_min$1.exports;
var hasRequiredDayjs_min;
function requireDayjs_min() {
  if (hasRequiredDayjs_min) return dayjs_min$1.exports;
  hasRequiredDayjs_min = 1;
  (function(module, exports) {
    !function(t2, e2) {
      module.exports = e2();
    }(dayjs_min, function() {
      var t2 = 1e3, e2 = 6e4, n3 = 36e5, r3 = "millisecond", i2 = "second", s2 = "minute", u2 = "hour", a2 = "day", o2 = "week", c2 = "month", f2 = "quarter", h2 = "year", d2 = "date", l2 = "Invalid Date", $2 = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y2 = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M2 = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(t3) {
        var e3 = ["th", "st", "nd", "rd"], n4 = t3 % 100;
        return "[" + t3 + (e3[(n4 - 20) % 10] || e3[n4] || e3[0]) + "]";
      } }, m2 = function(t3, e3, n4) {
        var r4 = String(t3);
        return !r4 || r4.length >= e3 ? t3 : "" + Array(e3 + 1 - r4.length).join(n4) + t3;
      }, v2 = { s: m2, z: function(t3) {
        var e3 = -t3.utcOffset(), n4 = Math.abs(e3), r4 = Math.floor(n4 / 60), i3 = n4 % 60;
        return (e3 <= 0 ? "+" : "-") + m2(r4, 2, "0") + ":" + m2(i3, 2, "0");
      }, m: function t3(e3, n4) {
        if (e3.date() < n4.date()) return -t3(n4, e3);
        var r4 = 12 * (n4.year() - e3.year()) + (n4.month() - e3.month()), i3 = e3.clone().add(r4, c2), s3 = n4 - i3 < 0, u3 = e3.clone().add(r4 + (s3 ? -1 : 1), c2);
        return +(-(r4 + (n4 - i3) / (s3 ? i3 - u3 : u3 - i3)) || 0);
      }, a: function(t3) {
        return t3 < 0 ? Math.ceil(t3) || 0 : Math.floor(t3);
      }, p: function(t3) {
        return { M: c2, y: h2, w: o2, d: a2, D: d2, h: u2, m: s2, s: i2, ms: r3, Q: f2 }[t3] || String(t3 || "").toLowerCase().replace(/s$/, "");
      }, u: function(t3) {
        return void 0 === t3;
      } }, g2 = "en", D = {};
      D[g2] = M2;
      var p2 = "$isDayjsObject", S2 = function(t3) {
        return t3 instanceof _2 || !(!t3 || !t3[p2]);
      }, w = function t3(e3, n4, r4) {
        var i3;
        if (!e3) return g2;
        if ("string" == typeof e3) {
          var s3 = e3.toLowerCase();
          D[s3] && (i3 = s3), n4 && (D[s3] = n4, i3 = s3);
          var u3 = e3.split("-");
          if (!i3 && u3.length > 1) return t3(u3[0]);
        } else {
          var a3 = e3.name;
          D[a3] = e3, i3 = a3;
        }
        return !r4 && i3 && (g2 = i3), i3 || !r4 && g2;
      }, O = function(t3, e3) {
        if (S2(t3)) return t3.clone();
        var n4 = "object" == typeof e3 ? e3 : {};
        return n4.date = t3, n4.args = arguments, new _2(n4);
      }, b2 = v2;
      b2.l = w, b2.i = S2, b2.w = function(t3, e3) {
        return O(t3, { locale: e3.$L, utc: e3.$u, x: e3.$x, $offset: e3.$offset });
      };
      var _2 = function() {
        function M3(t3) {
          this.$L = w(t3.locale, null, true), this.parse(t3), this.$x = this.$x || t3.x || {}, this[p2] = true;
        }
        var m3 = M3.prototype;
        return m3.parse = function(t3) {
          this.$d = function(t4) {
            var e3 = t4.date, n4 = t4.utc;
            if (null === e3) return /* @__PURE__ */ new Date(NaN);
            if (b2.u(e3)) return /* @__PURE__ */ new Date();
            if (e3 instanceof Date) return new Date(e3);
            if ("string" == typeof e3 && !/Z$/i.test(e3)) {
              var r4 = e3.match($2);
              if (r4) {
                var i3 = r4[2] - 1 || 0, s3 = (r4[7] || "0").substring(0, 3);
                return n4 ? new Date(Date.UTC(r4[1], i3, r4[3] || 1, r4[4] || 0, r4[5] || 0, r4[6] || 0, s3)) : new Date(r4[1], i3, r4[3] || 1, r4[4] || 0, r4[5] || 0, r4[6] || 0, s3);
              }
            }
            return new Date(e3);
          }(t3), this.init();
        }, m3.init = function() {
          var t3 = this.$d;
          this.$y = t3.getFullYear(), this.$M = t3.getMonth(), this.$D = t3.getDate(), this.$W = t3.getDay(), this.$H = t3.getHours(), this.$m = t3.getMinutes(), this.$s = t3.getSeconds(), this.$ms = t3.getMilliseconds();
        }, m3.$utils = function() {
          return b2;
        }, m3.isValid = function() {
          return !(this.$d.toString() === l2);
        }, m3.isSame = function(t3, e3) {
          var n4 = O(t3);
          return this.startOf(e3) <= n4 && n4 <= this.endOf(e3);
        }, m3.isAfter = function(t3, e3) {
          return O(t3) < this.startOf(e3);
        }, m3.isBefore = function(t3, e3) {
          return this.endOf(e3) < O(t3);
        }, m3.$g = function(t3, e3, n4) {
          return b2.u(t3) ? this[e3] : this.set(n4, t3);
        }, m3.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, m3.valueOf = function() {
          return this.$d.getTime();
        }, m3.startOf = function(t3, e3) {
          var n4 = this, r4 = !!b2.u(e3) || e3, f3 = b2.p(t3), l3 = function(t4, e4) {
            var i3 = b2.w(n4.$u ? Date.UTC(n4.$y, e4, t4) : new Date(n4.$y, e4, t4), n4);
            return r4 ? i3 : i3.endOf(a2);
          }, $3 = function(t4, e4) {
            return b2.w(n4.toDate()[t4].apply(n4.toDate("s"), (r4 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e4)), n4);
          }, y3 = this.$W, M4 = this.$M, m4 = this.$D, v3 = "set" + (this.$u ? "UTC" : "");
          switch (f3) {
            case h2:
              return r4 ? l3(1, 0) : l3(31, 11);
            case c2:
              return r4 ? l3(1, M4) : l3(0, M4 + 1);
            case o2:
              var g3 = this.$locale().weekStart || 0, D2 = (y3 < g3 ? y3 + 7 : y3) - g3;
              return l3(r4 ? m4 - D2 : m4 + (6 - D2), M4);
            case a2:
            case d2:
              return $3(v3 + "Hours", 0);
            case u2:
              return $3(v3 + "Minutes", 1);
            case s2:
              return $3(v3 + "Seconds", 2);
            case i2:
              return $3(v3 + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, m3.endOf = function(t3) {
          return this.startOf(t3, false);
        }, m3.$set = function(t3, e3) {
          var n4, o3 = b2.p(t3), f3 = "set" + (this.$u ? "UTC" : ""), l3 = (n4 = {}, n4[a2] = f3 + "Date", n4[d2] = f3 + "Date", n4[c2] = f3 + "Month", n4[h2] = f3 + "FullYear", n4[u2] = f3 + "Hours", n4[s2] = f3 + "Minutes", n4[i2] = f3 + "Seconds", n4[r3] = f3 + "Milliseconds", n4)[o3], $3 = o3 === a2 ? this.$D + (e3 - this.$W) : e3;
          if (o3 === c2 || o3 === h2) {
            var y3 = this.clone().set(d2, 1);
            y3.$d[l3]($3), y3.init(), this.$d = y3.set(d2, Math.min(this.$D, y3.daysInMonth())).$d;
          } else l3 && this.$d[l3]($3);
          return this.init(), this;
        }, m3.set = function(t3, e3) {
          return this.clone().$set(t3, e3);
        }, m3.get = function(t3) {
          return this[b2.p(t3)]();
        }, m3.add = function(r4, f3) {
          var d3, l3 = this;
          r4 = Number(r4);
          var $3 = b2.p(f3), y3 = function(t3) {
            var e3 = O(l3);
            return b2.w(e3.date(e3.date() + Math.round(t3 * r4)), l3);
          };
          if ($3 === c2) return this.set(c2, this.$M + r4);
          if ($3 === h2) return this.set(h2, this.$y + r4);
          if ($3 === a2) return y3(1);
          if ($3 === o2) return y3(7);
          var M4 = (d3 = {}, d3[s2] = e2, d3[u2] = n3, d3[i2] = t2, d3)[$3] || 1, m4 = this.$d.getTime() + r4 * M4;
          return b2.w(m4, this);
        }, m3.subtract = function(t3, e3) {
          return this.add(-1 * t3, e3);
        }, m3.format = function(t3) {
          var e3 = this, n4 = this.$locale();
          if (!this.isValid()) return n4.invalidDate || l2;
          var r4 = t3 || "YYYY-MM-DDTHH:mm:ssZ", i3 = b2.z(this), s3 = this.$H, u3 = this.$m, a3 = this.$M, o3 = n4.weekdays, c3 = n4.months, f3 = n4.meridiem, h3 = function(t4, n5, i4, s4) {
            return t4 && (t4[n5] || t4(e3, r4)) || i4[n5].slice(0, s4);
          }, d3 = function(t4) {
            return b2.s(s3 % 12 || 12, t4, "0");
          }, $3 = f3 || function(t4, e4, n5) {
            var r5 = t4 < 12 ? "AM" : "PM";
            return n5 ? r5.toLowerCase() : r5;
          };
          return r4.replace(y2, function(t4, r5) {
            return r5 || function(t5) {
              switch (t5) {
                case "YY":
                  return String(e3.$y).slice(-2);
                case "YYYY":
                  return b2.s(e3.$y, 4, "0");
                case "M":
                  return a3 + 1;
                case "MM":
                  return b2.s(a3 + 1, 2, "0");
                case "MMM":
                  return h3(n4.monthsShort, a3, c3, 3);
                case "MMMM":
                  return h3(c3, a3);
                case "D":
                  return e3.$D;
                case "DD":
                  return b2.s(e3.$D, 2, "0");
                case "d":
                  return String(e3.$W);
                case "dd":
                  return h3(n4.weekdaysMin, e3.$W, o3, 2);
                case "ddd":
                  return h3(n4.weekdaysShort, e3.$W, o3, 3);
                case "dddd":
                  return o3[e3.$W];
                case "H":
                  return String(s3);
                case "HH":
                  return b2.s(s3, 2, "0");
                case "h":
                  return d3(1);
                case "hh":
                  return d3(2);
                case "a":
                  return $3(s3, u3, true);
                case "A":
                  return $3(s3, u3, false);
                case "m":
                  return String(u3);
                case "mm":
                  return b2.s(u3, 2, "0");
                case "s":
                  return String(e3.$s);
                case "ss":
                  return b2.s(e3.$s, 2, "0");
                case "SSS":
                  return b2.s(e3.$ms, 3, "0");
                case "Z":
                  return i3;
              }
              return null;
            }(t4) || i3.replace(":", "");
          });
        }, m3.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, m3.diff = function(r4, d3, l3) {
          var $3, y3 = this, M4 = b2.p(d3), m4 = O(r4), v3 = (m4.utcOffset() - this.utcOffset()) * e2, g3 = this - m4, D2 = function() {
            return b2.m(y3, m4);
          };
          switch (M4) {
            case h2:
              $3 = D2() / 12;
              break;
            case c2:
              $3 = D2();
              break;
            case f2:
              $3 = D2() / 3;
              break;
            case o2:
              $3 = (g3 - v3) / 6048e5;
              break;
            case a2:
              $3 = (g3 - v3) / 864e5;
              break;
            case u2:
              $3 = g3 / n3;
              break;
            case s2:
              $3 = g3 / e2;
              break;
            case i2:
              $3 = g3 / t2;
              break;
            default:
              $3 = g3;
          }
          return l3 ? $3 : b2.a($3);
        }, m3.daysInMonth = function() {
          return this.endOf(c2).$D;
        }, m3.$locale = function() {
          return D[this.$L];
        }, m3.locale = function(t3, e3) {
          if (!t3) return this.$L;
          var n4 = this.clone(), r4 = w(t3, e3, true);
          return r4 && (n4.$L = r4), n4;
        }, m3.clone = function() {
          return b2.w(this.$d, this);
        }, m3.toDate = function() {
          return new Date(this.valueOf());
        }, m3.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, m3.toISOString = function() {
          return this.$d.toISOString();
        }, m3.toString = function() {
          return this.$d.toUTCString();
        }, M3;
      }(), k2 = _2.prototype;
      return O.prototype = k2, [["$ms", r3], ["$s", i2], ["$m", s2], ["$H", u2], ["$W", a2], ["$M", c2], ["$y", h2], ["$D", d2]].forEach(function(t3) {
        k2[t3[1]] = function(e3) {
          return this.$g(e3, t3[0], t3[1]);
        };
      }), O.extend = function(t3, e3) {
        return t3.$i || (t3(e3, _2, O), t3.$i = true), O;
      }, O.locale = w, O.isDayjs = S2, O.unix = function(t3) {
        return O(1e3 * t3);
      }, O.en = D[g2], O.Ls = D, O.p = {}, O;
    });
  })(dayjs_min$1);
  return dayjs_min$1.exports;
}
var dayjs_minExports = requireDayjs_min();
const dayjs = /* @__PURE__ */ getDefaultExportFromCjs(dayjs_minExports);
var duration$2 = { exports: {} };
var duration$1 = duration$2.exports;
var hasRequiredDuration;
function requireDuration() {
  if (hasRequiredDuration) return duration$2.exports;
  hasRequiredDuration = 1;
  (function(module, exports) {
    !function(t2, s2) {
      module.exports = s2();
    }(duration$1, function() {
      var t2, s2, n3 = 1e3, i2 = 6e4, e2 = 36e5, r3 = 864e5, o2 = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, u2 = 31536e6, d2 = 2628e6, a2 = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/, h2 = { years: u2, months: d2, days: r3, hours: e2, minutes: i2, seconds: n3, milliseconds: 1, weeks: 6048e5 }, c2 = function(t3) {
        return t3 instanceof g2;
      }, f2 = function(t3, s3, n4) {
        return new g2(t3, n4, s3.$l);
      }, m2 = function(t3) {
        return s2.p(t3) + "s";
      }, l2 = function(t3) {
        return t3 < 0;
      }, $2 = function(t3) {
        return l2(t3) ? Math.ceil(t3) : Math.floor(t3);
      }, y2 = function(t3) {
        return Math.abs(t3);
      }, v2 = function(t3, s3) {
        return t3 ? l2(t3) ? { negative: true, format: "" + y2(t3) + s3 } : { negative: false, format: "" + t3 + s3 } : { negative: false, format: "" };
      }, g2 = function() {
        function l3(t3, s3, n4) {
          var i3 = this;
          if (this.$d = {}, this.$l = n4, void 0 === t3 && (this.$ms = 0, this.parseFromMilliseconds()), s3) return f2(t3 * h2[m2(s3)], this);
          if ("number" == typeof t3) return this.$ms = t3, this.parseFromMilliseconds(), this;
          if ("object" == typeof t3) return Object.keys(t3).forEach(function(s4) {
            i3.$d[m2(s4)] = t3[s4];
          }), this.calMilliseconds(), this;
          if ("string" == typeof t3) {
            var e3 = t3.match(a2);
            if (e3) {
              var r4 = e3.slice(2).map(function(t4) {
                return null != t4 ? Number(t4) : 0;
              });
              return this.$d.years = r4[0], this.$d.months = r4[1], this.$d.weeks = r4[2], this.$d.days = r4[3], this.$d.hours = r4[4], this.$d.minutes = r4[5], this.$d.seconds = r4[6], this.calMilliseconds(), this;
            }
          }
          return this;
        }
        var y3 = l3.prototype;
        return y3.calMilliseconds = function() {
          var t3 = this;
          this.$ms = Object.keys(this.$d).reduce(function(s3, n4) {
            return s3 + (t3.$d[n4] || 0) * h2[n4];
          }, 0);
        }, y3.parseFromMilliseconds = function() {
          var t3 = this.$ms;
          this.$d.years = $2(t3 / u2), t3 %= u2, this.$d.months = $2(t3 / d2), t3 %= d2, this.$d.days = $2(t3 / r3), t3 %= r3, this.$d.hours = $2(t3 / e2), t3 %= e2, this.$d.minutes = $2(t3 / i2), t3 %= i2, this.$d.seconds = $2(t3 / n3), t3 %= n3, this.$d.milliseconds = t3;
        }, y3.toISOString = function() {
          var t3 = v2(this.$d.years, "Y"), s3 = v2(this.$d.months, "M"), n4 = +this.$d.days || 0;
          this.$d.weeks && (n4 += 7 * this.$d.weeks);
          var i3 = v2(n4, "D"), e3 = v2(this.$d.hours, "H"), r4 = v2(this.$d.minutes, "M"), o3 = this.$d.seconds || 0;
          this.$d.milliseconds && (o3 += this.$d.milliseconds / 1e3, o3 = Math.round(1e3 * o3) / 1e3);
          var u3 = v2(o3, "S"), d3 = t3.negative || s3.negative || i3.negative || e3.negative || r4.negative || u3.negative, a3 = e3.format || r4.format || u3.format ? "T" : "", h3 = (d3 ? "-" : "") + "P" + t3.format + s3.format + i3.format + a3 + e3.format + r4.format + u3.format;
          return "P" === h3 || "-P" === h3 ? "P0D" : h3;
        }, y3.toJSON = function() {
          return this.toISOString();
        }, y3.format = function(t3) {
          var n4 = t3 || "YYYY-MM-DDTHH:mm:ss", i3 = { Y: this.$d.years, YY: s2.s(this.$d.years, 2, "0"), YYYY: s2.s(this.$d.years, 4, "0"), M: this.$d.months, MM: s2.s(this.$d.months, 2, "0"), D: this.$d.days, DD: s2.s(this.$d.days, 2, "0"), H: this.$d.hours, HH: s2.s(this.$d.hours, 2, "0"), m: this.$d.minutes, mm: s2.s(this.$d.minutes, 2, "0"), s: this.$d.seconds, ss: s2.s(this.$d.seconds, 2, "0"), SSS: s2.s(this.$d.milliseconds, 3, "0") };
          return n4.replace(o2, function(t4, s3) {
            return s3 || String(i3[t4]);
          });
        }, y3.as = function(t3) {
          return this.$ms / h2[m2(t3)];
        }, y3.get = function(t3) {
          var s3 = this.$ms, n4 = m2(t3);
          return "milliseconds" === n4 ? s3 %= 1e3 : s3 = "weeks" === n4 ? $2(s3 / h2[n4]) : this.$d[n4], s3 || 0;
        }, y3.add = function(t3, s3, n4) {
          var i3;
          return i3 = s3 ? t3 * h2[m2(s3)] : c2(t3) ? t3.$ms : f2(t3, this).$ms, f2(this.$ms + i3 * (n4 ? -1 : 1), this);
        }, y3.subtract = function(t3, s3) {
          return this.add(t3, s3, true);
        }, y3.locale = function(t3) {
          var s3 = this.clone();
          return s3.$l = t3, s3;
        }, y3.clone = function() {
          return f2(this.$ms, this);
        }, y3.humanize = function(s3) {
          return t2().add(this.$ms, "ms").locale(this.$l).fromNow(!s3);
        }, y3.valueOf = function() {
          return this.asMilliseconds();
        }, y3.milliseconds = function() {
          return this.get("milliseconds");
        }, y3.asMilliseconds = function() {
          return this.as("milliseconds");
        }, y3.seconds = function() {
          return this.get("seconds");
        }, y3.asSeconds = function() {
          return this.as("seconds");
        }, y3.minutes = function() {
          return this.get("minutes");
        }, y3.asMinutes = function() {
          return this.as("minutes");
        }, y3.hours = function() {
          return this.get("hours");
        }, y3.asHours = function() {
          return this.as("hours");
        }, y3.days = function() {
          return this.get("days");
        }, y3.asDays = function() {
          return this.as("days");
        }, y3.weeks = function() {
          return this.get("weeks");
        }, y3.asWeeks = function() {
          return this.as("weeks");
        }, y3.months = function() {
          return this.get("months");
        }, y3.asMonths = function() {
          return this.as("months");
        }, y3.years = function() {
          return this.get("years");
        }, y3.asYears = function() {
          return this.as("years");
        }, l3;
      }(), p2 = function(t3, s3, n4) {
        return t3.add(s3.years() * n4, "y").add(s3.months() * n4, "M").add(s3.days() * n4, "d").add(s3.hours() * n4, "h").add(s3.minutes() * n4, "m").add(s3.seconds() * n4, "s").add(s3.milliseconds() * n4, "ms");
      };
      return function(n4, i3, e3) {
        t2 = e3, s2 = e3().$utils(), e3.duration = function(t3, s3) {
          var n5 = e3.locale();
          return f2(t3, { $l: n5 }, s3);
        }, e3.isDuration = c2;
        var r4 = i3.prototype.add, o3 = i3.prototype.subtract;
        i3.prototype.add = function(t3, s3) {
          return c2(t3) ? p2(this, t3, 1) : r4.bind(this)(t3, s3);
        }, i3.prototype.subtract = function(t3, s3) {
          return c2(t3) ? p2(this, t3, -1) : o3.bind(this)(t3, s3);
        };
      };
    });
  })(duration$2);
  return duration$2.exports;
}
var durationExports = requireDuration();
const duration = /* @__PURE__ */ getDefaultExportFromCjs(durationExports);
var isoWeek$2 = { exports: {} };
var isoWeek$1 = isoWeek$2.exports;
var hasRequiredIsoWeek;
function requireIsoWeek() {
  if (hasRequiredIsoWeek) return isoWeek$2.exports;
  hasRequiredIsoWeek = 1;
  (function(module, exports) {
    !function(e2, t2) {
      module.exports = t2();
    }(isoWeek$1, function() {
      var e2 = "day";
      return function(t2, i2, s2) {
        var a2 = function(t3) {
          return t3.add(4 - t3.isoWeekday(), e2);
        }, d2 = i2.prototype;
        d2.isoWeekYear = function() {
          return a2(this).year();
        }, d2.isoWeek = function(t3) {
          if (!this.$utils().u(t3)) return this.add(7 * (t3 - this.isoWeek()), e2);
          var i3, d3, n4, o2, r3 = a2(this), u2 = (i3 = this.isoWeekYear(), d3 = this.$u, n4 = (d3 ? s2.utc : s2)().year(i3).startOf("year"), o2 = 4 - n4.isoWeekday(), n4.isoWeekday() > 4 && (o2 += 7), n4.add(o2, e2));
          return r3.diff(u2, "week") + 1;
        }, d2.isoWeekday = function(e3) {
          return this.$utils().u(e3) ? this.day() || 7 : this.day(this.day() % 7 ? e3 : e3 - 7);
        };
        var n3 = d2.startOf;
        d2.startOf = function(e3, t3) {
          var i3 = this.$utils(), s3 = !!i3.u(t3) || t3;
          return "isoweek" === i3.p(e3) ? s3 ? this.date(this.date() - (this.isoWeekday() - 1)).startOf("day") : this.date(this.date() - 1 - (this.isoWeekday() - 1) + 7).endOf("day") : n3.bind(this)(e3, t3);
        };
      };
    });
  })(isoWeek$2);
  return isoWeek$2.exports;
}
var isoWeekExports = requireIsoWeek();
const isoWeek = /* @__PURE__ */ getDefaultExportFromCjs(isoWeekExports);
dayjs.extend(duration);
dayjs.extend(isoWeek);
class Utils {
  static getDurationMmSs(dateTimeFrom, dateTimeTo = /* @__PURE__ */ new Date()) {
    const duration2 = dayjs.duration(dayjs(dateTimeTo).diff(dateTimeFrom));
    const totalSeconds = duration2.asSeconds();
    const minutes = Math.trunc(totalSeconds / 60);
    const seconds = Math.trunc(totalSeconds % 60);
    return minutes + ":" + (seconds > 9 ? seconds : "0" + seconds);
  }
  static formatDurationFromTo(dateTimeFrom, dateTimeTo = /* @__PURE__ */ new Date()) {
    return this.formatDuration(dayjs.duration(dayjs(dateTimeTo).diff(dateTimeFrom)));
  }
  static formatDuration(duration2) {
    const hours = duration2.hours();
    const minutes = duration2.minutes();
    const seconds = duration2.seconds();
    if (duration2.asMonths() >= 1) {
      const weeks = duration2.weeks();
      const months = Math.floor(duration2.asMonths());
      return `${months}m ${weeks}t`;
    }
    if (duration2.asWeeks() >= 1) {
      const weeks = duration2.weeks();
      const days = duration2.days() - weeks * 7;
      return `${weeks}t ${days}d`;
    }
    if (duration2.asDays() >= 1)
      return `${duration2.days()}d ${hours}h`;
    if (duration2.asHours() >= 1)
      return `${hours}h ${minutes}m`;
    if (duration2.asMinutes() >= 5)
      return `${minutes}m`;
    return `${minutes}m ${seconds}s`;
  }
  static getDayString(date, shortName = false) {
    return Utils.getDayStringFromIsoDayOfWeek(date.isoWeekday(), shortName);
  }
  static getDayStringFromIsoDayOfWeek(isoDayOfWeek, shortName = false) {
    switch (isoDayOfWeek) {
      case 1:
        return shortName ? "Po" : "pondělí";
      case 2:
        return shortName ? "Út" : "úterý";
      case 3:
        return shortName ? "St" : "středa";
      case 4:
        return shortName ? "Čt" : "čtvrtek";
      case 5:
        return shortName ? "Pá" : "pátek";
      case 6:
        return shortName ? "So" : "sobota";
      case 7:
        return shortName ? "Ne" : "neděle";
      default:
        throw "Unsupported day of week: " + isoDayOfWeek;
    }
  }
  static getMonthString(date, shortName = false) {
    return Utils.getMonthStringFromMonthNumber(date.month(), shortName);
  }
  static getMonthStringFromMonthNumber(monthNumber, shortName = false) {
    switch (monthNumber) {
      case 0:
        return shortName ? "Led" : "Leden (1)";
      case 1:
        return shortName ? "Úno" : "Únor (2)";
      case 2:
        return shortName ? "Bře" : "Březen (3)";
      case 3:
        return shortName ? "Dub" : "Duben (4)";
      case 4:
        return shortName ? "Kvě" : "Květen (5)";
      case 5:
        return shortName ? "Črv" : "Červen (6)";
      case 6:
        return shortName ? "Čvn" : "Červenec (7)";
      case 7:
        return shortName ? "Srp" : "Srpen (8)";
      case 8:
        return shortName ? "Zář" : "Září (9)";
      case 9:
        return shortName ? "Říj" : "Říjen (10)";
      case 10:
        return shortName ? "List" : "Listopad (11)";
      case 11:
        return shortName ? "Pro" : "Prosinec (12)";
      default:
        throw "Unsupported day of month: " + monthNumber;
    }
  }
  static formatDaysAgoAsName(dateTimeFrom) {
    const days = Math.floor(dayjs.duration(this.getDate(dayjs(dateTimeFrom)).diff(this.getDate(dayjs()))).asDays());
    if (days == 0)
      return "dnes";
    if (days == 1)
      return "zítra";
    if (days == 2)
      return "pozítří";
    if (days >= 3 && days <= 4)
      return `za ${days} dny`;
    return `za ${days} dní`;
  }
  static getDurationFromTimeString(time) {
    const parts = time.split(":");
    return dayjs.duration({ hours: +parts[0], minutes: +parts[1], seconds: +parts[2] });
  }
  static getTimeStringFromDuration(dur) {
    return `${dur.hours()}:${dur.minutes() ?? "0"}:${dur.seconds() ?? "0"}`;
  }
  static getDate(dateTime) {
    return dateTime.hour(0).minute(0).second(0).millisecond(0);
  }
}
var __defProp$5 = Object.defineProperty;
var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __decorateClass$5 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$3(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$5(target, key, result);
  return result;
};
let LastChangeText = class extends r$2 {
  render() {
    if (!this.entity)
      return x`<div>No entity defined</div>`;
    const lastChanged = this.entity.attributes["state_last_changed"] ?? this.entity.last_changed;
    return x`
      <div>
        ${Utils.formatDurationFromTo(lastChanged)}
      </div>
    `;
  }
};
LastChangeText.styles = i$3`
    /* Add component styles here */
        :host {
            font-size: 11px;
            white-space: nowrap;
        }
  `;
__decorateClass$5([
  n2({ attribute: false })
], LastChangeText.prototype, "entity", 2);
LastChangeText = __decorateClass$5([
  t("last-change-text")
], LastChangeText);
var __defProp$4 = Object.defineProperty;
var __decorateClass$4 = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$4(target, key, result);
  return result;
};
const _ElementBase = class _ElementBase extends r$2 {
  setConfig(config) {
    if (!config.entity) {
      throw Error("Entity required");
    }
    this._config = config;
    if (config.style) {
      Object.keys(config.style).forEach((prop) => {
        this.style.setProperty(prop, config.style[prop]);
      });
    }
  }
  _showMoreInfo() {
    var _a2;
    const entityId = (_a2 = this._config) == null ? void 0 : _a2.entity;
    const event = new CustomEvent("hass-more-info", {
      detail: { entityId },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
  render() {
    if (!this._config || !this.hass) {
      return E;
    }
    const entity = this.hass.states[this._config.entity];
    return x`
        <div @click=${this._showMoreInfo}>
            ${this.renderContent(entity)}
        </div>`;
  }
};
_ElementBase.styles = i$3`
        :host {
            cursor: pointer;
        }
    `;
let ElementBase = _ElementBase;
__decorateClass$4([
  n2({ attribute: false })
], ElementBase.prototype, "hass");
__decorateClass$4([
  r2()
], ElementBase.prototype, "_config");
async function getAlarmoAreaEntitiesAndSensors(hass) {
  const [area_entities, sensors] = await Promise.all(
    [
      hass.callWS({ type: "alarmo/entities" }),
      hass.callWS({ type: "alarmo/sensors" })
    ]
  );
  return { area_entities, sensors };
}
async function getAlarmoSensorToAlarmoEntityMapping(entities, sensors) {
  const mapping = /* @__PURE__ */ new Map();
  console.log(sensors);
  for (const sensorId in sensors) {
    const sensor = sensors[sensorId];
    const areaEntity = entities.find((e2) => e2.area_id === sensor.area);
    if (areaEntity) {
      mapping.set(sensor.entity_id, { areaEntity, sensor });
    }
  }
  return mapping;
}
let sensorsToAreas = void 0;
async function alarmoSensorsToAreas(hass) {
  if (!sensorsToAreas) {
    const { area_entities, sensors } = await getAlarmoAreaEntitiesAndSensors(hass);
    sensorsToAreas = await getAlarmoSensorToAlarmoEntityMapping(area_entities, sensors);
  }
  return sensorsToAreas;
}
async function getAlarmoSensorAndArea(hass, entity_id) {
  console.log("Getting sensor and area for", entity_id);
  const sensors = await alarmoSensorsToAreas(hass);
  const sensor = sensors.get(entity_id);
  return sensor;
}
function getAlarmoSensorState(hass, sensor) {
  if (!hass || !sensor)
    return void 0;
  const state = {
    area_entity: sensor.areaEntity.entity_id,
    armed: false,
    triggered: false
  };
  const areaState = hass.states[sensor.areaEntity.entity_id].state;
  if (areaState === "disarmed")
    return state;
  if (areaState === "triggered") {
    state.triggered = true;
    state.armed = true;
    return state;
  }
  state.armed = sensor.sensor.modes.includes(areaState);
  return state;
}
var __defProp$3 = Object.defineProperty;
var __decorateClass$3 = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$3(target, key, result);
  return result;
};
class ElementBaseArmable extends ElementBase {
  updated(changedProperties) {
    if (changedProperties.has("hass") && !changedProperties.get("hass")) {
      console.log("hass object assigned for the first time", this.hass);
      if (this._config && this.hass) {
        getAlarmoSensorAndArea(this.hass, this._config.entity).then((alarmoArea) => this._alarmoArea = alarmoArea);
      }
    }
  }
  getAlarmoSensorState() {
    return getAlarmoSensorState(this.hass, this._alarmoArea);
  }
}
__decorateClass$3([
  r2()
], ElementBaseArmable.prototype, "_alarmoArea");
var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$2(target, key, result);
  return result;
};
let DoorWindowElement = class extends ElementBaseArmable {
  renderContent(entity) {
    if (!this._config || !this.hass)
      return E;
    const opened = entity.state == "on";
    const svgPathArea = "M0 0 L0 " + this._config.height + " L" + this._config.width + " " + this._config.height + " L" + this._config.width + " 0 Z";
    const alarmState = this.getAlarmoSensorState();
    const color = opened ? "blue" : alarmState ? alarmState.armed ? "red" : "green" : "white";
    return x`
            <svg width="${this._config.width}px" height="${this._config.height}px">
                <path d=${svgPathArea} fill=${color} stroke=${color} strokeDasharray=0 strokeWidth=1 />
            </svg>
            <last-change-text .entity=${entity}></last-change-text>
            `;
  }
};
DoorWindowElement = __decorateClass$2([
  t("door-window-element")
], DoorWindowElement);
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$1(target, key, result);
  return result;
};
let MotionSensorElement = class extends ElementBaseArmable {
  renderContent(entity) {
    const alarmState = this.getAlarmoSensorState();
    const color = alarmState ? alarmState.armed ? "red" : "green" : "white";
    return x`
            <ha-icon style="color:${color}" icon="mdi:motion-sensor"></ha-icon>
            <last-change-text .entity=${entity}></last-change-text>
        `;
  }
};
MotionSensorElement = __decorateClass$1([
  t("motion-sensor-element")
], MotionSensorElement);
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
let AnalogElement = class extends ElementBase {
  renderContent(entity) {
    const units = entity.attributes.unit_of_measurement;
    return x`
            <span>${entity.state}<span style="font-size:50%">${units}</span></span>
        `;
  }
};
AnalogElement = __decorateClass([
  t("analog-element")
], AnalogElement);
//# sourceMappingURL=picture-elements-scalable-dev.js.map
