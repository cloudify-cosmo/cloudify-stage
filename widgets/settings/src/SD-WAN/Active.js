/**
 * Created by jakub on 2/3/17.
 */

import Button from '../../../../app/components/basic/control/Button';

export default class Active extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            savingData: false
        };
    }

    _DESSCRIPTION = 'This SD-wan mechanism will load balance the traffic equally  between WAN interfaces';

    _saveData(){
        this.setState( {savingData: true} );
        setTimeout(function(){
            this.setState( {savingData: false} );
        }.bind(this), 400);

        this.props.callback();
    }

    render() {
        return (
            <div className="ui segment">
            <label>
                {this._DESSCRIPTION}
            </label>

            <br/><br/>

            <Button loading={this.state.savingData} content='apply' color="blue" onClick={this._saveData.bind(this)}/>
        </div>);
    }

}