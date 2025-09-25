# Shelly - React + Vite + Tailwind CSS

## Setup Instructions

### Prerequisites

You'll need to install Node.js first. You can download it from [nodejs.org](https://nodejs.org/) or install it using a package manager:

```bash
# Using Homebrew on macOS
brew install node

# Or using nvm (recommended for version management)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts
```

### Install Dependencies

After Node.js is installed, run:

```bash
# Install existing dependencies
npm install

# Install Tailwind CSS and its dependencies
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind (optional - already configured)
# npx tailwindcss init -p
```

### Development

Start the development server:

```bash
npm run dev
```

### Tailwind Configuration

The project is configured with a modern Tailwind CSS setup including:

- **Custom Color Palette**: Primary (blue), Secondary (purple), and Neutral colors
- **Extended Spacing**: Additional spacing utilities
- **Custom Animations**: Fade-in, slide-up, and gentle bounce animations
- **Custom Components**: Pre-built button and card styles
- **Typography**: Inter font family with JetBrains Mono for monospace
- **Enhanced Shadows**: Soft shadows and glow effects

### Tailwind Features Available

#### Custom Colors

- `bg-primary-500`, `text-primary-600`, etc.
- `bg-secondary-500`, `text-secondary-600`, etc.
- `bg-neutral-800`, `text-neutral-200`, etc.

#### Custom Components (in CSS)

- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.card` - Card container with shadow and borders

#### Custom Animations

- `animate-fade-in` - Smooth fade in effect
- `animate-slide-up` - Slide up from bottom
- `animate-bounce-gentle` - Subtle bounce animation

#### Extended Utilities

- `rounded-4xl`, `rounded-5xl` - Larger border radius
- `shadow-soft`, `shadow-glow` - Custom shadow effects
- `space-18`, `space-88`, `space-128` - Additional spacing

## Project Structure

```
src/
├── App.tsx          # Main App component
├── main.tsx         # App entry point
├── index.css        # Global styles with Tailwind directives
└── App.css          # Component-specific styles
```

## Building for Production

```bash
npm run build
```

The build files will be generated in the `dist/` directory.
