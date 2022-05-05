import type { FunctionComponent } from 'react';
import type { FilterModalProps } from './FilterModal';
import FilterModal from './FilterModal';

type FilterEditModalProps = Omit<FilterModalProps, 'initialFilterIdSuffix' | 'showFilterIdInput' | 'i18nHeaderKey'>;

const FilterEditModal: FunctionComponent<FilterEditModalProps> = props => {
    return <FilterModal i18nHeaderKey="widgets.filters.modal.header.edit" {...props} />;
};

export default FilterEditModal;
