/**
 * Created by Tamer on 14/08/2017.
 */

export default class MyResourcesCheckbox extends React.Component {

    handleChange(proxy, elm){
        this.props.toolbox.getContext ().setValue ('onlyMyResources', elm.checked);
        this.props.toolbox.getEventBus().trigger('plugins:refresh');
        this.props.toolbox.getEventBus().trigger('snapshots:refresh');
        this.props.toolbox.getEventBus().trigger('blueprints:refresh');
        this.props.toolbox.getEventBus().trigger('deployments:refresh');
    }

    render() {
        var {Checkbox} = Stage.Basic;
        return ( 
            <Checkbox toggle label="Show Only my Resources" onChange={this.handleChange.bind(this)} />
        );
    }
}