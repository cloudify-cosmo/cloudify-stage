import { FunctionComponent } from 'react';
import FilterModal, { FilterModalProps } from './FilterModal';

type FilterCloneModalProps = Required<
    Omit<FilterModalProps, 'i18nHeaderKey' | 'showFilterIdInput' | 'initialFilterIdSuffix'>
>;

const FilterCloneModal: FunctionComponent<FilterCloneModalProps> = ({ initialFilter, ...rest }) => {
    return (
        <FilterModal
            initialFilter={initialFilter}
            i18nHeaderKey="widgets.filters.modal.header.clone"
            showFilterIdInput
            initialFilterIdSuffix="_clone"
            {...rest}
        />
    );
};

export default FilterCloneModal;
