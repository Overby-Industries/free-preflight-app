# Security Policy

FreeFlight currently has no user accounts, authentication, or stored user data. It proxies public, keyless aviation data (aviationweather.gov, adsb.lol) through its own API routes and runs entirely client-side beyond that. The one key it uses, for CARTO's map tiles, is meant for the browser and is restricted to the site's hosts in CARTO's dashboard; it is read from `NEXT_PUBLIC_CARTO_BASEMAPS_KEY` and is not committed (`.env.local` is git-ignored).

## Reporting a vulnerability

If you find a security issue, please report it privately using [GitHub's security advisory feature](https://github.com/Overby-Industries/free-preflight-app/security/advisories/new) rather than opening a public issue. We'll acknowledge reports as soon as possible.
