import type { ReactNode } from 'react';
import React from 'react';
import getTemplateForDataType from './utils/getTemplateForDataType';
import ParameterValue from '../components/parameter/ParameterValue';
import type { DataType } from './types';

import { Header, List } from '../../../components/basic';

const HelpProperty = ({ show, name, value }: { show: boolean; name: string; value: ReactNode }) => {
    return show ? (
        <>
            <Header as="h4">{name}</Header>
            <div>{value}</div>
        </>
    ) : null;
};

export default function InputHelp({
    description,
    type,
    constraints,
    defaultValue,
    dataType
}: {
    description: string | undefined;
    type: string;
    constraints: Record<string, any>[];
    defaultValue: string;
    dataType: DataType;
}) {
    let example = null;
    if (!_.isUndefined(defaultValue)) {
        example = defaultValue;
    } else if (!_.isUndefined(dataType)) {
        example = getTemplateForDataType(dataType);
    }

    const showExample = !_.isUndefined(defaultValue) || !_.isUndefined(dataType);
    const showDescription = !_.isEmpty(description);
    const showType = !_.isEmpty(type);
    const showConstraints = !_.isEmpty(constraints);
    const showAnyHelpProperty = showExample || showDescription || showType || showConstraints;

    return showAnyHelpProperty ? (
        <div>
            <HelpProperty name="Description" show={showDescription} value={description} />
            <HelpProperty name="Type" show={showType} value={type} />
            <HelpProperty
                name="Constraints"
                show={showConstraints}
                value={
                    <List bulleted>
                        {_.map(constraints, constraint => {
                            const key = _.first(_.keys(constraint)) as string;
                            return (
                                <List.Item key={key}>
                                    {_.capitalize(_.lowerCase(key))}: {String(constraint[key])}
                                </List.Item>
                            );
                        })}
                    </List>
                }
            />
            <HelpProperty
                name={!_.isUndefined(defaultValue) ? 'Default Value' : 'Example'}
                show={showExample}
                value={<ParameterValue value={example} />}
            />
        </div>
    ) : null;
}
