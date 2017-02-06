/**
 * Created by jakub on 2/1/17.
 */

import Button from '../../../app/components/basic/control/Button';

import CPE from './CPE/CPE';
import ACL from './ACL';
import VNF from './VNF';
import SDWAN from './SD-WAN/SDWAN';
import fetchData from './DataHandler';

export default class Wrapper extends React.Component {

    constructor(props, context) {
        super(props, context);

        let fetched = fetchData();

        this.state = {
            activePanel: 0,

            cpe_source: fetched.CPE,
            sd_wan_source: fetched.SD_WAN
        };
    }

    handleItemClick = (index) => {
        this.setState({ activePanel: index });
    };

    handleSDWANUpdate (data, isInterfaces) {
        console.log(">>> in wrapper ")
        console.log(data)
        console.log(">>>")

        let sd_wan_source = this.state.sd_wan_source;
        if( isInterfaces ) {
            sd_wan_source.interfaces = data.selectable;
            sd_wan_source.interfacesSelectedItems = data.selectedItems;
        }else{
            console.log("update app")
            sd_wan_source.applications = data.selectable;
            sd_wan_source.applicationsSelectedItems = data.selectedItems;
        }
        this.setState(sd_wan_source);
    }

    render () {
        const panels = [{
                title: 'CPE',
                content: <CPE
                    source={this.state.cpe_source}
                />
            }, {
                title: 'SD-WAN',
                content: <SDWAN
                    source={this.state.sd_wan_source}
                    callback={ (this.handleSDWANUpdate).bind(this) }
                />
            }, {
                title: 'ACL',
                content: <ACL/>
            }, {
                title: 'VAS',
                content: <VNF/>
            }, {
                title: 'SSL VPN',
                content: <VNF/>
            }
        ];

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