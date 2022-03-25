import Header from './InputsHeader';
import HelpDescription from './InputsHelpDescription';
import HelpIcon from './InputsHelpIcon';
import Utils from './utils';
import DataTypesButton from './DataTypesButton';
import YamlFileButton from './YamlFileButton';

const InputsCommon = {
    DataTypesButton,
    Header,
    HelpDescription,
    HelpIcon,
    Utils,
    YamlFileButton
};

declare global {
    namespace Stage.Common {
        const Inputs: typeof InputsCommon;
    }
}

Stage.defineCommon({
    name: 'Inputs',
    common: InputsCommon
});
