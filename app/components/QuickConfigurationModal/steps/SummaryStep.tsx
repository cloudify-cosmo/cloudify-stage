import React, { memo, useMemo } from 'react';
import { JSONData, JSONSchema } from '../model';
import useFetchPlugins from '../plugins/useFetchPlugins';
import useFetchSecrets from '../secrets/useFetchSecrets';

type Props = {
    schema: JSONSchema;
    data: JSONData;
};

const SummaryStep = ({ schema, data }: Props) => {
    // TODO: only for testing
    const managerPlugins = useFetchPlugins();
    const managerSecrets = useFetchSecrets();
    // const changedSecrets = useMemo(() => {
    //     // if (managerSecrets) {
    //     // managerSecrets?.items
    //     // }
    //     return null;
    // }, [managerSecrets]);
    return (
        <div>
            <div>Summary & Status body here ...</div>
            {managerPlugins.loading && <pre>Plugins information loading ...</pre>}
            {managerPlugins.error && <pre>Error: {managerPlugins.error}</pre>}
            {managerSecrets.loading && <div>Secrets information loading ...</div>}
            {managerSecrets.error && <div>Manager error: {managerSecrets.error}</div>}
            <pre>{JSON.stringify(data, null, 4)}</pre>
            <div>
                {managerPlugins.plugins?.installed.map((item, _index) => {
                    return (
                        <div key={item.package_name}>
                            {item.package_name} {item.package_version} {item.distribution}
                        </div>
                    );
                })}
            </div>
            <div>
                {managerSecrets.secrets?.items.map((item, _index) => {
                    return <div key={item.key}>{item.key}</div>;
                })}
            </div>
            {/* {managerPlugins.plugins && <pre>{JSON.stringify(managerPlugins.plugins, null, 4)}</pre>} */}
        </div>
    );
};

export default memo(SummaryStep);
