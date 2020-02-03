import { expect } from 'chai';
import _ from 'lodash';
import { consts } from 'cloudify-ui-common';
import { getColorByStatus, getContentByStatus, getNodeState } from '../../../widgets/topology/src/NodeStatusService';

describe('(Widget) Topology', () => {
    describe('NodeStatusService getColorByStatus', function() {
        it('should return color by status', function() {
            _.each(consts.nodeStatuses, function(s) {
                expect(typeof getColorByStatus(s)).to.equal('string', `type ${s} should have a color`);
            });
        });
    });

    describe('NodeStatusService getColorByStatus', function() {
        it('should return icon by status', function() {
            _.each(consts.nodeStatuses, function(s) {
                expect(typeof getContentByStatus(s)).to.equal('string', `type ${s} should have an icon`);
            });
        });
    });

    describe('NodeStatusService getNodeState', function() {
        it('should return uninitialized if nothing is initialized', function() {
            expect(getNodeState(false, [{ state: 'uninitialized' }])).to.equal('uninitialized');
        });

        describe('in progress', function() {
            it('should return loading if all instances failed', function() {
                expect(getNodeState(true, [{ state: 'starting' }])).to.equal('loading');
            });

            it('should return done if all instances passed', function() {
                expect(getNodeState(true, [{ state: 'started' }])).to.equal('done');
            });

            it('should return loading if some failed and some passed', function() {
                expect(getNodeState(true, [{ state: 'starting' }, { state: 'started' }])).to.equal('loading');
            });
        });

        describe('not in progress', function() {
            it('should return failed if all instances failed', function() {
                expect(getNodeState(false, [{ state: 'starting' }])).to.equal('failed');
            });

            it('should return done if all instances passed', function() {
                expect(getNodeState(false, [{ state: 'started' }])).to.equal('done');
            });

            it('should return alert if some failed and some passed', function() {
                expect(getNodeState(false, [{ state: 'starting' }, { state: 'started' }])).to.equal('alert');
            });
        });
    });
});
