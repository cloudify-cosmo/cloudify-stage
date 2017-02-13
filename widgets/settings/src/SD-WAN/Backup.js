/**
 * Created by jakub on 2/3/17.
 */

import Button from '../../../../app/components/basic/control/Button';
import SelectableTable from './SelectableTable';

import cloneDeep from 'lodash/cloneDeep';

const _DESSCRIPTION = 'This SD-wan mechanism will forward traffic only to the primary interface. If primary interface fails the traffic will be forwarded to the backup interface.';
const _names = ['Primary', 'Backup'];


export default class Backup extends React.Component {

    constructor(props, context) {
        super(props, context);

        let selectedItems = cloneDeep(this.props.selectedItems);
        let selectable = cloneDeep(this.props.source);

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


    _callbackFromSelectableTable( data ) {
        let source = this.state.source;
        source.selectable = data.selectable;
        source.selectedItems = data.selectedItems;

        this.setState({
            source
        });
    }


    _saveData() {
        this.setState( {savingData: true} );
        setTimeout(function(){
            this.setState( {savingData: false} );
        }.bind(this), 400);

        this.props.onSaveData( this.state.source );
    }

    render() {
        return (<div className="ui segment">
            <div>
                {_DESSCRIPTION}
            </div>

            <br/>

            <SelectableTable
                source={this.state.source}
                names={_names}
                onMoveElement={ (this._callbackFromSelectableTable).bind(this) }
                only-one
                all="Interfaces"
                selected="Selected interface"
            />

            <br/>

            <Button loading={this.state.savingData} content='Apply' color="blue" onClick={this._saveData.bind(this)}/>
        </div>
        );
    }

}