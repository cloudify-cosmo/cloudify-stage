import PropTypes from 'prop-types';

/**
 * Created by jakubniezgoda on 16/10/2018.
 */

class InputsHeader extends React.Component {

    constructor(props,context) {
        super(props,context);
    }

    static propTypes = {
        compact: PropTypes.bool,
        dividing: PropTypes.bool,
        header: PropTypes.string
    };

    static defaultProps = {
        compact: false,
        dividing: true,
        header: 'Deployment inputs'
    };

    render () {
        let {Form, Header, List, PopupHelp} = Stage.Basic;

        let HeaderWithDescription = () =>
            <Header size="tiny">
                {this.props.header}
                <Header.Subheader>
                    See values typing details:&nbsp;
                    <PopupHelp flowing content={
                        <div>
                            Values are casted to types, e.g.:
                            <List bulleted>
                                <List.Item><strong>[1, 2]</strong> will be casted to an array</List.Item>
                                <List.Item><strong>524</strong> will be casted to a number</List.Item>
                            </List>
                            Surround value with <strong>"</strong> to explicitly declare it as a string, e.g.:
                            <List bulleted>
                                <List.Item><strong>{'"{"a":"b"}"'}</strong> will be send as string not an object</List.Item>
                                <List.Item><strong>{'"true"'}</strong> will be send as string not a boolean value</List.Item>
                            </List>
                            Use <strong>""</strong> for an empty string.
                        </div>
                    } />
                </Header.Subheader>
            </Header>;

        return this.props.dividing
            ?
                <Form.Divider style={this.props.compact ? {marginTop: 0} : {}}>
                    <HeaderWithDescription />
                </Form.Divider>
            :
                <HeaderWithDescription />
    }
}

Stage.defineCommon({
    name: 'InputsHeader',
    common: InputsHeader
});