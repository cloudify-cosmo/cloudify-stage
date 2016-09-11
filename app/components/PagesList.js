/**
 * Created by kinneretzin on 01/09/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class PagesList extends Component {

    static propTypes = {
        onPageSelected: PropTypes.func.isRequired,
        pages: PropTypes.array.isRequired,
        selected: PropTypes.string
    };

    render() {
        return (
            <div className="pages">
                {
                    this.props.pages.map(function(page){
                        return <div key={page.id} className={'item ' + (this.props.selected === page.id ? 'active' : '')} onClick={()=>{this.props.onPageSelected(page);} }>{page.name}</div>
                    },this)
                }
            </div>
        );
    }
}

