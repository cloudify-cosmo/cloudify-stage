import React from 'react';
import { Label, List } from 'semantic-ui-react';

import type { URLString } from '../../plugins/model';

type Props = {
    icon?: URLString;
    name: string;
    description: string | JSX.Element;
};

const PluginTaskItem = ({ icon, name, description }: Props) => {
    return (
        <List.Item>
            <Label horizontal>
                {icon && (
                    <img
                        style={{
                            minWidth: '1.5em',
                            maxHeight: '1.5em',
                            verticalAlign: 'middle'
                        }}
                        src={icon}
                        alt={name}
                    />
                )}
                <span style={{ marginLeft: '1em' }}>{name}</span>
            </Label>
            {description}
        </List.Item>
    );
};

export default PluginTaskItem;
