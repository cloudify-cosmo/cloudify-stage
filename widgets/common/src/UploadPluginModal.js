/**
 * Created by kinneretzin on 05/10/2016.
 */

class UploadPluginModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {...UploadPluginModal.initialState};
    }

    static propTypes = {
        open: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired,
        toolbox: PropTypes.object.isRequired
    };

    static initialState = {
        loading: false,
        wagonUrl: '',
        wagonFile: null,
        yamlUrl: '',
        yamlFile: null,
        errors: {},
        visibility: Stage.Common.Consts.defaultVisibility
    };


    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            this.setState(UploadPluginModal.initialState);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.open, nextProps.open) || !_.isEqual(this.state, nextState);
    }
    

    uploadPlugin() {
        let wagonUrl = this.state.wagonFile ? '' : this.state.wagonUrl;
        let yamlUrl = this.state.yamlFile ? '' : this.state.yamlUrl;

        let errors = {};

        if (!this.state.wagonFile) {
            if (_.isEmpty(wagonUrl)) {
                errors['wagonUrl'] = 'Please select wagon file or provide URL to wagon file';
            } else if (!Stage.Utils.Url.isUrl(wagonUrl)) {
                errors['wagonUrl'] = 'Please provide valid URL for wagon file';
            }
        }

        if (!this.state.yamlFile) {
            if (_.isEmpty(yamlUrl)) {
                errors['yamlUrl'] = 'Please select YAML file or provide URL to YAML file';
            } else if (!Stage.Utils.Url.isUrl(yamlUrl)) {
                errors['yamlUrl'] = 'Please provide valid URL for YAML file';
            }
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        let actions = new Stage.Common.PluginActions(this.props.toolbox);
        actions.doUpload(this.state.visibility, wagonUrl, yamlUrl, this.state.wagonFile, this.state.yamlFile).then(()=>{
            this.setState({errors: {}, loading: false}, this.props.onHide);
            this.props.toolbox.refresh();
        }).catch(err=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    onFormFieldChange(fields) {
        this.setState(fields);
    }
    
    render() {
        let {ApproveButton, CancelButton, Icon, Modal, VisibilityField} = Stage.Basic;
        let {UploadPluginForm} = Stage.Common;

        return (
            <Modal open={this.props.open} onClose={this.props.onHide}>
                <Modal.Header>
                    <Icon name="upload"/> Upload plugin
                    <VisibilityField visibility={this.state.visibility} className="rightFloated"
                                  onVisibilityChange={(visibility)=>this.setState({visibility: visibility})}/>
                </Modal.Header>

                <Modal.Content>
                    <UploadPluginForm wagonUrl={this.state.wagonUrl}
                                      wagonFile={this.state.wagonFile}
                                      yamlUrl={this.state.yamlUrl}
                                      yamlFile={this.state.yamlFile}
                                      errors={this.state.errors}
                                      loading={this.state.loading}
                                      onChange={this.onFormFieldChange.bind(this)} />
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.props.onHide} disabled={this.state.loading} />
                    <ApproveButton onClick={this.uploadPlugin.bind(this)} disabled={this.state.loading} content="Upload" icon="upload" color="green"/>
                </Modal.Actions>
            </Modal>
        );
    }
}

Stage.defineCommon({
    name: 'UploadPluginModal',
    common: UploadPluginModal
});
