/**
 * Created by jakub on 2/3/17.
 */

import Button from '../../../../app/components/basic/control/Button';

export default class Backup extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            interfaces: [
                'LTE',
                'VDSL',
                'ADSL'
            ],
            selectedInterfaces: [],
            selectedLeft: null,
            selectedRight: null
        };
    }

    _DESSCRIPTION = 'This SD-wan mechanism will forward traffic only to the primary interface and if primary interface fails the traffic will be forwarded to the backup interfaces';

    _setSelected( event, index, left ) {
        if( left === true ) {
            this.setState({
                selectedLeft: index,
                selectedRight: null
            });
        } else {
            this.setState({
                selectedRight: index,
                selectedLeft: null
            });
        }
    }

    _moveToLeft () {
        let selectedInterfaces = this.state.selectedInterfaces;
        let interfaces = this.state.interfaces;

        if( this.state.selectedRight !== null ) {
            let selected = selectedInterfaces[this.state.selectedRight];
            interfaces.push(selected);
            selectedInterfaces = selectedInterfaces.filter( (item, index) => { return index !== this.state.selectedRight } );

            this.setState({
                interfaces,
                selectedInterfaces,
                selectedRight: null
            })
        }
    }

    _moveToRight () {

        let selectedInterfaces = this.state.selectedInterfaces;
        let interfaces = this.state.interfaces;

        if( this.state.selectedLeft !== null ) {
            let selected = interfaces[this.state.selectedLeft];
            selectedInterfaces.push(selected);
            interfaces = interfaces.filter( (item, index) => { return index !== this.state.selectedLeft } );

            this.setState({
                interfaces,
                selectedInterfaces,
                selectedLeft: null
            })
        }
    }

    render() {
        return (<div className="ui segment">
            <div>
                {this._DESSCRIPTION}
            </div>

            <h3>Primary</h3>
            <div className="ui grid equal width center aligned">

                <div className="column">
                    <table className="ui celled table">
                        <thead><tr><th>All</th></tr></thead>
                        <tbody>
                    {
                        this.state.interfaces.map(
                            (item, index) => (
                                <tr key={ index } >
                                    <td onClick={ (event) => this._setSelected(event, index, true) }
                                        className={ index === this.state.selectedLeft ? 'warning' : '' }>
                                        {item}
                                    </td>
                                </tr>
                            ))
                    }
                    </tbody></table>
                </div>

                <div className="column">
                    <Button icon="arrow left"
                            onClick={ () => this._moveToLeft() }
                            disabled={ this.state.selectedRight === null }></Button>
                    <Button icon="arrow right"
                            onClick={ () => this._moveToRight() }
                            disabled={ this.state.selectedInterfaces.length > 0 || this.state.selectedLeft === null }
                            ></Button>
                </div>

                <div className="column">
                    <table className="ui celled table">
                        <thead><tr><th>Selected</th></tr></thead>
                        <tbody>
                    {
                        this.state.selectedInterfaces.map(
                            (item, index) => (
                                <tr key={ index } >
                                    <td onClick={ (event) => this._setSelected(event, index, false) }
                                        className={ index === this.state.selectedRight ? 'warning' : '' }>
                                        {item}
                                    </td>
                                </tr>
                            ))
                    }
                    </tbody></table>
                </div>
            </div>

            <br/><br/>

            <Button positive content='Save'/>
        </div>);
    }

}