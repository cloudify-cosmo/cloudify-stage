/**
 * Created by Alex on 1/24/2017.
 */

const { Form } = Stage.Basic;
import Accordion from '../../../../app/components/basic/Accordion';

import LANConfiguration from './LANConfiguration';
import VoiceLANConfiguration from './VoiceLANConfiguration';

import {lanConfig, voiceConfig} from './Definitions';
import cloneDeep from 'lodash/cloneDeep';

export default class CPE extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            site: 0,
            CPEs: cloneDeep(props['source'].cpes)
        };

        this._options = props['source'].cpesOptions;
    }

    _handleChange(proxy, field) {
        this.setState(Form.fieldNameValue(field));
    }

    HandleLANConfig = function ( lanConfig, index ) {
        let CPEs = this.state.CPEs;
        CPEs[index]['dynamic']['fields'] = lanConfig;
        this.setState( CPEs );
        this.props.onUpdateCPE(CPEs);
    };

    HandleVoiceLANConfig = function ( voiceLANConfig, index ) {
        let CPEs = this.state.CPEs;
        CPEs[index]['dynamic']['fields'] = voiceLANConfig;
        this.setState( CPEs );
        this.props.onUpdateCPE(CPEs);
    };

    render() {
        return (
            <div>
                <Form.Group>
                    <Form.Field>
                        <div>Select CPE</div>
                        <Form.Dropdown name='site'
                                       selection
                                       options={this._options}
                                       value={this.state.site}
                                       text={this._options[this.state.site].text}
                                       onChange={this._handleChange.bind(this)}/>
                    </Form.Field>
                </Form.Group>
                <br/>
                <Accordion styled panels={[
                    {title: 'LAN Configuration',
                        content: <LANConfiguration
                        onDataSave={ this.HandleLANConfig.bind(this) }
                        data-cpe={this.state.CPEs[this.state.site]['dynamic']['fields']}
                        data-const={lanConfig}
                        data-site-value={this.state.site}
                        /> },

                    {title: 'Voice LAN Configuration',
                        content: <VoiceLANConfiguration
                        onDataSave={ this.HandleVoiceLANConfig.bind(this) }
                        data-cpe={this.state.CPEs[this.state.site]['dynamic']['fields']}
                        data-site-value={this.state.site}
                        data-const={voiceConfig}
                        />}
                ]} className="fluid" />

            </div>
        )
    }
}
