import PropTypes from 'prop-types';

/**
 * Created by jakubniezgoda on 16/10/2018.
 */

class InputsHeader extends React.Component {

    constructor(props,context) {
        super(props,context);
    }

    static propTypes = {
        header: PropTypes.string
    };

    static defaultProps = {
        header: 'Deployment inputs'
    };

    render () {
        let {Header, List, PopupHelp} = Stage.Basic;

        return (
            <Header size="tiny" dividing {..._.omit(this.props, _.keys(InputsHeader.propTypes))}>
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
            </Header>
        );
    }
}

Stage.defineCommon({
    name: 'InputsHeader',
    common: InputsHeader
});