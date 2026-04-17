import { Request } from "express";
import geoip from "geoip-lite";

export class GeoLocationService {
  static getLocation(ip: string) {
    return geoip.lookup(ip);
  }

  static getClientIp(request: Request) {
    const forwarded = request.headers["x-forwarded-for"];

    if (typeof forwarded === "string") {
      return forwarded.split(",")[0].trim();
    }

    return request.ip || request.socket.remoteAddress || "";
  }
}
