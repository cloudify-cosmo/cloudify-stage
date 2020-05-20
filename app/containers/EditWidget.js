/**
 * Created by addihorowitz on 10/06/2016.
 */

import PropTypes from 'prop-types';

import React from 'react';
import { connect } from 'react-redux';
import { editPageWidget } from '../actions/templateManagement';
import { editWidget } from '../actions/widgets';
import EditWidgetIcon from '../components/EditWidgetIcon';
import EditWidgetModal from '../components/EditWidgetModal';

const mapStateToProps = (state, ownProps) => {
    return {
        pageId: ownProps.pageId,
        widget: ownProps.widget,
        pageManagementMode: ownProps.pageManagementMode,
        configuration: ownProps.widget.configuration || {},
        configDef: ownProps.widget.definition.initialConfiguration || [],
        showConfig: ownProps.widget.showConfig || false
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onWidgetEdited: configuration => {
            if (ownProps.pageManagementMode) {
                dispatch(
                    editPageWidget(
                        ownProps.pageId,
                        ownProps.widget.id,
                        configuration || ownProps.widget.configuration || {}
                    )
                );
            } else {
                dispatch(
                    editWidget(
                        ownProps.pageId,
                        ownProps.widget.id,
                        configuration || ownProps.widget.configuration || {}
                    )
                );
            }
        }
    };
};

class EditWidgetComponent extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            showConfig: false
        };
    }

    static propTypes = {
        widget: PropTypes.object,
        onWidgetEdited: PropTypes.func,
        configDef: PropTypes.array,
        configuration: PropTypes.object
    };

    showConfig() {
        this.setState({ showConfig: true });
    }

    hideConfig() {
        this.setState({ showConfig: false });
    }

    render() {
        const { configDef, configuration, onWidgetEdited, widget } = this.props;
        const { showConfig } = this.state;

        return (
            <span>
                <EditWidgetIcon widgetId={widget.id} onShowConfig={this.showConfig.bind(this)} />
                <EditWidgetModal
                    widget={widget}
                    configDef={configDef}
                    configuration={configuration}
                    onWidgetEdited={onWidgetEdited}
                    show={showConfig}
                    onHideConfig={this.hideConfig.bind(this)}
                />
            </span>
        );
    }
}

const EditWidget = connect(
    mapStateToProps,
    mapDispatchToProps
)(EditWidgetComponent);

export default EditWidget;
