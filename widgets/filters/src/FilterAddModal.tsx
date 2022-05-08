import type { FunctionComponent } from 'react';
import type { FilterModalProps } from './FilterModal';
import FilterModal from './FilterModal';

type FilterAddModalProps = Pick<FilterModalProps, 'onCancel' | 'onSubmit' | 'toolbox'>;

const FilterAddModal: FunctionComponent<FilterAddModalProps> = props => {
    return <FilterModal {...props} i18nHeaderKey="widgets.filters.modal.header.add" showFilterIdInput />;
};

export default FilterAddModal;
