/**
 * Created by Tamer on 30/07/2017.
 */
import PluginsCatalogModal from './PluginsCatalogModal';

/**
 * @class List
 * @augments {Component}
 */
export default class PluginsCatalogList extends React.Component {
    /**
     * Creates an instance of List.
     *
     * @param {any} props
     * @param {any} context
     */
    constructor(props, context) {
        super(props, context);
        this.state = {
            showModal: false,
            plugin: null,
            success: null,
            selected: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    /*
  |--------------------------------------------------------------------------
  | Custom Events
  |--------------------------------------------------------------------------
  */
    /**
     * onSuccess Event
     *
     * @param {any} msg
     */
    onSuccess(msg) {
        this.setState({ success: msg });
    }

    /**
     * Modal Events
     */
    showModal() {
        this.setState({ showModal: true });
    }

    hideModal() {
        this.setState({ showModal: false });
    }

    /**
     * Upload Click Event
     *
     * @param plugin
     */
    onUpload(plugin) {
        this.setState({ plugin });
        this.showModal();
    }

    /*
  |--------------------------------------------------------------------------
  | React Renderer
  |--------------------------------------------------------------------------
  */
    render() {
        const { plugin, selected, showModal, success } = this.state;
        const { actions, items: itemsProp, toolbox } = this.props;
        const NO_DATA_MESSAGE = "There are no Plugins available in catalog. Check widget's configuration.";
        const { DataTable, Message, Button } = Stage.Basic;
        const { PluginIcon } = Stage.Common;

        const distro = `${toolbox
            .getManager()
            .getDistributionName()
            .toLowerCase()} ${toolbox
            .getManager()
            .getDistributionRelease()
            .toLowerCase()}`;
        let items = _.map(itemsProp, item => {
            const wagon = _.find(item.wagons, wagon => {
                return wagon.name.toLowerCase() === distro || wagon.name.toLowerCase() === 'any';
            });

            if (wagon) {
                return { ...item, isSelected: item.title === selected, wagon };
            }
        });
        items = _.compact(items);

        return (
            <div>
                {success && (
                    <Message color="green" onDismiss={() => this.setState({ success: null })}>
                        {success}
                    </Message>
                )}

                <DataTable noDataAvailable={items.length === 0} selectable noDataMessage={NO_DATA_MESSAGE}>
                    <DataTable.Column width="2%" />
                    <DataTable.Column label="Name" width="20%" />
                    <DataTable.Column label="Description" width="60%" />
                    <DataTable.Column label="Version" width="10%" />
                    <DataTable.Column width="5%" />

                    {items.map(item => {
                        return (
                            <DataTable.Row key={item.title}>
                                <DataTable.Data>
                                    <PluginIcon src={item.icon} />
                                </DataTable.Data>
                                <DataTable.Data>{item.title}</DataTable.Data>
                                <DataTable.Data>{item.description}</DataTable.Data>
                                <DataTable.Data>{item.version}</DataTable.Data>
                                <DataTable.Data className="center aligned">
                                    <Button
                                        icon="upload"
                                        onClick={event => {
                                            event.preventDefault();
                                            this.onUpload({
                                                ...item.wagon,
                                                ..._.pick(item, 'title', 'icon'),
                                                yamlUrl: item.link
                                            });
                                        }}
                                    />
                                </DataTable.Data>
                            </DataTable.Row>
                        );
                    })}
                </DataTable>

                <PluginsCatalogModal
                    open={showModal}
                    plugin={plugin}
                    onSuccess={this.onSuccess.bind(this)}
                    onHide={this.hideModal.bind(this)}
                    toolbox={toolbox}
                    actions={actions}
                />
            </div>
        );
    }
}
