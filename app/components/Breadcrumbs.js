/**
 * Created by kinneretzin on 18/09/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {EditableLabel} from './basic';

export default class Breadcrumbs extends Component {
    static propTypes = {
        pagesList: PropTypes.array.isRequired,
        onPageNameChange: PropTypes.func.isRequired,
        onPageSelected: PropTypes.func.isRequired
    };

    render() {
        var elements = [];
        var pagesList = _(this.props.pagesList).reverse().value();
        _.each(pagesList,(p,index)=>{
            if (index !== pagesList.length-1) {
                elements.push(<div key={p.id} className='section' onClick={()=>{this.props.onPageSelected(p,pagesList,index);} }>{p.name}</div>);
                elements.push(<span key={'d_'+p.id} className="divider">/</span>);
            } else {
                elements.push(
                    <EditableLabel key={p.id}
                        text={p.name}
                        placeholder='You must fill a page name'
                        className='section active pageTitle'
                        isEditEnable={this.props.isEditMode}
                        onEditDone={(newName)=>this.props.onPageNameChange(p,newName)}
                    />
                );
            }

        });
        return (
            <div className='ui breadcrumb breadcrumbLineHeight'>
                {elements}
            </div>
        );
    }
}
