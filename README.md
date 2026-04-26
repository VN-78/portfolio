# sv

# Vishwa | Personal Portfolio 🚀

A high-performance, responsive personal portfolio built to showcase software engineering projects, UI components, and data visualization work. Engineered for maximum speed with a perfect 100 Lighthouse score across Performance, Accessibility, Best Practices, and SEO.

## ✨ Key Features

* **Custom SMTP Backend:** Form submissions are routed securely through a custom `+page.server.ts` endpoint using **Nodemailer**, complete with frontend Regex validation and programmatic Bits UI dialogs.
* **Automated Asset Pipeline:** Integrated `@sveltejs/enhanced-img` to automatically compress, resize, and convert raw images into next-gen WebP/AVIF formats at build time to prevent Cumulative Layout Shift (CLS).
* **Fluid Typography & Layout:** Built using **Tailwind CSS** with a CSS Grid "Bento Box" architecture for responsive project displays.
* **Hardware-Accelerated Scrolling:** Implemented **Lenis** for buttery-smooth, 60fps scroll hijacking without jank.

## 🛠️ Tech Stack

* **Framework:** SvelteKit (SSR & API Routes)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Components:** Bits UI (Headless components)
* **Runtime/Package Manager:** Bun
* **Email Client:** Nodemailer

## 💻 Local Development

To run this project locally, you will need [Bun](https://bun.sh/) installed on your machine.

To recreate this project with the same configuration:

```sh
# recreate this project
bun x sv@0.15.1 create --template minimal --types ts --add prettier eslint tailwindcss="plugins:typography,forms" --install bun portfolio
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
bun run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
```

## Building

To create a production version of your app:

```sh
bun run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
