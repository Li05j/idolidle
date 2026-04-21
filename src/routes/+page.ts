// SSR is useless here: all truth lives in the browser's localStorage, so the server
// can only render a fresh-game lie that flashes on screen before the client patches it.
export const ssr = false;
