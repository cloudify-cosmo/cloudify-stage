/**
 * Created by Tamer on 30/07/2017.
 */
import PluginsCatalogModal from './PluginsCatalogModal';

/**
 * @class List
 * @extends {Component}
 */
export default class PluginsCatalogList extends React.Component {
  /**
   * Creates an instance of List.
   * @param {any} props 
   * @param {any} context 
   */
  constructor (props, context) {
    super (props, context);
    this.state = {
      showModal: false,
      plugin: null,
      success: null,
      selected: null,
    };
  }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.widget, nextProps.widget)
            || !_.isEqual(this.state, nextState)
            || !_.isEqual(this.props.data, nextProps.data);
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
  onSuccess (msg) {
    this.setState ({success: msg});
  }

  /**
   * Modal Events
   */
  showModal () {
    this.setState ({showModal: true});
  }
  hideModal () {
    this.setState ({showModal: false});
  }

  /**
   * Upload Click Event
   */
  onUpload (plugin) {
    this.setState ({plugin: plugin});
    this.showModal ();
  }

  /*
  |--------------------------------------------------------------------------
  | React Renderer
  |--------------------------------------------------------------------------
  */
  render () {
    let {DataTable, Image, Label, Message, Button} = Stage.Basic;

    let distro = `${this.props.toolbox.getManager()._data.distribution.toLowerCase()} ${this.props.toolbox.getManager()._data.distroRelease.toLowerCase()}`;
    let items = _.map (this.props.items, item => {
      var wagon = _.find(item.wagons, (wagon) => {
          return wagon.name.toLowerCase() === distro || wagon.name.toLowerCase() === 'any';
      });

      if(!!wagon) {
          return Object.assign({}, item, {
              isSelected: item.title === this.state.selected,
              wagon: wagon
          })
      }
    });
    items = _.compact(items);

    return (
      <div>
        {this.state.success &&
          <Message
            color="green"
            onDismiss={() => this.setState ({success: null})}
          >
            {this.state.success}
          </Message>}

        <DataTable noDataAvailable={items.length === 0} selectable={true}>
          <DataTable.Column  width="2%" />
          <DataTable.Column label="Name" name="plugin" width="20%" />
          <DataTable.Column label="Description" name="description" width="60%" />
          <DataTable.Column label="Version" name="plugin" width="10%" />
          <DataTable.Column width="5%" />

            {items.map (item => {
                return (
                      <DataTable.Row key={item.title}>
                        <DataTable.Data>
                          <Image src={item.icon} height="25" />
                        </DataTable.Data>
                        <DataTable.Data>{item.title}</DataTable.Data>
                        <DataTable.Data>{item.description}</DataTable.Data>
                        <DataTable.Data>{item.version}</DataTable.Data>
                        <DataTable.Data className="center aligned">
                          <Button
                              icon="upload"
                              onClick={event => {
                                  event.preventDefault ();
                                  this.onUpload(Object.assign({}, item.wagon, {yamlUrl: item.link, title: item.title}));
                              }}
                          />
                        </DataTable.Data>
                      </DataTable.Row>
                );
            })}
        </DataTable>

        <PluginsCatalogModal
          open={this.state.showModal}
          plugin={this.state.plugin}
          onSuccess={this.onSuccess.bind (this)}
          onHide={this.hideModal.bind (this)}
          toolbox={this.props.toolbox}
          actions={this.props.actions}
        />
      </div>
    );
  }
}
