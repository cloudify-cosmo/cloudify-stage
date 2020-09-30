/**
 * NodeInstancesFilter - a component showing dropdown with nodes instances of specified deployment.
 * Data is dynamically fetched from manager.
 *
 * @param props
 */
export default function NodeInstancesFilter({
    deploymentId,
    toolbox,
    name,
    onChange,
    help,
    label,
    placeholder,
    upward,
    value: initialValue
}) {
    const { useEffect, useState } = React;
    const { useBoolean, useInput, useErrors } = Stage.Hooks;

    const [value, setValue, clearValue] = useInput(initialValue);
    const [nodeInstances, setNodeInstances] = useState([]);
    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, setErrors, clearErrors } = useErrors();

    function fetchData() {
        if (_.isEmpty(deploymentId)) {
            return;
        }

        setLoading();
        setNodeInstances([]);
        setErrors({ ...errors, nodeInstanceIds: null });

        const params = { _include: 'id', deployment_id: deploymentId };
        const fetchUrl = '/node-instances';
        toolbox
            .getManager()
            .doGet(fetchUrl, params)
            .then(data => {
                const parsedData = _.chain(data.items || {})
                    .map(item => ({ text: item.id, value: item.id, key: item.id }))
                    .unshift({ text: '', value: '', key: '' })
                    .uniqWith(_.isEqual)
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

    function handleInputChange(event, field) {
        const newValue = field.value;
        setValue(newValue);
        onChange(event, { name, value: newValue });
    }

    const { Form } = Stage.Basic;

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

/**
 * @property {string} name name of the field
 * @property {string} value value of the field
 * @property {object} toolbox Toolbox object
 * @property {Function} onChange function to be called on field's value change
 * @property {string} [deploymentId=''] ID of deployment for which Node Instances will be fetched
 * @property {string} [label=''] field label
 * @property {string} [placeholder=''] field's placeholder
 * @property {string} [help=''] field's help description
 * @property {boolean} [upward=false] make dropdown to expand upwards
 */
NodeInstancesFilter.propTypes = {
    name: PropTypes.string.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    deploymentId: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    help: PropTypes.string,
    upward: PropTypes.bool
};

NodeInstancesFilter.defaultProps = {
    deploymentId: '',
    label: '',
    placeholder: '',
    help: '',
    upward: false
};

Stage.defineCommon({
    name: 'NodeInstancesFilter',
    common: React.memo(NodeInstancesFilter, _.isEqual)
});
