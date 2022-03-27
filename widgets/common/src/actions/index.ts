import File from './FileActions';
import Search from './SearchActions';
import Summary from './SummaryActions';

const ActionsCommon = {
    File,
    Search,
    Summary
};

declare global {
    namespace Stage.Common {
        const Actions: typeof ActionsCommon;
    }
}

Stage.defineCommon({
    name: 'Actions',
    common: ActionsCommon
});
