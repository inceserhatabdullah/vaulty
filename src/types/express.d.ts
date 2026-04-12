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

// TODO request içerisinde session bilgisi düzenlenmeli. token için de session id bilgisi var, request içerisinde o an session objecti yazıyor. olmamalı.