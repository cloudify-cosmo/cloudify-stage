import _ from 'lodash';
import { consts } from 'cloudify-ui-common-frontend';
import { getColorByStatus, getContentByStatus, getNodeState } from 'topology/src/NodeStatusService';

describe('(Widget) Topology', () => {
    describe('NodeStatusService getColorByStatus', () => {
        it('should return color by status', () => {
            _.each(consts.nodeStatuses, s => {
                expect(typeof getColorByStatus(s)).toBe('string');
            });
        });
    });

    describe('NodeStatusService getContentByStatus', () => {
        it('should return icon by status', () => {
            _.each(consts.nodeStatuses, s => {
                expect(typeof getContentByStatus(s)).toBe('string');
            });
        });
    });

    describe('NodeStatusService getNodeState', () => {
        it('should return uninitialized if nothing is initialized', () => {
            expect(getNodeState(false, [{ state: 'uninitialized', runtime_properties: {} }])).toBe('uninitialized');
        });

        describe('in progress', () => {
            it('should return loading if all instances failed', () => {
                expect(getNodeState(true, [{ state: 'starting', runtime_properties: {} }])).toBe('loading');
            });

            it('should return done if all instances passed', () => {
                expect(getNodeState(true, [{ state: 'started', runtime_properties: {} }])).toBe('done');
            });

            it('should return loading if some failed and some passed', () => {
                expect(
                    getNodeState(true, [
                        { state: 'starting', runtime_properties: {} },
                        { state: 'started', runtime_properties: {} }
                    ])
                ).toBe('loading');
            });
        });

        describe('not in progress', () => {
            it('should return failed if all instances failed', () => {
                expect(getNodeState(false, [{ state: 'starting', runtime_properties: {} }])).toBe('failed');
            });

            it('should return done if all instances passed', () => {
                expect(getNodeState(false, [{ state: 'started', runtime_properties: {} }])).toBe('done');
            });

            it('should return alert if some failed and some passed', () => {
                expect(
                    getNodeState(false, [
                        { state: 'starting', runtime_properties: {} },
                        { state: 'started', runtime_properties: {} }
                    ])
                ).toBe('alert');
            });
        });
    });
});
