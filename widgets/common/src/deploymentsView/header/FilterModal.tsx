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

    function saveValue() {
        setSavedValue(value);
    }

    function revertValue() {
        setValue(savedValue);
    }

    function resetValues() {
        resetValue();
        resetSavedValue();
    }

    const result: [T, typeof setValue, typeof saveValue, typeof revertValue, typeof resetValues] = [
        value,
        setValue,
        saveValue,
        revertValue,
        resetValues
    ];
    return result;
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
    const [filterId, setFilterId, saveFilterId, revertFilterId, resetFilterId] = useRevertableState<string | undefined>(
        undefined
    );
    const [filterRules, setFilterRules, saveFilterRules, revertFilterRules, resetFilterRules] = useRevertableState<
        FilterRule[]
    >([]);
    const [filterDirty, setFilterDirty, saveFilterDirty, revertFilterDirty, resetFilterDirty] = useRevertableState<
        boolean
    >(false);

    const filterRulesResult = useFilterQuery(toolbox, filterId);

    // Used to initialize RulesForm
    const [initialFilterRules, setInitialFilterRules] = useState<FilterRule[]>([]);

    useEffect(() => {
        if (!userFilterSelected) {
            resetFilterId();
            resetFilterRules();
            resetFilterDirty();
        }
    }, [userFilterSelected]);

    function handleSubmit() {
        if (!filterRules?.length) {
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

        saveFilterRules();
        saveFilterId();
        saveFilterDirty();
        setInitialFilterRules(filterRules);
        clearErrors();

        onSubmit(filterRules, filterDirty ? undefined : filterId);
    }

    function handleCancel() {
        onCancel();
        revertFilterId();
        revertFilterRules();
        revertFilterDirty();
        setRuleErrorsPresent(false);
        clearErrors();
    }

    function handleFilterIdChange(value: string) {
        setFilterId(value);
        setFilterDirty(false);
        clearErrors();
    }

    function handleFilterRulesChange(newFilterRules: FilterRule[], ruleErrors: boolean) {
        setFilterRules(newFilterRules);
        setFilterDirty(true);
        setRuleErrorsPresent(ruleErrors);
    }

    useEffect(() => {
        setFilterRules(filterRulesResult.data ?? []);
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
                            value={filterId}
                        />
                    </UnsafelyTypedFormField>
                    <UnsafelyTypedFormField label={tModal('filterRules')}>
                        {filterRulesResult.isFetching && <Stage.Basic.LoadingOverlay />}
                        {filterRulesResult.isSuccess && (
                            <RulesForm
                                initialFilters={initialFilterRules}
                                onChange={handleFilterRulesChange}
                                markErrors={!!filterRules?.length}
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
