import { FunctionComponent } from 'react';
import { Filter } from './types';
import type { FilterRule } from '../../common/src/filters/types';

export interface FilterModalProps {
    initialFilter?: Filter;
    filterId?: string;
    i18nHeaderKey: string;
    onSubmit: (filterId: string, filterRules: FilterRule[]) => Promise<void>;
    onCancel: () => void;
}

const { Form } = Stage.Basic;

// TODO: RD-1837
const UnsafeForm = (Form as unknown) as FunctionComponent<{ [x: string]: any }>;
const UnsafeField = (Form.Field as unknown) as FunctionComponent<{ [x: string]: any }>;

const FilterModal: FunctionComponent<FilterModalProps> = ({
    i18nHeaderKey,
    initialFilter,
    filterId: filterIdProp,
    onCancel,
    onSubmit
}) => {
    const { useInput, useErrors } = Stage.Hooks;
    const [filterId, setFilterId] = useInput(filterIdProp);
    const { errors, setErrors, clearErrors, setMessageAsError } = useErrors();
    const { i18n } = Stage;

    function handleSubmit() {
        clearErrors();

        if (filterIdProp !== undefined && !filterId) {
            setErrors({ filterId: i18n.t('widgets.filters.modal.idMissing') });
            return;
        }

        onSubmit(
            (filterId || initialFilter?.id) as string,
            initialFilter ? [...initialFilter.attrs_filter_rules, ...initialFilter.labels_filter_rules] : []
        ).catch(setMessageAsError);
    }

    const { ApproveButton, CancelButton, Icon, Modal } = Stage.Basic;
    return (
        <Modal open onClose={onCancel}>
            <Modal.Header>
                <Icon name="filter" /> {i18n.t(i18nHeaderKey, { filterId: initialFilter?.id })}
            </Modal.Header>

            <Modal.Content>
                {filterId !== undefined && (
                    <UnsafeForm errors={errors} onErrorsDismiss={clearErrors}>
                        <UnsafeField label={i18n.t('widgets.filters.modal.id')}>
                            <Form.Input value={filterId} required onChange={setFilterId} error={errors.filterId} />
                        </UnsafeField>
                    </UnsafeForm>
                )}
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onCancel} />
                <ApproveButton onClick={handleSubmit} color="green" />
            </Modal.Actions>
        </Modal>
    );
};

export default FilterModal;
