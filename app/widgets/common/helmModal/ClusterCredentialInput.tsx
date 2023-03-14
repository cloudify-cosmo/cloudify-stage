import React, { useEffect } from 'react';
import type { ClusterCredential, ClusterCredentialName } from 'backend/handler/HelmHandler.types';
import { camelCase } from 'lodash';
import type { Toolbox } from 'app/utils/StageAPI';
import type { StrictLabelProps } from 'semantic-ui-react/dist/commonjs/elements/Label/Label';
import StageUtils from '../../../utils/stageUtils';

const translate = StageUtils.getT('widgets.blueprints.helmModal.credentialsSection');
const translateSource = StageUtils.composeT(translate, 'source');

interface ClusterCredentialProps {
    clusterCredential: ClusterCredentialName;
    initialSource?: ClusterCredential['source'];
    onChange: (credential: ClusterCredential) => void;
    toolbox: Toolbox;
    error?: StrictLabelProps;
}

export default function ClusterCredentialInput({
    clusterCredential,
    initialSource = 'secret',
    onChange,
    toolbox,
    error
}: ClusterCredentialProps) {
    const { Form } = Stage.Basic;
    const { DynamicDropdown } = Stage.Common.Components;
    const { useInput } = Stage.Hooks;

    const [source, setSource] = useInput(initialSource);
    const [value, setValue, resetValue] = useInput('');

    useEffect(() => {
        onChange({ source, value });
    }, [source, value]);

    return (
        <Form.Group>
            <Form.Field width={3} style={{ paddingTop: 8 }}>
                {translate(camelCase(clusterCredential))}
            </Form.Field>
            <Form.Field width={4}>
                <Form.Dropdown
                    selection
                    value={source}
                    clearable={false}
                    options={['input', 'secret'].map(option => ({ text: translateSource(option), value: option }))}
                    onChange={(...args) => {
                        setSource(...args);
                        resetValue();
                    }}
                />
            </Form.Field>
            <Form.Field width={9} error={error}>
                {source === 'input' ? (
                    <Form.Input value={value} onChange={setValue} />
                ) : (
                    <DynamicDropdown
                        fluid
                        selection
                        value={value}
                        fetchUrl="/secrets"
                        onChange={newValue => setValue(newValue as string)}
                        clearable={false}
                        toolbox={toolbox}
                        valueProp="key"
                    />
                )}
            </Form.Field>
        </Form.Group>
    );
}
