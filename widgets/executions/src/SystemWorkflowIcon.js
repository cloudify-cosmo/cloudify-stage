/**
 * Created by jakub.niezgoda on 18/10/2018.
 */

export default class SystemWorkflowIcon extends React.Component {

    constructor(props, context){
        super(props, context);
    }

    static propTypes = {
        execution: PropTypes.object
    };

    static defaultProps = {
        execution: {is_system_workflow: false}
    };

    render() {
        let {Icon, Popup} = Stage.Basic;
        const execution = this.props.execution;

        return execution.is_system_workflow
            ? <Popup wide on='hover'>
                  <Popup.Trigger>
                      <Icon name='cogs' color='blue' />
                  </Popup.Trigger>
                  <Popup.Content>
                      System Workflow
                  </Popup.Content>
              </Popup>
            : null;
    }
}

