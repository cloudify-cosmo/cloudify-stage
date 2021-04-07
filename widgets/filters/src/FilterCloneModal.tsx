import { FunctionComponent } from 'react';
import FilterModal, { FilterModalProps } from './FilterModal';

type FilterCloneModalProps = Required<Omit<FilterModalProps, 'i18nHeaderKey' | 'filterId'>>;

const FilterCloneModal: FunctionComponent<FilterCloneModalProps> = ({ initialFilter, ...rest }) => {
    return (
        <FilterModal
            initialFilter={initialFilter}
            i18nHeaderKey="widgets.filters.modal.header.clone"
            filterId={`${initialFilter.id}_clone`}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...rest}
        />
    );
};

export default FilterCloneModal;
