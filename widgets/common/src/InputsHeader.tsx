export {};

const PopupContent = () => {
    const { List } = Stage.Basic;
    return (
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
                Surround value with <strong>&quot;</strong> (double quotes) to explicitly declare it as a string, e.g.:
                <br />
                <strong>&quot;true&quot;</strong> will be treated as a string, not a boolean value.
            </p>
            <p>
                Use <strong>&quot;&quot;</strong> for an empty string.
            </p>
        </div>
    );
};

interface InputsHeaderProps {
    iconButton?: boolean;
    compact?: boolean;
    dividing?: boolean;
    header?: string;
}

class InputsHeader extends React.Component<InputsHeaderProps> {
    shouldComponentUpdate(nextProps: InputsHeaderProps) {
        return !_.isEqual(this.props, nextProps);
    }

    render() {
        const { compact = false, dividing = true, header = 'Deployment inputs', iconButton = false } = this.props;
        const { Form, Header, Button, Popup, PopupHelp } = Stage.Basic;

        if (iconButton) {
            return (
                <Popup
                    flowing
                    trigger={<Button icon="help" floated="right" />}
                    header="Value type"
                    content={<PopupContent />}
                />
            );
        }

        const HeaderWithDescription = () => (
            <Header size="tiny">
                {header}
                <Header.Subheader>
                    See values typing details:&nbsp;
                    <PopupHelp flowing header="Value type" content={<PopupContent />} />
                </Header.Subheader>
            </Header>
        );

        return dividing ? (
            <Form.Divider style={compact ? { marginTop: 0 } : {}}>
                <HeaderWithDescription />
            </Form.Divider>
        ) : (
            <HeaderWithDescription />
        );
    }
}

declare global {
    namespace Stage.Common {
        // eslint-disable-next-line import/prefer-default-export
        export { InputsHeader };
    }
}

Stage.defineCommon({
    name: 'InputsHeader',
    common: InputsHeader
});
