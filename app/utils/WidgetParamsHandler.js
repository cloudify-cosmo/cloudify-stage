/**
 * Created by kinneretzin on 04/04/2017.
 */

export default class WidgetParamsHandler {
    constructor(widget,toolbox) {
        this._widget = widget;
        this._toolbox = toolbox;

        // initialize params
        this.fetchParams = {
            gridParams: {
                currentPage: 1,
                pageSize: this._widget.configuration.pageSize,
                sortColumn: this._widget.configuration.sortColumn,
                sortAscending: this._widget.configuration.sortAscending
            },
            filterParams: {}
        };


        // process fetch params
        this._runFetchParamsIfNeeded();
    }

    buildParamsToSend(userRequestedParams) {

        // Map grid params to params
        let gridParams = this._mapGridParamsToParams();
        let fetchParams = this._buildFilterParams();

        let params = Object.assign({},gridParams,fetchParams);

        // If user stated params, replace the grid params and pick the ones we need from the real params
        if (!_.isEmpty(userRequestedParams)) {

            // If user stated he wanted gridParams, then add the grid params fields
            userRequestedParams = _.replace(userRequestedParams, 'gridParams', '_sort,_size,_offset').split(',');

            // Pick only the values that the user asked for
            params = _.pick(params, userRequestedParams);
        }

        return params;
    }


    updateFetchParams() {
        // save the old filter params
        var oldFilterParams = this.fetchParams.filterParams;

        this. _runFetchParamsIfNeeded();

        // Check if the filter params have changed
        return !_.isEqual(this.fetchParams.filterParams, oldFilterParams) ;
    }

    updateGridParams(newGridParams) {
        Object.assign(this.fetchParams.gridParams, newGridParams);
    }

    _runFetchParamsIfNeeded() {
        if (_.isFunction(this._widget.definition.fetchParams)) {
            try {
                this.fetchParams.filterParams = this._widget.definition.fetchParams(this._widget, this._toolbox);
            } catch (e) {
                console.error('Error processing fetch params', e);
                throw new Error('Error processing fetch params',e);
            }
        }
    }

    _buildFilterParams() {
        let params = {};
        _.forIn(this.fetchParams.filterParams, function(value, key) {
            if (!_.isEmpty(value)) {
                params[key] = value;
            }
        });

        return params

    }
    _mapGridParamsToParams() {
        if (_.isEmpty(this.fetchParams.gridParams)) {
            return {};
        }

        let params = {};

        // If we have a mapping function run it
        if (_.isFunction(this._widget.definition.mapGridParams)) {
            try {
                params = this._widget.definition.mapGridParams(this.fetchParams.gridParams);
            } catch (e) {
                console.error('Error processing match grid params', e);
                throw new Error('Error processing match grid params',e);
            }
        } else {
            // If not this is the default mapping
            if (this.fetchParams.gridParams.sortColumn) {
                params._sort = `${this.fetchParams.gridParams.sortAscending?'':'-'}${this.fetchParams.gridParams.sortColumn}`;
            }

            if (this.fetchParams.gridParams.pageSize) {
                params._size=this.fetchParams.gridParams.pageSize;
            }

            if (this.fetchParams.gridParams.currentPage) {
                params._offset=(this.fetchParams.gridParams.currentPage-1)*this.fetchParams.gridParams.pageSize;
            }
        }

        return params;
    }

    getGridParams() {
        return this.fetchParams.gridParams;
    }
}
