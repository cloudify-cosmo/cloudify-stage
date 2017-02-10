/**
 * Created by jakub on 2/1/17.
 */

import Button from '../../../app/components/basic/control/Button';

import CPE from './CPE/CPE';
import SDWAN from './SD-WAN/SDWAN';
import fetchData from './DataHandler';

export default class Settings extends React.Component {

    constructor(props, context) {
        super(props, context);

        console.log("****")
        console.log( props.data );
        console.log("****")

        let fetched = fetchData();

        this.state = {
            activePanel: 0,

            cpe_source: fetched.CPE,
            sd_wan_source: fetched.SD_WAN
        };
    }

    componentWillReceiveProps(props) {
        console.log( props['data'] )
    }


    handleItemClick = (index) => {
        /* block not available components */
        if( index > 1 ) return;
        this.setState({ activePanel: index });
    };

    handleSDWANUpdate (data, isInterfaces) {
        let sd_wan_source = this.state.sd_wan_source;
        if( isInterfaces ) {
            sd_wan_source.interfaces = data.selectable;
            sd_wan_source.interfacesSelectedItems = data.selectedItems;
        }else{
            sd_wan_source.applications = data.selectable;
            sd_wan_source.applicationsSelectedItems = data.selectedItems;
        }
        this.setState(sd_wan_source);
    }

    handleSDWANSettings( name, value ) {
        let sd_wan_source = this.state.sd_wan_source;
        sd_wan_source[name] = value;

        this.setState(sd_wan_source);
    }

    handleCPEUpdate( data ) {
        let cpe_source = this.state.cpe_source;
        cpe_source.cpes = data;
        this.setState({
            cpe_source
        });
    }

    render () {
        const panels = [{
                title: 'CPE',
                content: <CPE
                    source={this.state.cpe_source}
                    onUpdateCPE={ (this.handleCPEUpdate).bind(this) }
                />
            }, {
                title: 'SD-WAN',
                content: <SDWAN
                    source={this.state.sd_wan_source}
                    onUpdateTables={ (this.handleSDWANUpdate).bind(this) }
                    callbackSettings={ this.handleSDWANSettings.bind(this) }
                />
            }, {
                title: 'ACL',
                content: <div></div>
            }, {
                title: 'VAS',
                content: <div></div>
            }, {
                title: 'SSL VPN',
                content: <div></div>
            }
        ];

        return (
            <div className="ui grid">
                 <div className="three wide column">
                     <div className="ui vertical fluid menu">
                     {panels.map(
                         (item, index) =>
                             <a
                                 className={ (index == this.state.activePanel ? "active item" : "item") + (index > 1 ? " disabled" : "") }
                                 key={index}
                                 onClick={() => this.handleItemClick(index)}
                                 href="javascript:void(0)"
                             >
                                 {item.title}
                             </a>
                     )}
                     </div>
                 </div>

                <div className="thirteen wide column">
                    {(panels[this.state.activePanel].content)}
                </div>
            </div>
        );
    };

};