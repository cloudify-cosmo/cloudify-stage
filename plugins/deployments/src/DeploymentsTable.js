/**
 * Created by kinneretzin on 18/10/2016.
 */

import MenuAction from './MenuAction';
import React, { Component, PropTypes } from 'react';

export default class extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        widget: PropTypes.object.isRequired,
        fetchData: PropTypes.func,
        onSelectDeployment: PropTypes.func,
        onMenuAction: PropTypes.func

    };

    static defaultProps = {
        fetchData: ()=>{},
        onSelectDeployment: ()=>{},
        onMenuAction: ()=>{}
    };

    render() {
        var Grid = Stage.Basic.Grid;

        return (
            <Grid.Table fetchData={this.props.fetchData}
                        totalSize={this.props.data.total}
                        pageSize={this.props.widget.plugin.pageSize}
                        selectable={true}
                        className="deploymentTable">

                <Grid.Column label="Name" name="id" width="25%"/>
                <Grid.Column label="Blueprint" name="blueprint_id" width="25%"/>
                <Grid.Column label="Created" name="created_at" width="18%"/>
                <Grid.Column label="Updated" name="updated_at" width="18%"/>
                <Grid.Column width="14%"/>

                {
                    this.props.data.items.map((item)=>{
                        return (
                            <Grid.Row key={item.id} select={item.isSelected} onClick={()=>this.props.onSelectDeployment(item)}>
                                <Grid.Data><a className='deploymentName' href="javascript:void(0)">{item.id}</a></Grid.Data>
                                <Grid.Data>{item.blueprint_id}</Grid.Data>
                                <Grid.Data>{item.created_at}</Grid.Data>
                                <Grid.Data>{item.updated_at}</Grid.Data>
                                <Grid.Data className="center aligned rowActions">
                                    <MenuAction item={item} bordered={true} onSelectAction={this.props.onMenuAction}/>
                                </Grid.Data>
                            </Grid.Row>
                        );
                    })
                }
            </Grid.Table>
        );
    }
}