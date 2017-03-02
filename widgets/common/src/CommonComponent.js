/**
 * Created by kinneretzin on 02/03/2017.
 */


export default class CommonComponent extends React.Component {
    render() {
        return (
            <div>Im from Common {this.props.prop}</div>
        );
    }
}

Stage.defineCommon({
    name: 'Comp1',
    common: CommonComponent
});
