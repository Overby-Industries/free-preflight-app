# FreeFlight

A free, lightweight pre-flight electronic flight bag (EFB) for pilots. FreeFlight is a Next.js Progressive Web App — installable on Windows, macOS, and mobile straight from the browser, no app store required.

## Features

- METAR lookup by ICAO code, with TAF and a VFR / MVFR / IFR / LIFR flight-category badge
- PIREP lookup by ICAO code
- Live nearby air traffic map, sourced from public ADS-B data
- Day / night theme toggle — red-on-dark by default to preserve night vision, with a light day mode
- Installable PWA with offline support via a service worker

No accounts or sign-ups are required to use FreeFlight. Weather data comes from the National Weather Service's [aviationweather.gov](https://aviationweather.gov) API, and traffic data comes from [adsb.lol](https://adsb.lol) — both free and public, and keyless. The one key the app needs is for the map's background tiles, which are [CARTO basemaps](https://carto.com/basemaps/): since September 2026 CARTO serves a watermark instead of the map without a free key (see Getting started).

## Roadmap

The following are planned but not yet built:

- FAA sectional charts and approach / IFR plates
- Aircraft-manufacturer performance data for weight & balance
- A dedicated weight & balance section
- A full weather briefing beyond raw METAR / TAF / PIREP text
- Flight plan filing

## Tech stack

- [Next.js](https://nextjs.org/) 14 (App Router) with TypeScript
- [React](https://react.dev/) 18
- [Tailwind CSS](https://tailwindcss.com/)
- [Leaflet](https://leafletjs.com/) with OpenStreetMap / CARTO tiles
- [Serwist](https://serwist.pages.dev/) for the PWA service worker

## Getting started

Requires Node.js 20 (see `.nvmrc`).

```bash
git clone https://github.com/Overby-Industries/free-preflight-app.git
cd free-preflight-app
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

**The map needs a free CARTO basemaps key**, or its tiles are a watermark that says "API key required". Get one (no account) at [carto.com/basemaps/apikey](https://carto.com/basemaps/apikey), copy `.env.example` to `.env.local`, and put the key in it:

```
NEXT_PUBLIC_CARTO_BASEMAPS_KEY=your-key
```

`.env.local` is not committed. The key is made for the browser (it is in the page's tile requests), so in CARTO's dashboard restrict it to your site's host and `localhost`. When you deploy, set the same variable in your host's environment settings **before the build**: it is read at build time, so changing it means building again.

Other scripts: `npm run build` (production build), `npm run start` (serve a production build), `npm run lint`.

## Project structure

```
app/
  api/                  Route handlers proxying aviationweather.gov and adsb.lol
  components/           Shared UI: nav, weather/traffic panels, theme toggle
  context/              Day/night theme context
  ui/
    dashboard/          Dashboard pages (weather, traffic, pre-flight)
    fonts.ts, globals.css
  layout.tsx, page.tsx  Root layout and landing page
```

## Branching

- `main` — stable
- `dev` — active development

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md).

## License

MIT — see [LICENSE](LICENSE).
