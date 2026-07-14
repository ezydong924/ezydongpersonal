# Free Animation Library

This directory is the local source of truth for reusable animation components.

## Components

- `Reveal`: viewport-triggered content reveal with reduced-motion support.
- `TiltCard`: pointer-driven 3D card movement; it is disabled for touch input and reduced-motion users.
- `Magnetic`: subtle pointer attraction for small controls; use it sparingly.

## Upstream sources

- Motion / Framer Motion: already installed, MIT licensed.
- React Three Fiber and Drei: already installed, MIT licensed, reserved for intentional WebGL scenes.
- Motion Primitives: MIT-licensed reference collection. Copy only the components that meet the site performance budget.

## Rules

- Prefer CSS and Motion for page and gallery transitions.
- Use at most one continuous WebGL scene per view.
- Every motion component must retain an accessible static state and respect `prefers-reduced-motion`.
- Do not use remote runtime embeds or paid template code.
