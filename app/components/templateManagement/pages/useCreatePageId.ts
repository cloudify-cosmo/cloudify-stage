import _ from 'lodash';
import { useSelector } from 'react-redux';
import { ReduxState } from '../../../reducers';

export default function useCreatePageId() {
    const pageDefs = useSelector((state: ReduxState) => state.templates.pagesDef);

    return (name: string) => {
        const ids = _.keysIn(pageDefs);

        // Add suffix to make URL unique if same page name already exists
        let newPageId = _.snakeCase(name.trim());

        let suffix = 1;
        _.each(ids, id => {
            if (id.startsWith(newPageId)) {
                const index = parseInt(id.substring(newPageId.length), 10) || suffix;
                suffix = Math.max(index + 1, suffix + 1);
            }
        });

        if (suffix > 1) {
            newPageId += suffix;
        }

        return newPageId;
    };
}
