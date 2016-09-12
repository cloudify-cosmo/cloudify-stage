/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';
import InlineEdit from 'react-edit-inline';

import AddWidget from '../containers/AddWidget';
import WidgetsList from './WidgetsList';
import EditWidgetModal from './EditWidgetModal';

export default class Page extends Component {
    static propTypes = {
        page: PropTypes.object.isRequired
    }

    constructor(props){
        super(props);
        this.dataChanged = this.dataChanged.bind(this);
        this.state = {
            name: 'Demo Page'
        }
    }

    dataChanged(data) {
        this.setState({...data})
    }

    render() {
        return (
            <div className="">
                <h3 className='ui header dividing'>
                    <InlineEdit
                        text={this.state.name}
                        change={this.dataChanged}
                        paramName="name"
                        />
                </h3>
                <AddWidget pageId={this.props.page.id}/>

                <WidgetsList widgets={this.props.page.widgets}/>

                {/* Modal is here so it will exist one time in the page. we dont need it for each edit button*/}
                <EditWidgetModal/>
            </div>
        );
    }
}
