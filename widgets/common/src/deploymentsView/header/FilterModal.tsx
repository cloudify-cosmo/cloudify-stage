import type { FunctionComponent } from 'react';
import { useEffect, useState } from 'react';
import { i18nMessagesPrefix, i18nPrefix } from '../common';
import RulesForm from '../../filters/RulesForm';
import { FilterRule } from '../../filters/types';
import useFilterQuery from '../useFilterQuery';

interface FilterModalProps {
    userFilterSelected: boolean;
    open: boolean;
    onSubmit: (filterRules: FilterRule[], filterId?: string) => void;
    onCancel: () => void;
    toolbox: Stage.Types.Toolbox;
}

const tModal = Stage.Utils.getT(`${i18nPrefix}.header.filter.modal`);
const tMessage = Stage.Utils.getT(i18nMessagesPrefix);

function useRevertableState<T>(initialValue: T) {
    const { useResettableState } = Stage.Hooks;

    const [value, setValue, resetValue] = useResettableState<T>(initialValue);
    const [savedValue, setSavedValue, resetSavedValue] = useResettableState<T>(initialValue);

    return {
        value,
        set: setValue,
        save: () => setSavedValue(value),
        revert: () => setValue(savedValue),
        reset: () => {
            resetValue();
            resetSavedValue();
        }
    };
}

function useRevertableStates(...revertableStates: Omit<ReturnType<typeof useRevertableState>, 'set'>[]) {
    return {
        save: () => revertableStates.forEach(s => s.save()),
        revert: () => revertableStates.forEach(s => s.revert()),
        reset: () => revertableStates.forEach(s => s.reset())
    };
}

const FilterModal: FunctionComponent<FilterModalProps> = ({
    userFilterSelected,
    open,
    onCancel,
    onSubmit,
    toolbox
}) => {
    const { i18n } = Stage;
    const { ApproveButton, CancelButton, Icon, Modal, UnsafelyTypedForm, UnsafelyTypedFormField } = Stage.Basic;
    // @ts-expect-error DynamicDropdown is not converted to TS yet
    const { DynamicDropdown } = Stage.Common;

    const { errors, setErrors, clearErrors } = Stage.Hooks.useErrors();
    const [rulesErrorsPresent, setRuleErrorsPresent] = useState<boolean>();

    // The values are 'saved' on modal submit and 'reverted' on modal cancel
    const filterId = useRevertableState<string | undefined>(undefined);
    const filterRules = useRevertableState<FilterRule[]>([]);
    const filterDirty = useRevertableState<boolean>(false);
    const modalState = useRevertableStates(filterId, filterRules, filterDirty);

    const filterRulesResult = useFilterQuery(toolbox, filterId.value);

    // Used to initialize RulesForm
    const [initialFilterRules, setInitialFilterRules] = useState<FilterRule[]>([]);

    useEffect(() => {
        if (!userFilterSelected) modalState.reset();
    }, [userFilterSelected]);

    function handleSubmit() {
        if (!filterRules.value?.length) {
            setErrors({
                error: tModal(filterId ? 'noFilterRulesError' : 'noFilterError')
            });
            return;
        }

        if (rulesErrorsPresent) {
            setErrors({
                error: tModal('filterRulesInvalidError')
            });
            return;
        }

        modalState.save();
        setInitialFilterRules(filterRules.value);
        clearErrors();

        onSubmit(filterRules.value, filterDirty.value ? undefined : filterId.value);
    }

    function handleCancel() {
        onCancel();
        modalState.revert();
        setRuleErrorsPresent(false);
        clearErrors();
    }

    function handleFilterIdChange(value: string) {
        filterId.set(value);
        filterDirty.set(false);
        clearErrors();
    }

    function handleFilterRulesChange(newFilterRules: FilterRule[], ruleErrors: boolean) {
        filterRules.set(newFilterRules);
        filterDirty.set(true);
        setRuleErrorsPresent(ruleErrors);
    }

    useEffect(() => {
        filterRules.set(filterRulesResult.data ?? []);
        setInitialFilterRules(filterRulesResult.data ?? []);
    }, [JSON.stringify(filterRulesResult.data)]);

    useEffect(() => {
        if (filterRulesResult.isError) setErrors({ error: tMessage('errorLoadingFilterRules') });
    }, [filterRulesResult.isError]);

    return (
        <Modal open={open} onClose={onCancel} size="large">
            <Modal.Header>
                <Icon name="filter" /> {i18n.t(`${i18nPrefix}.header.filter.modal.header`)}
            </Modal.Header>

            <Modal.Content>
                <UnsafelyTypedForm errors={errors} onErrorsDismiss={clearErrors}>
                    <UnsafelyTypedFormField label={tModal('filterId')}>
                        <DynamicDropdown
                            toolbox={toolbox}
                            onChange={handleFilterIdChange}
                            fetchUrl="/filters/deployments?_include=id"
                            prefetch
                            value={filterId.value}
                        />
                    </UnsafelyTypedFormField>
                    <UnsafelyTypedFormField label={tModal('filterRules')}>
                        {filterRulesResult.isFetching && <Stage.Basic.LoadingOverlay />}
                        {filterRulesResult.isSuccess && (
                            <RulesForm
                                initialFilters={initialFilterRules}
                                onChange={handleFilterRulesChange}
                                markErrors={!!filterRules.value?.length}
                                toolbox={toolbox}
                            />
                        )}
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
