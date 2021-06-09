// @ts-nocheck File not migrated fully to TS
import _ from 'lodash';
import log from 'loglevel';

import mapGridParamsToManagerGridParams from './shared/mapGridParamsToManagerGridParams';

export default class WidgetParamsHandler {
    constructor(widget, toolbox) {
        this.widget = widget;
        this.toolbox = toolbox;

        // initialize params
        this.fetchParams = {
            gridParams: {
                currentPage: 1,
                pageSize: this.widget.configuration.pageSize,
                sortColumn: this.widget.configuration.sortColumn,
                sortAscending: this.widget.configuration.sortAscending
            },
            filterParams: {}
        };

        // process fetch params
        this.runFetchParamsIfNeeded();
    }

    update(widget) {
        this.widget = widget;
    }

    buildParamsToSend(userRequestedParams) {
        // Map grid params to params
        const gridParams = this.mapGridParamsToParams();
        const fetchParams = this.buildFilterParams();

        let params = { ...gridParams, ...fetchParams };

        // If user stated params, replace the grid params and pick the ones we need from the real params
        if (!_.isEmpty(userRequestedParams)) {
            // If user stated he wanted gridParams, then add the grid params fields
            const userParamsResolved = _.replace(
                userRequestedParams,
                'gridParams',
                '_sort,_size,_offset,_search'
            ).split(',');

            // Pick only the values that the user asked for
            params = _.pick(params, userParamsResolved);
        }

        return params;
    }

    updateFetchParams() {
        // save the old filter params
        const oldFilterParams = this.fetchParams.filterParams;

        this.runFetchParamsIfNeeded();

        // Check if the filter params have changed
        return !_.isEqual(this.fetchParams.filterParams, oldFilterParams);
    }

    updateGridParams(newGridParams) {
        Object.assign(this.fetchParams.gridParams, newGridParams);
    }

    runFetchParamsIfNeeded() {
        if (_.isFunction(this.widget.definition.fetchParams)) {
            try {
                this.fetchParams.filterParams = this.widget.definition.fetchParams(this.widget, this.toolbox);
            } catch (e) {
                log.error('Error processing fetch params', e);
                throw new Error('Error processing fetch params', e);
            }
        }
    }

    buildFilterParams() {
        const params = {};
        _.forIn(this.fetchParams.filterParams, (value, key) => {
            if (_.isBoolean(value) || !_.isEmpty(value)) {
                params[key] = value;
            }
        });

        return params;
    }

    mapGridParamsToParams() {
        if (_.isEmpty(this.fetchParams.gridParams)) {
            return {};
        }

        let params = {};

        // If we have a mapping function run it
        if (_.isFunction(this.widget.definition.mapGridParams)) {
            try {
                params = this.widget.definition.mapGridParams(this.fetchParams.gridParams);
            } catch (e) {
                log.error('Error processing match grid params', e);
                throw new Error('Error processing match grid params', e);
            }
        } else {
            params = mapGridParamsToManagerGridParams(this.fetchParams.gridParams);
        }

        return params;
    }

    getGridParams() {
        return this.fetchParams.gridParams;
    }
}
