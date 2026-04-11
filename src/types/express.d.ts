declare namespace Express {
  interface Request {
    session?: any;
    authorization?: {
      user?: {
        _id: string;
      };
      accessToken: string;
    };
  }
}
