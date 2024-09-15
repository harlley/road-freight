export const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  here: {
    apiKey: import.meta.env.VITE_HERE_API_KEY,
    appId: import.meta.env.VITE_HERE_API_ID,
    autocomplete: "https://autocomplete.search.hereapi.com/v1/autocomplete",
    lookup: "https://lookup.search.hereapi.com/v1/lookup",
    matrixRouter: "https://matrix.router.hereapi.com/v8/matrix",
  },
};
