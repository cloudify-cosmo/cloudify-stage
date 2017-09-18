/**
 * Created by jakubniezgoda on 18/09/2017.
 */

let PropTypes = React.PropTypes;

export default class TimeFilter extends React.Component {

    static propTypes = {
        toolbox: PropTypes.object.isRequired
    };

    _onDataChanged(timeFilter) {
        this.props.toolbox.getContext().setValue('timeFilter', timeFilter);
        this.props.toolbox.getEventBus().trigger('graph:refresh');
    };

    _getTimeFilterValue() {
        return this.props.toolbox.getContext().getValue('timeFilter');
    }

    render () {
        let {Form} = Stage.Basic;

        return (
            <Form.InputTimeFilter name='timeFilter' value={this._getTimeFilterValue()} onApply={this._onDataChanged.bind(this)} />
        );
    }
}
