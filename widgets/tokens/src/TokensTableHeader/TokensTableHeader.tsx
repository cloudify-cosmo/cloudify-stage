import styled from 'styled-components';
import { translationPath } from '../widget.consts';
import CreateTokenModal from './CreateTokenModal';

const { useBoolean } = Stage.Hooks;
const { getT } = Stage.Utils;
const { Button } = Stage.Basic;

export const Wrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
`;

interface TokensTableHeaderProps {
    toolbox: Stage.Types.Toolbox;
}

const translate = getT(`${translationPath}.table`);

const TokensTableHeader = ({ toolbox }: TokensTableHeaderProps) => {
    const [isCreateModalVisible, showCreateModal, hideCreateModal] = useBoolean();

    return (
        <>
            <Wrapper>
                <Button
                    labelPosition="left"
                    icon="add"
                    content={translate('buttons.create')}
                    onClick={showCreateModal}
                />
            </Wrapper>
            {isCreateModalVisible && <CreateTokenModal onClose={hideCreateModal} toolbox={toolbox} />}
        </>
    );
};

export default TokensTableHeader;
