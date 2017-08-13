/**
 * Created by Tamer on 30/07/2017.
 */
import PluginsCatalogModal from './PluginsCatalogModal';
import PluginsCatalogRow from './PluginsCatalogRow';

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
    let {DataTable, Image, Label, Message} = Stage.Basic;

    let items = _.map (this.props.items, item => {
      return Object.assign ({}, item, {
        isSelected: item.title === this.state.selected,
      });
    });

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
          <DataTable.Column label="Name" name="plugin" width="50%" />
          <DataTable.Column label="Version" name="plugin" width="10%" />
          <DataTable.Column label="#Plugins" width="5%" />

          {items.map (item => {
            return (
              <DataTable.RowExpandable
                key={item.title}
                expanded={item.isSelected}
              >
                <DataTable.Row
                  key={item.title}
                  selected={item.isSelected}
                  onClick={() =>
                    this.setState ({
                      selected: this.state.selected !== item.title
                        ? item.title
                        : 'null',
                    })}
                >
                  <DataTable.Data>
                    <Image src={item.icon} height="25" />
                  </DataTable.Data>
                  <DataTable.Data>{item.title}</DataTable.Data>
                  <DataTable.Data>
                    {item.version}
                  </DataTable.Data>
                  <DataTable.Data>
                    <Label className="green" horizontal>
                      {item.wagons.length}
                    </Label>
                  </DataTable.Data>
                </DataTable.Row>
                <DataTable.DataExpandable>
                  <PluginsCatalogRow
                    item={item}
                    onUpload={this.onUpload.bind (this)}
                  />
                </DataTable.DataExpandable>
              </DataTable.RowExpandable>
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
