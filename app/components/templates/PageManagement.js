/**
 * Created by pposel on 19/09/2017.
 */

import React, { Component, PropTypes } from 'react';
import WidgetsList from '../WidgetsList';
import Const from '../../utils/consts';
import EditModeBubble from '../EditModeBubble';

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
        return !_.isEqual(this.props.page, nextProps.page)
            || this.props.isPageEditMode !== nextProps.isPageEditMode
            || this.props.showDrillDownWarn !== nextProps.showDrillDownWarn;
    }

    render () {
        let {Breadcrumb, Segment, Divider, ErrorMessage, EditableLabel, Alert} = Stage.Basic;
        var pageManagementMode = this.props.isPageEditMode ? Const.PAGE_MANAGEMENT_EDIT : Const.PAGE_MANAGEMENT_VIEW;

        var maximizeWidget = _.findIndex(this.props.page.widgets, { 'maximized': true }) >= 0;

        $('body').css({overflow: maximizeWidget?'hidden':'inherit'}).scrollTop(0);

        return (
            <div className='main'>
                <div className='sidebarContainer'>
                    <div className="ui visible left vertical sidebar menu small basic">
                        <div className="pages" ref="pages">
                            <div className="item link pageMenuItem">{this.props.page.name}</div>
                            <div className="item link pageMenuItem"></div>
                        </div>
                    </div>
                </div>

                <div className="page">
                    <Segment basic loading={this.props.isLoading} className={`fullHeight ${maximizeWidget?'maximizeWidget':''}`}>
                        <div>
                            <Breadcrumb className="breadcrumbLineHeight">
                                <Breadcrumb.Section onClick={this.props.onTemplateNavigate}>Template management</Breadcrumb.Section>
                                <Breadcrumb.Divider />
                                <Breadcrumb.Section active>
                                    <EditableLabel text={this.props.page.name}
                                                   placeHolder='You must fill a page name'
                                                   className='section active pageTitle'
                                                   isEditEnable={this.props.isPageEditMode}
                                                   onEditDone={this.props.onPageNameChange}
                                    />
                                </Breadcrumb.Section>
                            </Breadcrumb>
                        </div>
                        <Divider/>

                        <ErrorMessage error={this.props.error}/>

                        <WidgetsList widgets={this.props.page.widgets} onWidgetsGridDataChange={this.props.onWidgetsGridDataChange}
                                     pageId={this.props.page.id} isEditMode={this.props.isPageEditMode} pageManagementMode={pageManagementMode}/>

                        <EditModeBubble isVisible={true} onDismiss={this.props.onTemplateNavigate} onPageSave={this.props.onPageSave}
                                        page={this.props.page} pageManagementMode={pageManagementMode}/>
                    </Segment>
                </div>

                <Alert open={this.props.showDrillDownWarn}
                       content="Drill down action is not available in the template management"
                       onDismiss={this.props.onCloseDrillDownWarning}/>
            </div>
        );
    }
}
