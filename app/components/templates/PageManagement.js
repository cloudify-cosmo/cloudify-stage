/**
 * Created by pposel on 19/09/2017.
 */

import React, { Component, PropTypes } from 'react';
import WidgetsList from '../WidgetsList';
import EditModeBubble from '../EditModeBubble';

export default class PageManagement extends Component {

    static propTypes = {
        isEditMode: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
        onTemplateNavigate: PropTypes.func.isRequired,
        onWidgetsGridDataChange: PropTypes.func.isRequired,
        onPageSave: PropTypes.func.isRequired
    };

    render () {
        let {Breadcrumb, Segment, Divider, ErrorMessage, EditableLabel} = Stage.Basic;

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
                    <Segment basic loading={this.props.isLoading}>
                        <div>
                            <Breadcrumb className="breadcrumbLineHeight">
                                <Breadcrumb.Section onClick={this.props.onTemplateNavigate}>Template management</Breadcrumb.Section>
                                <Breadcrumb.Divider />
                                <Breadcrumb.Section active>
                                    <EditableLabel text={this.props.page.name}
                                                   placeHolder='You must fill a page name'
                                                   className='section active pageTitle'
                                                   isEditEnable={this.props.isEditMode}
                                                   onEditDone={this.props.onPageNameChange}
                                    />
                                </Breadcrumb.Section>
                            </Breadcrumb>
                        </div>
                        <Divider/>

                        <ErrorMessage error={this.props.error}/>

                        <WidgetsList widgets={this.props.page.widgets} onWidgetsGridDataChange={this.props.onWidgetsGridDataChange}
                                     pageId={this.props.page.id} isEditMode={this.props.isEditMode} isPageManagement={true}/>

                        <EditModeBubble isVisible={true} onDismiss={this.props.onTemplateNavigate} onPageSave={this.props.onPageSave}
                                        page={this.props.page} isPageManagement={this.props.isEditMode} isPagePreview={!this.props.isEditMode}/>
                    </Segment>
                </div>
            </div>
        );
    }
}
