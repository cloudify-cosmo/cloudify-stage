import React, { useState } from 'react';
import type { FunctionComponent } from 'react';
import EditWidgetIcon from './EditWidgetIcon';
import type { EditWidgetIconProps } from './EditWidgetIcon';
import EditWidgetModal from './EditWidgetModal';
import type { Widget } from '../../../utils/StageAPI';
import type { WidgetOwnProps } from '../content/widgets/Widget';

interface EditWidgetProps {
    widget: Widget;
    onWidgetEdited: NonNullable<WidgetOwnProps<any>['onWidgetUpdated']>;
    iconSize: EditWidgetIconProps['size'];
}

const EditWidget: FunctionComponent<EditWidgetProps> = ({ iconSize, onWidgetEdited, widget }) => {
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
};
export default EditWidget;
