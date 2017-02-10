/**
 * Created by jakub on 2/3/17.
 */

import Button from '../../../../app/components/basic/control/Button';
import SelectableTable from './SelectableTable';

import cloneDeep from 'lodash/cloneDeep';

const _DESSCRIPTION = 'This SD-wan mechanism will Forward by default the traffic in Active-Backup mechanism.';
const _names = ['Primary', 'Backup'];

export default class Application extends React.Component {

    constructor(props, context) {
        super(props, context);

        let selectedItems = cloneDeep(this.props.selectedItems);
        let source = cloneDeep(this.props.source);

        this.state = {
            source: {
                selectable: source,
                selectedItems: selectedItems,
                selectedLeft: [null, null],
                selectedRight: [null, null]
            },
            savingData: false
        };

    }

    _source = null;

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
        return (
            <div className="ui segment">
                <div>
                    {_DESSCRIPTION}
                </div>

                <br/>

                <SelectableTable
                    source={this.state.source}
                    names={_names}
                    onMoveElement={ (this._callbackFromSelectableTable).bind(this)  }
                    all="Applications"
                    selected="Selected Applications"
                />
                <br/>

                <Button loading={this.state.savingData} content='Apply' color="blue" onClick={this._saveData.bind(this)}/>
            </div>
        );
    }

}