/**
 * Created by jakub on 2/3/17.
 */

import Button from '../../../../app/components/basic/control/Button';
import SelectableTable from './SelectableTable';

export default class Backup extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            source: {
                selectable: this.props.source,
                selectedItems: this.props.selectedItems,
                selectedLeft: [null, null],
                selectedRight: [null, null]
            }
        };

        console.log(" call to sdwan: ")
        console.log( props.callback )
        this._callbackToSDWAN = props.callback;
    }

    _source = null;
    _callbackToSDWAN = null;

    _DESSCRIPTION = 'This SD-wan mechanism will forward traffic only to the primary interface and if primary interface fails the traffic will be forwarded to the backup interfaces';

    _callbackFromSelectableTable( data ) {
        let source = this.state.source;
        source.selectable = data.selectable;
        source.selectedItems = data.selectedItems;

        this.setState({
            source
        });

        console.log("*** callback")
        console.log( data )
        console.log( this.state )
        console.log("***")

        this._callbackToSDWAN( Object.assign({}, this.state.source) );
    }

    _names = ['Primary', 'Backup'];

    render() {
        return (<div className="ui segment">
            <div>
                {this._DESSCRIPTION}
            </div>

            <br/>

            <SelectableTable source={this.state.source} names={this._names} callback={ (this._callbackFromSelectableTable).bind(this) } only-one />

            <br/>

            <Button content='apply' color="blue"/>
        </div>
        );
    }

}