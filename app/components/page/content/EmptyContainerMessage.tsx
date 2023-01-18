import i18n from 'i18next';
import React from 'react';
import StageUtils from '../../../utils/stageUtils';
import { Container, Header } from '../../basic';

const translate = StageUtils.getT('editMode.emptyContainer');

interface EmptyContainerMessageProps {
    isEditMode: boolean;
    containerTypeLabel: string;
}

export default function EmptyContainerMessage({ isEditMode = false, containerTypeLabel }: EmptyContainerMessageProps) {
    return (
        <Container className="emptyPage alignCenter" style={{ padding: '10rem 0' }}>
            {isEditMode ? (
                <Header size="large">
                    {translate('line1', { containerType: containerTypeLabel })}
                    <br />
                    {translate('line2')}
                </Header>
            ) : (
                <Header size="large">{i18n.t('page.emptyContainer', { containerType: containerTypeLabel })}</Header>
            )}
        </Container>
    );
}
