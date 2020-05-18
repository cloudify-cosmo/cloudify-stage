/**
 * Created by kinneretzin on 05/10/2016.
 */

import Actions from './actions';

export default class UploadModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = { ...UploadModal.initialState, open: false };
    }

    static initialState = {
        loading: false,
        snapshotUrl: '',
        snapshotFile: null,
        snapshotId: '',
        errors: {}
    };

    onApprove() {
        this.submitUpload();
        return false;
    }

    onCancel() {
        this.setState({ open: false });
        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        const { open } = this.state;
        if (!prevState.open && open) {
            this.setState(UploadModal.initialState);
        }
    }

    submitUpload() {
        const { snapshotFile, snapshotId, snapshotUrl: snapshotUrlState } = this.state;
        const { toolbox } = this.props;
        const snapshotUrl = snapshotFile ? '' : snapshotUrlState;

        const errors = {};

        if (!snapshotFile) {
            if (_.isEmpty(snapshotUrl)) {
                errors.snapshotUrl = 'Please select snapshot file or url';
            } else if (!Stage.Utils.Url.isUrl(snapshotUrl)) {
                errors.snapshotUrl = 'Please provide valid URL for snapshot';
            }
        }

        if (_.isEmpty(snapshotId)) {
            errors.snapshotId = 'Please provide snapshot ID';
        }

        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        // Disable the form
        this.setState({ loading: true });

        const actions = new Actions(toolbox);
        actions
            .doUpload(snapshotUrl, snapshotId, snapshotFile)
            .then(() => {
                this.setState({ errors: {}, loading: false, open: false });
                toolbox.refresh();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    onSnapshotFileChange(file) {
        if (file) {
            this.setState({ snapshotUrl: file.name, snapshotFile: file });
        }
    }

    onSnapshotUrlChange(snapshotUrl) {
        this.setState({ snapshotUrl, snapshotFile: null });
    }

    render() {
        const { errors, loading, open, snapshotId, snapshotUrl } = this.state;
        const { ApproveButton, Button, CancelButton, Form, Icon, Label, Modal } = Stage.Basic;
        const uploadButton = <Button content="Upload" icon="upload" labelPosition="left" />;

        return (
            <Modal
                trigger={uploadButton}
                open={open}
                onOpen={() => this.setState({ open: true })}
                onClose={() => this.setState({ open: false })}
            >
                <Modal.Header>
                    <Icon name="upload" /> Upload snapshot
                </Modal.Header>

                <Modal.Content>
                    <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                        <Form.Field label="Snapshot file" required error={errors.snapshotUrl}>
                            <Form.UrlOrFile
                                name="snapshot"
                                value={snapshotUrl}
                                placeholder="Provide the snapshot's file URL or click browse to select a file"
                                onChangeUrl={this.onSnapshotUrlChange.bind(this)}
                                onChangeFile={this.onSnapshotFileChange.bind(this)}
                            />
                        </Form.Field>

                        <Form.Field label="Snapshot name" required error={errors.snapshotId}>
                            <Form.Input
                                name="snapshotId"
                                value={snapshotId}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={loading} />
                    <ApproveButton
                        onClick={this.onApprove.bind(this)}
                        disabled={loading}
                        content="Upload"
                        icon="upload"
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}
