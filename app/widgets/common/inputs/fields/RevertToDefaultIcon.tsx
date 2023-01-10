import React from 'react';
import GenericRevertToDefaultIcon from '../../components/RevertToDefaultIcon';
import { STRING_VALUE_SURROUND_CHAR } from '../consts';
import getInputFieldInitialValue from '../utils/getInputFieldInitialValue';
import type { RevertableInputFieldProps } from './types';

interface PositionedRevertToDefaultIconProps extends RevertableInputFieldProps {
    right?: number;
}

export function PositionedRevertToDefaultIcon(props: PositionedRevertToDefaultIconProps) {
    const { right = 10 } = props;
    return (
        <div style={{ position: 'absolute', top: 10, right }}>
            <RevertToDefaultIcon {...props} />
        </div>
    );
}

export default function RevertToDefaultIcon({ name, value, defaultValue, onChange }: RevertableInputFieldProps) {
    const { Json } = Stage.Utils;

    const stringValue = Json.getStringValue(value);
    const typedValue =
        _.startsWith(stringValue, STRING_VALUE_SURROUND_CHAR) &&
        _.endsWith(stringValue, STRING_VALUE_SURROUND_CHAR) &&
        _.size(stringValue) > 1
            ? stringValue.slice(1, -1)
            : Json.getTypedValue(value);

    const typedDefaultValue = defaultValue;

    if (_.isUndefined(typedDefaultValue)) return null;

    const cloudifyTypedDefaultValue = getInputFieldInitialValue(defaultValue, Json.toCloudifyType(typedDefaultValue));

    const revertToDefault = () => onChange?.(null, { name, value: cloudifyTypedDefaultValue });

    return <GenericRevertToDefaultIcon value={typedValue} defaultValue={typedDefaultValue} onClick={revertToDefault} />;
}
