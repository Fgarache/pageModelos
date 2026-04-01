# Copilot Instructions - React + Vite + TypeScript

This workspace is a React project configured with:
- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **CSS Modules** - Scoped styling

## Project Structure

```
src/
  ├── components/      # Reusable React components
  ├── pages/           # Page components
  ├── styles/          # Global and module styles
  ├── App.tsx          # Root component
  └── main.tsx         # Entry point
public/               # Static assets
package.json          # Dependencies and scripts
vite.config.ts        # Vite configuration
tsconfig.json         # TypeScript configuration
```

## Development Guidelines

- Use TypeScript for all `.ts` and `.tsx` files
- CSS Modules for component-scoped styling
- Functional components with hooks
- Place reusable components in `src/components/`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
