import CreateTokenModal from './CreateTokenModal';
import { Wrapper } from './TokensTableHeader.styles';

interface TokensTableHeaderProps {
    toolbox: Stage.Types.Toolbox;
}

const {
    Basic: { Button },
    Hooks: { useBoolean }
} = Stage;

const TokensTableHeader = ({ toolbox }: TokensTableHeaderProps) => {
    const [isCreateModalVisible, showCreateModal, hideCreateModal] = useBoolean();

    return (
        <>
            <Wrapper>
                <Button labelPosition="left" icon="add" content="Create" onClick={showCreateModal} />
            </Wrapper>
            {isCreateModalVisible && <CreateTokenModal onClose={hideCreateModal} toolbox={toolbox} />}
        </>
    );
};

export default TokensTableHeader;
