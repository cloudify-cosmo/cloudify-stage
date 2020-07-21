/**
 * Created by Tamer on 14/08/2017.
 */

export default class MyResourcesCheckbox extends React.Component {
    handleChange(proxy, elm) {
        const { toolbox } = this.props;
        toolbox.getContext().setValue('onlyMyResources', elm.checked);
        toolbox.getEventBus().trigger('plugins:refresh');
        toolbox.getEventBus().trigger('snapshots:refresh');
        toolbox.getEventBus().trigger('blueprints:refresh');
        toolbox.getEventBus().trigger('deployments:refresh');
    }

    render() {
        const { Checkbox } = Stage.Basic;
        return <Checkbox toggle label="Show Only my Resources" onChange={this.handleChange.bind(this)} />;
    }
}

MyResourcesCheckbox.propTypes = {
    toolbox: Stage.PropTypes.Toolbox.isRequired
};
