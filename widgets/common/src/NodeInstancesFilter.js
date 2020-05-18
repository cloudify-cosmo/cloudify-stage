/**
 * NodeInstancesFilter - a component showing dropdown with nodes instances of specified deployment.
 * Data is dynamically fetched from manager.
 *
 * @param props
 */
export default class NodeInstancesFilter extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = NodeInstancesFilter.initialState(props);
    }

    /**
     * propTypes
     *
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
    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
        toolbox: PropTypes.object.isRequired,
        deploymentId: PropTypes.string,
        label: PropTypes.string,
        placeholder: PropTypes.string,
        help: PropTypes.string,
        upward: PropTypes.bool
    };

    static defaultProps = {
        deploymentId: '',
        label: '',
        placeholder: '',
        help: '',
        upward: false
    };

    static initialState = props => ({
        value: props.value,
        nodeInstances: [],
        loading: false,
        errors: {}
    });

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.deploymentId !== this.props.deploymentId) {
            this.setState({ ...NodeInstancesFilter.initialState(this.props) });
            this.fetchData();
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        if (_.isEmpty(this.props.deploymentId)) {
            return;
        }

        const params = { _include: 'id', deployment_id: this.props.deploymentId };
        const fetchUrl = '/node-instances';
        const errors = { ...this.state.errors };
        errors.nodeInstanceIds = null;

        this.setState({ loading: true, nodeInstances: [], errors });
        this.props.toolbox
            .getManager()
            .doGet(fetchUrl, params)
            .then(data => {
                const parsedData = _.chain(data.items || {})
                    .map(item => ({ text: item.id, value: item.id, key: item.id }))
                    .unshift({ text: '', value: '', key: '' })
                    .uniqWith(_.isEqual)
                    .value();
                this.setState({ loading: false, nodeInstances: parsedData });
            })
            .catch(error => {
                errors.nodeInstanceIds = `Data fetching error: ${error.message}`;
                this.setState({ loading: false, nodeInstances: [], errors });
            });
    }

    handleInputChange(event, field) {
        this.setState({ value: field.value }, () => {
            this.props.onChange(event, {
                name: this.props.name,
                value: this.state.value
            });
        });
    }

    render() {
        const { Form } = Stage.Basic;
        const { errors } = this.state;

        return (
            <Form.Field error={this.state.errors.nodeInstanceIds} label={this.props.label} help={this.props.help}>
                <Form.Dropdown
                    search
                    selection
                    multiple
                    value={errors.nodeInstanceIds ? '' : this.state.value}
                    placeholder={errors.nodeInstanceIds || this.props.placeholder}
                    options={this.state.nodeInstances}
                    onChange={this.handleInputChange.bind(this)}
                    name="nodeInstanceIds"
                    loading={this.state.loading}
                    upward={this.props.upward}
                />
            </Form.Field>
        );
    }
}

Stage.defineCommon({
    name: 'NodeInstancesFilter',
    common: NodeInstancesFilter
});
