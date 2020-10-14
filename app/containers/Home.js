/**
 * Created by addihorowitz on 19/09/2016.
 */

import _ from 'lodash';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { parse } from 'query-string';
import Home from '../components/Home';
import { setAppError } from '../actions/appState';
import { storeCurrentPageId } from '../actions/app';
import { clearContext, setValue } from '../actions/context';
import { setDrilldownContext } from '../actions/drilldownContext';

import Consts from '../utils/consts';

const mapStateToProps = (state, ownProps) => {
    const { pages } = state;
    const homePageId = _.isEmpty(pages) ? '' : pages[0].id;
    const selectedPageId = ownProps.match.params.pageId || homePageId;
    const selectedPageName = ownProps.match.params.pageName || '';

    const query = parse(ownProps.location.search);
    const context = query.c ? JSON.parse(query.c) : [];

    return {
        emptyPages: _.isEmpty(pages),
        selectedPage: _.find(pages, { id: selectedPageId }),
        pageId: selectedPageId,
        pageName: selectedPageName,
        contextParams: context,
        isMaintenance: state.manager.maintenance === Consts.MAINTENANCE_ACTIVATED
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onClearContext: () => {
            dispatch(clearContext());
        },
        onSetContextValue: (key, value) => {
            dispatch(setValue(key, value));
        },
        onSetDrilldownContext(drilldownContext) {
            dispatch(setDrilldownContext(drilldownContext));
        },
        navigateTo404: () => {
            dispatch(push(Consts.ERROR_404_PAGE_PATH));
        },
        navigateToError: message => {
            dispatch(setAppError(message));
            dispatch(push(Consts.ERROR_PAGE_PATH));
        },
        navigateToMaintenancePage: () => {
            dispatch(push(Consts.MAINTENANCE_PAGE_PATH));
        },
        onStorePageId: pageId => {
            dispatch(storeCurrentPageId(pageId));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
