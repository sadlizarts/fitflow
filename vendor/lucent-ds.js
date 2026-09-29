/* @ds-bundle: {"format":4,"namespace":"LucentDesignSystem_e8cb5c","components":[{"name":"Wordmark","sourcePath":"components/brand/Wordmark.jsx"},{"name":"SegmentedControl","sourcePath":"components/controls/SegmentedControl.jsx"},{"name":"Select","sourcePath":"components/controls/Select.jsx"},{"name":"MeterBar","sourcePath":"components/data/MeterBar.jsx"},{"name":"StatTile","sourcePath":"components/data/StatTile.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"Progress","sourcePath":"components/feedback/Progress.jsx"},{"name":"Tag","sourcePath":"components/feedback/Tag.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"RadioGroup","sourcePath":"components/forms/RadioGroup.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"},{"name":"NavList","sourcePath":"components/navigation/NavList.jsx"},{"name":"SidebarNav","sourcePath":"components/navigation/SidebarNav.jsx"},{"name":"Stepper","sourcePath":"components/navigation/Stepper.jsx"},{"name":"Modal","sourcePath":"components/overlays/Modal.jsx"},{"name":"Avatar","sourcePath":"components/structure/Avatar.jsx"},{"name":"Tabs","sourcePath":"components/structure/Tabs.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"ProductTile","sourcePath":"components/surfaces/ProductTile.jsx"}],"sourceHashes":{"components/brand/Wordmark.jsx":"60945e8bdf6d","components/controls/SegmentedControl.jsx":"b5932e09bdb0","components/controls/Select.jsx":"f6efc6eb0007","components/data/MeterBar.jsx":"59449be0aeb4","components/data/StatTile.jsx":"436acb2db849","components/feedback/Badge.jsx":"20a3274135f3","components/feedback/Progress.jsx":"5360071e053e","components/feedback/Tag.jsx":"d714fc8c5bf6","components/feedback/Tooltip.jsx":"4eeb5037765e","components/forms/Button.jsx":"7dd9ed50f8fd","components/forms/Checkbox.jsx":"7a6be4b72a70","components/forms/IconButton.jsx":"035b9022d516","components/forms/Input.jsx":"6ac5e8ac6057","components/forms/RadioGroup.jsx":"35261446fc0c","components/forms/Switch.jsx":"f975b2c526cb","components/forms/Textarea.jsx":"f621c21a971b","components/navigation/NavBar.jsx":"abc0bb54508c","components/navigation/NavList.jsx":"42fbb38f36f3","components/navigation/SidebarNav.jsx":"001faa7f3dc7","components/navigation/Stepper.jsx":"7a9b34a4c036","components/overlays/Modal.jsx":"c1e3dc4c7f68","components/structure/Avatar.jsx":"9cabf4f70a2a","components/structure/Tabs.jsx":"6ff0d3230846","components/surfaces/Card.jsx":"a322a235d85d","components/surfaces/ProductTile.jsx":"0683d2ea7ee4","ui_kits/dashboard/ConsoleShell.jsx":"2c771334956a","ui_kits/marketing/HeroScreen.jsx":"763f7cf47d89","ui_kits/marketing/LayersScreen.jsx":"9f27c3845973","ui_kits/marketing/MenuScreen.jsx":"e0087421f692","ui_kits/marketing/ShowcaseScreen.jsx":"fcd851dbad70","ui_kits/marketing/icons.jsx":"55604c42c967"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.LucentDesignSystem_e8cb5c = window.LucentDesignSystem_e8cb5c || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Wordmark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — Wordmark
 * The brand name set in type. No supplied logo mark (see readme).
 */
function Wordmark({
  size = 'md',
  tagline = false,
  color = 'var(--text-primary)',
  style = {},
  ...rest
}) {
  const sizes = {
    sm: 16,
    md: 22,
    lg: 34
  };
  const fs = sizes[size] || sizes.md;
  const tag = tagline === true ? 'design system' : tagline;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 800,
      fontSize: fs,
      letterSpacing: '0.42em',
      textTransform: 'uppercase',
      color,
      lineHeight: 1,
      paddingLeft: '0.42em'
    }
  }, "Lucent"), tag && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: Math.max(9, fs * 0.32),
      letterSpacing: '0.28em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginTop: 10,
      paddingLeft: '0.28em'
    }
  }, tag));
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/controls/SegmentedControl.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — SegmentedControl
 * Mono, boxed multi-option toggle. Active segment gets a gold (warm) or
 * white (cool) accent. Generic — role pickers, view switches, axis toggles.
 */
function SegmentedControl({
  options = [],
  value,
  onChange,
  accent = 'warm',
  // 'warm' (gold) | 'cool' (white)
  size = 'md',
  style = {},
  ...rest
}) {
  const norm = options.map(o => typeof o === 'string' ? {
    value: o,
    label: o
  } : o);
  const pads = {
    sm: '7px 14px',
    md: '9px 20px',
    lg: '12px 26px'
  };
  const fss = {
    sm: 12,
    md: 13,
    lg: 14
  };
  const activeInk = accent === 'cool' ? 'var(--text-primary)' : 'var(--gold-400)';
  const activeBorder = accent === 'cool' ? 'var(--border-strong)' : 'var(--border-warm)';
  const activeFill = accent === 'cool' ? 'var(--surface-raised)' : 'var(--interactive-warm-soft)';
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    style: {
      display: 'inline-flex',
      padding: 4,
      gap: 4,
      background: 'var(--surface-raised)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-mono)',
      ...style
    }
  }, rest), norm.map(o => {
    const active = o.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: o.value,
      role: "tab",
      "aria-selected": active,
      onClick: () => onChange && onChange(o.value),
      style: {
        padding: pads[size],
        fontSize: fss[size],
        lineHeight: 1,
        letterSpacing: '0.04em',
        cursor: 'pointer',
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'var(--font-mono)',
        color: active ? activeInk : 'var(--text-muted)',
        background: active ? activeFill : 'transparent',
        border: `1px solid ${active ? activeBorder : 'transparent'}`,
        fontWeight: active ? 600 : 500,
        transition: 'color var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)'
      },
      onMouseEnter: e => {
        if (!active) e.currentTarget.style.color = 'var(--text-secondary)';
      },
      onMouseLeave: e => {
        if (!active) e.currentTarget.style.color = 'var(--text-muted)';
      }
    }, o.label);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/controls/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/controls/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — Select
 * Dark, hairline-bordered native select with a chevron. Optional mono label.
 */
function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  size = 'md',
  disabled = false,
  style = {},
  ...rest
}) {
  const norm = options.map(o => typeof o === 'string' ? {
    value: o,
    label: o
  } : o);
  const pads = {
    sm: '9px 34px 9px 12px',
    md: '13px 40px 13px 16px',
    lg: '16px 44px 16px 18px'
  };
  const fss = {
    sm: 13,
    md: 15,
    lg: 16
  };
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-label)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-label)',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    value: value,
    onChange: onChange,
    disabled: disabled,
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: '100%',
      boxSizing: 'border-box',
      padding: pads[size],
      fontSize: fss[size],
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-primary)',
      background: 'var(--surface-raised)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      outline: 'none',
      transition: 'border-color var(--dur-base) var(--ease-out)'
    },
    onFocus: e => {
      e.currentTarget.style.borderColor = 'var(--border-warm)';
    },
    onBlur: e => {
      e.currentTarget.style.borderColor = 'var(--border-default)';
    }
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), norm.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--text-muted)",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      position: 'absolute',
      right: 14,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  }))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/controls/Select.jsx", error: String((e && e.message) || e) }); }

// components/data/MeterBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — MeterBar
 * Labelled horizontal value bar. Track is dark; fill color is semantic
 * (positive/negative/highlight or any token). Generic for any ratio/percent.
 */
function MeterBar({
  label,
  value = 0,
  // 0–100
  max = 100,
  color = 'var(--data-positive)',
  valueText,
  size = 'md',
  style = {},
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  const h = {
    sm: 6,
    md: 8,
    lg: 10
  }[size] || 8;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, rest), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)',
      width: 34,
      flex: 'none'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: h,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--chart-track)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + '%',
      height: '100%',
      borderRadius: 'var(--radius-pill)',
      background: color,
      transition: 'width var(--dur-slow) var(--ease-out)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: 15,
      color,
      width: 48,
      textAlign: 'right',
      flex: 'none'
    }
  }, valueText != null ? valueText : Math.round(pct) + '%'));
}
Object.assign(__ds_scope, { MeterBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/MeterBar.jsx", error: String((e && e.message) || e) }); }

// components/data/StatTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — StatTile
 * Mono uppercase label + big serif number + caption. Optional gold-accent
 * highlight border. Supports a paired value (e.g. "20% · 73%").
 */
function StatTile({
  label,
  value,
  value2,
  caption,
  unit,
  unit2,
  highlight = false,
  valueColor = 'var(--text-primary)',
  value2Color = 'var(--data-negative)',
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: highlight ? 'var(--surface-warm-hi)' : 'var(--surface-card)',
      border: `1px solid ${highlight ? 'var(--border-warm)' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-md)',
      padding: '18px 20px',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, rest), highlight && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 3,
      background: 'var(--gold-500)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-label)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-label)',
      color: 'var(--text-muted)',
      marginBottom: 12
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 40,
      lineHeight: 1,
      color: valueColor,
      letterSpacing: '-0.01em'
    }
  }, value, unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      marginLeft: 2
    }
  }, unit)), value2 != null && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)',
      fontSize: 20
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 40,
      lineHeight: 1,
      color: value2Color,
      letterSpacing: '-0.01em'
    }
  }, value2, unit2 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      marginLeft: 2
    }
  }, unit2)))), caption && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)',
      marginTop: 10
    }
  }, caption));
}
Object.assign(__ds_scope, { StatTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatTile.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — Badge
 * Tracked-mono status marker. The "NEW LAUNCH" block on the launch banner.
 */
function Badge({
  children,
  variant = 'solid',
  style = {},
  ...rest
}) {
  const variants = {
    solid: {
      background: 'var(--ink-900)',
      color: 'var(--white)',
      border: '1px solid var(--ink-900)'
    },
    invert: {
      background: 'var(--white)',
      color: 'var(--ink-900)',
      border: '1px solid var(--white)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-default)'
    },
    accent: {
      background: 'var(--cobalt-500)',
      color: 'var(--white)',
      border: '1px solid var(--cobalt-500)'
    },
    signal: {
      background: 'var(--orange-600)',
      color: 'var(--white)',
      border: '1px solid var(--orange-600)'
    }
  };
  const v = variants[variant] || variants.solid;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '6px 12px',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-label)',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-label)',
      lineHeight: 1,
      borderRadius: 'var(--radius-xs)',
      ...v,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Progress.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — Progress
 * Linear determinate bar. Gold by default; pass a data-viz token for color.
 */
function Progress({
  value = 0,
  max = 100,
  color = 'var(--gold-500)',
  size = 'md',
  style = {},
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  const h = {
    sm: 4,
    md: 6,
    lg: 8
  }[size] || 6;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "progressbar",
    "aria-valuenow": value,
    "aria-valuemax": max,
    style: {
      width: '100%',
      height: h,
      borderRadius: 999,
      background: 'var(--chart-track)',
      overflow: 'hidden',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + '%',
      height: '100%',
      borderRadius: 999,
      background: color,
      transition: 'width var(--dur-slow) var(--ease-out)'
    }
  }));
}
Object.assign(__ds_scope, { Progress });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Progress.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — Tag
 * Pill category chip with an optional status dot.
 */
function Tag({
  children,
  dot = false,
  dotColor = 'var(--success)',
  active = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '7px 14px',
      fontFamily: 'var(--font-sans)',
      fontSize: '13px',
      fontWeight: 500,
      lineHeight: 1,
      borderRadius: 'var(--radius-pill)',
      background: active ? 'var(--surface-card)' : 'transparent',
      color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
      border: `1px solid ${active ? 'var(--border-strong)' : 'var(--border-default)'}`,
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: dotColor,
      flex: 'none'
    }
  }), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
/**
 * Lucent — Tooltip
 * Hover label on a dark overlay surface. Wraps any trigger element.
 */
function Tooltip({
  label,
  children,
  side = 'top',
  style = {}
}) {
  const [s, setS] = React.useState(false);
  const pos = side === 'bottom' ? {
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%) translateY(8px)'
  } : {
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-8px)'
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    },
    onMouseEnter: () => setS(true),
    onMouseLeave: () => setS(false)
  }, children, s && /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      ...pos,
      whiteSpace: 'nowrap',
      zIndex: 50,
      background: 'var(--surface-overlay)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-sm)',
      padding: '6px 10px',
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      boxShadow: 'var(--shadow-md)',
      ...style
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — Button
 * White-pill primary on dark, cobalt accent, hairline secondary, and ghost.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '8px 16px',
      fontSize: '13px',
      height: '36px',
      gap: '8px'
    },
    md: {
      padding: '11px 22px',
      fontSize: '14px',
      height: '44px',
      gap: '9px'
    },
    lg: {
      padding: '15px 30px',
      fontSize: '15px',
      height: '54px',
      gap: '10px'
    }
  };
  const variants = {
    primary: {
      background: 'var(--interactive-primary)',
      color: 'var(--interactive-primary-ink)',
      border: '1px solid var(--interactive-primary)'
    },
    accent: {
      background: 'var(--interactive-accent)',
      color: 'var(--interactive-accent-ink)',
      border: '1px solid var(--interactive-accent)',
      boxShadow: 'var(--glow-blue)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-strong)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent'
    },
    danger: {
      background: 'var(--danger)',
      color: 'var(--white)',
      border: '1px solid var(--danger)'
    }
  };
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      height: s.height,
      padding: s.padding,
      width: fullWidth ? '100%' : 'auto',
      fontFamily: 'var(--font-sans)',
      fontSize: s.fontSize,
      fontWeight: 600,
      letterSpacing: '0.01em',
      lineHeight: 1,
      borderRadius: 'var(--radius-pill)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      transition: 'transform var(--dur-fast) var(--ease-out), background var(--dur-base) var(--ease-out), opacity var(--dur-base) var(--ease-out)',
      whiteSpace: 'nowrap',
      ...v,
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'scale(0.97)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'scale(1)';
    }
  }, rest), iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, iconLeft), children, iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — Checkbox
 * Square multi-select control with a gold checked fill.
 */
function Checkbox({
  checked = false,
  onChange,
  disabled = false,
  label,
  style = {},
  ...rest
}) {
  const toggle = () => {
    if (!disabled && onChange) onChange(!checked);
  };
  return /*#__PURE__*/React.createElement("label", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-secondary)',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    onClick: toggle,
    role: "checkbox",
    "aria-checked": checked,
    style: {
      width: 18,
      height: 18,
      flex: 'none',
      borderRadius: 'var(--radius-xs)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: checked ? 'var(--gold-500)' : 'transparent',
      border: '1.5px solid ' + (checked ? 'var(--gold-500)' : 'var(--border-strong)'),
      transition: 'background var(--dur-fast) var(--ease-out)'
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--umber-950)",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 13l4 4L19 7"
  }))), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — IconButton
 * Square, hairline-bordered control for single glyphs (menu, close, plus).
 * Icon-agnostic: pass a Lucide/SVG node as children.
 */
function IconButton({
  children,
  size = 'md',
  variant = 'outline',
  ariaLabel,
  disabled = false,
  onClick,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: 34,
    md: 44,
    lg: 54
  };
  const dim = sizes[size] || sizes.md;
  const variants = {
    outline: {
      background: 'transparent',
      border: '1px solid var(--border-default)',
      color: 'var(--text-primary)'
    },
    solid: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      color: 'var(--text-primary)'
    },
    ghost: {
      background: 'transparent',
      border: '1px solid transparent',
      color: 'var(--text-secondary)'
    }
  };
  const v = variants[variant] || variants.outline;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": ariaLabel,
    disabled: disabled,
    onClick: onClick,
    style: {
      width: dim,
      height: dim,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-sm)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      transition: 'background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
      ...v,
      ...style
    },
    onMouseEnter: e => {
      if (!disabled) e.currentTarget.style.background = 'var(--interactive-ghost-hover)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = v.background;
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — Input
 * Underline-forward field on dark surfaces, with optional tracked-mono label.
 */
function Input({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  disabled = false,
  error = '',
  style = {},
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-label)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-label)',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      width: '100%',
      boxSizing: 'border-box',
      background: 'transparent',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      fontSize: '16px',
      fontWeight: 500,
      padding: '10px 2px',
      border: 'none',
      borderBottom: `1.5px solid ${error ? 'var(--danger)' : focused ? 'var(--text-primary)' : 'var(--border-default)'}`,
      outline: 'none',
      opacity: disabled ? 0.4 : 1,
      transition: 'border-color var(--dur-base) var(--ease-out)'
    }
  }, rest)), error && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px',
      color: 'var(--danger)'
    }
  }, error));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/RadioGroup.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — RadioGroup
 * Single-choice control. Options are strings or {value,label}.
 */
function RadioGroup({
  options = [],
  value,
  onChange,
  disabled = false,
  style = {},
  ...rest
}) {
  const norm = options.map(o => typeof o === 'string' ? {
    value: o,
    label: o
  } : o);
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "radiogroup",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, rest), norm.map(o => {
    const sel = o.value === value;
    return /*#__PURE__*/React.createElement("label", {
      key: o.value,
      onClick: () => {
        if (!disabled && onChange) onChange(o.value);
      },
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 14,
        color: 'var(--text-secondary)',
        opacity: disabled ? 0.5 : 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 18,
        height: 18,
        flex: 'none',
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1.5px solid ' + (sel ? 'var(--gold-500)' : 'var(--border-strong)')
      }
    }, sel && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: 'var(--gold-500)'
      }
    })), o.label);
  }));
}
Object.assign(__ds_scope, { RadioGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/RadioGroup.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — Switch
 * Gold toggle for binary settings. Optional trailing label.
 */
function Switch({
  checked = false,
  onChange,
  disabled = false,
  label,
  size = 'md',
  style = {},
  ...rest
}) {
  const w = size === 'sm' ? 36 : 44,
    h = size === 'sm' ? 20 : 24,
    k = h - 6;
  const toggle = () => {
    if (!disabled && onChange) onChange(!checked);
  };
  return /*#__PURE__*/React.createElement("label", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: label ? 10 : 0,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-secondary)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    onClick: toggle,
    role: "switch",
    "aria-checked": checked,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      width: w,
      height: h,
      borderRadius: 999,
      padding: 3,
      boxSizing: 'border-box',
      flex: 'none',
      background: checked ? 'var(--gold-500)' : 'var(--ink-700)',
      border: '1px solid ' + (checked ? 'var(--gold-500)' : 'var(--border-default)'),
      opacity: disabled ? 0.4 : 1,
      transition: 'background var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: k,
      height: k,
      borderRadius: '50%',
      background: checked ? 'var(--umber-950)' : 'var(--steel-300)',
      transform: `translateX(${checked ? w - h : 0}px)`,
      transition: 'transform var(--dur-base) var(--ease-out)'
    }
  })), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — Textarea
 * Boxed multi-line field with an optional tracked-mono label.
 */
function Textarea({
  label,
  value,
  onChange,
  placeholder = '',
  rows = 4,
  disabled = false,
  error = '',
  style = {},
  ...rest
}) {
  const [f, setF] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-label)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-label)',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("textarea", _extends({
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    rows: rows,
    disabled: disabled,
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: {
      width: '100%',
      boxSizing: 'border-box',
      resize: 'vertical',
      background: 'var(--surface-raised)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      lineHeight: 1.5,
      padding: '12px 14px',
      border: '1px solid ' + (error ? 'var(--danger)' : f ? 'var(--text-primary)' : 'var(--border-default)'),
      borderRadius: 'var(--radius-sm)',
      outline: 'none',
      opacity: disabled ? 0.4 : 1,
      transition: 'border-color var(--dur-base) var(--ease-out)'
    }
  }, rest)), error && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--danger)'
    }
  }, error));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — NavBar
 * Transparent top bar: brand at left, actions at right. Sits over hero imagery.
 */
function NavBar({
  brand,
  right,
  bordered = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      boxSizing: 'border-box',
      padding: '24px 40px',
      borderBottom: bordered ? '1px solid var(--border-subtle)' : 'none',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, brand), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px'
    }
  }, right));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavList.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — NavList
 * The large left-hand menu list (WHAT'S NEW / PAYMENTS …) with active state.
 */
function NavList({
  items = [],
  value,
  onSelect,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("ul", _extends({
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, rest), items.map(it => {
    const key = typeof it === 'string' ? it : it.id;
    const label = typeof it === 'string' ? it : it.label;
    const active = key === value;
    return /*#__PURE__*/React.createElement("li", {
      key: key,
      style: {
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => onSelect && onSelect(key),
      style: {
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        background: active ? 'linear-gradient(90deg, var(--ink-800), transparent)' : 'transparent',
        border: 'none',
        color: active ? 'var(--text-primary)' : 'var(--text-muted)',
        fontFamily: 'var(--font-sans)',
        fontWeight: 700,
        fontSize: '22px',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        padding: '22px 18px',
        transition: 'color var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)'
      },
      onMouseEnter: e => {
        if (!active) e.currentTarget.style.color = 'var(--text-secondary)';
      },
      onMouseLeave: e => {
        if (!active) e.currentTarget.style.color = 'var(--text-muted)';
      }
    }, label));
  }));
}
Object.assign(__ds_scope, { NavList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavList.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SidebarNav.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — SidebarNav
 * Grouped vertical navigation rail. Active item gets a gold left indicator,
 * gold icon, and a soft fill. Generic app shell navigation.
 *
 * groups: [{ label, items: [{ id, label, icon }] }]
 */
function SidebarNav({
  groups = [],
  value,
  onSelect,
  header,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 22,
      padding: '20px 14px',
      fontFamily: 'var(--font-sans)',
      background: 'var(--surface-warm-base)',
      borderRight: '1px solid var(--border-subtle)',
      minWidth: 220,
      boxSizing: 'border-box',
      ...style
    }
  }, rest), header && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 8px 4px'
    }
  }, header), groups.map((g, gi) => /*#__PURE__*/React.createElement("div", {
    key: gi
  }, g.label && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: 'var(--text-faint)',
      padding: '0 10px 10px'
    }
  }, g.label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, g.items.map(it => {
    const active = it.id === value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      type: "button",
      onClick: () => onSelect && onSelect(it.id),
      style: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        textAlign: 'left',
        cursor: 'pointer',
        padding: '10px 12px',
        borderRadius: 'var(--radius-sm)',
        border: 'none',
        background: active ? 'linear-gradient(90deg, rgba(217,155,62,0.16) 0%, rgba(217,155,62,0.04) 55%, rgba(217,155,62,0) 100%)' : 'transparent',
        color: active ? 'var(--text-primary)' : 'var(--text-muted)',
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
        fontWeight: active ? 600 : 500,
        transition: 'color var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)'
      },
      onMouseEnter: e => {
        if (!active) {
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.background = 'var(--interactive-ghost-hover)';
        }
      },
      onMouseLeave: e => {
        if (!active) {
          e.currentTarget.style.color = 'var(--text-muted)';
          e.currentTarget.style.background = 'transparent';
        }
      }
    }, active && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        top: 9,
        bottom: 9,
        width: 2.5,
        borderRadius: 3,
        background: 'var(--gold-500)',
        boxShadow: '0 0 10px rgba(217,155,62,0.6)'
      }
    }), it.icon && /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        color: active ? 'var(--gold-400)' : 'var(--text-muted)'
      }
    }, it.icon), /*#__PURE__*/React.createElement("span", null, it.label));
  })))));
}
Object.assign(__ds_scope, { SidebarNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SidebarNav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Stepper.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — Stepper
 * Horizontal numbered progress. Done = gold outline, active = gold fill,
 * upcoming = muted. Generic multi-step flow header.
 */
function Stepper({
  steps = [],
  current = 0,
  onSelect,
  style = {},
  ...rest
}) {
  const norm = steps.map(s => typeof s === 'string' ? {
    label: s
  } : s);
  return /*#__PURE__*/React.createElement("ol", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 10,
      listStyle: 'none',
      margin: 0,
      padding: 0,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, rest), norm.map((s, i) => {
    const state = i < current ? 'done' : i === current ? 'active' : 'todo';
    const ring = state === 'todo' ? 'var(--border-default)' : 'var(--gold-500)';
    const badgeBg = state === 'active' ? 'var(--gold-500)' : 'transparent';
    const badgeInk = state === 'active' ? 'var(--umber-950)' : state === 'done' ? 'var(--gold-400)' : 'var(--text-muted)';
    const labelInk = state === 'todo' ? 'var(--text-muted)' : 'var(--text-primary)';
    return /*#__PURE__*/React.createElement("li", {
      key: i
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => onSelect && onSelect(i),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 9,
        background: state === 'active' ? 'linear-gradient(180deg, rgba(217,155,62,0.10), rgba(217,155,62,0.03))' : 'transparent',
        border: '1px solid ' + (state === 'active' ? 'rgba(217,155,62,0.30)' : 'transparent'),
        borderRadius: 'var(--radius-pill)',
        padding: '5px 13px 5px 5px',
        cursor: onSelect ? 'pointer' : 'default'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 22,
        height: 22,
        borderRadius: '50%',
        flex: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1.5px solid ${ring}`,
        background: badgeBg,
        color: badgeInk,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 600
      }
    }, state === 'done' ? '✓' : i + 1), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 600,
        color: labelInk,
        whiteSpace: 'nowrap'
      }
    }, s.label)));
  }));
}
Object.assign(__ds_scope, { Stepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Stepper.jsx", error: String((e && e.message) || e) }); }

// components/overlays/Modal.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — Modal
 * General-purpose centered dialog with a scrim. Works for any app:
 * confirmations, forms, detail overlays. Renders nothing when closed.
 */
function Modal({
  open = false,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  size = 'md',
  style = {},
  ...rest
}) {
  if (!open) return null;
  const widths = {
    sm: 380,
    md: 520,
    lg: 720
  };
  const w = widths[size] || widths.md;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'rgba(4, 6, 10, 0.66)',
      backdropFilter: 'blur(4px)',
      animation: 'lucent-modal-fade var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", _extends({
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: w,
      boxSizing: 'border-box',
      background: 'var(--surface-overlay)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-primary)',
      overflow: 'hidden',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 26px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-label)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-label)',
      color: 'var(--text-muted)',
      marginBottom: 8
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: 20,
      letterSpacing: '-0.01em'
    }
  }, title)), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "close",
    onClick: onClose,
    style: {
      width: 34,
      height: 34,
      flex: 'none',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12 M18 6L6 18"
  })))), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--text-secondary)'
    }
  }, children)), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      padding: '16px 26px',
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--surface-raised)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlays/Modal.jsx", error: String((e && e.message) || e) }); }

// components/structure/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — Avatar
 * Circular user image; falls back to initials on a neutral surface.
 */
function Avatar({
  src,
  name = '',
  size = 'md',
  style = {},
  ...rest
}) {
  const dim = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56
  }[size] || 40;
  const initials = name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      width: dim,
      height: dim,
      borderRadius: '50%',
      overflow: 'hidden',
      flex: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--surface-raised)',
      border: '1px solid var(--border-subtle)',
      color: 'var(--text-secondary)',
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      fontSize: Math.round(dim * 0.4),
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/structure/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/structure/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — Tabs
 * Underline tab bar with a gold active indicator. In-page section switch.
 */
function Tabs({
  tabs = [],
  value,
  onChange,
  style = {},
  ...rest
}) {
  const norm = tabs.map(t => typeof t === 'string' ? {
    value: t,
    label: t
  } : t);
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    style: {
      display: 'flex',
      gap: 4,
      borderBottom: '1px solid var(--border-subtle)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, rest), norm.map(t => {
    const a = t.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: t.value,
      role: "tab",
      "aria-selected": a,
      onClick: () => onChange && onChange(t.value),
      style: {
        position: 'relative',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '12px 14px',
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
        fontWeight: a ? 600 : 500,
        color: a ? 'var(--text-primary)' : 'var(--text-muted)',
        transition: 'color var(--dur-base) var(--ease-out)'
      },
      onMouseEnter: e => {
        if (!a) e.currentTarget.style.color = 'var(--text-secondary)';
      },
      onMouseLeave: e => {
        if (!a) e.currentTarget.style.color = 'var(--text-muted)';
      }
    }, t.label, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 10,
        right: 10,
        bottom: -1,
        height: 2,
        borderRadius: 2,
        background: a ? 'var(--gold-500)' : 'transparent'
      }
    }));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/structure/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — Card
 * Hairline-bordered surface for grouped content on dark backgrounds.
 */
function Card({
  children,
  eyebrow,
  title,
  interactive = false,
  padding = 'var(--space-6)',
  style = {},
  onClick,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface-card)',
      border: `1px solid ${interactive && hover ? 'var(--border-strong)' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-card)',
      padding,
      cursor: interactive ? 'pointer' : 'default',
      transform: interactive && hover ? 'translateY(-2px)' : 'translateY(0)',
      boxShadow: interactive && hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      transition: 'transform var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, rest), eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-label)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-label)',
      color: 'var(--text-muted)',
      marginBottom: '10px'
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '18px',
      fontWeight: 700,
      color: 'var(--text-primary)',
      letterSpacing: '-0.01em',
      marginBottom: children ? '8px' : 0
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '14px',
      lineHeight: 1.55,
      color: 'var(--text-secondary)'
    }
  }, children));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/ProductTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucent — ProductTile
 * Square media tile with a tracked label and caption — the LP2 app grid.
 */
function ProductTile({
  media,
  // node: image/video/gradient block
  label,
  caption,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      cursor: onClick ? 'pointer' : 'default',
      fontFamily: 'var(--font-sans)',
      width: '100%',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      aspectRatio: '1 / 1',
      borderRadius: 'var(--radius-sm)',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)',
      background: 'var(--surface-raised)',
      transform: hover ? 'scale(1.015)' : 'scale(1)',
      transition: 'transform var(--dur-slow) var(--ease-out)'
    }
  }, media), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-label)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-label)',
      color: 'var(--text-primary)',
      fontWeight: 500
    }
  }, label), caption && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '13px',
      lineHeight: 1.5,
      color: 'var(--text-muted)',
      marginTop: '8px'
    }
  }, caption)));
}
Object.assign(__ds_scope, { ProductTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/ProductTile.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/ConsoleShell.jsx
try { (() => {
/* Lucent UI kit (warm taste) — generic analytics console shell + hub screen.
   Domain-neutral: works as a template for any dashboard / data product. */
function Ic({
  d,
  size = 18
}) {
  const paths = Array.isArray(d) ? d : [d];
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, paths.map((p, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: p
  })));
}
const D = {
  hub: "M12 3v3 M12 18v3 M3 12h3 M18 12h3 M12 8a4 4 0 100 8 4 4 0 000-8z",
  filter: "M3 5h18 M6 12h12 M10 19h4",
  quality: "M4 18V9 M10 18V4 M16 18v-7",
  trend: "M3 17l6-6 4 4 8-8 M15 7h6v6",
  data: "M4 6h16 M4 12h16 M4 18h16",
  tools: "M14 7l3 3 M5 19l7-7 M14 4l6 6-3 3-6-6z",
  shield: "M12 3l7 3v6c0 4-3 7-7 8-4-1-7-4-7-8V6z"
};
function ConsoleShell() {
  const {
    SidebarNav,
    Stepper,
    SegmentedControl,
    Select,
    StatTile,
    MeterBar,
    Badge
  } = window.LucentDesignSystem_e8cb5c;
  const [view, setView] = React.useState('hub');
  const [step, setStep] = React.useState(1);
  const [scope, setScope] = React.useState('Portfolio');
  const [group, setGroup] = React.useState('all');
  const cards = [{
    name: 'NORTHWIND',
    n: 36,
    a: 25,
    b: 90,
    type: 'Segment A',
    quality: 0.31,
    flags: 13
  }, {
    name: 'MERIDIAN',
    n: 28,
    a: 21,
    b: 74,
    type: 'Segment A',
    quality: 0.26,
    flags: 2
  }, {
    name: 'CALDER',
    n: 26,
    a: 20,
    b: 72,
    type: 'Segment B',
    quality: 0.29,
    flags: 5
  }, {
    name: 'HALCYON',
    n: 31,
    a: 9,
    b: 76,
    type: 'Segment A',
    quality: 0.26,
    flags: 6
  }, {
    name: 'ORINOCO',
    n: 23,
    a: 20,
    b: 60,
    type: 'Segment B',
    quality: 0.25,
    flags: 10
  }, {
    name: 'VESPER',
    n: 16,
    a: 19,
    b: 74,
    type: 'Segment C',
    quality: 0.23,
    flags: 2
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '234px 1fr',
      height: '100%',
      background: 'var(--surface-warm-base)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement(SidebarNav, {
    header: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        letterSpacing: '0.18em',
        color: 'var(--text-faint)',
        textTransform: 'uppercase'
      }
    }, "analytics console"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-serif)',
        fontSize: 24,
        lineHeight: 1
      }
    }, "Insight", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--gold-400)'
      }
    }, "IQ"))),
    value: view,
    onSelect: setView,
    groups: [{
      label: 'start',
      items: [{
        id: 'hub',
        label: 'Overview',
        icon: /*#__PURE__*/React.createElement(Ic, {
          d: D.hub
        })
      }, {
        id: 'engine',
        label: 'Segments',
        icon: /*#__PURE__*/React.createElement(Ic, {
          d: D.filter
        })
      }]
    }, {
      label: 'analysis',
      items: [{
        id: 'quality',
        label: 'Quality',
        icon: /*#__PURE__*/React.createElement(Ic, {
          d: D.quality
        })
      }, {
        id: 'perf',
        label: 'Performance',
        icon: /*#__PURE__*/React.createElement(Ic, {
          d: D.trend
        })
      }]
    }, {
      label: 'data',
      items: [{
        id: 'source',
        label: 'Sources',
        icon: /*#__PURE__*/React.createElement(Ic, {
          d: D.data
        })
      }, {
        id: 'audit',
        label: 'Audit',
        icon: /*#__PURE__*/React.createElement(Ic, {
          d: D.shield
        })
      }]
    }],
    style: {
      height: '100%'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'auto',
      padding: '26px 34px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 20,
      borderBottom: '1px solid var(--border-subtle)',
      paddingBottom: 18
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontWeight: 400,
      fontSize: 26,
      lineHeight: 1.15,
      margin: 0,
      maxWidth: 640
    }
  }, "Defensible metrics & benchmarks \u2014 ", /*#__PURE__*/React.createElement("em", {
    style: {
      color: 'var(--gold-400)'
    }
  }, "built from your own data.")), /*#__PURE__*/React.createElement(Badge, {
    variant: "outline",
    style: {
      color: 'var(--gold-400)',
      borderColor: 'var(--border-warm)',
      flex: 'none'
    }
  }, "Portfolio \xB7 connected")), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '20px 0 8px'
    }
  }, /*#__PURE__*/React.createElement(Stepper, {
    steps: ["Data", "Overview", "Segments", "Quality", "Performance", "Validate", "Save"],
    current: step,
    onSelect: setStep
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.12em',
      color: 'var(--gold-400)',
      textTransform: 'uppercase',
      margin: '20px 0 14px'
    }
  }, "this step \xA0", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      fontFamily: 'var(--font-sans)',
      letterSpacing: 0,
      textTransform: 'none'
    }
  }, "Start here to identify the segments most like your target before deeper analysis.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 14,
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement(StatTile, {
    label: "segments",
    value: "10",
    caption: "core benchmark"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "zones",
    value: "212",
    caption: "161 in use"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "records",
    value: "1,996",
    caption: "test set"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "samples",
    value: "46,570",
    caption: "clean"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "index",
    value: "20",
    unit: "%",
    value2: "73",
    unit2: "%",
    valueColor: "var(--data-positive)",
    value2Color: "var(--data-highlight)",
    highlight: true,
    caption: "median A \xB7 B"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '16px 18px',
      marginBottom: 22,
      background: 'var(--surface-warm-card)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.14em',
      color: 'var(--gold-400)',
      textTransform: 'uppercase',
      marginBottom: 14
    }
  }, "filter \u2014 highlight matching segments"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'flex-end',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(SegmentedControl, {
    options: ["Portfolio", "Watchlist"],
    value: scope,
    onChange: setScope,
    accent: "warm",
    size: "sm"
  }), /*#__PURE__*/React.createElement(Select, {
    label: "group",
    value: group,
    onChange: e => setGroup(e.target.value),
    size: "sm",
    options: [{
      value: 'all',
      label: 'all'
    }, {
      value: 'a',
      label: 'Segment A'
    }, {
      value: 'b',
      label: 'Segment B'
    }, {
      value: 'c',
      label: 'Segment C'
    }]
  }), /*#__PURE__*/React.createElement(Select, {
    label: "type",
    value: "all",
    onChange: () => {},
    size: "sm",
    options: ["all", "sandstone", "carbonate"]
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 14
    }
  }, cards.filter(c => group === 'all' || c.type.toLowerCase().includes(group)).map(c => /*#__PURE__*/React.createElement("div", {
    key: c.name,
    style: {
      background: 'var(--surface-warm-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '18px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 22
    }
  }, c.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-muted)'
    }
  }, c.n, " units")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)',
      marginBottom: 8
    }
  }, "index \xB7 median"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(MeterBar, {
    label: "A",
    value: c.a,
    color: "var(--data-positive)"
  }), /*#__PURE__*/React.createElement(MeterBar, {
    label: "B",
    value: c.b,
    color: "var(--data-highlight)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      borderTop: '1px solid var(--border-subtle)',
      paddingTop: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--gold-500)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 13
    }
  }, c.type), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: c.flags > 8 ? 'var(--data-negative)' : 'var(--text-muted)'
    }
  }, "\u25B8 ", c.flags, " flags")))))));
}
window.ConsoleShell = ConsoleShell;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/ConsoleShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/HeroScreen.jsx
try { (() => {
/* Lucent UI kit — Hero screen (warm architectural void). Generic product hero. */
function HeroScreen({
  onOpenMenu
}) {
  const {
    NavBar,
    Wordmark,
    IconButton,
    Button
  } = window.LucentDesignSystem_e8cb5c;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      background: 'var(--gradient-warm)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0 2px, transparent 2px 60px)',
      opacity: 0.6
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '18%',
      height: '46%',
      background: 'radial-gradient(60% 100% at 50% 100%, rgba(201,160,106,0.35), transparent 70%)'
    }
  }), /*#__PURE__*/React.createElement(NavBar, {
    brand: /*#__PURE__*/React.createElement(Wordmark, {
      size: "sm"
    }),
    right: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '10px 16px',
        border: '1px solid var(--border-default)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--text-secondary)',
        lineHeight: 1.5,
        display: 'block'
      }
    }, "version 2.4", /*#__PURE__*/React.createElement("br", null), "now available")), /*#__PURE__*/React.createElement(IconButton, {
      ariaLabel: "open menu",
      onClick: onOpenMenu
    }, /*#__PURE__*/React.createElement(Icon, {
      d: ICONS.menu
    })))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      textAlign: 'center',
      width: '90%',
      maxWidth: 900
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 'clamp(48px, 8vw, 104px)',
      lineHeight: 1.0,
      letterSpacing: '-0.02em',
      margin: 0,
      fontWeight: 400
    }
  }, "clarity,", /*#__PURE__*/React.createElement("br", null), "by design"), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: 460,
      margin: '28px auto 0',
      fontSize: 18,
      lineHeight: 1.6,
      color: 'var(--text-secondary)'
    }
  }, "A dark-first foundation for building focused, premium interfaces \u2014 calm, precise, and unmistakably crafted."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 34,
      display: 'flex',
      gap: 12,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      d: ICONS.arrow,
      size: 16
    })
  }, "get started"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: onOpenMenu
  }, "explore"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 40,
      right: 40,
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      padding: '18px 22px',
      border: '1px solid var(--border-default)',
      background: 'rgba(0,0,0,0.25)',
      backdropFilter: 'blur(6px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      background: 'repeating-conic-gradient(#0b0c0f 0deg 90deg, #fff 90deg 180deg) 0 0 / 11px 11px',
      border: '3px solid #fff'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 600
    }
  }, "scan to", /*#__PURE__*/React.createElement("br", null), "install")));
}
window.HeroScreen = HeroScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/HeroScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/LayersScreen.jsx
try { (() => {
/* Lucent UI kit — Layers (blueprint grid, generic exploded architecture). */
function LayersScreen({
  onBack
}) {
  const {
    Wordmark,
    IconButton,
    Badge
  } = window.LucentDesignSystem_e8cb5c;
  const rows = ['Interface', 'Screens & flows', 'Components', 'Patterns', 'Tokens', 'Color & type', 'Grid & spacing', 'Motion engine'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      background: 'var(--gradient-blueprint)',
      backgroundImage: 'linear-gradient(rgba(122,150,210,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(122,150,210,0.10) 1px, transparent 1px), var(--gradient-blueprint)',
      backgroundSize: '30px 30px, 30px 30px, cover'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px 40px'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: "sm"
  }), /*#__PURE__*/React.createElement(IconButton, {
    variant: "outline",
    ariaLabel: "back",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(Icon, {
    d: ICONS.close
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '30%',
      top: '50%',
      transform: 'translate(-50%,-50%)'
    }
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 300,
      height: 60,
      marginTop: i === 0 ? 0 : -22,
      transform: `translateX(${i * 14}px)`,
      background: i === 2 ? 'linear-gradient(135deg,#3a3f4a,#c17a45)' : 'var(--gradient-metal)',
      border: '1px solid rgba(255,255,255,0.25)',
      borderRadius: 6,
      boxShadow: '0 12px 30px rgba(0,0,0,0.5)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: -40,
      left: 90,
      width: 60,
      height: 30,
      background: 'var(--gold-500)',
      boxShadow: 'var(--glow-gold)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 60,
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, rows.map(r => /*#__PURE__*/React.createElement("div", {
    key: r,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      border: '1px solid var(--border-strong)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, r)))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 40,
      left: 60
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "signal"
  }, "one system, top to bottom")));
}
window.LayersScreen = LayersScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/LayersScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/MenuScreen.jsx
try { (() => {
/* Lucent UI kit — full-screen Menu overlay (nav list + release banner + feature grid). Generic. */
function MenuScreen({
  onClose,
  onOpenShowcase
}) {
  const {
    Wordmark,
    IconButton,
    NavList,
    Badge,
    ProductTile
  } = window.LucentDesignSystem_e8cb5c;
  const tile = from => /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      background: from
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      background: 'var(--void)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px 40px'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: "sm"
  }), /*#__PURE__*/React.createElement(IconButton, {
    variant: "outline",
    ariaLabel: "close menu",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(Icon, {
    d: ICONS.close
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '340px 1fr',
      gap: 60,
      padding: '20px 40px 40px',
      height: 'calc(100% - 88px)',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement(NavList, {
    items: ["what's new", "product", "solutions", "company", "resources"],
    value: "what's new",
    onSelect: () => {}
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    onClick: onOpenShowcase,
    style: {
      position: 'relative',
      cursor: 'pointer',
      height: 260,
      borderRadius: 'var(--radius-sm)',
      overflow: 'hidden',
      background: 'var(--gradient-banner)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 16,
      left: 16
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "solid"
  }, "new release")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 15,
      letterSpacing: '0.28em',
      textTransform: 'uppercase',
      color: 'var(--white)',
      textAlign: 'center',
      textShadow: '0 2px 12px rgba(0,0,0,0.4)'
    }
  }, "version 2.4", /*#__PURE__*/React.createElement("br", null), "the composed release"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '62%',
      height: 78,
      borderRadius: 8,
      background: 'var(--gradient-metal)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      fontSize: 12,
      letterSpacing: '0.34em',
      color: 'var(--ink-900)'
    }
  }, "LUCENT"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontStyle: 'italic',
      fontSize: 14,
      color: 'var(--ink-900)'
    }
  }, "2.4"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 28,
      marginTop: 34
    }
  }, /*#__PURE__*/React.createElement(ProductTile, {
    label: "analyze",
    caption: "turn raw activity into clear, defensible insight",
    media: tile('radial-gradient(120% 100% at 30% 20%, #7c5cff44, transparent), var(--gradient-blueprint)')
  }), /*#__PURE__*/React.createElement(ProductTile, {
    label: "automate",
    caption: "let routine work run itself, quietly in the background",
    media: tile('radial-gradient(120% 100% at 60% 40%, #2f52c866, transparent), var(--gradient-vignette)')
  }), /*#__PURE__*/React.createElement(ProductTile, {
    label: "collaborate",
    caption: "one shared surface for the whole team",
    media: tile('radial-gradient(120% 100% at 50% 60%, #17b57355, transparent), var(--gradient-vignette)')
  }), /*#__PURE__*/React.createElement(ProductTile, {
    label: "careers",
    caption: "help build the most considered software around",
    media: tile('var(--gradient-warm)')
  })))));
}
window.MenuScreen = MenuScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/MenuScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/ShowcaseScreen.jsx
try { (() => {
/* Lucent UI kit — Showcase (sky gradient, a generic floating product object). */
function ShowcaseScreen({
  onBack,
  onLayers
}) {
  const {
    Wordmark,
    IconButton,
    Button
  } = window.LucentDesignSystem_e8cb5c;
  const Label = ({
    children,
    style
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.55)',
      ...style
    }
  }, children);

  // a generic "product object": a stylized app window, not a credit card
  const ProductObject = () => /*#__PURE__*/React.createElement("div", {
    style: {
      width: 420,
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.18)',
      background: 'linear-gradient(160deg, #12151c, #0b0d12)',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      padding: '12px 14px',
      borderBottom: '1px solid rgba(255,255,255,0.08)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: '50%',
      background: '#3d424e'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: '50%',
      background: '#3d424e'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: '50%',
      background: '#3d424e'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 8,
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.16em',
      color: 'var(--text-muted)',
      textTransform: 'uppercase'
    }
  }, "overview")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10,
      marginBottom: 14
    }
  }, [['active', '1,996'], ['index', '20%']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 6,
      padding: '12px 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      letterSpacing: '0.18em',
      color: 'var(--text-muted)',
      textTransform: 'uppercase'
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 26,
      color: '#fff',
      marginTop: 6
    }
  }, v)))), [70, 46, 88].map((w, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      height: 7,
      borderRadius: 999,
      background: 'var(--chart-track)',
      marginBottom: 9,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: w + '%',
      height: '100%',
      background: i === 2 ? 'var(--data-highlight)' : 'var(--data-positive)'
    }
  })))));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      background: 'var(--gradient-sky)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px 40px'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: "sm"
  }), /*#__PURE__*/React.createElement(IconButton, {
    variant: "outline",
    ariaLabel: "sound"
  }, /*#__PURE__*/React.createElement(Icon, {
    d: ICONS.sound,
    size: 18
  }))), /*#__PURE__*/React.createElement("h2", {
    style: {
      textAlign: 'center',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: 30,
      letterSpacing: '0.28em',
      textTransform: 'uppercase',
      margin: '10px 0 0'
    }
  }, "a reflection of clarity"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '52%',
      left: '50%',
      transform: 'translate(-50%,-46%) rotate(-3deg)'
    }
  }, /*#__PURE__*/React.createElement(ProductObject, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 60,
      top: '46%',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Built on: web standards"), /*#__PURE__*/React.createElement(Label, null, "Theme: adaptive dark"), /*#__PURE__*/React.createElement(Label, null, "Motion: 60fps")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 44,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: onBack,
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      d: ICONS.arrow,
      size: 16,
      style: {
        transform: 'rotate(180deg)'
      }
    })
  }, "back"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onLayers,
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      d: ICONS.arrow,
      size: 16
    })
  }, "see how it's built")));
}
window.ShowcaseScreen = ShowcaseScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/ShowcaseScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/icons.jsx
try { (() => {
/* Lucent UI kit — minimal line-icon set (Lucide-style, 1.6 stroke).
   Exported to window for the sibling screen scripts. */
function Icon({
  d,
  size = 22,
  stroke = 1.6,
  style = {}
}) {
  const paths = Array.isArray(d) ? d : [d];
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: style
  }, paths.map((p, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: p
  })));
}
const ICONS = {
  menu: "M3 6h18 M3 12h18 M3 18h18",
  close: ["M6 6l12 12", "M18 6L6 18"],
  arrow: ["M5 12h14", "M13 6l6 6-6 6"],
  plus: ["M12 5v14", "M5 12h14"],
  sound: ["M4 10v4", "M8 6v12", "M12 3v18", "M16 7v10", "M20 10v4"],
  wallet: ["M3 7h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11", "M17 13h.01"],
  chip: ["M7 4v16 M17 4v16 M4 7h16 M4 17h16", "M9 9h6v6H9z"]
};
Object.assign(window, {
  Icon,
  ICONS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/icons.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.MeterBar = __ds_scope.MeterBar;

__ds_ns.StatTile = __ds_scope.StatTile;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Progress = __ds_scope.Progress;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.RadioGroup = __ds_scope.RadioGroup;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.NavList = __ds_scope.NavList;

__ds_ns.SidebarNav = __ds_scope.SidebarNav;

__ds_ns.Stepper = __ds_scope.Stepper;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.ProductTile = __ds_scope.ProductTile;

})();
