import { NextFunction, Request, Response } from "express";
import { UAParser } from "ua-parser-js";

export const parseUserAgentMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const parser = new UAParser(request.headers["user-agent"]);
  const { cpu, device, os, engine, browser, ua } = parser.getResult();

  const configuration = {
    cpu,
    device,
    os,
    engine,
    browser,
    ua,
    ip: request.ip,
  };

  request.session = configuration;
  next();
};