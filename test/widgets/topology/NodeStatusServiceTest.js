import { expect } from 'chai';
import _ from 'lodash';
import { consts } from 'cloudify-ui-common';
import { getColorByStatus, getContentByStatus, getNodeState } from '../../../widgets/topology/src/NodeStatusService';

describe('(Widget) Topology', () => {
    describe('NodeStatusService getColorByStatus', () => {
        it('should return color by status', () => {
            _.each(consts.nodeStatuses, s => {
                expect(typeof getColorByStatus(s)).to.equal('string', `type ${s} should have a color`);
            });
        });
    });

    describe('NodeStatusService getColorByStatus', () => {
        it('should return icon by status', () => {
            _.each(consts.nodeStatuses, s => {
                expect(typeof getContentByStatus(s)).to.equal('string', `type ${s} should have an icon`);
            });
        });
    });

    describe('NodeStatusService getNodeState', () => {
        it('should return uninitialized if nothing is initialized', () => {
            expect(getNodeState(false, [{ state: 'uninitialized' }])).to.equal('uninitialized');
        });

        describe('in progress', () => {
            it('should return loading if all instances failed', () => {
                expect(getNodeState(true, [{ state: 'starting' }])).to.equal('loading');
            });

            it('should return done if all instances passed', () => {
                expect(getNodeState(true, [{ state: 'started' }])).to.equal('done');
            });

            it('should return loading if some failed and some passed', () => {
                expect(getNodeState(true, [{ state: 'starting' }, { state: 'started' }])).to.equal('loading');
            });
        });

        describe('not in progress', () => {
            it('should return failed if all instances failed', () => {
                expect(getNodeState(false, [{ state: 'starting' }])).to.equal('failed');
            });

            it('should return done if all instances passed', () => {
                expect(getNodeState(false, [{ state: 'started' }])).to.equal('done');
            });

            it('should return alert if some failed and some passed', () => {
                expect(getNodeState(false, [{ state: 'starting' }, { state: 'started' }])).to.equal('alert');
            });
        });
    });
});
