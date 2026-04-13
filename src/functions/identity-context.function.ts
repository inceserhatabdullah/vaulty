import { Request } from "express";

export function identityContext(request: Request) {
  return request._vaulty_.auth;
}
