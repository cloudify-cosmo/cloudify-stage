import React from 'react';
import { isEmpty, isEqual, chain } from 'lodash';
import type { DropdownProps } from 'semantic-ui-react';
import { useBoolean, useErrors, useInput } from '../../../utils/hooks';
import { Form } from '../../../components/basic';

interface NodeInstancesFilterProps {
    /**
     * name of the field
     */
    name: string;
    /**
     * value of the field
     */
    value: string[];
    /**
     * function to be called on field's value change
     */
    onChange: Stage.Types.CustomConfigurationComponentProps<DropdownProps['value']>['onChange'];
    /**
     * Toolbox object
     */
    toolbox: Stage.Types.WidgetlessToolbox;
    /**
     * [deploymentId=''] ID of deployment for which Node Instances will be fetched
     */
    deploymentId?: string;
    /**
     * field label
     */
    label?: string;
    /**
     * field's placeholder
     */
    placeholder?: string;
    /**
     * field's help description
     */
    help?: string;
    /**
     * make dropdown to expand upwards
     */
    upward?: boolean;
}

/**
 * NodeInstancesFilter - a component showing dropdown with nodes instances of specified deployment.
 * Data is dynamically fetched from manager.
 *
 * @param props
 */
export default function NodeInstancesFilter({
    deploymentId = '',
    toolbox,
    name,
    onChange,
    help = '',
    label = '',
    placeholder = '',
    upward,
    value: initialValue
}: NodeInstancesFilterProps) {
    const { useEffect, useState } = React;

    const [value, setValue, clearValue] = useInput(initialValue);
    const [nodeInstances, setNodeInstances] = useState<DropdownProps['options']>([]);
    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, setErrors, clearErrors } = useErrors();

    function fetchData() {
        if (isEmpty(deploymentId)) {
            return;
        }

        setLoading();
        setNodeInstances([]);
        setErrors({ ...errors, nodeInstanceIds: null });

        const params = { _include: 'id', deployment_id: deploymentId };
        const fetchUrl = '/node-instances';
        toolbox
            .getManager()
            .doGet(fetchUrl, { params })
            .then(data => {
                const parsedData = chain(data.items || {})
                    .map(item => ({ text: item.id, value: item.id, key: item.id }))
                    .unshift({ text: '', value: '', key: '' })
                    .uniqWith(isEqual)
                    .value();
                setNodeInstances(parsedData);
            })
            .catch(error => setErrors({ ...errors, nodeInstanceIds: `Data fetching error: ${error.message}` }))
            .finally(unsetLoading);
    }

    useEffect(() => {
        clearValue();
        setNodeInstances([]);
        unsetLoading();
        clearErrors();
        fetchData();
    }, [deploymentId]);

    const handleInputChange: DropdownProps['onChange'] = (event, field) => {
        const newValue = field.value;
        setValue(newValue);
        onChange(event, { name, value: newValue });
    };

    return (
        <Form.Field error={errors.nodeInstanceIds} label={label} help={help}>
            <Form.Dropdown
                search
                selection
                multiple
                value={errors.nodeInstanceIds ? '' : value}
                placeholder={errors.nodeInstanceIds || placeholder}
                options={nodeInstances}
                onChange={handleInputChange}
                name="nodeInstanceIds"
                loading={isLoading}
                upward={upward}
            />
        </Form.Field>
    );
}
