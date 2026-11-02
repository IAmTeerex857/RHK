# Rush Hour Kids

Monorepo for the Rush Hour Kids Transportation website and, later, the admin, driver and parent portals.

```
apps/web          Landing site (www.rushhourkidstransportation.com), Next.js 16
packages/ui       Shared design system: theme tokens, Button, Field, Accordion, loaders
rush-hour-kids-app-prd.md   Product requirements (client-facing)
```

Future portals go in `apps/admin`, `apps/driver` and `apps/parents` and import `@rhk/ui` so they share the same look.

## Run it

```bash
pnpm install
pnpm dev          # http://localhost:3100
pnpm build        # production build of every app
```

Requires Node 20+ and pnpm.

## Where things live

| What | Where |
| --- | --- |
| All site copy (services, FAQs, stats, contact details) | `apps/web/src/content/site.ts` |
| Colours, fonts, shadows | `packages/ui/src/styles/theme.css` |
| Hero scene (school, road, bus, parallax) | `apps/web/src/components/hero/hero-scene.tsx` |
| Scroll route (road + bus that follows scrolling) | `apps/web/src/components/route/` |
| Application form | `apps/web/src/components/apply/application-form.tsx` |

### Changing the bus route

The road passes through every `<RoadPoint />` on the page, in document order. Each point is an invisible
marker positioned with classes or styles inside a section. Use `lg:hidden` / `hidden lg:block` to give
phones and tablets a different route from desktop. Points placed beyond the page edge (for example
`left: "130%"`) make the road leave and come back from the side. The road is drawn behind content, so it
disappears under solid cards and shows through open space. Keep it away from plain text.

## Not connected yet

- **Payments and form submissions.** The application form is front-end only: it validates, keeps a
  draft in the browser and shows a success screen, but nothing is sent or charged. The payment step says
  "Test mode · no card is charged" until `NEXT_PUBLIC_PAYMENTS_LIVE=1` is set. Wire both up with the admin portal.
- **Contact form.** Opens the visitor's email app addressed to the office.
- **Logo.** A temporary wordmark (`components/site/logo.tsx`) until we have the client's logo file.

## Third-party components (all MIT)

- [border-beam](https://libraries.dev/beam), [liquid-gooey](https://libraries.dev/gooey), [metal-fx](https://libraries.dev/metal) by Jakub Antalik
- [Generative Loaders](https://generativeloaders.com) (vendored in `packages/ui/src/vendor/generative-loaders`, with its licence)
- [Stageshow](https://github.com/benjitaylor/skills) kit (MIT, vendored in `apps/web/src/vendor/stageshow`): the iPhone frame and notification in the app section
- Button hover and form-control behaviour adapted from [amicro](https://github.com/Subhan-code/Amicro--Micro-transitions-)
- Ride tracker pattern adapted from [Beautiful UI](https://www.beautifului.dev) Task Rows
