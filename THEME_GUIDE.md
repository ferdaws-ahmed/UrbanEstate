# Theme Configuration Guide

## Overview
Now you can change ALL theme colors from ONE FILE! Just edit `src/app/globals.css`

## How to Change Colors
Edit the CSS variables in `src/app/globals.css`:

### Light Mode Colors
Edit the `:root` selector:
```css
:root {
  --background: #ffffff;
  --foreground: #0f172a;
  --card: #ffffff;
  --primary: #099880;
  --accent: #cddfa0;
  /* ... other colors */
}
```

### Dark Mode Colors
Edit the `.dark` selector:
```css
.dark {
  --background: #099880; /* Change this to your desired dark bg color */
  --card: #066e5b;
  --primary: #cddfa0;
  --accent: #cddfa0;
  /* ... other colors */
}
```

## How Components Use Colors
All components now use Tailwind classes with CSS variables like:
- `bg-[var(--background)]` for background
- `bg-[var(--card)]` for cards
- `text-[var(--foreground)]` for text
- `text-[var(--accent)]` for accent color
- `bg-[var(--primary)]` for primary color

That's it! One file controls everything! 🎉
