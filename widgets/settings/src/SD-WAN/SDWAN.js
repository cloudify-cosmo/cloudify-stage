/**
 * Created by Alex on 1/24/2017.
 */

const { Form } = Stage.Basic;
import Accordion from '../../../../app/components/basic/Accordion';



export default class SDWAN extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
        }
    }

    /*
    panels = [
        {title: 'Active / Active', content: <LANConfiguration/> },
        {title: 'Active / Backup', content: <VoiceLANConfiguration/>}
        {title: 'Applications', content: <VoiceLANConfiguration/>}
    ];
    */

    render() {
        return (
            <div>
                <div>SD-WAN Features</div>
                <br/>

            </div>
        )
    }
}
