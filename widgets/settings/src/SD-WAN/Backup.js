/**
 * Created by jakub on 2/3/17.
 */

import Button from '../../../../app/components/basic/control/Button';
import SelectableTable from './SelectableTable';

export default class Backup extends React.Component {

    constructor(props, context) {
        super(props, context);

        let selectedItems = JSON.parse(JSON.stringify(this.props.selectedItems));
        let selectable = JSON.parse(JSON.stringify(this.props.source));

        this.state = {
            source: {
                selectable: selectable,
                selectedItems: selectedItems,
                selectedLeft: [null, null],
                selectedRight: [null, null],
                savingData: false
            }
        };
    }

    _source = null;
    _DESSCRIPTION = 'This SD-wan mechanism will forward traffic only to the primary interface and if primary interface fails the traffic will be forwarded to the backup interfaces';

    _callbackFromSelectableTable( data ) {
        let source = this.state.source;
        source.selectable = data.selectable;
        source.selectedItems = data.selectedItems;

        this.setState({
            source
        });
    }

    _names = ['Primary', 'Backup'];

    _saveData() {
        this.setState( {savingData: true} );
        setTimeout(function(){
            this.setState( {savingData: false} );
        }.bind(this), 400);

        this.props.callback( this.state.source );
    }

    render() {
        return (<div className="ui segment">
            <div>
                {this._DESSCRIPTION}
            </div>

            <br/>

            <SelectableTable
                source={this.state.source}
                names={this._names}
                callback={ (this._callbackFromSelectableTable).bind(this) }
                only-one />

            <br/>

            <Button loading={this.state.savingData} content='apply' color="blue" onClick={this._saveData.bind(this)}/>
        </div>
        );
    }

}