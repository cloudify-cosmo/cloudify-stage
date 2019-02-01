/**
 * Created by jakubniezgoda on 05/07/2018.
 */

class IdPopup extends React.Component {

    constructor(props,context) {
        super(props,context);
    }

    static propTypes = {
        label: PropTypes.string,
        id: PropTypes.string,
        selected: PropTypes.bool
    };

    static defaultProps = {
        label: 'ID',
        id: '',
        selected: true
    };

    render () {
        let {CopyToClipboardButton, Label, Popup} = Stage.Basic;

        return (
            <Popup wide hoverable position='right center'>
                <Popup.Trigger>
                    <Label style={{opacity: this.props.selected ? '1' : '0.2'}}>{this.props.label}</Label>
                </Popup.Trigger>
                <Popup.Content>
                    <div className='noWrap'>
                        <CopyToClipboardButton content={`Copy ${this.props.label}`} text={this.props.id} />
                        &nbsp;&nbsp;<strong>{this.props.id}</strong>
                    </div>
                </Popup.Content>
            </Popup>
        );
    }
}

Stage.defineCommon({
    name: 'IdPopup',
    common: IdPopup
});