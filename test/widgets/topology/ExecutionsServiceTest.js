import { expect } from 'chai';
import ExecutionStatusService from '../../../widgets/topology/src/ExecutionsService';

describe('(Widget) Topology', function() {
    describe('ExecutionService isRunning', function() {
        it('should return true if execution is running', function() {
            expect(ExecutionStatusService.isRunning()).to.be.false;
            expect(ExecutionStatusService.isRunning({ status: 'failed' })).to.be.false;
            expect(ExecutionStatusService.isRunning({ status: 'running' })).to.be.true;
        });

        it('should support arrays and return true if one is running', function() {
            expect(ExecutionStatusService.isRunning([{ status: 'running' }])).to.be.true;
        });
    });
});
