// The preloader shows once per browser session.
export const PRELOADED_KEY = "sk-preloaded";

/** Runs in <head> before paint: hides the preloader markup on repeat visits. */
export const preloadedHeadScript = `try{if(sessionStorage.getItem("${PRELOADED_KEY}")==="1")document.documentElement.setAttribute("data-preloaded","")}catch(e){}`;

/** Fired on window when the preloader has finished its exit. */
export const PRELOADER_DONE_EVENT = "sk:preloaded";
