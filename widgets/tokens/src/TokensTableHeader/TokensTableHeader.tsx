import { widgetTranslationPath } from '../consts';
import CreateTokenModal from './CreateTokenModal';
import { Wrapper } from './TokensTableHeader.styles';

interface TokensTableHeaderProps {
    toolbox: Stage.Types.Toolbox;
}

const {
    Basic: { Button },
    Utils: { getT },
    Hooks: { useBoolean }
} = Stage;

const t = getT(`${widgetTranslationPath}.table`);

const TokensTableHeader = ({ toolbox }: TokensTableHeaderProps) => {
    const [isCreateModalVisible, showCreateModal, hideCreateModal] = useBoolean();

    return (
        <>
            <Wrapper>
                <Button labelPosition="left" icon="add" content={t('buttons.create')} onClick={showCreateModal} />
            </Wrapper>
            {isCreateModalVisible && <CreateTokenModal onClose={hideCreateModal} toolbox={toolbox} />}
        </>
    );
};

export default TokensTableHeader;
