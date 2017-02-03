/**
 * Created by Alex on 1/24/2017.
 */

const { Form } = Stage.Basic;
import Accordion from '../../../../app/components/basic/Accordion';

import LANConfiguration from './LANConfiguration';
import VoiceLANConfiguration from './VoiceLANConfiguration';

const siteOptions = [{
    text: 'Haifa',
    value: '0'
}, {
    text: 'Tel Aviv',
    value: '1'
}, {
    text: 'Jerusalem',
    value: '2'
}, {
    text: 'Eilat',
    value: '3'
}];

const CPEs = siteOptions.map( site => ({ site: site.text, value: site.value, LAN: {}, voiceLAN: {} }) );

export default class CPE extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            site: 0,
            CPEs
        };
    }

    _handleChange(proxy, field) {
        this.setState(Form.fieldNameValue(field));
    }

    _handleLANConfig = function ( lanConfig, index ) {
        let CPEs = this.state.CPEs;

        CPEs[index].LAN = lanConfig;

        console.log( lanConfig )
        console.log( CPEs )

        this.setState( CPEs );
    };

    _handleVoiceLANConfig = function ( voiceLANConfig, index ) {
        let CPEs = this.state.CPEs;

        CPEs[index].voiceLAN = voiceLANConfig;
        this.setState( CPEs );
    };

    render() {
        return (
            <div>
                <Form.Group>
                    <Form.Field>
                        <div>Select Site</div>
                        <Form.Dropdown name='site'
                                       selection
                                       options={siteOptions}
                                       value={this.state.site}
                                       onChange={this._handleChange.bind(this)}/>
                    </Form.Field>
                </Form.Group>
                <br/>
                <Accordion styled panels={[
                    {title: 'LAN Configuration',
                        content: <LANConfiguration
                        save-data={ this._handleLANConfig.bind(this) }
                        data-cpe={this.state.CPEs[this.state.site]} /> },

                    {title: 'Voice LAN Configuration',
                        content: <VoiceLANConfiguration
                        save-data={ this._handleVoiceLANConfig.bind(this) }
                        data-cpe={this.state.CPEs[this.state.site]} />}
                ]} className="fluid" />

            </div>
        )
    }
}
