/**
 * Created by jakubniezgoda on 07/11/2018.
 */

import PropTypes from 'prop-types';

class DeleteConfirm extends React.Component {

    constructor(props,context) {
        super(props,context);
    }

    static propTypes = {
        resourceName: PropTypes.string.isRequired,
        onConfirm: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
        className: PropTypes.string,
        force: PropTypes.bool,
        onForceChange: PropTypes.func
    };

    static defaultProps = {
        className: '',
        force: false,
        onForceChange: _.noop
    };

    render () {
        let {Confirm, Form, Segment} = Stage.Basic;

        return <Confirm className={this.props.className}
                        header={`Are you sure you want to remove ${this.props.resourceName}?`}
                        content={
                            <Segment basic>
                                <Form.Field>
                                    <Form.Checkbox name='force' toggle label='Force'
                                                   checked={this.props.force}
                                                   onChange={this.props.onForceChange} />
                                </Form.Field>
                            </Segment>
                        }
                        open={this.props.open}
                        onConfirm={this.props.onConfirm}
                        onCancel={this.props.onCancel} />
    }
}

Stage.defineCommon({
    name: 'DeleteConfirm',
    common: DeleteConfirm
});