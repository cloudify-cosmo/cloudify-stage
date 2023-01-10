import { forIn, isBoolean, isEmpty, isEqual, isFunction, pick, replace } from 'lodash';
import log from 'loglevel';

import type { QueryStringParams } from 'backend/sharedUtils';
import mapGridParamsToManagerGridParams from './shared/mapGridParamsToManagerGridParams';
import type { Toolbox, Widget } from './StageAPI';

export interface FetchParams {
    gridParams: Stage.Types.GridParams;
    filterParams: QueryStringParams;
}

export default class WidgetParamsHandler {
    fetchParams: FetchParams;

    constructor(private widget: Widget<Stage.Types.GridParams & Record<string, unknown>>, private toolbox: Toolbox) {
        // initialize params
        this.fetchParams = {
            gridParams: {
                currentPage: 1,
                pageSize: widget.configuration.pageSize,
                sortColumn: widget.configuration.sortColumn,
                sortAscending: widget.configuration.sortAscending
            },
            filterParams: {}
        };

        // process fetch params
        this.runFetchParamsIfNeeded();
    }

    update(widget: Widget) {
        this.widget = widget;
    }

    buildParamsToSend(userRequestedParams?: string) {
        // Map grid params to params
        const gridParams = this.mapGridParamsToParams();
        const fetchParams = this.buildFilterParams();

        let params = { ...gridParams, ...fetchParams };

        // If user stated params, replace the grid params and pick the ones we need from the real params
        if (userRequestedParams && !isEmpty(userRequestedParams)) {
            // If user stated he wanted gridParams, then add the grid params fields
            const userParamsResolved = replace(userRequestedParams, 'gridParams', '_sort,_size,_offset,_search').split(
                ','
            );

            // Pick only the values that the user asked for
            params = pick(params, userParamsResolved);
        }

        return params;
    }

    updateFetchParams() {
        // save the old filter params
        const oldFilterParams = this.fetchParams.filterParams;

        this.runFetchParamsIfNeeded();

        // Check if the filter params have changed
        return !isEqual(this.fetchParams.filterParams, oldFilterParams);
    }

    updateGridParams(newGridParams: Stage.Types.GridParams) {
        Object.assign(this.fetchParams.gridParams, newGridParams);
    }

    runFetchParamsIfNeeded() {
        if (isFunction(this.widget.definition.fetchParams)) {
            try {
                this.fetchParams.filterParams = this.widget.definition.fetchParams(this.widget, this.toolbox);
            } catch (err) {
                log.error('Error processing fetch params', err);
                throw new Error('Error processing fetch params');
            }
        }
    }

    buildFilterParams() {
        const params: QueryStringParams = {};
        forIn(this.fetchParams.filterParams, (value, key) => {
            if (isBoolean(value) || !isEmpty(value)) {
                params[key] = value;
            }
        });

        return params;
    }

    mapGridParamsToParams() {
        if (isEmpty(this.fetchParams.gridParams)) {
            return {};
        }

        let params = {};

        // If we have a mapping function run it
        if (isFunction(this.widget.definition.mapGridParams)) {
            try {
                params = this.widget.definition.mapGridParams(this.fetchParams.gridParams);
            } catch (err) {
                log.error('Error processing match grid params', err);
                throw new Error('Error processing match grid params');
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
