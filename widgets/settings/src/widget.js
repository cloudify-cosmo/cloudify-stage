/**
 * Created by Alex on 1/23/2017.
 */

import { Accordion } from 'semantic-ui-react'

import CPE from './CPE';
import ACL from './ACL';
import VNF from './VNF';

const panels = [{
    title: 'CPE',
    content: React.createElement(CPE)
}, {
    title: 'ACL',
    content: React.createElement(ACL)
}, {
    title: 'VNF',
    content: React.createElement(VNF)
}];


Stage.defineWidget({
    id: "settings",
    name: "Settings",
    description: 'Shows settings',
    initialWidth: 12,
    initialHeight: 5,
    color: "green",
    isReact: true,

    render: function(/*widget, data, error, toolbox*/) {
        return (
            <Accordion panels={panels} defaultActiveIndex={0} styled/>
        )
    }
});
