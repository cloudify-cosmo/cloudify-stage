/**
 * Created by jakub on 2/6/17.
 */

import Button from '../../../../app/components/basic/control/Button';


export default class SelectableTable extends React.Component {

    _callback = null;
    _onlyOne = false;

    constructor(props, context) {
        super(props, context);

        let source = props['source'];
        let names = props['names'];

        this._callback = props['callback'];

        if( props['only-one'] !== undefined ) {
            this._onlyOne = true;
        }

        source.names = names;
        this.state = source;
    }

    _setSelected( event, index, left, dest ) {
        let selectedRight = this.state.selectedRight;
        let selectedLeft = this.state.selectedLeft;

        if( left === true ) {
            selectedLeft[dest] = index;
            selectedRight = [null, null];
        } else {
            selectedLeft = [null, null];
            selectedRight[dest] = index;
        }
        this.setState({
            selectedLeft,
            selectedRight
        });
    }

    _moveToLeft ( dest ) {
        let selectedItems = this.state.selectedItems;
        let selectable = this.state.selectable;
        let selectedRight = this.state.selectedRight;

        if( this.state.selectedRight[dest] !== null ) {
            let selected = selectedItems[dest][this.state.selectedRight[dest]];
            selectable.push(selected);
            selectedItems[dest] = selectedItems[dest].filter( (item, index) => { return index !== this.state.selectedRight[dest] } );
            selectedRight[dest] = null;

            this.setState({
                selectable,
                selectedItems,
                selectedRight
            })
        }

        this._callback( Object.assign({}, {
            selectable,
            selectedItems,
            selectedRight
        }) );
    }

    _moveToRight ( dest ) {
        let selectedItems = this.state.selectedItems;
        let selectable = this.state.selectable;
        let selectedLeft = this.state.selectedLeft;

        if( this.state.selectedLeft[dest] !== null ) {
            let selected = selectable[this.state.selectedLeft[dest]];
            selectedItems[dest].push(selected);
            selectable = selectable.filter( (item, index) => { return index !== this.state.selectedLeft[dest] } );
            selectedLeft = [null, null];

            this.setState({
                selectable,
                selectedItems,
                selectedLeft
            })
        }

        this._callback( Object.assign({}, {
            selectable,
            selectedItems,
            selectedLeft
        }) );
    }

    _generateSelectableTable (dest, name ) {

        return (
            <div>
                <h3>{ name }</h3>
                <div className="ui grid equal width center aligned">

                    <div className="column">
                        <table className="ui celled table">
                            <thead><tr><th>All</th></tr></thead>
                            <tbody>
                            {
                                this.state.selectable.map(
                                    (item, index) => (
                                        <tr key={ index } >
                                            <td onClick={ (event) => this._setSelected(event, index, true, dest) }
                                                className={ index === this.state.selectedLeft[dest] ? 'warning' : '' }>
                                                {item}
                                            </td>
                                        </tr>
                                    ))
                            }
                            </tbody></table>
                    </div>

                    <div className="column">
                        <Button icon="arrow left"
                                onClick={ () => this._moveToLeft(dest) }
                                disabled={ this.state.selectedRight[dest] === null }></Button>
                        <Button icon="arrow right"
                                onClick={ () => this._moveToRight(dest) }
                                disabled={ (this.state.selectedItems[dest].length > 0 && this._onlyOne) || this.state.selectedLeft[dest] === null }
                        ></Button>
                    </div>

                    <div className="column">
                        <table className="ui celled table">
                            <thead><tr><th>Selected</th></tr></thead>
                            <tbody>
                            {
                                this.state.selectedItems[dest].map(
                                    (item, index) => (
                                        <tr key={ index } >
                                            <td onClick={ (event) => this._setSelected(event, index, false, dest) }
                                                className={ index === this.state.selectedRight[dest] ? 'warning' : '' }>
                                                {item}
                                            </td>
                                        </tr>
                                    ))
                            }
                            </tbody></table>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return(
            <div>
                { this._generateSelectableTable( 0, this.state.names[0] ) }

                <br/>

                { this._generateSelectableTable( 1, this.state.names[1] ) }
            </div>
        )
    }

}
