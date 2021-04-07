import type { FunctionComponent } from 'react';
import FilterModal, { FilterModalProps } from './FilterModal';

type FilterAddModalProps = Pick<FilterModalProps, 'onCancel' | 'onSubmit'>;

const FilterAddModal: FunctionComponent<FilterAddModalProps> = props => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <FilterModal {...props} i18nHeaderKey="widgets.filters.modal.header.add" filterId="" />;
};

export default FilterAddModal;
