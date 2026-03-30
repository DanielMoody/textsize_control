# Textsize Control

A lightweight Drupal module that provides user-adjustable text scaling with intelligent fallback strategies.

This module adds a small floating UI (`A- / A / A+`) that allows users to dynamically adjust text size across the site. It is designed to work across a wide range of themes, including those that rely on `rem`, `em`, or fixed `px` units.

---
## Installation
Install via Composer:

`composer require cms-alchemy/textsize-control`
## Features

- Persistent text scaling via `localStorage`
- Three scaling strategies:
  - Root font-size scaling (preferred)
  - Class-based scaling fallback
  - Transform-based scaling (last resort)
- Automatic detection of whether scaling is effective
- Minimal UI injected on page load
- No configuration required

---

## How It Works

The module attaches a Drupal behavior that:

1. Injects a control UI into the page (`A-`, `A`, `A+`)
2. Tracks the current scale and mode in `localStorage`
3. Applies scaling using a CSS variable (`--text-scale`)
4. Attempts scaling in this order:
   - Root (`html { font-size }`)
   - Class-based (`.textsize-mode-class`)
   - Transform (`scale()`)

If root scaling does not visibly affect the page, the module automatically falls back to alternative methods.
