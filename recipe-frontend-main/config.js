export const BASE_URL =
  import.meta.env.VITE_NODE_ENV === "development" //null
    ? "http://localhost:3500/api/v1"
    : "https://kaarthi-recipe-backend.vercel.app/api/v1";