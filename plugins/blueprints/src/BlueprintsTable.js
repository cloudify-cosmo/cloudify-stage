/**
 * Created by kinneretzin on 02/10/2016.
 */

export default (pluginUtils)=> {

    return class extends React.Component {

        _selectBlueprint (item){
            var oldSelectedBlueprintId = this.props.context.getValue('blueprintId');
            this.props.context.setValue('blueprintId',item.id === oldSelectedBlueprintId ? null : item.id);
        }

        _createDeployment(item){
        }

        _deleteBlueprint(item){
        }

        render() {
            return (

                <table className="ui very compact table blueprintsTable">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Created</th>
                        <th>Updated</th>
                        <th># Deployments</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <tr key={item.id} className={"row "+ (item.isSelected ? 'active' : '')} onClick={this._selectBlueprint.bind(this,item)}>
                                    <td>
                                        <div>
                                            <a className='blueprintName' href="javascript:void(0)">{item.id}</a>
                                        </div>
                                    </td>
                                    <td>{item.created_at}</td>
                                    <td>{item.updated_at}</td>
                                    <td><div className="ui green horizontal label">{item.depCount}</div></td>
                                    <td>
                                        <div className="rowActions">
                                            <i className="rocket icon link bordered" title="Create deployment" onClick={this._createDeployment.bind(this,item)}></i>
                                            <i className="trash icon link bordered" title="Delete blueprint" onClick={this._deleteBlueprint.bind(this,item)}></i>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>

            );
        }
    };
};
