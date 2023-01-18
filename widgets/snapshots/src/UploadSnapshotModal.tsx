import type { Toolbox } from 'app/utils/StageAPI';
import { noop } from 'lodash';
import Actions from './actions';

const translate = Stage.Utils.getT('widgets.snapshots.uploadModal');

export default function UploadModal({ toolbox }: { toolbox: Toolbox }) {
    const { useBoolean, useErrors, useOpen, useInput } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();
    const [snapshotId, setSnapshotId, clearSnapshotId] = useInput('');
    const [snapshotFile, setSnapshotFile, clearSnapshotFile] = useInput<File | null>(null);
    const [snapshotUrl, setSnapshotUrl, clearSnapshotUrl] = useInput('');
    const [isOpen, doOpen, doClose] = useOpen(() => {
        unsetLoading();
        clearErrors();
        clearSnapshotId();
        clearSnapshotFile();
        clearSnapshotUrl();
    });

    function submitUpload() {
        const validationErrors: Partial<Record<'snapshotUrl' | 'snapshotId', string>> = {};

        if (!snapshotFile) {
            if (_.isEmpty(snapshotUrl)) {
                validationErrors.snapshotUrl = translate('errors.fileOrUrlMissing');
            } else if (!Stage.Utils.Url.isUrl(snapshotUrl)) {
                validationErrors.snapshotUrl = translate('errors.urlInvalid');
            }
        }

        if (_.isEmpty(snapshotId)) {
            validationErrors.snapshotId = translate('errors.idMissing');
        }

        if (!_.isEmpty(validationErrors)) {
            setErrors(validationErrors);
            return;
        }

        // Disable the form
        setLoading();

        const actions = new Actions(toolbox);
        actions
            .doUpload(snapshotFile ? '' : snapshotUrl, snapshotId, snapshotFile)
            .then(() => {
                doClose();
                clearErrors();
                toolbox.refresh();
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    function onSnapshotFileChange(file?: File) {
        if (file) {
            setSnapshotUrl(file.name);
            setSnapshotFile(file);
        }
    }

    function onSnapshotUrlChange(url: string) {
        setSnapshotUrl(url);
        clearSnapshotFile();
    }

    const { ApproveButton, Button, CancelButton, Form, Icon, Modal } = Stage.Basic;
    const uploadButton = <Button content={translate('actions.upload')} icon="upload" labelPosition="left" />;

    return (
        <Modal trigger={uploadButton} open={isOpen} onOpen={doOpen} onClose={doClose}>
            <Modal.Header>
                <Icon name="upload" /> {translate('header')}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field label={translate('form.file.label')} required error={errors.snapshotUrl}>
                        <Form.UrlOrFile
                            name="snapshot"
                            placeholder={translate('form.file.placeholder')}
                            onChangeUrl={onSnapshotUrlChange}
                            onChangeFile={onSnapshotFileChange}
                            onBlurUrl={noop}
                        />
                    </Form.Field>

                    <Form.Field label={translate('form.name.label')} required error={errors.snapshotId}>
                        <Form.Input name="snapshotId" value={snapshotId} onChange={setSnapshotId} />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={doClose} disabled={isLoading} />
                <ApproveButton
                    onClick={submitUpload}
                    disabled={isLoading}
                    content={translate('actions.upload')}
                    icon="upload"
                />
            </Modal.Actions>
        </Modal>
    );
}
