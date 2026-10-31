# Aardish Duwal's portfolio

A React portfolio with individual routes, animated page transitions, a responsive navigation menu, and filterable projects. Tailwind CSS provides the styling layer and Vite builds the app for deployment on Vercel.

## Run locally

Use a Node.js version supported by Vite 8 (Node 20.19+ or 22.12+).

```sh
npm ci
npm run dev
```

Open <http://localhost:4173>. The pages are `/`, `/about`, `/projects`, `/capabilities`, and `/contact`. Navigation uses React Router, so moving between pages preserves the app shell and plays a transition. Browser back/forward and direct page URLs are supported.

## Build and preview

```sh
npm run build
npm run preview
```

The production output is `dist/`. Stop the development server before running the preview server; both use port 4173.

## Deploy on Vercel

Import the repository into Vercel and use the Vite preset. The included `vercel.json` sets the build command to `npm run build`, the output directory to `dist`, and rewrites route requests to `index.html`. This lets visitors open or refresh a direct URL such as `/projects` without receiving a hosting 404.

No environment variables are needed. Deployment is not performed by this project setup.

The portfolio is an interactive client-side React application. It does not include a backend, database, or email delivery service. The contact action opens the visitor's email application through a `mailto:` link; it does not claim to submit or deliver a message on the server.

## Update content

- `src/data.js` holds the profile, experience, education, projects, and social links. Current positions are **Full Stack Developer Intern at Nightvision** and **Data Annotator at CloudFactory**, supplied by the portfolio owner; no employment dates are assumed. Education includes SEE at Mount Valley English School, higher secondary computer science at Khwopa College, and the ongoing BCA at Bhaktapur Multiple Campus.
- `src/pages/` contains each page's content and interactions.
- `src/App.jsx` owns routing, the shared navigation, and page transitions.
- `src/styles.css` contains the Tailwind import, the `@theme` design tokens, base resets, and the glass/noise utilities. Component styling is written with Tailwind utility classes in the components and pages.
- `assets/images/` contains the portrait and other image assets; imported assets are included in the Vite build.

## Browser checks

Install the browser once, then run the checks:

```sh
npx playwright install chromium
npm test
```

Playwright starts the local development server automatically when one is not already running. Checks cover direct route refreshes, client-side navigation and history, the mobile menu, project filters, reduced-motion behavior, and horizontal overflow at 320, 390, 768, 1024, and 1440 pixels. Runtime console errors fail the checks.
