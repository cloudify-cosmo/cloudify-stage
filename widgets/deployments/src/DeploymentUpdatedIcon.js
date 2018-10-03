/**
 * Created by jakub.niezgoda on 09/05/2018.
 */

import PropTypes from 'prop-types';

export default class DeploymentUpdatedIcon extends React.Component {

    constructor(props, context){
        super(props, context);
    }

    static propTypes = {
        deployment: PropTypes.object,
        className: PropTypes.string
    };

    static defaultProps = {
        deployment: {isUpdated: false, updated_at: null},
        className: '',
    };

    render() {
        let {Icon, Popup} = Stage.Basic;
        const deployment = this.props.deployment;

        return deployment.isUpdated
            ? <Popup wide on='hover'>
                  <Popup.Trigger>
                      <Icon.Group size='large' className={this.props.className} style={{marginLeft: '6px', marginTop: '-4px'}}>
                          <Icon name='cube' color='blue' />
                          <Icon corner name='refresh' color='blue' />
                      </Icon.Group>
                  </Popup.Trigger>
                  <Popup.Header>
                      Deployment updated
                  </Popup.Header>
                  <Popup.Content>
                      <p>This deployment has been updated at least once since creation.</p>
                      <p>Last update was on: <strong>{deployment.updated_at}</strong>.</p>
                  </Popup.Content>
              </Popup>
            : null;
    }
}

