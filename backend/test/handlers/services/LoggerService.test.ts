import { getLogger } from 'handler/LoggerHandler';
import Logger from 'handler/services/LoggerService';

jest.mock('handler/LoggerHandler');
const loggerMock = {};
(<jest.Mock>getLogger).mockReturnValue(loggerMock);

describe('LoggerService', () => {
    it('should return logger instance', () => {
        const logger = Logger();
        expect(logger).toBe(loggerMock);
        expect(getLogger).toHaveBeenCalledWith('WidgetBackend');
    });
});
