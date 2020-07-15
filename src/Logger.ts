import { ILogger } from './types';

let logger: ILogger = console;

export function setLogger(_logger: ILogger) {
    logger = _logger;
}

export function getLogger() {
    return logger;
}
