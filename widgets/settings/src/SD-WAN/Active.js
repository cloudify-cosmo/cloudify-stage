/**
 * Created by jakub on 2/3/17.
 */

import Button from '../../../../app/components/basic/control/Button';

export default class Active extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {};
    }

    _DESSCRIPTION = 'This SD-wan mechanism will load balance the traffic equally  between WAN interfaces';

    render() {
        return (<div className="ui segment">
            <label>
                {this._DESSCRIPTION}
            </label>

            <br/><br/>
            <Button positive content='Save'/>
        </div>);
    }

}