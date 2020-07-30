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
        function fillInputs(propertiesMap, nested) {
            _.each(propertiesMap, (property, propertyName) => {
                if (!newInputs[propertyName]) {
                    newInputs[propertyName] = { dependantProperties: [] };
                }

                if (_.isPlainObject(property)) {
                    // has dependant properties
                    _.each(
                        property,
                        dependantProperties =>
                            (newInputs[propertyName].dependantProperties = _.uniq([
                                ...newInputs[propertyName].dependantProperties,
                                ..._.keys(dependantProperties)
                            ]))
                    );
                }

                if (nested) {
                    newInputs[propertyName].values = [];
                } else {
                    newInputs[propertyName].values = _.isPlainObject(property) ? _.keys(property) : property;
                }

                if (_.isPlainObject(property)) {
                    _.each(property, childProperty => fillInputs(childProperty, true));
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

        _.each(inputs[propertyName].dependantProperties, dependantProperty =>
            clearValue(updatedInputs, dependantProperty, true)
        );
    }

    function findDependantProperties(propertiesSubTree, name, value) {
        if (propertiesSubTree[name] && propertiesSubTree[name][value]) {
            return propertiesSubTree[name][value];
        }

        for (const parentPropertyName of _.keys(propertiesSubTree)) {
            const propertyValue = inputs[parentPropertyName].currentValue;
            if (propertyValue && propertiesSubTree[parentPropertyName][propertyValue]) {
                const dependantProperties = findDependantProperties(
                    propertiesSubTree[parentPropertyName][propertyValue],
                    name,
                    value
                );
                if (dependantProperties) {
                    return dependantProperties;
                }
            }
        }

        return null;
    }

    function handleInputChange(event, { name, value }) {
        setErrors({});
        const updatedInputs = _.clone(inputs);

        // recursively clear values of dependant fields
        clearValue(updatedInputs, name);

        if (value) {
            updatedInputs[name].currentValue = value;
            // recursively traverse properties tree to set values for dependant fields
            const dependantProperties = findDependantProperties(properties, name, value);
            _.each(dependantProperties, (values, propertyName) => {
                updatedInputs[propertyName].values = _.isPlainObject(values) ? _.keys(values) : values;
            });
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
                                value={input.currentValue || ''}
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
