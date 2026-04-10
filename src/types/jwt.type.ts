export const JwtTypeValue = {
  access_token: "access_token",
  refresh_token: "refresh_token",
} as const;

export type JWTType = (typeof JwtTypeValue)[keyof typeof JwtTypeValue];
