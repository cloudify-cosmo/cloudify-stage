/**
 * Created by jakub on 2/1/17.
 */

import Button from '../../../app/components/basic/control/Button';

import CPE from './CPE/CPE';
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
}, {
    title: 'SD-WAN',
    content: React.createElement(VNF)
}
];


export default class Wrapper extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            activePanel: 0
        }
    }

    handleItemClick = (index) => {
        this.setState({ activePanel: index });
    };

    render () {
        return (
            <div className="ui grid">
                 <div className="three wide column">
                     {panels.map(
                         (item, index) =>
                             <div key={index}>
                                <Button
                                    onClick={() => this.handleItemClick(index)}
                                    content={item.title}
                                    fluid={true}
                                    className={ index == this.state.activePanel ? "teal" : "" }
                                ></Button>
                                <br/>
                             </div>
                     )}
                 </div>

                <div className="thirteen wide column">
                    {(panels[this.state.activePanel].content)}
                </div>
            </div>
        );
    };

};