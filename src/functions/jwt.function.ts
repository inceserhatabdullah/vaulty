export const getJwtSecret = (): string => {
  return process.env.JWT_SECRET ?? "super_secret";
};

export const getJwtExpiresIn = (): number => {
  return Number(process.env.JWT_EXPIRES_IN) ?? 3600;
};

export const getJwtExpiresAt = (): Date => {
  return new Date(Date.now() + getJwtExpiresIn() * 1000);
};
