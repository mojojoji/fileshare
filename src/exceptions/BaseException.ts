export default class BaseException extends Error {
  protected status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.message = message;
  }

  getStatus(): number {
    return this.status;
  }

  getMessage(): string {
    return this.message;
  }
}
