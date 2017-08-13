/**
 * Created by Tamer on 31/07/2017.
 */

/**
 * @class Grid
 * @extends {Component}
 */
export default class PluginCatalogRow extends React.Component {
  /**
   * Creates an instance of Dialog.
   * @param {any} props 
   * @param {any} context 
   */
  constructor (props, context) {
    super (props, context);
  }

  /*
  |--------------------------------------------------------------------------
  | React Renderer
  |--------------------------------------------------------------------------
  */
  render () {
    let {DataSegment, Grid, Button} = Stage.Basic;
    return (
      <div style={{padding: '15px'}}>
        <DataSegment.Item>
          {this.props.item.description}
        </DataSegment.Item>
        <Grid columns={3} divided>
          <Grid.Row>
            {this.props.item.wagons.map ((item, idx) => {
              return (
                <Grid.Column key={idx}>
                  <DataSegment.Item>
                    <Grid columns={2} verticalAlign="middle">
                      <Grid.Row>
                        <Grid.Column width={14}>
                          <b>{item.name}</b>
                        </Grid.Column>
                        <Grid.Column width={2}>
                          <Button
                            icon="upload"
                            className="rightFloated"
                            onClick={event => {
                              event.preventDefault ();
                              this.props.onUpload (item);
                            }}
                          />
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </DataSegment.Item>
                </Grid.Column>
              );
            })}
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
