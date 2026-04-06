import ms from "ms";

export const getAccessTokenSecret = (): string => {
  return process.env.ACCESS_TOKEN_SECRET ?? "super_secret";
};

export const getAccessTokenExpiresIn = (): string => {
  return process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m";
};

export const getRefreshTokenSecret = (): string => {
  return process.env.REFRESH_TOKEN_SECRET ?? "super_secret";
};

export const getRefreshTokenExpiresIn = (): string => {
  return process.env.REFRESH_TOKEN_EXPIRES_IN ?? "7d";
};

export const calculateRefreshTokenExpiresAt = (): Date => {
  return new Date(
    Date.now() + ms(getRefreshTokenExpiresIn() as ms.StringValue),
  );
};
