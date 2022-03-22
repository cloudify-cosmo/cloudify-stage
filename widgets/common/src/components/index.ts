import DeleteConfirm from './DeleteConfirm';
import DynamicDropdown from './DynamicDropdown';
import FeedbackMessages from './FeedbackMessages';
import GroupState from './GroupState';
import NoDataMessage from './NoDataMessage';
import RevertToDefaultIcon from './RevertToDefaultIcon';
import SemanticColorDropdown from './SemanticColorDropdown';
import Accordion from './accordion';
import Parameter from './parameter';

const ComponentsCommon = {
    Accordion,
    DeleteConfirm,
    DynamicDropdown,
    FeedbackMessages,
    GroupState,
    NoDataMessage,
    Parameter,
    RevertToDefaultIcon,
    SemanticColorDropdown
};

declare global {
    namespace Stage.Common {
        const Components: typeof ComponentsCommon;
    }
}

Stage.defineCommon({
    name: 'Components',
    common: ComponentsCommon
});
