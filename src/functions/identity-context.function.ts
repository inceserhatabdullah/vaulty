export function identityContext(request: Express.Request) {
  return request._vaulty_.auth;
}
