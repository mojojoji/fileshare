import BaseException from './BaseException';

export class NotOpenException extends BaseException {
  constructor(message = 'Peer server connection not yet opened') {
    super(message, 500);
  }
}
