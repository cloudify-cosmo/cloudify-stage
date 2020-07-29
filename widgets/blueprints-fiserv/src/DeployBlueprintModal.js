function chooseId(baseId, promise) {
    const maxSuffixNumber = 1000;
    const isIdInList = (items, id) => !_.isUndefined(_.find(items, { id }));

    let id = baseId;
    let idChosen = false;
    return promise().then(({ items }) => {
        idChosen = !isIdInList(items, id);

        for (let i = 0; i < maxSuffixNumber && !idChosen; i++) {
            id = `${baseId}_${i}`;
            idChosen = !isIdInList(items, id);
        }

        return idChosen ? Promise.resolve(id) : Promise.reject(`Not found unused deployment ID.`);
    });
}

export default function({ blueprintId, open, onHide, properties, toolbox }) {
    const { useEffect, useState } = React;

    const [loading, setLoading] = useState(true);
    const [deploymentId, setDeploymentId] = useState('');
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});

    const { ApproveButton, CancelButton, Form, Icon, LoadingOverlay, Modal } = Stage.Basic;

    function chooseDeploymentId(initialDeploymentId) {
        const deploymentActions = new Stage.Common.DeploymentActions(toolbox);
        return chooseId(initialDeploymentId, () =>
            deploymentActions.doGetDeployments({ _search: initialDeploymentId })
        );
    }

    useEffect(() => {
        if (!open) {
            return;
        }

        chooseDeploymentId(blueprintId).then(deployemntId => {
            setDeploymentId(deployemntId);
            setLoading(false);
        });

        const newInputs = {};
        function fillInputs(propertiesMap, parentPropValue) {
            _.each(propertiesMap, (property, propertyName) => {
                if (!newInputs[propertyName]) {
                    newInputs[propertyName] = { possibleValues: [] };
                }

                if (_.isPlainObject(property)) {
                    newInputs[propertyName].possibleValues.push(
                        ..._.map(property, (allowedProperties, value) => ({
                            value,
                            allows: _.mapValues(allowedProperties, allowedValues =>
                                _.isPlainObject(allowedValues) ? _.keys(allowedValues) : allowedValues
                            )
                        }))
                    );
                } else if (_.isArray(property)) {
                    newInputs[propertyName].possibleValues.push(...property.map(value => ({ value })));
                }

                newInputs[propertyName].possibleValues = _.uniqBy(newInputs[propertyName].possibleValues, 'value');

                if (parentPropValue) {
                    newInputs[propertyName].values = [];
                } else {
                    newInputs[propertyName].values = _.map(newInputs[propertyName].possibleValues, 'value');
                }

                if (_.isPlainObject(property)) {
                    _.each(property, childProperty => fillInputs(childProperty, {}));
                }
            });
        }
        fillInputs(properties);
        setInputs(newInputs);
    }, [open]);

    function clearValue(updatedInputs, propertyName, clearValues) {
        updatedInputs[propertyName].currentValue = null;
        if (clearValues) {
            updatedInputs[propertyName].values = [];
        }

        _.each(inputs[propertyName].possibleValues, ({ allows }) =>
            _.each(allows, (values, dependantProperty) => clearValue(updatedInputs, dependantProperty, true))
        );
    }

    function handleInputChange(event, { name, value }) {
        setErrors({});
        const updatedInputs = _.clone(inputs);
        if (value) {
            updatedInputs[name].currentValue = value;
            // set values for dependant fields
            _.chain(inputs[name].possibleValues)
                .find({ value })
                .get('allows')
                .each((values, property) => {
                    updatedInputs[property].values = values;
                    if (
                        updatedInputs[property].currentValue &&
                        !_.includes(values, updatedInputs[property].currentValue)
                    ) {
                        clearValue(updatedInputs, property);
                    }
                })
                .value();
        } else {
            // recursively clear values of dependant fields
            clearValue(updatedInputs, name);
        }
        setInputs(updatedInputs);
    }

    function deployBlueprint(deploymentInputs) {
        const { BlueprintActions, InputsUtils } = Stage.Common;
        const blueprintActions = new BlueprintActions(toolbox);
        return blueprintActions
            .doDeploy({ id: blueprintId }, deploymentId, deploymentInputs, 'tenant', false, '', false)
            .catch(err => Promise.reject(InputsUtils.getErrorObject(err.message)));
    }

    function waitForDeploymentIsCreated() {
        const { DeploymentActions } = Stage.Common;

        const deploymentActions = new DeploymentActions(toolbox);

        return deploymentActions
            .waitUntilCreated(deploymentId)
            .catch(err => Promise.reject(`Deployment ${deploymentId} environment creation failed. ${err}`));
    }

    function installDeployment() {
        const { DeploymentActions } = Stage.Common;

        const deploymentActions = new DeploymentActions(toolbox);

        return deploymentActions
            .doExecute({ id: deploymentId }, { name: 'install' }, {}, false, false, false)
            .catch(err => Promise.reject({ errors: `Deployment ${deploymentId} installation failed: ${err.message}` }));
    }

    function onSubmit() {
        setErrors({});
        setLoading(true);
        deployBlueprint(_.mapValues(inputs, 'currentValue'))
            .then(waitForDeploymentIsCreated)
            .then(installDeployment)
            .then(onHide)
            .catch(errors => {
                setLoading(false);
                setErrors(errors);
            });
    }

    return (
        <Modal open={open} onClose={() => onHide()} closeOnEscape={false} className="deployBlueprintModal">
            <Modal.Header>
                <Icon name="rocket" /> Setup Properties
            </Modal.Header>

            <Modal.Content>
                <Form errors={errors}>
                    {loading && <LoadingOverlay />}
                    <Form.Field label="Deployment name">
                        <Form.Input
                            name={deploymentId}
                            value={deploymentId}
                            onChange={(e, { value }) => setDeploymentId(value)}
                        ></Form.Input>
                    </Form.Field>
                    {_.map(inputs, (input, inputName) => (
                        <Form.Field key={inputName} label={inputName}>
                            <Form.Dropdown
                                disabled={_.isEmpty(input.values)}
                                selection
                                name={inputName}
                                value={input.currentValue}
                                options={_.map(input.values, value => ({ key: value, value, text: value }))}
                                onChange={handleInputChange}
                            ></Form.Dropdown>
                        </Form.Field>
                    ))}
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onHide} disabled={loading} />
                <ApproveButton
                    onClick={onSubmit}
                    disabled={loading}
                    content="Deploy & Install"
                    icon="cogs"
                    className="green"
                />
            </Modal.Actions>
        </Modal>
    );
}
