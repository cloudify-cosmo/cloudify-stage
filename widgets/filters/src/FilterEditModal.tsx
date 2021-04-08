import { FunctionComponent } from 'react';
import FilterModal, { FilterModalProps } from './FilterModal';

type FilterEditModalProps = Omit<FilterModalProps, 'i18nHeaderKey' | 'filterId'>;

const FilterEditModal: FunctionComponent<FilterEditModalProps> = props => {
    return (
        <FilterModal
            i18nHeaderKey="widgets.filters.modal.header.edit"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
        />
    );
};

export default FilterEditModal;
