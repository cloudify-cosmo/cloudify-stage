/**
 * Created by jakub.niezgoda on 18/10/2018.
 */

export default class DryRunIcon extends React.Component {

    constructor(props, context){
        super(props, context);
    }

    static propTypes = {
        execution: PropTypes.object
    };

    static defaultProps = {
        execution: {is_dry_run: false}
    };

    render() {
        let {Icon, Popup} = Stage.Basic;
        const execution = this.props.execution;

        return execution.is_dry_run
            ? <Popup wide on='hover'>
                  <Popup.Trigger>
                      <Icon name='clipboard check' color='green' />
                  </Popup.Trigger>
                  <Popup.Content>
                      Dry Run
                  </Popup.Content>
              </Popup>
            : null;
    }
}

