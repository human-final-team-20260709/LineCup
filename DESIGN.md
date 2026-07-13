---
name: Kinetic Industrial
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bccbb9'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#869585'
  outline-variant: '#3d4a3d'
  surface-tint: '#4ae176'
  primary: '#4be277'
  on-primary: '#003915'
  primary-container: '#22c55e'
  on-primary-container: '#004b1e'
  inverse-primary: '#006e2f'
  secondary: '#ffb95f'
  on-secondary: '#472a00'
  secondary-container: '#ee9800'
  on-secondary-container: '#5b3800'
  tertiary: '#ffb4ae'
  on-tertiary: '#68000a'
  tertiary-container: '#ff8a83'
  on-tertiary-container: '#860011'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6bff8f'
  primary-fixed-dim: '#4ae176'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005321'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  data-lg:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  data-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

This design system is engineered for the high-stakes environment of industrial manufacturing. The brand personality is authoritative, precise, and utilitarian, prioritizing rapid information retrieval and operational clarity over decorative elements. 

The aesthetic leverages **Modern Corporate** principles with a lean toward **Technical Minimalism**. It utilizes a strict grid-based structure to organize complex data streams from cup noodle production lines—spanning mixing, steaming, drying, and packaging phases. The UI must evoke a sense of "Mission Control," providing operators with a high-contrast, low-fatigue environment suitable for long-duration monitoring. High-visibility accents are used sparingly but decisively to signal machine health and throughput anomalies.

## Colors

The palette is optimized for a dark-room monitoring environment. The background uses a deep navy-black to minimize screen glare and eye strain. 

- **Status Primary (Green):** Used exclusively for "Nominal" operations and successful cycles.
- **Status Warning (Amber):** Used for maintenance alerts, nearing thresholds, or minor line stutters.
- **Status Alarm (Red):** Reserved for critical stops, safety violations, or hardware failures.
- **Surface & Borders:** A range of slate grays provides structural definition without the harshness of pure white lines. Text should primarily use high-contrast off-whites for maximum legibility.

## Typography

The typography system relies on **Inter** for its exceptional legibility in dense interfaces. A secondary monospaced font, **JetBrains Mono**, is introduced for numerical data, sensor readouts, and timestamps to ensure that digits align vertically for easy comparison across rows.

Large display sizes are reserved for "Total Throughput" or "OEE (Overall Equipment Effectiveness)" metrics. Labels should frequently use the `label-caps` style to provide clear, categorized metadata without competing with the primary data values.

## Layout & Spacing

The design system utilizes a **12-column fluid grid** for the main dashboard dashboard. However, internal card layouts should follow a strict 4px/8px incremental rhythm to maintain density. 

- **Desktop:** 12-column grid, 16px gutters. Widgets typically span 3, 4, or 6 columns.
- **Tablet:** 6-column grid, 16px gutters.
- **Mobile:** 2-column grid, 12px gutters.

The layout prioritizes "above the fold" visibility for critical status indicators. Data-heavy tables should use "compact" spacing with 8px vertical padding to maximize the number of visible rows on a single screen.

## Elevation & Depth

To maintain a "flat and functional" industrial feel, this design system eschews traditional shadows in favor of **Tonal Layering** and **Low-Contrast Outlines**.

1.  **Level 0 (Background):** The darkest color (`#020617`), representing the physical screen.
2.  **Level 1 (Surface/Card):** A slightly lighter navy (`#1E293B`) with a 1px border (`#334155`). 
3.  **Level 2 (Active/Hover):** Interactive elements use a subtle inner-glow or a brighter border rather than a drop shadow.
4.  **Emphasis:** Critical alerts "pop" using high-saturation background fills (e.g., a solid Red background for an Alarm state) rather than depth.

## Shapes

The shape language is "Soft-Industrial." Components use a consistent 4px (`rounded-sm`) radius to feel modern and professional without appearing "friendly" or "playful" like a consumer app. 

Buttons and input fields use the same 4px radius. Status indicators (dots) and specific toggle switches may use pill-shapes to distinguish them from structural data containers.

## Components

- **Buttons:** Primary buttons use a solid slate-gray background with white text. Action-specific buttons (e.g., "STOP LINE") use a solid Red.
- **Status Chips:** Small, high-contrast badges. Use `data-sm` typography. They consist of a subtle tinted background with a 100% opacity text color of the same hue.
- **Data Cards:** The workhorse of the dashboard. Must include a header with `label-caps` text and a main body area for large `data-lg` readouts or sparkline charts.
- **Sparklines:** Compact, monochromatic line charts embedded in cards to show 30-minute trends without full axes.
- **Input Fields:** Darker than the surface color with a 1px slate border. Focus state is indicated by a 1px primary-color (Green) border.
- **Progress Bars:** Used for "Batch Completion" or "Hopper Levels." Use a thick 8px track with a high-contrast fill.
- **Lists:** Zebra-striping is used for long data tables to assist horizontal eye tracking across sensor columns.