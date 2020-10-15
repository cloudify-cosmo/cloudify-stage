const BASIC_PARAMS = { _include: 'id' };

const inputNames = ['blueprint', 'deployment', 'node', 'nodeInstance'];

function toId(resourceName) {
    return `${resourceName}Id`;
}

/**
 * NodeFilter  - a component showing dropdowns for filtering blueprints, deployments, nodes and nodes instances.
 * Data (list of blueprints, deployments, nodes and node instances) is dynamically fetched from manager.
 *
 * @param props
 */
function NodeFilter({
    value,
    toolbox,
    name,
    onChange,
    showBlueprints,
    showDeployments,
    showNodeInstances,
    showNodes,
    allowMultiple,
    allowMultipleBlueprints,
    allowMultipleDeployments,
    allowMultipleNodes,
    allowMultipleNodeInstances,
    allowedBlueprints,
    allowedDeployments,
    allowedNodes,
    allowedNodeInstances
}) {
    const { useState, useEffect } = React;
    const { useErrors } = Stage.Hooks;

    const [values, setValues] = useState();
    const [options, setOptions] = useState();
    const [loading, setLoading] = useState();

    const { errors, clearErrors, setErrors } = useErrors();

    function resetState() {
        setValues(
            _(inputNames)
                .keyBy()
                .mapValues(inputName => value[toId(inputName)])
                .value()
        );
        setOptions(
            _(inputNames)
                .keyBy()
                .mapValues(() => [])
                .value()
        );
        clearErrors();
    }

    function getAllowedOptionsFor(resourcesName) {
        return { allowedBlueprints, allowedDeployments, allowedNodeInstances, allowedNodes }[
            `allowed${_.upperFirst(resourcesName)}s`
        ];
    }

    function isFilteringSetFor(resourceName) {
        return !_.isEmpty(getAllowedOptionsFor(resourceName));
    }

    function isMultipleSetFor(resourceName) {
        return (
            allowMultiple ||
            { allowMultipleBlueprints, allowMultipleDeployments, allowMultipleNodeInstances, allowMultipleNodes }[
                `allowMultiple${_.upperFirst(resourceName)}s`
            ]
        );
    }

    function fetchData(fetchUrl, params, inputName) {
        setErrors({ ...errors, [inputName]: null });
        setOptions({ ...options, [inputName]: [] });
        setLoading({ ...loading, [inputName]: true });

        toolbox
            .getManager()
            .doGet(fetchUrl, params)
            .then(data => {
                let ids = _.chain(data.items || [])
                    .map(item => item.id)
                    .uniqWith(_.isEqual)
                    .value();
                if (isFilteringSetFor(inputName)) {
                    ids = _.intersection(ids, getAllowedOptionsFor(inputName));
                }

                const newOptions = _.map(ids, id => ({ text: id, value: id, key: id }));
                if (!isMultipleSetFor(inputName)) {
                    newOptions.unshift({ text: '', value: '', key: '' });
                }

                setOptions({ ...options, [inputName]: newOptions });
            })
            .catch(error => setErrors({ ...errors, [inputName]: `Data fetching error: ${error.message}` }))
            .finally(() => setLoading({ ...loading, [inputName]: false }));
    }

    function fetchNodeInstances(paramValues = values) {
        const { node, deployment } = paramValues;
        const params = { ...BASIC_PARAMS };
        if (!_.isEmpty(deployment)) {
            params.deployment_id = deployment;
        }
        if (!_.isEmpty(node)) {
            params.node_id = node;
        }
        fetchData('/node-instances', params, 'nodeInstance');
    }

    function fetchNodes(paramValues = values) {
        const { blueprint, deployment } = paramValues;
        const params = { ...BASIC_PARAMS };
        if (!_.isEmpty(blueprint)) {
            params.blueprint_id = blueprint;
        }
        if (!_.isEmpty(deployment)) {
            params.deployment_id = deployment;
        }
        fetchData('/nodes', params, 'node');
        fetchNodeInstances(paramValues);
    }

    function fetchDeployments(paramValues = values) {
        const { blueprint } = paramValues;
        const params = { ...BASIC_PARAMS };
        if (!_.isEmpty(blueprint)) {
            params.blueprint_id = blueprint;
        }
        fetchData('/deployments', params, 'deployment');
        fetchNodes(paramValues);
    }

    function fetchBlueprints() {
        const params = { ...BASIC_PARAMS };
        fetchData('/blueprints', params, 'blueprint');
        fetchDeployments();
    }

    useEffect(() => {
        if (!_.isEqual(_.pick(value, inputNames.map(toId)), _.mapKeys(values, toId))) {
            resetState();
            fetchBlueprints();
        }
    }, [JSON.stringify(value)]);

    function getEmptyValueFor(resourceName) {
        return isMultipleSetFor(resourceName) ? [] : '';
    }

    function handleInputChange(inputsToClear, event, field, onStateChange = _.noop) {
        const newValues = {
            ...values,
            ..._(inputsToClear).keyBy().mapValues(getEmptyValueFor).value(),
            [field.name]: field.value
        };
        setValues(newValues);

        onStateChange(newValues);
        onChange(event, {
            name,
            value: _.mapKeys(values, toId)
        });
    }

    function selectBlueprint(event, field) {
        handleInputChange(['deployment', 'node', 'nodeInstance'], event, field, fetchDeployments);
    }

    function selectDeployment(event, field) {
        handleInputChange(['node', 'nodeInstance'], event, field, fetchNodes);
    }

    function selectNode(event, field) {
        handleInputChange(['nodeInstance'], event, field, fetchNodeInstances);
    }

    function selectNodeInstance(event, field) {
        handleInputChange([], event, field);
    }

    function renderInput(inputName, onInputChange) {
        const show = { showBlueprints, showDeployments, showNodeInstances, showNodes }[
            `show${_.upperFirst(inputName)}s`
        ];
        return (
            show && (
                <Form.Field error={errors[inputName]}>
                    <Form.Dropdown
                        search
                        selection
                        value={errors[inputName] ? getEmptyValueFor(inputName) : values[inputName]}
                        multiple={isMultipleSetFor(inputName)}
                        placeholder={errors[inputName] || _.startCase(inputName)}
                        options={options[inputName]}
                        onChange={onInputChange}
                        name={inputName}
                        loading={loading[inputName]}
                    />
                </Form.Field>
            )
        );
    }

    const { Form } = Stage.Basic;

    return (
        <Form.Group widths="equal">
            {renderInput('blueprint', selectBlueprint)}
            {renderInput('deployment', selectDeployment)}
            {renderInput('node', selectNode)}
            {renderInput('nodeInstance', selectNodeInstance)}
        </Form.Group>
    );
}

/**
 * @property {string} name name of the field
 * @property {string} value value of the field (object containing the following string valued keys: blueprintId, deploymentId, nodeId, nodeInstanceId)
 * @property {object} toolbox Toolbox object
 * @property {func} [onChange=_.noop] function to be called on value change
 * @property {bool} [allowMultiple=false] if set to true, then it will be allowed to select more than one blueprint, deployment, node and node instance
 * @property {bool} [allowMultipleBlueprints=false] if set to true, then it will be allowed to select more than one blueprint
 * @property {bool} [allowMultipleDeployments=false] if set to true, then it will be allowed to select more than one deployment
 * @property {bool} [allowMultipleNodes=false] if set to true, then it will be allowed to select more than one node
 * @property {bool} [allowMultipleNodeInstances=false] if set to true, then it will be allowed to select more than one node instance
 * @property {Array} [allowedBlueprints=null] array specifing allowed blueprints to be selected
 * @property {Array} [allowedDeployments=null] array specifing allowed deployments to be selected
 * @property {Array} [allowedNodes=null] array specifing allowed nodes to be selected
 * @property {Array} [allowedNodeInstances=null] array specifing allowed node instances to be selected
 * @property {bool} [showBlueprints=true] if set to false, then it will be not allowed to select blueprint
 * @property {bool} [showDeployments=true] if set to false, then it will be not allowed to select deployment
 * @property {bool} [showNodes=true] if set to false, then it will be not allowed to select node
 * @property {bool} [showNodeInstances=true] if set to false, then it will be not allowed to select node instance
 */
NodeFilter.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.shape({
        blueprintId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
        deploymentId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
        nodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
        nodeInstanceId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired
    }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    onChange: PropTypes.func,
    allowMultiple: PropTypes.bool,
    allowMultipleBlueprints: PropTypes.bool,
    allowMultipleDeployments: PropTypes.bool,
    allowMultipleNodes: PropTypes.bool,
    allowMultipleNodeInstances: PropTypes.bool,
    allowedBlueprints: PropTypes.arrayOf(PropTypes.string),
    allowedDeployments: PropTypes.arrayOf(PropTypes.string),
    allowedNodes: PropTypes.arrayOf(PropTypes.string),
    allowedNodeInstances: PropTypes.arrayOf(PropTypes.string),
    showBlueprints: PropTypes.bool,
    showDeployments: PropTypes.bool,
    showNodes: PropTypes.bool,
    showNodeInstances: PropTypes.bool
};

NodeFilter.defaultProps = {
    onChange: _.noop,
    allowMultiple: false,
    allowMultipleBlueprints: false,
    allowMultipleDeployments: false,
    allowMultipleNodeInstances: false,
    allowMultipleNodes: false,
    allowedBlueprints: null,
    allowedDeployments: null,
    allowedNodeInstances: null,
    allowedNodes: null,
    showBlueprints: true,
    showDeployments: true,
    showNodes: true,
    showNodeInstances: true
};

Stage.defineCommon({
    name: 'NodeFilter',
    common: React.memo(NodeFilter, _.isEqual)
});
