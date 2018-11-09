/**
 * Created by jakubniezgoda on 05/07/2018.
 */

import PropTypes from 'prop-types';

class YamlFileButton extends React.Component {

    constructor(props,context) {
        super(props,context);
    }

    static propTypes = {
        dataType: PropTypes.string,
        fileLoading: PropTypes.bool,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        dataType: 'values',
        fileLoading: false,
        onChange: _.noop
    };

    render () {
        let {Form} = Stage.Basic;

        return (
            <Form.File name='yamlFile' showInput={false} showReset={false}
                       openButtonParams={{className: 'rightFloated', content: 'Load Values', labelPosition: 'left'}}
                       onChange={this.props.onChange}
                       help={`You can provide YAML file with ${this.props.dataType} to automatically fill in the form.`}
                       loading={this.props.fileLoading} disabled={this.props.fileLoading} />
        );
    }
}

Stage.defineCommon({
    name: 'YamlFileButton',
    common: YamlFileButton
});