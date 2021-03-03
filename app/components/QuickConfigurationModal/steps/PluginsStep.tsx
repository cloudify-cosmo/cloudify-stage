import React, { memo } from 'react';
import { JSONData, JSONSchema } from '../model';
import useFetchPlugins from '../plugins/useFetchPlugins';

type Props = {
    schema: JSONSchema;
    data: JSONData;
};

const PluginsStep = ({ schema, data }: Props) => {
    const managerPlugins = useFetchPlugins();
    return (
        <div>
            {managerPlugins.error && <pre>Error: {managerPlugins.error}</pre>}
            <div>Summary & Status body here ...</div>
            <pre>{JSON.stringify(data, null, 4)}</pre>
            <div>
                {managerPlugins.plugins?.installed.items.map((item, index) => {
                    //TODO: better key
                    return <div key={index}>{item.todo}</div>;
                })}
            </div>
            {/* {managerPlugins.plugins && <pre>{JSON.stringify(managerPlugins.plugins, null, 4)}</pre>} */}
        </div>
    );
};

export default memo(PluginsStep);
