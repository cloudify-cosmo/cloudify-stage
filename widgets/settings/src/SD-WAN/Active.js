/**
 * Created by jakub on 2/3/17.
 */

import Button from '../../../../app/components/basic/control/Button';

const _DESSCRIPTION = 'This SD-wan mechanism will load balance the traffic equally  between WAN interfaces';

export default class Active extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            savingData: false
        };
    }

    _saveData(){
        this.setState( {savingData: true} );
        setTimeout(function(){
            this.setState( {savingData: false} );
        }.bind(this), 400);

        this.props.onSaveData();
    }

    render() {
        return (
            <div className="ui segment">
            <label>
                {_DESSCRIPTION}
            </label>

            <br/><br/>

            <Button loading={this.state.savingData} content='Apply' color="blue" onClick={this._saveData.bind(this)}/>
        </div>);
    }

}