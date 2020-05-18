/**
 * Created by jakubniezgoda on 16/10/2018.
 */

class InputsHeader extends React.Component {
    constructor(props, context) {
        super(props, context);
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

    shouldComponentUpdate(nextProps) {
        return !_.isEqual(this.props, nextProps);
    }

    render() {
        const { Form, Header, List, PopupHelp } = Stage.Basic;

        const HeaderWithDescription = () => (
            <Header size="tiny">
                {this.props.header}
                <Header.Subheader>
                    See values typing details:&nbsp;
                    <PopupHelp
                        flowing
                        header="Value type"
                        content={
                            <div>
                                <p>Values are casted to types:</p>
                                <List bulleted>
                                    <List.Item>
                                        <strong>524</strong> or <strong>3.14</strong> will be casted to a number
                                    </List.Item>
                                    <List.Item>
                                        <strong>false</strong> will be casted to a boolean
                                    </List.Item>
                                    <List.Item>
                                        <strong>[1, 2]</strong> will be casted to an array
                                    </List.Item>
                                    <List.Item>
                                        <strong>{'{"a":"b"}'}</strong> will be casted to an object
                                    </List.Item>
                                    <List.Item>
                                        <strong>null</strong> will be casted to a null value
                                    </List.Item>
                                </List>
                                <p>Value is treated as string if it is not possible to cast it to a different type.</p>
                                <p>
                                    Surround value with <strong>"</strong> (double quotes) to explicitly declare it as a
                                    string, e.g.:
                                    <br />
                                    <strong>"true"</strong> will be treated as a string, not a boolean value.
                                </p>
                                <p>
                                    Use <strong>""</strong> for an empty string.
                                </p>
                            </div>
                        }
                    />
                </Header.Subheader>
            </Header>
        );

        return this.props.dividing ? (
            <Form.Divider style={this.props.compact ? { marginTop: 0 } : {}}>
                <HeaderWithDescription />
            </Form.Divider>
        ) : (
            <HeaderWithDescription />
        );
    }
}

Stage.defineCommon({
    name: 'InputsHeader',
    common: InputsHeader
});
