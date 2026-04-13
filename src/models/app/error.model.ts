export class AppError extends Error {
  public readonly code: number;
  private readonly isOperational: boolean;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor)
  }
}
