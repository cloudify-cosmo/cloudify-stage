/**
 * Created by kinneretzin on 19/10/2016.
 */

export default class extends React.Component {
    constructor(props,context) {
        super(props,context);

        this.state = {
        }
    }

    onSelectWorkflow(value, text, $choice) {
        var workflow = _.find( this.props.item.workflows,{name: value});
        console.log('selected workflow '+ value,workflow);

        this.props.onWorkflowSelected(this.props.item,workflow);
    }

    render () {
        return (
            <div className="ui dropdown top right pointing" ref={(dropdown)=>$(dropdown).dropdown({onChange: this.onSelectWorkflow.bind(this)})} onClick={(e)=>e.stopPropagation()}>
                <i className="road icon link bordered" title="Execute workflow"></i>
                <div className="menu">
                    {
                        this.props.item.workflows.map((workflow)=>{
                            return <div key={workflow.name} className="item">{workflow.name}</div>
                        })
                    }
                </div>
            </div>

        );
    }
}
