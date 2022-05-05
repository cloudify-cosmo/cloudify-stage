import _ from 'lodash';
import { useSelector } from 'react-redux';
import type { ReduxState } from '../../../reducers';
import { createPageId } from '../../../actions/templateManagement/pages';

export default function useCreatePageId() {
    const pageDefs = useSelector((state: ReduxState) => state.templates.pagesDef);

    return (name: string) => createPageId(name, pageDefs);
}
