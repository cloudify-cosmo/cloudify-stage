/**
 * Created by pposel on 19/09/2017.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import WidgetsList from '../WidgetsList';
import Const from '../../utils/consts';
import EditModeBubble from '../EditModeBubble';
import { Breadcrumb, Segment, Divider, ErrorMessage, EditableLabel, Alert } from '../basic';

export default class PageManagement extends Component {
    static propTypes = {
        isPageEditMode: PropTypes.bool.isRequired,
        page: PropTypes.object,
        onClose: PropTypes.func.isRequired,
        onClear: PropTypes.func.isRequired,
        onTemplateNavigate: PropTypes.func.isRequired,
        onWidgetsGridDataChange: PropTypes.func.isRequired,
        onPageSave: PropTypes.func.isRequired,
        showDrillDownWarn: PropTypes.bool,
        onCloseDrillDownWarning: PropTypes.func
    };

    componentWillUnmount() {
        this.props.onClear();
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { isPageEditMode, page, showDrillDownWarn } = this.props;
        return (
            !_.isEqual(page, nextProps.page) ||
            isPageEditMode !== nextProps.isPageEditMode ||
            showDrillDownWarn !== nextProps.showDrillDownWarn
        );
    }

    render() {
        const {
            error,
            isLoading,
            isPageEditMode,
            onCloseDrillDownWarning,
            onPageNameChange,
            onPageSave,
            onTemplateNavigate,
            onWidgetsGridDataChange,
            page,
            showDrillDownWarn
        } = this.props;
        const pageManagementMode = isPageEditMode ? Const.PAGE_MANAGEMENT_EDIT : Const.PAGE_MANAGEMENT_VIEW;

        const maximizeWidget = _.findIndex(page.widgets, { maximized: true }) >= 0;

        $('body')
            .css({ overflow: maximizeWidget ? 'hidden' : 'inherit' })
            .scrollTop(0);

        return (
            <div className="main">
                <div className="sidebarContainer">
                    <div className="ui visible left vertical sidebar menu small basic">
                        <div className="pages" ref="pages">
                            <div className="item link pageMenuItem">{page.name}</div>
                            <div className="item link pageMenuItem" />
                        </div>
                    </div>
                </div>

                <div className="page">
                    <Segment
                        basic
                        loading={isLoading}
                        className={`fullHeight ${maximizeWidget ? 'maximizeWidget' : ''}`}
                    >
                        <div>
                            <Breadcrumb className="breadcrumbLineHeight">
                                <Breadcrumb.Section onClick={onTemplateNavigate}>
                                    Template management
                                </Breadcrumb.Section>
                                <Breadcrumb.Divider />
                                <Breadcrumb.Section active>
                                    <EditableLabel
                                        value={page.name}
                                        placeHolder="You must fill a page name"
                                        className="section active pageTitle"
                                        enabled={isPageEditMode}
                                        onChange={onPageNameChange}
                                    />
                                </Breadcrumb.Section>
                            </Breadcrumb>
                        </div>
                        <Divider />

                        <ErrorMessage error={error} />

                        <WidgetsList
                            widgets={page.widgets}
                            onWidgetsGridDataChange={onWidgetsGridDataChange}
                            pageId={page.id}
                            isEditMode={isPageEditMode}
                            pageManagementMode={pageManagementMode}
                        />

                        <EditModeBubble
                            isVisible
                            onDismiss={onTemplateNavigate}
                            onPageSave={onPageSave}
                            page={page}
                            pageManagementMode={pageManagementMode}
                        />
                    </Segment>
                </div>

                <Alert
                    open={showDrillDownWarn}
                    content="Drill down action is not available in the template management"
                    onDismiss={onCloseDrillDownWarning}
                />
            </div>
        );
    }
}
