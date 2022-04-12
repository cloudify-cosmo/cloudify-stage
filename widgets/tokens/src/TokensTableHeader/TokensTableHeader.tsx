import CreateTokenModal from './CreateTokenModal';
import { Wrapper } from './TokensTableHeader.styles';

interface TokensTableHeaderProps {}

const {
    Basic: { Button },
    Hooks: { useBoolean }
} = Stage;

const TokensTableHeader = ({}: TokensTableHeaderProps) => {
    const [isCreateModalVisible, showCreateModal, hideCreateModal] = useBoolean();

    return (
        <>
            <Wrapper>
                <Button labelPosition="left" icon="add" content="Create" onClick={showCreateModal} />
            </Wrapper>
            <CreateTokenModal open={isCreateModalVisible} onClose={hideCreateModal} />
        </>
    );
};

export default TokensTableHeader;
