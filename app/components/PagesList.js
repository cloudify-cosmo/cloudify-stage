/**
 * Created by kinneretzin on 01/09/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class PagesList extends Component {

    static propTypes = {
        onPageSelected: PropTypes.func.isRequired,
        onPageRemoved: PropTypes.func.isRequired,
        pages: PropTypes.array.isRequired,
        selected: PropTypes.string,
        isEditMode : PropTypes.bool.isRequired
    };

    render() {
        return (
            <div className="pages">
                {
                    _.filter(this.props.pages, (p)=>{return !p.isDrillDown}).map(function(page){
                        return <div key={page.id} className={'pageRemoveButton item ' + (this.props.selected === page.id ? 'active' : '')} onClick={()=>{this.props.onPageSelected(page);} }>
                        {page.name}
                        {
                            this.props.isEditMode && page.id != "0" ?
                                <i className="remove link icon small" onClick={()=>this.props.onPageRemoved(page)}/>
                            :
                            ''
                        }
                        </div>
                    },this)
                }
            </div>
        );
    }
}

