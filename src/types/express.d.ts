declare namespace Express {
  interface Request {
    _vaulty_: {
      auth: VaultyAuthType;
    };
  }

  type VaultyAuthType = {
    session: Record<string, any>;
    accessToken: string;
  };
}
