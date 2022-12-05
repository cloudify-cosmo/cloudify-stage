import styled from 'styled-components';

const { Button } = Stage.Basic;

export const Wrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
`;

const t = Stage.Utils.getT('widgets.secretProviders.table');

const SecretProvidersTableHeader = () => {
    return (
        <Wrapper>
            <Button labelPosition="left" icon="add" content={t('buttons.create')} />
        </Wrapper>
    );
};

export default SecretProvidersTableHeader;
