/**
 * Created by kinneretzin on 05/10/2016.
 */

import Actions from './actions';

export default class UploadModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {...UploadModal.initialState, open: false}
        this.snapshotFileRef = React.createRef();
    }

    static initialState = {
        loading: false,
        snapshotUrl: '',
        snapshotFile: null,
        snapshotId: '',
        errors: {}
    }

    onApprove () {
        this._submitUpload();
        return false;
    }

    onCancel () {
        this.setState({open: false});
        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.open && this.state.open) {
            this.snapshotFileRef.current && this.snapshotFileRef.current.reset();
            this.setState(UploadModal.initialState);
        }
    }

    _submitUpload() {
        let snapshotUrl = this.state.snapshotFile ? '' : this.state.snapshotUrl;

        let errors = {};

        if (!this.state.snapshotFile) {
            if (_.isEmpty(snapshotUrl)) {
                errors['snapshotUrl'] = 'Please select snapshot file or url';
            } else if (!Stage.Utils.Url.isUrl(snapshotUrl)) {
                errors['snapshotUrl'] = 'Please provide valid URL for snapshot';
            }
        }

        if (_.isEmpty(this.state.snapshotId)) {
            errors['snapshotId']='Please provide snapshot ID';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        var actions = new Actions(this.props.toolbox);
        actions.doUpload(snapshotUrl, this.state.snapshotId, this.state.snapshotFile).then(()=>{
            this.setState({errors: {}, loading: false, open: false});
            this.props.toolbox.refresh();
        }).catch(err=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    _onSnapshotUrlFocus() {
        if (this.state.snapshotFile) {
            this.snapshotFileRef.current && this.snapshotFileRef.current.reset();
            this._onSnapshotReset();
        }
    }

    _onSnapshotFileChange(file) {
        if (file) {
            this.setState({snapshotUrl: file.name, snapshotFile: file});
        }
    }

    _onSnapshotFileReset() {
        this.setState({snapshotUrl: '', snapshotFile: null});
    }

    render() {
        var {ApproveButton, Button, CancelButton, Form, Icon, Label, Modal} = Stage.Basic;
        const uploadButton = <Button content='Upload' icon='upload' labelPosition='left'/>;

        return (
            <Modal trigger={uploadButton} open={this.state.open} onOpen={()=>this.setState({open:true})} onClose={()=>this.setState({open:false})}>
                <Modal.Header>
                    <Icon name="upload"/> Upload snapshot
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}
                          onErrorsDismiss={() => this.setState({errors: {}})}>
                        <Form.Field label='Snapshot file' required
                                    error={this.state.errors.snapshotUrl}>
                            <Form.UrlOrFile name="snapshot" value={this.state.snapshotUrl}
                                            placeholder="Provide the snapshot's file URL or click browse to select a file"
                                            onChangeUrl={this._handleInputChange.bind(this)}
                                            onFocusUrl={this._onSnapshotUrlFocus.bind(this)}
                                            onBlurUrl={() => {}}
                                            onChangeFile={this._onSnapshotFileChange.bind(this)}
                                            onResetFile={this._onSnapshotFileReset.bind(this)}
                                            label={<Label>{!this.state.snapshotFile ? 'URL' : 'File'}</Label>}
                                            fileInputRef={this.snapshotFileRef}
                            />
                        </Form.Field>

                        <Form.Field label='Snapshot name' required
                                    error={this.state.errors.snapshotId}>
                            <Form.Input name='snapshotId'
                                        value={this.state.snapshotId} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="Upload" icon="upload" color="green"/>
                </Modal.Actions>
            </Modal>
        );
    }
};
