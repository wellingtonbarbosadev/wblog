import { env } from "@/env";
import type { SignOptions } from "jsonwebtoken";

export const authConfig: {
  jwt: {
    secret: string;
    expiresIn: NonNullable<SignOptions["expiresIn"]>;
  };
} = {
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: "1d"
  }
}