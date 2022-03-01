import { FunctionComponent } from 'react';
import FilterModal, { FilterModalProps } from './FilterModal';

type FilterEditModalProps = Omit<FilterModalProps, 'initialFilterIdSuffix' | 'showFilterIdInput' | 'i18nHeaderKey'>;

const FilterEditModal: FunctionComponent<FilterEditModalProps> = props => {
    return <FilterModal i18nHeaderKey="widgets.filters.modal.header.edit" {...props} />;
};

export default FilterEditModal;
