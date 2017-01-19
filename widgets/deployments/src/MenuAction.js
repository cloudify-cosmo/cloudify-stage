/**
 * Created by kinneretzin on 19/10/2016.
 */

export default class extends React.Component {

    onDropdownChange(value, text, $choice) {
        if ($choice.hasClass("workflow")) {
            var workflow = _.find(this.props.item.workflows,{name: value});
            console.log('selected workflow '+ value,workflow);
            this.props.onSelectAction(value, this.props.item, workflow);
        } else {
            this.props.onSelectAction(value, this.props.item);
        }
    }

    render () {
        return (
            <div className="ui icon top right pointing dropdown" ref={(dropdown)=>$(dropdown).dropdown({onChange: this.onDropdownChange.bind(this)})} onClick={(e)=>e.stopPropagation()}>
                <i className={this.props.bordered?'road icon link bordered':'ellipsis vertical large link icon'}></i>
                <div className="menu" ref="popupMenu">
                    <div className="header"><i className="road icon"></i>Execute workflow</div>
                    <div className="divider"></div>
                    {
                        this.props.item.workflows.map((workflow)=>{
                            return <div key={workflow.name} className="item workflow" data-value={workflow.name}><span className="indent">{_.capitalize(_.lowerCase(workflow.name))}</span></div>
                        })
                    }
                    <div className="divider"></div>
                    <div className="item" data-value="edit"><i className="edit icon"></i>Edit</div>
                    <div className="item" data-value="delete"><i className="remove icon"></i>Delete</div>
                </div>
            </div>
        );
    }
}
