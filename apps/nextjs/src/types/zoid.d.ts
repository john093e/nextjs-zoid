// Extend the global Window interface to include xprops
interface Window {
  /**
   * By default `window.xprops` is populated in the child window/frame with any props from the parent.
   * Some built-in props are provided and automatically populated on `window.xprops`:
   */
  xprops: {
    /** Gracefully close the component.
     * ```javascript
     * document.querySelector("button#close").addEventListener("click", () => {
     *   window.xprops.close();
     * }); */
    close: () => ZalgoPromise<void>
    /** Refocus the component. Works on popup windows only, should be triggered on a user interaction like a click, in order to be allowed by the browser.
     * ```javascript
     * document.querySelector("button#focus").addEventListener("click", () => {
     *  window.xprops.focus();
     * });
     * ``` */
    focus: () => ZalgoPromise<void>
    /** Resize the component. Works on iframe windows only, popups can not be resized after opening.
     * ```javascript
     * document.querySelector("button#resize").addEventListener("click", () => {
     *   window.xprops.resize({ width: 500, height: 800 });
     * });
     * ``` */
    resize: (dimensions: {
      width: number
      height: number
    }) => ZalgoPromise<void>
    /** Unique ID for the component instance
     * ```javascript
     *  console.log("The current component uid is:", window.xprops.uid);
     * ``` */
    uid: string
    /** Tag for the component instance
     * ```javascript
     * console.log("The current component is:", window.xprops.tag);
     * ``` */
    tag: string
    /** Get a reference to the parent window 
     * ```javascript
     * const parentWindow = window.xprops.getParent();
     * 
     * parentWindow.postMessage("hello!", "*");
     * ``` */
    getParent: () => Window
    /** Get the domain of the parent window
     * ```javascript
     * console.log(
     *   "The current parent window domain is:",
     *   window.xprops.getParentDomain()
     * );
     * ``` */
    getParentDomain: () => string
    /** Show the component. Works on iframe windows only, popups can not be shown/hidden after opening.
     * ```javascript
     * document.querySelector("button#show").addEventListener("click", () => {
     *   window.xprops.show();
     * });
     * ``` */
    show: () => ZalgoPromise<void>
    /** Hide the component. Works on iframe windows only, popups can not be shown/hidden after opening.
     * ```javascript
     * document.querySelector("button#hide").addEventListener("click", () => {
     *   window.xprops.hide();
     * });
     * ``` */
    hide: () => ZalgoPromise<void>
    /** Export data and/or functions from the child to the parent window.
     * ```javascript
     * window.xprops.export({
     *   submit: () => {
     *     document.querySelector("form#createPost").submit();
     *   },
     * });
     * ```
     * This export will be available on the parent window:
     * ```javascript
     * const postForm = CreatePostForm();
     * postForm.render("#create-post-form-container");
     * document.querySelector("button#submitForm").addEventListener("click", () => {
     *   postForm.submit();
     * });
     * ```
     * This assumes that when the component was first created, the author implemented the `exports` function to ensure the exports are mapped to the parent:
     * ```javascript
     * const CreatePostForm = zoid.create({
     *     tag: 'create-post-form',
     *     url: 'https://my-site.com/component/create-post-form',
     *     exports: ({ getExports }) => {
     *         return {
     *             submit: () => getExports().then(exports => exports.submit())
     *         };
     *     };
     * });
     * ```
     * 
     * This mapper is necessary so that the exports are immediately available on the parent component instance, even before the component is fully rendered and before `xprops.export(...)` has been called in the child window. */
    export: (exports: Record<string, any>) => ZalgoPromise<void>
    /** Send an error to the parent
     * ```
     * window.xprops.onError(new Error(`Something went wrong!`));
     * ``` */
    onError: (error: Error) => ZalgoPromise<void>
    /** Set up a listener to receive new props as they are set by the parent window using `componentInstance.setProps(...)`
     * In the child window:
     * ```javascript
     * console.log("The current color is", window.xprops.color); // red
     * window.xprops.onProps(() => {
     *    console.log("The current color is", window.xprops.color); // blue
     * });
     * ```
     * 
     * In the parent window: 
     * ```javascript
     * const component = MyComponent({
     *   color: "red",
     * });
     * component.render("#container").then(() => {
     *    component.setProps({
     *     color: "blue",
     *   });
     * });
     * ``` */
    onProps: (callback: (props: Record<string, any>) => void) => void
    parent: {
      /** Props from the parent component, if the component is rendered as a child.
       * Define the components:
       * ```javascript
       * const ChildComponent = zoid.create({
       *   tag: "child-component",
       *   url: "https://my-site.com/component/child",
       * });
       * 
       * const ParentComponent = zoid.create({
       *   tag: "child-component",
       *   url: "https://my-site.com/component/child",
       *   children: () => {
       *     return {
       *       Child: ChildComponent,
       *     };
       *   },
       * });
       * ```
       * 
       * In the parent window:
       * ```javascript
       * const parent = ParentComponent({
       *   color: "blue",
       * });
       * 
       * const child = parent.Child();
       * 
       * child.render("#child-container");
       * ```
       * 
       * In the child window:
       * ```javascript
       * console.log("The color of this component is:", window.xprops.parent.color); // Red
       * ```*/
      props: Record<string, any>
      /** Export values to the parent component.
       * Define the components:
       * ```javascript
       * const ChildComponent = zoid.create({
       *   tag: "child-component",
       *   url: "https://my-site.com/component/child",
       * });
       * const ParentComponent = zoid.create({
       *   tag: "child-component",
       *   url: "https://my-site.com/component/child",
       *   children: () => {
       *     return {
       *       Child: ChildComponent,
       *     };
       *   },
       *   exports: ({ getExports }) => {
       *     return {
       *       sayHello: () => getExports().then((exports) => exports.sayHello()),
       *     };
       *   },
       * });
       * ```
       * 
       * In the parent window:
       * ```javascript
       * const parent = ParentComponent({
       *   color: "blue",
       * });
       * const child = parent.Child();
       * child.render("#child-container");
       * document.querySelector("button#doSomething").addEventListener("click", () => {
       *   parent.sayHello(); // Should log 'hello world!'
       * });
       * ```
       * 
       * In the child window:
       * ```javascript
       * window.xprops.parent.export({
       *   sayHello: () => {
       *     console.log("hello world!");
       *   },
       * });
       * ``` */
      export: (exports: Record<string, any>) => ZalgoPromise<void>
    }
    /** Get an array of sibling components on the same domain
     * 
     * ```javascript
     * for (const sibling of window.xprops.getSiblings()) {
     *   console.log("Found sibling!", sibling.tag);
     * }
     * ```
     * 
     * ```javascript
     * for (const sibling of window.xprops.getSiblings({ anyParent: true })) {
     *   console.log("Found sibling from any parent!", sibling.tag);
     * }
     *   ``` */
    getSiblings: (options?: {
      anyParent?: boolean
    }) => Array<{ tag: string; xprops: any; exports: any }>
    sessionID?: string
    /** All props from the Zoid components pass to the child */
    [k: string]: any
  }
  ZoidComponent: any; // Adjust the type if you have a specific type for MyZoidComponent
}

// types/cross-domain-utils.d.ts
// ---------------------------------------------
declare module "cross-domain-utils" {
  export {
    getDomain,
    getActualDomain,
    isCurrentDomain,
    isSameDomain,
  } from "cross-domain-utils/src"
}

// types/zalgo.d.ts
// ---------------------------------------------
declare module "zalgo-promise" {
  export { ZalgoPromise } from "zalgo-promise/src/promise"
}

// types/belter.d.ts
// ---------------------------------------------
declare module "belter" {
  import { ZalgoPromise } from "zalgo-promise/src"
  import {
    SameDomainWindowType,
    CrossDomainWindowType,
  } from "cross-domain-utils/src"

  // Export something to force webpack to see this as an ES module
  export const TYPES: boolean

  // Global variable for testing purposes
  declare const __TEST__: boolean

  // JSON types
  export type JSONPrimitive = string | boolean | number
  export type JSONObject =
    | { [key: string]: JSONPrimitive | JSONObject }
    | ReadonlyArray<JSONPrimitive | JSONObject>
  export type JSONType = JSONObject | JSONPrimitive

  // Cancelable type
  export type CancelableType = {
    cancel: () => void
  }

  // Function and other type exports
  export function getElement(selector: string | HTMLElement): HTMLElement
  export function isStandAlone(): boolean
  export function once<T>(fn: () => T): () => T
  export function memoize<T>(fn: () => T): () => T

  // Additional declarations for device.js
  export function getUserAgent(): string
  export function isDevice(userAgent?: string): boolean
  export function isTablet(userAgent?: string): boolean
  export function isWebView(ua?: string): boolean
  export function isStandAlone(): boolean
  export function isFacebookWebView(ua?: string): boolean
  export function isFirefox(ua?: string): boolean
  export function isFirefoxIOS(ua?: string): boolean
  export function isEdgeIOS(ua?: string): boolean
  export function isOperaMini(ua?: string): boolean
  export function isAndroid(ua?: string): boolean
  export function isIos(ua?: string): boolean
  export function isIOS14(ua?: string): boolean
  export function isGoogleSearchApp(ua?: string): boolean
  export function isQQBrowser(ua?: string): boolean
  export function isIosWebview(ua?: string): boolean
  export function isSFVC(ua?: string): boolean
  export function isSFVCorSafari(ua?: string): boolean
  export function isAndroidWebview(ua?: string): boolean
  export function isIE(): boolean
  export function isIECompHeader(): boolean
  export function isElectron(): boolean
  export function isIEIntranet(): boolean
  export function isMacOsCna(): boolean
  export function supportsPopups(ua?: string): boolean
  export function isChrome(ua?: string): boolean
  export function isSafari(ua?: string): boolean
  export function isIpadOs(ua?: string): boolean
  export function isApplePaySupported(): boolean
  export function isCrossSiteTrackingEnabled(expectedCookieKey: string): boolean

  // Experiment type
  export type Experiment = {
    name: string
    sample: number
    logTreatment: (treatment: string, payload?: Record<string, unknown>) => void
    getTreatment: () => string
    logCheckpoint: (
      checkpoint: string,
      payload?: Record<string, unknown>
    ) => void
  }

  // Additional declarations for utils.js
  export function isElement(element: unknown): boolean
  export function getFunctionName<T extends Function>(fn: T): string
  export function setFunctionName<T extends Function>(fn: T, name: string): T
  export function base64encode(str: string): string
  export function base64decode(str: string): string
  export function uniqueID(): string
  export function getGlobal(): any
  export function getObjectID(obj: object): string
  export function serializeArgs<T>(args: ReadonlyArray<T>): string
  export function getEmptyObject(): {}
  export type MemoizeOptions = {
    name?: string
    time?: number
    thisNamespace?: boolean
  }
  export type Memoized<F extends Function> = F & { reset: () => void }
  export function memoize<F extends Function>(
    method: F,
    options?: MemoizeOptions
  ): Memoized<F>
  export function promiseIdentity<T>(item: ZalgoPromise<T> | T): ZalgoPromise<T>
  export function memoizePromise<R>(
    method: (...args: ReadonlyArray<any>) => ZalgoPromise<R>
  ): (...args: ReadonlyArray<any>) => ZalgoPromise<R>
  export function promisify<R>(
    method: (...args: ReadonlyArray<any>) => R,
    options?: { name?: string }
  ): (...args: ReadonlyArray<any>) => ZalgoPromise<R>
  export function inlineMemoize<R>(
    method: (...args: ReadonlyArray<any>) => R,
    logic: (...args: ReadonlyArray<any>) => R,
    args?: ReadonlyArray<any>
  ): R
  export function noop(...args: ReadonlyArray<unknown>): void
  export function hashStr(str: string): number
  export function strHashStr(str: string): string
  export function match(str: string, pattern: RegExp): string | undefined
  export function awaitKey<T>(obj: object, key: string): ZalgoPromise<T>
  export function stringifyError(err: unknown, level?: number): string
  export function stringifyErrorMessage(err: unknown): string
  export function stringify(item: unknown): string
  export function domainMatches(hostname: string, domain: string): boolean
  export function patchMethod(
    obj: object,
    name: string,
    handler: Function
  ): void
  export function extend<T extends object | Function>(obj: T, source: object): T
  export function values<T>(obj: { [key: string]: T }): ReadonlyArray<T>
  export function memoizedValues<T>(obj: { [key: string]: T }): ReadonlyArray<T>
  export function perc(pixels: number, percentage: number): number
  export function min(...args: ReadonlyArray<number>): number
  export function max(...args: ReadonlyArray<number>): number
  export function roundUp(num: number, nearest: number): number
  export function regexMap<T>(
    str: string,
    regexp: RegExp,
    handler: (...args: any[]) => T
  ): ReadonlyArray<T>
  export function svgToBase64(svg: string): string
  export function objFilter<T, R>(
    obj: { [key: string]: T },
    filter?: (value: T, key?: string) => unknown
  ): { [key: string]: R }
  export function identity<T>(item: T): T
  export function regexTokenize(
    text: string,
    regexp: RegExp
  ): ReadonlyArray<string>
  export function promiseDebounce<T>(
    method: () => ZalgoPromise<T> | T,
    delay?: number
  ): () => ZalgoPromise<T>
  export function safeInterval(
    method: Function,
    time: number
  ): { cancel: () => void }
  export function isInteger(str: string): boolean
  export function isFloat(str: string): boolean
  export function serializePrimitive(value: string | number | boolean): string
  export function deserializePrimitive(value: string): string | number | boolean
  export function dotify(
    obj: object,
    prefix?: string,
    newobj?: object
  ): { [key: string]: string }
  export function undotify(obj: { [key: string]: string }): object
  export type EventEmitterType = {
    on: (eventName: string, handler: Function) => CancelableType
    once: (eventName: string, handler: Function) => CancelableType
    trigger: (
      eventName: string,
      ...args: ReadonlyArray<unknown>
    ) => ZalgoPromise<void>
    triggerOnce: (
      eventName: string,
      ...args: ReadonlyArray<unknown>
    ) => ZalgoPromise<void>
    reset: () => void
  }
  export function eventEmitter(): EventEmitterType
  export function camelToDasherize(string: string): string
  export function dasherizeToCamel(string: string): string
  export function capitalizeFirstLetter(string: string): string
  export function get(item: object, path: string, def?: unknown): unknown
  export function safeTimeout(method: Function, time: number): void
  export function defineLazyProp<T>(
    obj: object | ReadonlyArray<unknown>,
    key: string | number,
    getter: () => T
  ): void
  export function arrayFrom<T>(item: Iterable<T>): ReadonlyArray<T>
  export function isObject(item: unknown): boolean
  export function isObjectObject(obj: unknown): boolean
  export function isPlainObject(obj: unknown): boolean
  export function replaceObject<T extends object | ReadonlyArray<unknown>>(
    item: T,
    replacer: (value: unknown, key: string | number, path: string) => unknown,
    fullKey?: string
  ): T
  export function copyProp(
    source: object,
    target: object,
    name: string,
    def: unknown
  ): void
  export type RegexResultType = {
    text: string
    groups: ReadonlyArray<string>
    start: number
    end: number
    length: number
    replace: (text: string) => string
  }
  export function regex(
    pattern: string | RegExp,
    string: string,
    start?: number
  ): RegexResultType | undefined
  export function regexAll(
    pattern: string | RegExp,
    string: string
  ): ReadonlyArray<RegexResultType>
  export function isDefined(value: unknown): boolean
  export function cycle(method: Function): ZalgoPromise<void>
  export function debounce<T>(
    method: (...args: ReadonlyArray<unknown>) => T,
    time?: number
  ): (...args: ReadonlyArray<unknown>) => void
  export function isRegex(item: unknown): boolean
  export const weakMapMemoize: <R>(
    method: (arg: unknown) => R
  ) => (arg: unknown) => R
  export const weakMapMemoizePromise: <R>(
    method: (arg: unknown) => ZalgoPromise<R>
  ) => (arg: unknown) => ZalgoPromise<R>
  export function getOrSet<O extends object, T>(
    obj: O,
    key: string,
    getter: () => T
  ): T
  export type CleanupType = {
    set: <T>(key: string, value: T) => T
    register: (handler: Function) => { cancel: () => void }
    all: (err?: unknown) => ZalgoPromise<void>
  }
  export function cleanup(obj: object): CleanupType
  export function tryCatch<T>(
    fn: () => T
  ): { result: T; error: void } | { result: void; error: unknown }
  export function removeFromArray<X, T extends ReadonlyArray<X>>(
    arr: T,
    item: X
  ): void
  export function assertExists<T>(name: string, thing: T | null | undefined): T
  export function unique(arr: ReadonlyArray<string>): ReadonlyArray<string>
  export const constHas: <
    X extends string | boolean | number,
    T extends { [key: string]: X },
  >(
    constant: T,
    value: X
  ) => boolean
  export function dedupeErrors<T>(
    handler: (err: unknown) => T
  ): (err: unknown) => T | void
  export class ExtendableError extends Error {
    constructor(message: string)
  }
  export function sanitizeUrl(url?: string): string

  // Additional declarations for dom.js
  // Declarations for dom.js
  export type ElementRefType = string | HTMLElement
  export function getBody(): HTMLBodyElement
  export function isDocumentReady(): boolean
  export function isDocumentInteractive(): boolean
  export function urlEncode(str: string): string
  export function waitForWindowReady(): ZalgoPromise<void>
  export const waitForDocumentReady: () => ZalgoPromise<void>
  export function waitForDocumentBody(): ZalgoPromise<HTMLBodyElement>
  export function parseQuery(queryString: string): { [key: string]: string }
  export function getQueryParam(name: string): string | undefined
  export function urlWillRedirectPage(url: string): boolean
  export type Query = {
    [key: string]: boolean | string
  }
  export function formatQuery(obj?: Query): string
  export function extendQuery(originalQuery: string, props?: Query): string
  export function extendUrl(
    url: string,
    options: { query?: Query; hash?: Query }
  ): string
  export function redirect(
    url: string,
    win?: CrossDomainWindowType
  ): ZalgoPromise<void>
  export function hasMetaViewPort(): boolean
  export function isElementVisible(el: HTMLElement): boolean
  export function getPerformance(): Performance | undefined
  export function enablePerformance(): boolean
  export function getPageRenderTime(): ZalgoPromise<number | undefined>
  export function htmlEncode(html?: string): string
  export function isBrowser(): boolean
  export function querySelectorAll(
    selector: string,
    doc?: HTMLElement
  ): ReadonlyArray<HTMLElement>
  export function onClick(
    element: HTMLElement,
    handler: (event: Event) => void
  ): void
  export function getScript(options: {
    host?: string
    path: string
    reverse?: boolean
  }): HTMLScriptElement | undefined
  export function isLocalStorageEnabled(): boolean
  export function getBrowserLocales(): ReadonlyArray<{
    country?: string
    lang: string
  }>
  export function appendChild(
    container: HTMLElement,
    child: HTMLElement | Text
  ): void
  export function getElementSafe(
    id: ElementRefType,
    doc?: Document | HTMLElement
  ): HTMLElement | undefined
  export function elementReady(id: ElementRefType): ZalgoPromise<HTMLElement>
  export class PopupOpenError extends ExtendableError {}
  export type PopupOptions = {
    name?: string
    width?: number
    height?: number
    top?: number
    left?: number
    status?: 0 | 1
    resizable?: 0 | 1
    toolbar?: 0 | 1
    menubar?: 0 | 1
    scrollbars?: 0 | 1
    closeOnUnload?: 0 | 1
  }
  export function popup(
    url: string,
    options?: PopupOptions
  ): CrossDomainWindowType
  export function writeToWindow(win: SameDomainWindowType, html: string): void
  export function writeElementToWindow(
    win: SameDomainWindowType,
    el: HTMLElement
  ): void
  export function setStyle(
    el: HTMLElement,
    styleText: string,
    doc?: Document
  ): void
  export type ElementOptionsType = {
    style?: { [key: string]: string }
    id?: string
    class?: ReadonlyArray<string>
    attributes?: { [key: string]: string }
    styleSheet?: string
    html?: string
  }
  export function createElement(
    tag?: string,
    options?: ElementOptionsType,
    container?: HTMLElement
  ): HTMLElement
  export type IframeElementOptionsType = {
    style?: { [key: string]: string }
    class?: ReadonlyArray<string>
    attributes?: { [key: string]: string }
    styleSheet?: string
    html?: string
    url?: string
  }
  export function iframe(
    options?: IframeElementOptionsType,
    container?: HTMLElement
  ): HTMLIFrameElement
  export function addEventListener(
    obj: HTMLElement,
    event: string,
    handler: (event: Event) => void
  ): CancelableType
  export function bindEvents(
    element: HTMLElement,
    eventNames: ReadonlyArray<string>,
    handler: (event: Event) => void
  ): CancelableType
  export function setVendorCSS(
    element: HTMLElement,
    name: string,
    value: string
  ): void
  export function animate(
    element: ElementRefType,
    name: string,
    clean: (cleanupFn: () => void) => void,
    timeout?: number
  ): ZalgoPromise<void>
  export function makeElementVisible(element: HTMLElement): void
  export function makeElementInvisible(element: HTMLElement): void
  export function showElement(element: HTMLElement): void
  export function hideElement(element: HTMLElement): void
  export function destroyElement(element: HTMLElement): void
  export function showAndAnimate(
    element: HTMLElement,
    name: string,
    clean: (cleanupFn: () => void) => void
  ): ZalgoPromise<void>
  export function animateAndHide(
    element: HTMLElement,
    name: string,
    clean: (cleanupFn: () => void) => void
  ): ZalgoPromise<void>
  export function addClass(element: HTMLElement, name: string): void
  export function removeClass(element: HTMLElement, name: string): void
  export function isElementClosed(el: HTMLElement): boolean
  export function watchElementForClose(
    element: HTMLElement,
    handler: () => void
  ): CancelableType
  export function fixScripts(el: HTMLElement, doc?: Document): void
  export type OnResizeOptions = {
    width?: boolean
    height?: boolean
    interval?: number
    win?: SameDomainWindowType
  }
  export function onResize(
    el: HTMLElement,
    handler: (size: { width: number; height: number }) => void,
    options?: OnResizeOptions
  ): { cancel: () => void }
  export function getResourceLoadTime(url: string): number | undefined
  export function isShadowElement(element: Node): boolean
  export function getShadowRoot(element: Node): Node | undefined
  export function getShadowHost(element: Node): HTMLElement | undefined
  export function insertShadowSlot(element: HTMLElement): HTMLElement
  export function preventClickFocus(el: HTMLElement): void
  export function getStackTrace(): string
  export function getCurrentScript(): HTMLScriptElement
  export function getCurrentScriptUID(): string
  export type SubmitFormOptions = {
    url: string
    target: string
    body?: { [key: string]: string | boolean }
    method?: string
  }
  export function submitForm(options: SubmitFormOptions): void

  // Additional declarations for storage.js
  export type Getter<T> = (handler: (storage: object) => T) => T

  export type Storage = {
    getState: Getter<any>
    getID: () => string
    isStateFresh: () => boolean
    getSessionState: Getter<any>
    getSessionID: () => string
  }

  export const DEFAULT_SESSION_STORAGE: number

  export function getStorage(options: {
    name: string
    lifetime?: number
    stickySessionId?: string
  }): Storage
}

// types/zoid.d.ts
// ---------------------------------------------
declare module "zoid" {
  import { ZalgoPromise } from "zalgo-promise/src"
  import {
    CrossDomainWindowType,
    DomainMatcher,
  } from "cross-domain-utils/src"

  export type DimensionsType = {
    width: number
    height: number
  }

  export type CssDimensionsType = {
    width: string
    height: string
  }

  export type CancelableType = {
    cancel: () => void
  }

  export type StringMatcherType =
    | string
    | ReadonlyArray<string | RegExp>
    | RegExp

  export type ContainerReferenceType = string | HTMLElement

  type AttributesType = {
    iframe?: { [key: string]: string }
    popup?: { [key: string]: string }
  }

  type LoggerPayload = { [key: string]: string | boolean | null }

  type Logger = {
    info: (event: string, payload?: LoggerPayload) => any
  }

  export type ExportsConfigDefinition = {
    [key: string]: {
      type: string
    }
  }

  export type ExportsMapperDefinition<X> = (options: {
    getExports: () => ZalgoPromise<X>
  }) => X

  export type ExportsDefinition<X> =
    | ExportsConfigDefinition
    | ExportsMapperDefinition<X>

  export interface PropDefinition<P = any> {
    /** ### type
     * The data-type expected for the prop
     * - `'string'`
     * - `'number'`
     * - `'boolean'`
     * - `'object'`
     * - `'function'`
     * - `'array'`
     */
    type: "string" | "number" | "boolean" | "object" | "function" | "array"

    /** ### required
     * Whether or not the prop is mandatory. Defaults to `true`.
     *
     * ```javascript
     * onLogin: {
     *     type: 'function',
     *     required: false
     * }
     * ```
     */
    required?: boolean

    /** ### default
     * A function returning the default value for the prop, if none is passed
     *
     * ```javascript
     * email: {
     *     type: 'string',
     *     required: false,
     *     default: function() {
     *         return 'a@b.com';
     *     }
     * }
     * ```
     */
    default?: (options: {
      props: PropsType<P>
      state: Record<string, any>
      close: () => ZalgoPromise<void>
      focus: () => ZalgoPromise<void>
      onError: (error: any) => ZalgoPromise<void>
      container: HTMLElement | undefined
      event: Event
    }) => any

    /** ### validate
     * A function to validate the passed value. Should throw an appropriate error if invalid.
     *
     * ```javascript
     * email: {
     *     type: 'string',
     *     validate: function({ value, props }) {
     *         if (!value.match(/^.+@.+\..+$/)) {
     *             throw new TypeError(`Expected email to be valid format`);
     *         }
     *     }
     * }
     * ```
     */
    validate?: (options: { value: any; props: PropsType<P> }) => void

    /** ### queryParam
     * Should a prop be passed in the url.
     *
     * ```javascript
     * email: {
     *     type: 'string',
     *     queryParam: true // ?email=foo@bar.com
     * }
     * ```
     *
     * If a string is set, this specifies the url param name which will be used.
     *
     * ```javascript
     * email: {
     *     type: 'string',
     *     queryParam: 'user-email' // ?user-email=foo@bar.com
     * }
     * ```
     *
     * If a function is set, this is called to determine the url param which should be used.
     *
     * ```javascript
     * email: {
     *     type: 'string',
     *     queryParam: function({ value }) {
     *         if (value.indexOf('@foo.com') !== -1) {
     *             return 'foo-email'; // ?foo-email=person@foo.com
     *         } else {
     *             return 'generic-email'; // ?generic-email=person@whatever.com
     *         }
     *     }
     * }
     * ```
     */
    queryParam?: boolean | string | ((options: { value: any }) => string)

    /**
     * ### bodyParam
     * Should a prop be passed in the body.
     *
     * ```javascript
     * email: {
     *    type: 'string',
     *   bodyParam: true
     * }
     * ```
     */
    bodyParam?: boolean | string | ((options: { value: any }) => string)
    /** ### value
     * The value for the prop, if it should be statically defined at component creation time
     *
     * ```javascript
     * userAgent: {
     *     type: 'string',
     *     value() {
     *         return window.navigator.userAgent;
     *     }
     * }
     * ```
     */
    value?: (options: {
      props: PropsType<P>
      state: Record<string, any>
      close: () => ZalgoPromise<void>
      focus: () => ZalgoPromise<void>
      onError: (error: any) => ZalgoPromise<void>
      container: HTMLElement | undefined
      event: Event
    }) => any

    /** ### decorate
     * A function used to decorate the prop at render-time. Called with the value of the prop, should return the new value.
     *
     * ```javascript
     * onLogin: {
     *     type: 'function',
     *     decorate(original) {
     *         return function() {
     *             console.log('User logged in!');
     *             return original.apply(this, arguments);
     *         };
     *     }
     * }
     * ```
     */
    decorate?: (options: {
      props: PropsType<P>
      state: Record<string, any>
      close: () => ZalgoPromise<void>
      focus: () => ZalgoPromise<void>
      onError: (error: any) => ZalgoPromise<void>
      container: HTMLElement | undefined
      event: Event
      value: any
    }) => any

    /** ### serialization
     * If `json`, the prop will be JSON stringified before being inserted into the url
     *
     * ```javascript
     * user: {
     *     type: 'object',
     *     serialization: 'json' // ?user={"name":"Zippy","age":34}
     * }
     * ```
     *
     * If `dotify` the prop will be converted to dot-notation.
     *
     * ```javascript
     * user: {
     *     type: 'object',
     *     serialization: 'dotify' // ?user.name=Zippy&user.age=34
     * }
     * ```
     *
     * If `base64`, the prop will be JSON stringified then base64 encoded before being inserted into the url
     *
     * ```javascript
     * user: {
     *     type: 'object',
     *     serialization: 'base64' // ?user=eyJuYW1lIjoiWmlwcHkiLCJhZ2UiOjM0fQ==
     * }
     * ```
     */
    serialization?: "json" | "dotify" | "base64"

    /** ### alias
     * An aliased name for the prop
     *
     * ```javascript
     * onLogin: {
     *     type: 'function',
     *     alias: 'onUserLogin'
     * }
     * ```
     */
    alias?: string

    /** ### sendToChild
     * optionaly define if props should be passed to the child frame, by default or if set to true props is passed else if sett to false prrops won't be shared to tthe child frame
     */
    sendToChild?: boolean

    /**
     * ### allowDelegate
     * ? default : false and don't delegate props
     */
    allowDelegate?: boolean
  }
  type PropsInputType<P> = Partial<P>
  type RenderOptionsType<P> = { props: PropsType<P> }

  export type UserPropsDefinitionType<P, X> = {
    [K in keyof P]: X
  }

  export interface ZoidComponentInstance<P, X = void, C = void> {
    /** ## isEligible `() => boolean`
     * Informs if the component is eligible
     *
     * ```javascript
     * const myComponent = MyComponent();
     *
     * if (myComponent.isEligible()) {
     *   myComponent.render("#my-container");
     * }
     * ```
     *
     * To use `isEligible()` you must first define an `eligible` handler when setting up the component:
     *
     * ```javascript
     * const FirefoxOnlyButton = zoid.create({
     *   tag: "my-component",
     *   url: "https://my-site.com/my-component",
     *   eligible: () => {
     *     if (isFireFox()) {
     *       return true;
     *     } else {
     *       return false;
     *     }
     *   },
     * });
     * ```
     */
    isEligible: () => boolean

    /** ## clone `() => ZoidComponentInstance`
     * Clones the current instance with the exact same set of props
     *
     * ```javascript
     * const button1 = ButtonComponent({
     *   color: "red",
     * });
     *
     * const button2 = button1.clone();
     *
     * button1.render("#first-button-container"); // First red button
     * button2.render("#first-button-container"); // Second red button
     * ```
     */
    clone: () => ZoidComponentInstance<P, X, C>

    /** ## render `(container : string | HTMLElement, context : 'iframe' | 'popup') => Promise<void>`
     * Render the component to a given container.
     *
     * - container: can be a string selector like `'#my-container'` or a DOM element like `document.body`
     * - context: defaults to `iframe` or `defaultContainer` if set. Can be overriden to explicitly specify `'iframe'` or `'popup'`.
     *
     * ```javascript
     * const component = MyComponent();
     *
     * component.render("#my-container").then(() => {
     *   console.info("The component was successfully rendered");
     * });
     * ```
     *
     * ```javascript
     * const component = MyComponent();
     *
     * component.render(document.body).then(() => {
     *   console.info("The component was successfully rendered");
     * });
     * ```
     *
     * ```javascript
     * const component = MyComponent();
     *
     * component.render("#my-container", "popup").then(() => {
     *   console.info("The component was successfully rendered");
     * });
     * ```
     */
    render: (
      container?: ContainerReferenceType,
      context?: string
    ) => ZalgoPromise<void>

    /** ## renderTo `(window : Window, container : string | HTMLElement, context : 'iframe' | 'popup') => Promise<void>`
     * Render the component to a given window and given container.
     *
     * - window: a reference to the window which the component should be rendered to. Zoid must be loaded in that window and the component must be registered.
     * - container: must be a string selector like `'#my-container'` (DOM element is not transferable across different windows)
     * - context: defaults to `iframe` or `defaultContainer` if set. Can be overriden to explicitly specify `'iframe'` or `'popup'`.
     *
     * ```javascript
     * const component = MyComponent();
     *
     * component.renderTo(window.parent, "#my-container").then(() => {
     *   console.info("The component was successfully rendered");
     * });
     * ```
     *
     * ```javascript
     * const component = MyComponent();
     *
     * component.renderTo(window.parent, "#my-container", "popup").then(() => {
     *   console.info("The component was successfully rendered");
     * });
     * ```
     */
    renderTo: (
      target: CrossDomainWindowType,
      container?: ContainerReferenceType,
      context?: string
    ) => ZalgoPromise<void>
  }

  export type ComponentOptionsType<P, X, C> = {
    /** ### tag `string` [required]
     * A tag-name for the component, used for:
     * - Loading the correct component in the child window or frame
     * - Generating framework drivers
     * - Logging
     * ```javascript
     *  const MyComponent = zoid.create({
     *      tag: 'my-component-tag',
     *      ...
     * });
     * ```
     * */
    tag: string

    /** ### url `string | ({ props }) => string` [required]
     * The full url that will be loaded when your component is rendered, or a function returning the url.
     * This must include a protocol (http:, https:, or about:); it cannot be scheme-relative.
     * ```javascript
     *  const MyComponent = zoid.create({
     *      tag: "my-component",
     *      url: "https://my-site.com/my-component",
     * });
     *
     * url: "https://www.my-site.com/mycomponent";
     * ```
     *
     * ```javascript
     *  const MyComponent = zoid.create({
     *      tag: 'my-component',
     *      url: ({ props }) => { return (props.env === 'development')
     *          ? 'http://dev.my-site.com/mycomponent'
     *          : 'https://www.my-site.com/mycomponent';
     *  });
     * ```
     */
    url: string | ((options: { props: PropsType<P> }) => string)

    /** ### domain `string`
     * A string, or map of env to strings, for the domain which will be loaded in the iframe or popup.
     * Only required if the domain which will be rendered is different to the domain specified in the `url` setting - for example, if the original url does a 302 redirect to a different domain or subdomain.
     * ```javascript
     * const MyComponent = zoid.create({
     *  tag: "my-component",
     *  url: "https://foo.com/login",
     *  domain: "https://subdomain.foo.com",
     * });
     * ```
     */
    domain?: DomainMatcher

    /** ### bridgeUrl `string | ({ props }) => string`
     * The url or a function returning the url for a [post-robot bridge](https://github.com/krakenjs/post-robot#parent-to-popup-messaging). Will be automatically loaded in a hidden iframe when a popup component is rendered, to allow communication between the parent window and the popup in IE/Edge.
     * This is only necessary if you are creating a popup component which needs to run in IE and/or Edge.
     * ```javascript
     * const MyComponent = zoid.create({
     *  tag: "my-component",
     *  url: "https://my-site.com/my-component",
     *  bridgeUrl: "https://foo.com/bridge",
     * });
     * ```
     * ```javascript
     * const MyComponent = zoid.create({
     *  tag: "my-component",
     *  url: "https://my-site.com/my-component",
     *  bridgeUrl: ({ props }) => {
     *      return props.env === "development"
     *          ? "http://foo.dev/bridge"
     *          : "https://foo.com/bridge";
     *  },
     * });
     * ```
     */
    bridgeUrl?: string

    /** ### method `string`
     * Specifies the method of communication with the child component. This is usually left as default.
     */
    method?: "get" | "post"

    /** ### props `{ [string] : PropDefinition }`
     * A mapping of prop name to prop settings. Helpful for setting default values, decorating values, adding props to the query string of your component url, and more.
     * Note: you are not required to create a prop definition for each new prop. By default, anything passed in as a prop when instantiating your component, will be automatically passed to the child window in `window.xprops`.
     * ```javascript
     * const MyComponent = zoid.create({
     *  tag: "my-component",
     *  url: "https://my-site.com/my-component",
     *  props: {
     *      onLogin: {
     *          type: "function",
     *      },
     *      prefilledEmail: {
     *          type: "string",
     *          required: false,
     *      },
     *  },
     * });
     * ```
     * See [Prop Definitions](./prop-definitions.md) for all options which can be passed to prop definitions.
     */
    props?: UserPropsDefinitionType<P, PropDefinition>

    /** ### dimensions `{ width : string, height : string }`
     * The dimensions for your component, in css-style units, with support for `px` or `%`.
     * ```javascript
     * const MyComponent = zoid.create({
     *  tag: "my-component",
     *  url: "https://my-site.com/my-component",
     *  dimensions: {
     *      width: "300px",
     *      height: "200px",
     *  },
     * });
     * ```
     * ```javascript
     * const MyComponent = zoid.create({
     *  tag: "my-component",
     *  url: "https://my-site.com/my-component",
     *  dimensions: {
     *      width: "80%",
     *      height: "90%",
     *  },
     * });
     * ```
     */
    dimensions?:
      | CssDimensionsType
      | ((options: { props: PropsType<P> }) => CssDimensionsType)

    /** ### autoResize `{ height: boolean, width: boolean, element: string }`
     * Makes the iframe resize automatically when the child window size changes.
     * ```javascript
     * const MyComponent = zoid.create({
     *  tag: "my-component",
     *  url: "https://my-site.com/my-component",
     *  autoResize: {
     *      width: false,
     *      height: true,
     *  },
     * });
     * ```
     * Note that by default it matches the `body` element of your content.
     * You can override this setting by specifying a custom selector as an `element` property.
     * ```javascript
     * const MyComponent = zoid.create({
     *  tag: "my-component",
     *  url: "https://my-site.com/my-component",
     *  autoResize: {
     *      width: false,
     *      height: true,
     *      element: ".my-selector",
     *  },
     * });
     * ```
     * Recommended to only use autoResize for height. Width has some strange effects, especially when scroll bars are present.
     */
    autoResize?: { width?: boolean; height?: boolean; element?: string }

    /** ### allowedParentDomains `string | Array<string | RegExp>`
     * A string, array of strings or regular expressions to be used to validate parent domain. If parent domain doesn't match any item, communication from child to parent will be prevented. The default value is '\*' which matches any domain.
     * ```javascript
     * const MyComponent = zoid.create({
     *  tag: "my-component",
     *  url: "https://my-site.com/my-component",
     *  allowedParentDomains: ["http://localhost", /^http:\/\/www\.mydomain\.com$/],
     * });
     * ```
     */
    allowedParentDomains?: StringMatcherType
    /**
     *
     */
    attributes?:
      | AttributesType
      | ((options: { props: PropsType<P> }) => AttributesType)
    /** ### defaultContext `string`
     * Determines which context (iframe or popup) should be picked by default when `render()` is called. Defaults to `iframe`.
     * ```javascript
     * const MyComponent = zoid.create({
     *  tag: "my-component",
     *  url: "https://my-site.com/my-component",
     *  defaultContext: "popup",
     * });
     * ```
     */
    defaultContext?: string

    /**
     * ### containerTemplate `(opts) => HTMLElement`
     * A function which should return a DOM element, rendered on the parent page and containing the iframe element (or rendered behind the popup window).
     * zoid will pass `opts.frame` and `opts.prerenderFrame` to this function, which is a pre-generated element your component will be rendered into. These must be inserted somewhere into the DOM element you return, for frame-based components
     * The `opts` parameter is [the same](#opts) as the parameter used in `prerenderTemplate`
     * Best used with [jsx-pragmatic](https://github.com/krakenjs/jsx-pragmatic). You can use [babel](https://babeljs.io/docs/plugins/transform-react-jsx/) with a `@jsx node` comment, to transpile the jsx down to regular javascript.
     * ```javascript
     * @jsx node
     * import { node, dom } from "jsx-pragmatic";
     * var MyLoginZoidComponent = zoid.create({
     *  tag: "my-login",
     *  url: "https://www.mysite.com/login",
     *  containerTemplate: function ({ uid, doc, frame, prerenderFrame }) {
     *      return (
     *          <div id={uid} class="container">
     *              <style>
     *                  {`#${uid}.container {
     *                      border: 5px solid red;
     *                  }`}
     *              </style>
     *              <node el={frame} />
     *              <node el={prerenderFrame} />
     *          </div>
     *      ).render(dom({ doc }));
     *  },
     * });
     * ```
     * As with React, you are also free to skip using JSX and just use `node` from `jsx-pragmatic` directly:
     * ```javascript
     * import { node, dom } from "jsx-pragmatic";
     * var MyLoginZoidComponent = zoid.create({
     *      tag: "my-login",
     *      url: "https://www.mysite.com/login",
     *      containerTemplate: function containerTemplate({
     *          id,
     *          doc,
     *          frame,
     *          prerenderFrame,
     *      }) {
     *          return node("div", { id: uid, class: "container" },
     *              node("style", null, `#${uid}.container { border: 5px solid red; }`),
     *              node("node", { el: frame }),
     *              node("node", { el: prerenderFrame })
     *          ).render(dom({ doc }));
     *      },
     * });
     * ```
     * Since `containerTemplate` requires a DOM element to be returned, you're also free to manually create the element hierarchy using built-in browser methods like `doc.createElement`:
     * ```javascript
     * import { node, dom } from "jsx-pragmatic";
     * var MyLoginZoidComponent = zoid.create({
     *      tag: "my-login",
     *      url: "https://www.mysite.com/login",
     *      containerTemplate: function containerTemplate({
     *          doc,
     *          uid,
     *          frame,
     *          prerenderFrame,
     *      }) {
     *          let container = doc.createElement("div");
     *          container.id = uid;
     *          container.appendChild(frame);
     *          container.appendChild(prerenderFrame);
     *          return container;
     *      },
     * });
     * ```
     * If no `containerTemplate` function is defined, then a default is used. The default template can be found [here](https://github.com/krakenjs/zoid/blob/main/src/component/templates/container.js).
     * @param options
     * @returns
     */
    containerTemplate?: (options: RenderOptionsType<P>) => HTMLElement | null

    /** ### prerenderTemplate `(opts) => HTMLElement`
     * A function which should return a DOM element, rendered in place of the iframe element, or inside the popup window, as it loads.
     * Useful if you want to display a loading spinner or pre-render some content as the component loads.
     * Best used with [jsx-pragmatic](https://github.com/krakenjs/jsx-pragmatic). You can use [babel](https://babeljs.io/docs/plugins/transform-react-jsx/) with a `@jsx node` comment, to transpile the jsx down to regular javascript.
     * ```javascript
     * @jsx node
     * import { node, dom } from "jsx-pragmatic";
     * var MyLoginZoidComponent = zoid.create({
     *  tag: "my-login",
     *  url: "https://www.mysite.com/login",
     *  prerenderTemplate: function ({ doc }) {
     *      return (<p>Please wait while the component loads...</p>).render(
     *          dom({ doc })
     *      );
     *  },
     * });
     * ```
     * As with React, you are also free to skip using JSX and just use `node` directly:
     * ```javascript
     * import { node, dom } from "jsx-pragmatic";
     * var MyLoginZoidComponent = zoid.create({
     *  tag: "my-login",
     *  url: "https://www.mysite.com/login",
     *  prerenderTemplate: function containerTemplate({ doc }) {
     *      return node(
     *          "p",
     *          null,
     *          `
     *              Please wait while the component loads...
     *          `
     *      ).render(dom({ doc }));
     *  },
     * });
     * ```
     * Since `prerenderTemplate` only requires a DOM element, you're also free to manually create the element hierarchy using built-in browser methods like `doc.createElement`.
     * **Note:** if you're using `document` method, you must use the `doc` passed to `prerenderTemplate`, so the element is created using the target document of the new iframe or popup window, **not** the document of the parent page. This is essential for browser compatibility.
     * ```javascript
     * var MyLoginZoidComponent = zoid.create({
     *  tag: "my-login",
     *  url: "https://www.mysite.com/login",
     *  prerenderTemplate: function containerTemplate({ doc }) {
     *      const p = doc.createElement("p");
     *      p.innerText = "Please wait while the component loads...";
     *      return p;
     *  },
     * });
     * ```
     */
    prerenderTemplate?: (options: RenderOptionsType<P>) => HTMLElement | null

    /** ### validate `({ props }) => void`
     * Function which is passed all of the props at once and may validate them. Useful for validating inter-dependent props.
     * ```javascript
     * const MyComponent = zoid.create({
     *  tag: "my-component",
     *  url: "https://my-site.com/my-component",
     *  validate: function ({ props }) {
     *      if (props.name === "Batman" && props.strength < 10) {
     *          throw new Error(`Batman must have at least 10 strength`);
     *      }
     *  },
     * });
     * ```
     */
    validate?: (options: { props: PropsInputType<P> }) => void

    /** ### logger `Logger`
     * Custom logger to use for component lifecycle events.
     */
    logger?: Logger

    /** ### eligible `({ props : { [string] : any } }) => { eligible: boolean, reason?: string }`
     * Function which determines if the component is eligible to be rendered.
     * ```javascript
     * const FirefoxOnlyButton = zoid.create({
     *  tag: "my-component",
     *  url: "https://my-site.com/my-component",
     *  eligible: () => {
     *      if (isFireFox()) {
     *          return true;
     *      } else {
     *          return false;
     *      }
     *  },
     * });
     * ```
     * Now anyone can check eligibility prior to rendering the component:
     * ```javascript
     * const myComponent = MyComponent();
     * if (myComponent.isEligible()) {
     *  myComponent.render("#my-container");
     * }
     * ```
     * If the component is not eligible, calling `.render(...)` will return a rejected promise:
     * ```javascript
     * const myComponent = MyComponent();
     * myComponent.render('#my-container').catch(err => {
     *  console.error(err); // This will happen if we're not in firefox
     * });
     * ```
     */
    eligible?: (options: { props: PropsInputType<P> }) => {
      eligible: boolean
      reason?: string
    }

    /** ### children `() => { [string] : ZoidComponent }`
     * Set up components which will be renderable as children of the current component
     * ```javascript
     * const CardNumberField = zoid.create({
     *  tag: 'card-number-field',
     *  url: 'https://my-site.com/component/card-fields/number'
     * });
     * const CardCVVField = zoid.create({
     *  tag: 'card-cvv-field',
     *  url: 'https://my-site.com/component/card-fields/cvv'
     * });
     * const CardExpiryField = zoid.create({
     *  tag: 'card-expiry-field',
     *  url: 'https://my-site.com/component/card-fields/expiry'
     * });
     * const CardFields = zoid.create({
     *  tag: 'card-fields',
     *  url: 'https://my-site.com/component/card-fields',
     *  children: () => {
     *      return {
     *          NumberField: CardNumberField,
     *          CVVField: CardCVVField,
     *          ExpiryField: CardExpiryField
     *      };
     *  }
     * });
     * ```
     * These children will now be renderable as children of the parent:
     * ```javascript
     * const cardFields = CardFields({
     *  style: {
     *      borderColor: "red",
     *  },
     * });
     * cardFields.NumberField().render("#card-number-field-container");
     * cardFields.CVVField().render("#card-cvv-field-container");
     * cardFields.ExpiryField().render("#card-expiry-field-container");
     * ```
     * The children will inherit both `props` and `export` from the parent, in `window.xprops.parent`.
     * ```javascript
     * console.log("Parent style:", window.xprops.parent.style);
     * window.xprops.parent.export({
     *  submit: () => {
     *      document.querySelector("form#cardFields").submit();
     *  },
     * });
     * ```
     */
    children?: () => C

    /** ### exports `ExportsDefinition<X>`
     * Used to map exports from the child (passed with `xprops.export(...)`) to properties on the parent component instance.
     * ```javascript
     * const CreatePostForm = zoid.create({
     *  tag: "create-post-form",
     *  url: "https://my-site.com/component/create-post-form",
     *  exports: {
     *      submit: {
     *          type: "function",
     *      },
     *  },
     * });
     * ```
     * Once this mapper is defined, the child window may export values up to the parent:
     * ```javascript
     * window.xprops.export({
     *  submit: () => {
     *      document.querySelector("form#createPost").submit();
     *  },
     * });
     * ```
     * The parent window may call these exports at any time:
     * ```javascript
     * const postForm = CreatePostForm();
     * postForm.render("#create-post-form-container");
     * document.querySelector("button#submitForm").addEventListener("click", () => {
     *  postForm.submit();
     * });
     * ```
     */
    exports?: ExportsDefinition<X>
  }

  export type ZoidComponent<P, X = void, C = void> = {
    /** ## Instantiate `(props : { [string] : any }) => ZoidComponentInstance`
     * Instantiate a component and pass in props.
     *
     * ```javascript
     * const Component = zoid.create({
     *   tag: "my-component",
     *   url: "https://my-site.com/my-component",
     * });
     *
     * const componentInstance = Component({
     *   foo: "bar",
     *   onSomething: () => {
     *     console.log("Something happened!");
     *   },
     * });
     * ```
     *
     * See [Component Instance](./instance.md);
     */
    (props?: PropsInputType<P>): ZoidComponentInstance<P, X, C>

    /** ## driver `(frameworkName : string, dependencies : { ... }) => Driver`
     * Register a component with your framework of choice, so it can be rendered natively in your app.
     *
     * ```javascript
     * import FooFramework from 'foo-framework';
     *
     * const Component = zoid.create({ ... });
     * const FooComponent = Component.driver('foo', { FooFramework });
     *
     * // Now `FooComponent` is natively renderable inside a `FooFramework` app.
     * ```
     *
     * ### React
     *
     * ```javascript
     * let MyReactZoidComponent = MyZoidComponent.driver("react", {
     *   React: React,
     *   ReactDOM: ReactDOM,
     * });
     * ```
     *
     * ```javascript
     * render() {
     *     return (
     *         <MyReactZoidComponent foo="bar" />
     *     );
     * }
     * ```
     *
     * ### Angular 1
     *
     * ```javascript
     * MyZoidComponent.driver('angular', angular);`
     * ```
     *
     * ```html
     * <my-zoid foo="bar"></my-zoid>
     * ```
     *
     * ### Angular 2
     *
     * ```javascript
     * @ng.core.NgModule({
     *     imports: [
     *         ng.platformBrowser.BrowserModule,
     *         MyZoidComponent.driver('angular2', ng.core)
     *     ]
     * });
     * ```
     *
     * ```html
     * <my-zoid [props]="{ foo: 'bar' }"></my-zoid>
     * ```
     *
     * ### Glimmer
     *
     * ```javascript
     * import Component from "@glimmer/component";
     *
     * export default MyZoidComponent.driver("glimmer", Component);
     * ```
     *
     * ```html
     * <my-zoid @foo="{{bar}}"></my-zoid>
     * ```
     *
     * ### Vue
     *
     * ```javascript
     * Vue.component('app', {
     *
     *     components: {
     *         'my-zoid': MyZoidComponent.driver('vue')
     *     }
     * }
     * ```
     *
     * ```html
     * <my-zoid :foo="bar" />
     * ```
     *
     * ### Vue 3
     *
     * ```javascript
     * // Create Vue application
     * const app = Vue.createApp(...)
     *
     * // Define a new component called my-zoid
     * app.component('my-zoid', MyZoidComponent.driver('vue3'))
     *
     * // Mount Vue application
     * app.mount(...)
     * ```
     *
     * ```html
     * <my-zoid :foo="bar" />
     * ```
     */
    driver: <T>(name: string, dep: any) => T

    /** ## isChild `() => boolean`
     * Returns `true` if the window you are currently in is an instance of the component, `false` if not.
     *
     * ```javascript
     * const MyComponent = zoid.create({ ... });
     *
     * if (MyComponent.isChild()) {
     *     console.log('We are currently in a child iframe or popup of MyComponent!')
     * }
     * ```
     */
    isChild: () => boolean

    /** ## xprops `{ [string] : any }`
     * Similar to `window.xprops` -- gives you access to the props passed down to the child window or iframe
     *
     * ```javascript
     * const MyComponent = zoid.create({ ... });
     *
     * console.log(MyComponent.xprops.message);
     * ```
     */
    xprops?: PropsType<P>

    /** ## canRenderTo `(Window) => Promise<boolean>`
     * Returns a promise for a boolean, informing you if it is possible to remotely render the component to a different window.
     *
     * ```javascript
     * const MyComponent = zoid.create({ ... });
     *
     * MyComponent.canRenderTo(window.parent).then(result => {
     *     if (result) {
     *         console.log('We can render to the parent window!');
     *         MyComponent().renderTo(window.parent, '#container');
     *     }
     * });
     * ```
     */
    canRenderTo: (win: CrossDomainWindowType) => ZalgoPromise<boolean>

    /** ## Instances `Array<ZoidComponentInstances>`
     * Provides an array of currently rendered instances of the zoid component
     *
     * ```
     * const MyComponent = zoid.create({ ... });
     *
     * console.log(`There are currently ${ MyComponent.instances.length } active instances of MyComponent`);
     * ```
     */
    instances: ReadonlyArray<ZoidComponentInstance<P, X, C>>
  }

  /** Create a component definition, which will be loaded in both the parent and child windows. */
  export function create<P, X, C>(
    options: ComponentOptionsType<P, X, C>
  ): ZoidComponent<P, X, C>

  export function destroyComponents(err?: any): ZalgoPromise<void>

  export const destroyAll: typeof destroyComponents

  export function destroy(err?: any): ZalgoPromise<void>
}

declare module "zoid/dist/zoid.frame" {
  const content: any
  export = content
}

declare module "zoid/dist/zoid.frame.min" {
  const content: any
  export = content
}

declare module "zoid/dist/zoid.frameworks.frame" {
  const content: any
  export = content
}

declare module "zoid/dist/zoid.frameworks.frame.min" {
  const content: any
  export = content
}

declare module "zoid/dist/zoid.frameworks" {
  const content: any
  export = content
}

declare module "zoid/dist/zoid.frameworks.min" {
  const content: any
  export = content
}

declare module "zoid/dist/zoid" {
  const content: any
  export = content
}

declare module "zoid/dist/zoid.min" {
  const content: any
  export = content
}

declare module "zoid/globals" {
  const content: any
  export = content
}

declare module "zoid/src/babel.config" {
  const content: any
  export = content
}

declare module "zoid/src/child/child" {
  const content: any
  export = content
}

declare module "zoid/src/child" {
  const content: any
  export = content
}

declare module "zoid/src/child/props" {
  const content: any
  export = content
}

declare module "zoid/src/component/component" {
  const content: any
  export = content
}

declare module "zoid/src/component" {
  const content: any
  export = content
}

declare module "zoid/src/component/props" {
  const content: any
  export = content
}

declare module "zoid/src/component/templates/component" {
  const content: any
  export = content
}

declare module "zoid/src/component/templates/container" {
  const content: any
  export = content
}

declare module "zoid/src/component/templates" {
  const content: any
  export = content
}

declare module "zoid/src/component/validate" {
  const content: any
  export = content
}

declare module "zoid/src/constants" {
  const content: any
  export = content
}

declare module "zoid/src/declarations" {
  const content: any
  export = content
}

declare module "zoid/src/drivers/angular" {
  const content: any
  export = content
}

declare module "zoid/src/drivers/angular2" {
  const content: any
  export = content
}

declare module "zoid/src/drivers" {
  const content: any
  export = content
}

declare module "zoid/src/drivers/react" {
  const content: any
  export = content
}

declare module "zoid/src/drivers/vue" {
  const content: any
  export = content
}

declare module "zoid/src/drivers/vue3" {
  const content: any
  export = content
}

declare module "zoid/src/lib/global" {
  const content: any
  export = content
}

declare module "zoid/src/lib" {
  const content: any
  export = content
}

declare module "zoid/src/lib/serialize" {
  const content: any
  export = content
}

declare module "zoid/src/lib/window" {
  const content: any
  export = content
}

declare module "zoid/src/parent" {
  const content: any
  export = content
}

declare module "zoid/src/parent/parent" {
  const content: any
  export = content
}

declare module "zoid/src/parent/props" {
  const content: any
  export = content
}

declare module "zoid/src/types" {
  const content: any
  export = content
}

// Filename aliases
declare module "zoid/dist/zoid.frame.js" {
  const content: any
  export = content
}
declare module "zoid/dist/zoid.frame.min.js" {
  const content: any
  export = content
}
declare module "zoid/dist/zoid.frameworks.frame.js" {
  const content: any
  export = content
}
declare module "zoid/dist/zoid.frameworks.frame.min.js" {
  const content: any
  export = content
}
declare module "zoid/dist/zoid.frameworks.js" {
  const content: any
  export = content
}
declare module "zoid/dist/zoid.frameworks.min.js" {
  const content: any
  export = content
}
declare module "zoid/dist/zoid.js" {
  const content: any
  export = content
}
declare module "zoid/dist/zoid.min.js" {
  const content: any
  export = content
}
declare module "zoid/globals.js" {
  const content: any
  export = content
}
declare module "zoid/index" {
  const content: any
  export = content
}
declare module "zoid/index.js" {
  const content: any
  export = content
}
declare module "zoid/src/babel.config.js" {
  const content: any
  export = content
}
declare module "zoid/src/child/child.js" {
  const content: any
  export = content
}
declare module "zoid/src/child/index" {
  const content: any
  export = content
}
declare module "zoid/src/child/index.js" {
  const content: any
  export = content
}
declare module "zoid/src/child/props.js" {
  const content: any
  export = content
}
declare module "zoid/src/component/component.js" {
  const content: any
  export = content
}
declare module "zoid/src/component/index" {
  const content: any
  export = content
}
declare module "zoid/src/component/index.js" {
  const content: any
  export = content
}
declare module "zoid/src/component/props.js" {
  const content: any
  export = content
}
declare module "zoid/src/component/templates/component.js" {
  const content: any
  export = content
}
declare module "zoid/src/component/templates/container.js" {
  const content: any
  export = content
}
declare module "zoid/src/component/templates/index" {
  const content: any
  export = content
}
declare module "zoid/src/component/templates/index.js" {
  const content: any
  export = content
}
declare module "zoid/src/component/validate.js" {
  const content: any
  export = content
}
declare module "zoid/src/constants.js" {
  const content: any
  export = content
}
declare module "zoid/src/declarations.js" {
  const content: any
  export = content
}
declare module "zoid/src/drivers/angular.js" {
  const content: any
  export = content
}
declare module "zoid/src/drivers/angular2.js" {
  const content: any
  export = content
}
declare module "zoid/src/drivers/index" {
  const content: any
  export = content
}
declare module "zoid/src/drivers/index.js" {
  const content: any
  export = content
}
declare module "zoid/src/drivers/react.js" {
  const content: any
  export = content
}
declare module "zoid/src/drivers/vue.js" {
  const content: any
  export = content
}
declare module "zoid/src/drivers/vue" {
  const content: any
  export = content
}

declare module "zoid/src/drivers/vue3" {
  const content: any
  export = content
}

declare module "zoid/src/index" {
  const content: any
  export = content
}

declare module "zoid/src/lib/global" {
  const content: any
  export = content
}

declare module "zoid/src/lib" {
  const content: any
  export = content
}

declare module "zoid/src/lib/serialize" {
  const content: any
  export = content
}

declare module "zoid/src/lib/window" {
  const content: any
  export = content
}

declare module "zoid/src/parent" {
  const content: any
  export = content
}

declare module "zoid/src/parent/parent" {
  const content: any
  export = content
}

declare module "zoid/src/parent/props" {
  const content: any
  export = content
}

declare module "zoid/src/types" {
  const content: any
  export = content
}

// Filename aliases
declare module "zoid/dist/zoid.frame.js" {
  const content: any
  export = content
}
declare module "zoid/dist/zoid.frame.min.js" {
  const content: any
  export = content
}
declare module "zoid/dist/zoid.frameworks.frame.js" {
  const content: any
  export = content
}
declare module "zoid/dist/zoid.frameworks.frame.min.js" {
  const content: any
  export = content
}
declare module "zoid/dist/zoid.frameworks.js" {
  const content: any
  export = content
}
declare module "zoid/dist/zoid.frameworks.min.js" {
  const content: any
  export = content
}
declare module "zoid/dist/zoid.js" {
  const content: any
  export = content
}
declare module "zoid/dist/zoid.min.js" {
  const content: any
  export = content
}
declare module "zoid/globals.js" {
  const content: any
  export = content
}
declare module "zoid/index.js" {
  const content: any
  export = content
}
declare module "zoid/src/babel.config.js" {
  const content: any
  export = content
}
declare module "zoid/src/child/child.js" {
  const content: any
  export = content
}
declare module "zoid/src/child/index.js" {
  const content: any
  export = content
}
declare module "zoid/src/child/props.js" {
  const content: any
  export = content
}
declare module "zoid/src/component/component.js" {
  const content: any
  export = content
}
declare module "zoid/src/component/index.js" {
  const content: any
  export = content
}
declare module "zoid/src/component/props.js" {
  const content: any
  export = content
}
declare module "zoid/src/component/templates/component.js" {
  const content: any
  export = content
}
declare module "zoid/src/component/templates/container.js" {
  const content: any
  export = content
}
declare module "zoid/src/component/templates/index.js" {
  const content: any
  export = content
}
declare module "zoid/src/component/validate.js" {
  const content: any
  export = content
}
declare module "zoid/src/constants.js" {
  const content: any
  export = content
}
declare module "zoid/src/declarations.js" {
  const content: any
  export = content
}
declare module "zoid/src/drivers/angular.js" {
  const content: any
  export = content
}
declare module "zoid/src/drivers/angular2.js" {
  const content: any
  export = content
}
declare module "zoid/src/drivers/index.js" {
  const content: any
  export = content
}
declare module "zoid/src/drivers/react.js" {
  const content: any
  export = content
}
declare module "zoid/src/drivers/vue.js" {
  const content: any
  export = content
}
declare module "zoid/src/drivers/vue3.js" {
  const content: any
  export = content
}
declare module "zoid/src/index.js" {
  const content: any
  export = content
}
declare module "zoid/src/lib/global.js" {
  const content: any
  export = content
}
declare module "zoid/src/lib/index.js" {
  const content: any
  export = content
}
declare module "zoid/src/lib/serialize.js" {
  const content: any
  export = content
}
declare module "zoid/src/lib/window.js" {
  const content: any
  export = content
}
declare module "zoid/src/parent/index.js" {
  const content: any
  export = content
}
declare module "zoid/src/parent/parent.js" {
  const content: any
  export = content
}
declare module "zoid/src/parent/props.js" {
  const content: any
  export = content
}
declare module "zoid/src/types.js" {
  const content: any
  export = content
}
