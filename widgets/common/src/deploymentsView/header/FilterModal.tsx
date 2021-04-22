import type { FunctionComponent } from 'react';
import { useEffect } from 'react';
import { i18nPrefix } from '../common';

interface FilterModalProps {
    filterId: string | undefined;
    open: boolean;
    onSubmit: (filterId: string) => void;
    onCancel: () => void;
    toolbox: Stage.Types.Toolbox;
}

const FilterModal: FunctionComponent<FilterModalProps> = ({
    filterId: filterIdProp,
    open,
    onCancel,
    onSubmit,
    toolbox
}) => {
    const { i18n } = Stage;
    const { ApproveButton, CancelButton, Icon, Modal, UnsafelyTypedForm, UnsafelyTypedFormField } = Stage.Basic;
    // @ts-ignore Property 'DynamicDropdown' does not exist on type 'typeof Common'
    const { DynamicDropdown } = Stage.Common;
    const { useResettableState } = Stage.Hooks;

    const { errors, setErrors, clearErrors } = Stage.Hooks.useErrors();
    const [filterId, setFilterId, resetFilterId] = useResettableState<string | undefined>(filterIdProp);

    useEffect(resetFilterId, [filterIdProp]);

    function handleSubmit() {
        if (!filterId) {
            setErrors({ error: i18n.t(`${i18nPrefix}.header.filter.modal.noFilterError`) });
            return;
        }

        onSubmit(filterId);
    }

    function handleCancel() {
        onCancel();
        resetFilterId();
        clearErrors();
    }

    function handleChange(value: string) {
        setFilterId(value);
        clearErrors();
    }

    return (
        <Modal open={open} onClose={onCancel}>
            <Modal.Header>
                <Icon name="filter" /> {i18n.t(`${i18nPrefix}.header.filter.modal.header`)}
            </Modal.Header>

            <Modal.Content>
                <UnsafelyTypedForm errors={errors} onErrorsDismiss={clearErrors}>
                    <UnsafelyTypedFormField>
                        <DynamicDropdown
                            toolbox={toolbox}
                            onChange={handleChange}
                            fetchUrl="/filters/deployments?_include=id"
                            prefetch
                            value={filterId}
                        />
                    </UnsafelyTypedFormField>
                </UnsafelyTypedForm>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={handleCancel} />
                <ApproveButton
                    onClick={handleSubmit}
                    color="green"
                    content={i18n.t(`${i18nPrefix}.header.filter.modal.submit`)}
                />
            </Modal.Actions>
        </Modal>
    );
};
export default FilterModal;
