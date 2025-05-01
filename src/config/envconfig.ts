import * as dotenv from "dotenv";
dotenv.config();
import { z } from "zod";

const envVarsSchema = z.object({
  PORT: z.string().default("80").transform((str) => parseInt(str, 10)),
  MONGO_URL: z.string(),
  JWT_SECRET: z.string(),
  IMAGE_KIT_PUBLIC_KEY:z.string(),
  IMAGE_KIT_PRIVATE_KEY:z.string(),
  IMAGE_KIT_URL_ENDPOINT:z.string(),
  EXPIRATION_MINUTE:z.string()
});

const envVars:any = envVarsSchema.parse(process.env);

export const envConfigs = {
  port: envVars.PORT || 8080,
  dburl:envVars.MONGO_URL,
  jwtsecret:envVars.JWT_SECRET,
  imageKitPublicKey:envVars.IMAGE_KIT_PUBLIC_KEY,
  imageKitPrivateKey:envVars.IMAGE_KIT_PRIVATE_KEY,
  imageKitUrlEndpoint:envVars.IMAGE_KIT_URL_ENDPOINT,
  expirationMinute:envVars.EXPIRATION_MINUTE
};

