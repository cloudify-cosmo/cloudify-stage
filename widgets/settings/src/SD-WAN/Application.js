/**
 * Created by jakub on 2/3/17.
 */

import Button from '../../../../app/components/basic/control/Button';
import SelectableTable from './SelectableTable';

export default class Application extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
        };

        this._source = {
            selectable: this.props.source,
            selectedItems: this.props.selectedItems,
            selectedLeft: [null, null],
            selectedRight: [null, null]
        };
    }

    _source = null;

    _DESSCRIPTION = 'This SD-wan mechanism will Forward by default  the traffic in Active-Backup mechanism.';

    _callbackFromSelectableTable( data ) {
        this.setState({

        });
    }

    _names = ['Primary', 'Backup'];

    render() {
        return (
            <div className="ui segment">
                <div>
                    {this._DESSCRIPTION}
                </div>

                <br/>

                <SelectableTable
                    source={this._source}
                    names={this._names}
                    callback={ (this._callbackFromSelectableTable).bind(this)  } />

                <br/>

                <Button content='apply' color="blue"/>
            </div>
        );
    }

}