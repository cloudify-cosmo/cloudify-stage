/**
 * Created by jakub.niezgoda on 09/05/2018.
 */

import PropTypes from 'prop-types';

export default class DeploymentUpdatedIcon extends React.Component {

    constructor(props, context){
        super(props, context);
        this.state = {
        }
    }

    static propTypes = {
        show: PropTypes.boolean,
        className: PropTypes.string
    };

    static defaultProps = {
        show: true,
        className: '',
    };

    render() {
        let {Icon, Popup} = Stage.Basic;

        return this.props.show
            ? <Popup wide on='hover'>
                  <Popup.Trigger>
                      <Icon name='exclamation triangle' color='yellow' bordered className={this.props.className}/>
                  </Popup.Trigger>
                  <Popup.Content>
                      This deployment was updated after creation
                  </Popup.Content>
              </Popup>
            : null;
    }
}

