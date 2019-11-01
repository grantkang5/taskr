import { sign } from "jsonwebtoken";
import { User } from "../../entity/User";
type Payload = User | string;

export const createAccessToken = (payload: Payload) => {
  const JWTPayload =
    typeof payload === "string"
      ? { googleIdToken: payload }
      : { userId: payload.id };
  const expirationDuration =
    process.env.NODE_ENV === "development" ? '7d' : "15m";

  return sign(JWTPayload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: expirationDuration
  });
};

export const createRefreshToken = (payload: Payload) => {
  if (typeof payload === "string") {
    return sign(
      { googleRefreshToken: payload },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "7d"
      }
    );
  } else {
    return sign(
      { userId: payload.id, tokenVersion: payload.tokenVersion },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "7d"
      }
    );
  }
};
