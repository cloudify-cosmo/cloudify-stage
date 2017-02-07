/**
 * Created by jakub on 2/3/17.
 */

import Button from '../../../../app/components/basic/control/Button';
import SelectableTable from './SelectableTable';

export default class Application extends React.Component {

    constructor(props, context) {
        super(props, context);

        let selectedItems = JSON.parse(JSON.stringify(this.props.selectedItems));
        let source = JSON.parse(JSON.stringify(this.props.source));

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
    _DESSCRIPTION = 'This SD-wan mechanism will Forward by default the traffic in Active-Backup mechanism.';

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
        return (
            <div className="ui segment">
                <div>
                    {this._DESSCRIPTION}
                </div>

                <br/>

                <SelectableTable
                    source={this.state.source}
                    names={this._names}
                    callback={ (this._callbackFromSelectableTable).bind(this)  }
                    all="Applications"
                    selected="Selected Applications"
                />
                <br/>

                <Button loading={this.state.savingData} content='Apply' color="blue" onClick={this._saveData.bind(this)}/>
            </div>
        );
    }

}