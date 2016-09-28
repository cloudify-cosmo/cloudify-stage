/**
 * Created by kinneretzin on 11/09/2016.
 */

import momentImport from 'moment';
import anglarImport from 'angular';
import React from 'react';
var ReactDOMServer = require('react-dom/server');

let Loading = ({}) => {
    return (
        <div className='ui segment basic' style={{height:'100%'}}>
            <div className='ui active inverted dimmer'>
                <div className='ui text loader'>Loading</div>
            </div>
        </div>
    );
};


export default class PluginUtils {
    static buildFromTemplate(html, data) {

        var compiled = _.template(html);
        return compiled(data);
    }

    static renderLoading() {
        return ReactDOMServer.renderToString(<Loading/>);
    }

    static moment = momentImport;
    static jQuery = $;
    static angular = anglarImport;
    static React = React;
}