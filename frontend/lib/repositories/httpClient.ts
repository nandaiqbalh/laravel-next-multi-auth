import axios from "axios";

const baseURL =
  process.env.API_BASE_URL_INTERNAL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8000/api";

console.log("[httpClient] Using baseURL:", baseURL);
console.log("[httpClient] API_BASE_URL_INTERNAL:", process.env.API_BASE_URL_INTERNAL);
console.log("[httpClient] NEXT_PUBLIC_API_BASE_URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

/**
 * Shared axios client for all repository requests.
 */
export const httpClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
