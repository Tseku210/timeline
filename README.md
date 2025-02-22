# :warning: Timeline implementation currently under DEVELOPMENT

This is a timeline implementation in progress. It was inspired by [Heygen Studio](https://app.heygen.com).

<img width="1715" alt="image" src="https://github.com/user-attachments/assets/4298c2a5-788f-4411-9b2e-3a7f26257a3d" />

## Stack

- React
- Typescript
- Bun
- Vite
- TailwindCSS v4
- Pragmatic-drag-and-drop
- React-moveable
- React-selecto
- Zustand
- and a few more

## Features

- [x] Dynamic playhead and ruler
- [x] Resizable items
- [x] Play functionality
- [x] Scenes
- [x] Items
- [x] Resizable items
- [x] Draggable items
- [x] Ability to reorder items
- [x] High performance
- [ ] Toggle hiding items
- [ ] Editing canvas

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```

## License

This project is licensed under the [MIT License](LICENSE).

Copyright (c) 2025 Tsenguun Otgonbaatar
