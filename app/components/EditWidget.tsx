// @ts-nocheck File not migrated fully to TS
/**
 * Created by addihorowitz on 10/06/2016.
 */

import PropTypes from 'prop-types';

import React, { useState } from 'react';
import EditWidgetIcon from './EditWidgetIcon';
import EditWidgetModal from './EditWidgetModal';

function EditWidget({ iconSize, onWidgetEdited, widget }) {
    const [configShown, setShowConfig] = useState(false);
    const configuration = widget.configuration || {};
    const configDef = widget.definition.initialConfiguration || [];

    return (
        <span>
            <EditWidgetIcon onShowConfig={() => setShowConfig(true)} size={iconSize} />
            <EditWidgetModal
                widget={widget}
                configDef={configDef}
                configuration={configuration}
                onWidgetEdited={onWidgetEdited}
                show={configShown}
                onHideConfig={() => setShowConfig(false)}
            />
        </span>
    );
}

EditWidget.propTypes = {
    widget: PropTypes.shape({
        configuration: PropTypes.shape({}),
        definition: PropTypes.shape({
            initialConfiguration: PropTypes.arrayOf(PropTypes.shape({}))
        }).isRequired
    }).isRequired,
    onWidgetEdited: PropTypes.func.isRequired,
    // iconSize is an optional forwarded prop
    // eslint-disable-next-line react/require-default-props
    iconSize: PropTypes.string
};

export default EditWidget;
