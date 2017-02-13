/**
 * Created by jakub on 2/1/17.
 */

import Button from '../../../app/components/basic/control/Button';

import CPE from './CPE/CPE';
import SDWAN from './SD-WAN/SDWAN';
import Actions from './actions';

export default class Settings extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            activePanel: 0,

            data: this.props['data']
        };
    }

    componentWillReceiveProps(props){
        this.setState({
            data: props['data']
        })
    }

    handleItemClick = (index) => {
        /* block not available components */
        if( index > 1 ) return;
        this.setState({ activePanel: index });
    };

    handleSDWANUpdate (data, isInterfaces) {
        if( this.state.data !== undefined ) {
            let stateData = this.state.data;

            if( isInterfaces ) {
                stateData.SDWAN.interfaces = data.selectable;
                stateData.SDWAN.interfacesSelectedItems = data.selectedItems;
            }else{
                stateData.SDWAN.applications = data.selectable;
                stateData.SDWAN.applicationsSelectedItems = data.selectedItems;
            }
            this.setState(stateData);

            const actions = new Actions(this.props.toolbox);
            actions.updateSD_WAN();
        }
    }

    handleSDWANSettings( name, value ) {
        if( this.state.data !== undefined ) {
            let stateData = this.state.data;
            stateData.SDWAN[name] = value;

            this.setState(stateData);
        }
    }

    handleCPEUpdate( data ) {
        if( this.state.data !== undefined ) {
            let stateData = this.state.data;
            stateData.CPE = data;

            this.setState({
                stateData
            });

            const actions = new Actions(this.props.toolbox);
            actions.updateCPE();
        }
    }

    render () {
        const panels = [{
                title: 'CPE',
                content: <CPE
                    toolbox={this.props.toolbox}
                    source={ this.state.data !== undefined ? this.state.data.CPE : undefined }
                    onUpdateCPE={ (this.handleCPEUpdate).bind(this) }
                />
            }, {
                title: 'SD-WAN',
                content: <SDWAN
                    toolbox={this.props.toolbox}
                    source={ this.state.data !== undefined ? this.state.data.SDWAN : undefined }
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
                    {this.state.data !== undefined && (panels[this.state.activePanel].content)}
                </div>
            </div>
        );
    };

};