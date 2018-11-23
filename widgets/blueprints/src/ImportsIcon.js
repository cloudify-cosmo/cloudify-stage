/**
 * Created by jakubniezgoda on 23/11/2018.
 */

import PropTypes from 'prop-types';

export default class ImportsIcon extends React.Component {

    constructor(props,context) {
        super(props,context);
    }

    static propTypes = {
        header: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        className: PropTypes.string,
        list: PropTypes.array
    };

    static defaultProps = {
        className: '',
        list: []
    };

    render () {
        let {Icon, List, Popup} = Stage.Basic;

        return !_.isEmpty(this.props.list) &&
            <Popup trigger={<Icon name={this.props.icon} color='blue' className={this.props.className} />}
                   header={this.props.header}
                   content={<List bulleted>{_.map(this.props.list, (item) => <List.Item key={item}>{item}</List.Item>)}</List>} />
    }
}
