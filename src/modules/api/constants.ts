export const MODULE_LOG_KEY = "api";
export const SECRET_KEY_SALT = "x4X7iHlx";

export const VALIDATE_REQUEST_CONTEXT_REFLECT_KEY = `request:context`;

export const SERVER_PORT = parseInt(process.env.SERVER_PORT) || 5000;
export const API_LINK = process.env.API_LINK || `http://localhost:5000`;

export const API_SOFTGARDEN_WELL_KNOWN_ROUTE = process.env.API_SOFTGARDEN_WELL_KNOWN_ROUTE;
export const SSO_AUDIENCE = process.env.SSO_AUDIENCE;

export const CRONOFY_CLIENT_ID = process.env.CRONOFY_CLIENT_ID;
export const CRONOFY_CLIENT_SECRET = process.env.CRONOFY_CLIENT_SECRET;
export const CRONOFY_DATA_CENTER = process.env.CRONOFY_DATA_CENTER;
export const CRONOFY_REDIRECT_URI = `${API_LINK}/cronofy-authorized-callback`;
