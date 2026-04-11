import { NextFunction, Request, Response } from "express";
import { UAParser } from "ua-parser-js";
import { GeoLocationService } from "../services/geo-location.service";

export const parseUserAgentMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const parser = new UAParser(request.headers["user-agent"]);
  const { cpu, device, os, engine, browser, ua } = parser.getResult();
  const ip = GeoLocationService.getClientIp(request);
  const location = GeoLocationService.getLocation(ip);

  const configuration = {
    cpu,
    device,
    os,
    engine,
    browser,
    ua,
    ip,
    location,
  };

  request.session = configuration;
  next();
};
