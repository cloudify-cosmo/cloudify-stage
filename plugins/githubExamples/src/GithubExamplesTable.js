/**
 * Created by kinneretzin on 20/10/2016.
 */

export default class extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
        }
    }

    _refreshData() {
        this.props.context.refresh();
    }

    componentDidMount() {
        this.props.context.getEventBus().on('githubExamples:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.context.getEventBus().off('githubExamples:refresh', this._refreshData);
    }


    _selectExample(item) {
        var oldSelectedExampleName = this.props.context.getValue('exampleName');
        this.props.context.setValue('exampleName',item.name === oldSelectedExampleName ? null : item.name);
    }
    
    render() {
        return (
            <div>
                {
                    this.state.error ?
                        <div className="ui error message" style={{"display":"block"}}>
                            <div className="header">Error Occured</div>
                            <p>{this.state.error}</p>
                        </div>
                        :
                        ''
                }

                <table className="ui very compact table githubExamplesTable">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <tr key={item.id} className={'row ' + (item.isSelected ? 'active' : '')} onClick={this._selectExample.bind(this,item)}>
                                    <td><a href={item.html_url} target="_blank">{item.name}</a></td>
                                    <td>{item.description}</td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}
