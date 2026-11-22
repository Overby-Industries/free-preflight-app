// CARTO's basemap tiles need a key since September 2026: without one every tile comes back as a watermark that says so. A free key
// is at https://carto.com/basemaps/apikey. It is made for the browser (restrict it to this site's hosts in CARTO's dashboard), so it
// is a NEXT_PUBLIC_ variable, read when the app is built. Set it in .env.local, and in the host's environment settings. See README.
export const CARTO_KEY = process.env.NEXT_PUBLIC_CARTO_BASEMAPS_KEY;

export const cartoTiles = (style: 'light_all' | 'dark_all') =>
    `https://{s}.basemaps.cartocdn.com/${style}/{z}/{x}/{y}{r}.png${CARTO_KEY ? `?key=${encodeURIComponent(CARTO_KEY)}` : ''}`;
