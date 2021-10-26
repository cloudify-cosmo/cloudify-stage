import _, { includes, isEmpty } from 'lodash';
import React from 'react';
import { ModalProps } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { useBoolean, useErrors, useInput, useOpen, useResettableState } from '../../../utils/hooks';
import {
    ApproveButton,
    CancelButton,
    Divider,
    Form,
    Icon,
    LoadingOverlay,
    Modal,
    Segment,
    UnsafelyTypedFormField
} from '../../basic';
import { ReduxState } from '../../../reducers';
import StageUtils from '../../../utils/stageUtils';
import SelectionList from '../common/SelectionList';
import SortableList from '../common/SortableList';

const t = StageUtils.getT('templates.pageGroupManagement.modal');

interface PageGroupModalProps {
    initialGroupName?: string;
    initialPages?: string[];
    trigger: ModalProps['trigger'];
    onSubmit: (groupName: string, pageIds: string[]) => Promise<any>;
}

const PageGroupModal: React.FunctionComponent<PageGroupModalProps> = ({
    trigger,
    initialGroupName = '',
    initialPages = [],
    onSubmit
}) => {
    const allAvailablePages = useSelector((state: ReduxState) => Object.keys(state.templates.pagesDef));
    const [selectedPages, setSelectedPages, resetSelectedPages] = useResettableState<string[]>(initialPages);

    const { errors, setErrors, setMessageAsError, clearErrors } = useErrors();
    const [loading, setLoading, unsetLoading] = useBoolean();
    const [groupName, setGroupName, resetGroupName] = useInput(initialGroupName);
    const [open, doOpen, doClose] = useOpen(() => {
        resetGroupName();
        resetSelectedPages();
        clearErrors();
    });

    const editMode = !isEmpty(initialGroupName);

    function handleSubmit() {
        const submitErrors: {
            groupName?: string;
            selectedPages?: string;
        } = {};

        if (_.isEmpty(_.trim(groupName))) {
            submitErrors.groupName = t('errors.groupName');
        }

        if (_.isEmpty(selectedPages)) {
            submitErrors.selectedPages = t('errors.selectedPages');
        }

        if (!_.isEmpty(submitErrors)) {
            setErrors(submitErrors);
            return;
        }

        setLoading();
        onSubmit(groupName, selectedPages).then(doClose).catch(setMessageAsError).finally(unsetLoading);
    }

    function handlePageAdd(pageId: string) {
        clearErrors();
        setSelectedPages([...selectedPages, pageId]);
    }

    return (
        <Modal trigger={trigger} open={open} onOpen={doOpen} onClose={doClose}>
            {loading && <LoadingOverlay />}

            <Modal.Header>
                <Icon name="folder open outline" />
                {editMode ? (
                    <span>
                        {t('updateHeader', {
                            pageGroupName: initialGroupName
                        })}
                    </span>
                ) : (
                    <span>{t('createHeader')}</span>
                )}
            </Modal.Header>

            <Modal.Content>
                <Form errors={errors}>
                    <UnsafelyTypedFormField error={errors.groupName}>
                        <Form.Input
                            placeholder={t('groupName')}
                            value={groupName}
                            onChange={(...args) => {
                                clearErrors();
                                setGroupName(...args);
                            }}
                        />
                    </UnsafelyTypedFormField>
                    <Segment.Group horizontal>
                        <Segment style={{ width: '50%' }}>
                            <Icon name="file outline" /> {t('availablePages')}
                            <Divider />
                            <SelectionList
                                items={allAvailablePages.filter(pageId => !includes(selectedPages, pageId))}
                                onItemSelected={handlePageAdd}
                                noDataMessageI18nKey="pageGroupManagement.modal.noPagesAvailable"
                                addIconTitleI18nKey="pageGroupManagement.modal.addPage"
                            />
                        </Segment>
                        <SortableList
                            icon="file outline"
                            items={selectedPages.map(pageId => ({ item: pageId, id: pageId, name: pageId }))}
                            titleI18nKey="pageGroupManagement.modal.selectedPages"
                            noDataMessageI18nKey="pageGroupManagement.modal.noPagesSelected"
                            onUpdate={setSelectedPages}
                        />
                    </Segment.Group>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={doClose} />
                <ApproveButton
                    content={editMode ? t('submitUpdate') : t('submitCreate')}
                    icon={editMode ? 'edit' : 'checkmark'}
                    color="green"
                    onClick={handleSubmit}
                />
            </Modal.Actions>
        </Modal>
    );
};

export default PageGroupModal;
