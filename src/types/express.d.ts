declare namespace Express {
  interface Request {
    user?: {
      _id: string;
    };
    session?: any;
    authorization?: {
      accessToken: string;
    };
  }
}
