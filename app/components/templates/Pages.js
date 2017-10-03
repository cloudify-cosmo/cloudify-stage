/**
 * Created by pposel on 11/08/2017.
 */

import React, { Component, PropTypes } from 'react';
import CreatePageModal from './CreatePageModal';
import TemplateList from './TemplateList';

export default class Pages extends Component {

    static propTypes = {
        pages: PropTypes.array,
        onSelectPage: PropTypes.func,
        onCreatePage: PropTypes.func,
        onDeletePage: PropTypes.func,
        onCanDeletePage: PropTypes.func,
        onEditPage: PropTypes.func,
        onPreviewPage: PropTypes.func
    }

    static defaultProps = {
        pages: []
    }

    render () {
        let {Segment, Header, DataTable, Icon, PopupConfirm, Label} = Stage.Basic;

        return (
            <Segment color="red">
                <Header dividing as="h5">Pages</Header>

                <DataTable>

                    <DataTable.Column label="Page id" width="25%"/>
                    <DataTable.Column label="Page name" width="25%"/>
                    <DataTable.Column label="Templates" width="10%"/>
                    <DataTable.Column label="Created at" width="15%"/>
                    <DataTable.Column label="Creator" width="15%"/>
                    <DataTable.Column width="10%"/>

                    {
                        this.props.pages.map((item)=>{
                            return (
                                <DataTable.RowExpandable key={item.id} expanded={item.selected}>
                                    <DataTable.Row key={item.id} selected={item.selected} onClick={() => this.props.onSelectPage(item)}>
                                        <DataTable.Data><Header as='a' size="small">{item.id}</Header></DataTable.Data>
                                        <DataTable.Data>{item.name}</DataTable.Data>
                                        <DataTable.Data><Label color="blue" horizontal>{_.size(item.templates)}</Label></DataTable.Data>
                                        <DataTable.Data>{item.createdAt && Stage.Utils.formatTimestamp(item.createdAt)}</DataTable.Data>
                                        <DataTable.Data>{item.creator}</DataTable.Data>
                                        <DataTable.Data className="center aligned rowActions">
                                            {item.custom ?
                                                <div>
                                                    <PopupConfirm trigger={<Icon name="remove" link
                                                                                 onClick={e => e.stopPropagation()}/>}
                                                                  content='Are you sure to remove this page?'
                                                                  onConfirm={() => this.props.onDeletePage(item)}
                                                                  onCanConfirm={() => this.props.onCanDeletePage(item)}/>
                                                    <Icon name="edit" link className='updatePageIcon' onClick={e => {e.stopPropagation();this.props.onEditPage(item)}}/>
                                                </div>
                                                :
                                                <div>
                                                    <Icon name="search" link className='updatePageIcon' onClick={e => {e.stopPropagation();this.props.onPreviewPage(item)}}/>
                                                </div>
                                            }
                                        </DataTable.Data>
                                    </DataTable.Row>

                                    <DataTable.DataExpandable>
                                        <TemplateList templates={item.templates}/>
                                    </DataTable.DataExpandable>

                                </DataTable.RowExpandable>
                            );
                        })
                    }

                    <DataTable.Action>
                        <CreatePageModal onCreatePage={this.props.onCreatePage}/>
                    </DataTable.Action>

                </DataTable>

            </Segment>
        );
    }
}
