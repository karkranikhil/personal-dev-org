import { LightningElement, api } from "lwc";

const VARIANTS = {
  default: "shaded",
  valid: ["base", "shaded"]
};

export default class EsExpandableSection extends LightningElement {
  /**
   * The title can include text, and is displayed in the header.
   *
   * @type {string}
   * @public
   */
  @api title;

  _closed = false;
  _collapsible = false;
  _variant = VARIANTS.default;

  /**
   * If present, close the section.
   *
   * @type {boolean}
   * @public
   * @default false
   */
  @api
  get closed() {
    return this._closed;
  }

  set closed(value) {
    this._closed = this.normalizeBoolean(value);
  }

  /**
   * If present, the section is collapsible.
   *
   * @type {boolean}
   * @public
   * @default false
   */
  @api
  get collapsible() {
    return this._collapsible;
  }

  set collapsible(value) {
    this._collapsible = this.normalizeBoolean(value);
  }

  /**
   * Variant of the section. Valid values include base and shaded.
   *
   * @type {string}
   * @public
   * @default base
   */
  @api
  get variant() {
    return this._variant;
  }

  set variant(value) {
    this._variant = this.normalizeString(value, {
      validValues: VARIANTS.valid,
      fallbackValues: VARIANTS.default
    });
  }

  /**
   * Computed list of the section classes.
   *
   * @type {string}
   * @default slds-section
   */
  get sectionClass() {
    return this.classSet("slds-section")
      .add({
        "slds-is-open": !this.collapsible || !this.closed
      })
      .toString();
  }

  /**
   * Computed list of the header classes.
   *
   * @type {string}
   * @default slds-section__title
   */
  get headerClass() {
    return this.classSet("slds-section__title")
      .add({
        "slds-theme_shade": !this.collapsible && this.variant === "shaded",
        "es-expandable-section__header_collapsible": this.collapsible
      })
      .add(`es-expandable-section__header_${this._variant}`)
      .toString();
  }

  /**
   * Computed list of the title classes, when the section is collapsible and the title is a button.
   *
   * @type {string}
   * @default slds-button slds-section__title-action
   */
  get titleButtonClass() {
    return this.classSet("slds-button slds-section__title-action")
      .add({
        "slds-theme_default es-expandable-section__title-button_base":
          this.variant === "base"
      })
      .toString();
  }

  /**
   * If true, the header is visible.
   *
   * @type {boolean}
   * @default false
   */
  get showHeader() {
    return this.title || this.collapsible;
  }

  /**
   * Section change status toggle.
   */
  toggleSection() {
    this._closed = !this._closed;

    /**
     * The event fired when the expandable section is closed or opened.
     *
     * @event
     * @name toggle
     * @param {boolean} closed
     * @public
     */
    this.dispatchEvent(
      new CustomEvent("toggle", {
        detail: {
          closed: this._closed
        }
      })
    );
  }

  //! Utility Methods

  normalizeString(value, config = {}) {
    const { fallbackValue = "", validValues, toLowerCase = true } = config;
    let normalized = (typeof value === "string" && value.trim()) || "";
    normalized = toLowerCase ? normalized.toLowerCase() : normalized;
    if (validValues && validValues.indexOf(normalized) === -1) {
      normalized = fallbackValue;
    }
    return normalized;
  }

  normalizeBoolean(value) {
    return typeof value === "string" || !!value;
  }
  classSet(config) {
    const proto = {
      add(className) {
        if (typeof className === "string") {
          this[className] = true;
        } else {
          Object.assign(this, className);
        }
        return this;
      },
      invert() {
        Object.keys(this).forEach((key) => {
          this[key] = !this[key];
        });
        return this;
      },
      toString() {
        return Object.keys(this)
          .filter((key) => this[key])
          .join(" ");
      }
    };
    if (typeof config === "string") {
      const key = config;
      config = {};
      config[key] = true;
    }
    return Object.assign(Object.create(proto), config);
  }
}
