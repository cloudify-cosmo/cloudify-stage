/**
 * Created by jakubniezgoda on 23/11/2018.
 */

import PropTypes from 'prop-types';

export default class ImportsWarningMessage extends React.Component {

    constructor(props,context) {
        super(props,context);
    }

    static propTypes = {
        list: PropTypes.array
    };

    static defaultProps = {
        list: []
    };

    render () {
        let {Message} = Stage.Basic;

        return !_.isEmpty(this.props.list) &&
            <Message warning>
                Blueprint is currently in use.
                It is imported by: <strong>{_.join(this.props.list, ', ')}</strong> blueprint(s).
            </Message>
    }
}
