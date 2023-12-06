import crypto from "crypto";
import { SECRET_KEY_SALT } from "~api/constants";

export const generateSecretKey = (email: string): string =>
  crypto.createHmac("sha256", SECRET_KEY_SALT).update(email).digest("hex");
