import type { FunctionComponent } from 'react';

const t = Stage.Utils.getT('widgets.events');

interface DetailsIconProps {
    onClick: () => void;
}

const DetailsIcon: FunctionComponent<DetailsIconProps> = ({ onClick }) => {
    const { Icon, Popup } = Stage.Basic;

    return (
        <Popup on="hover">
            <Popup.Trigger>
                <Icon.Group
                    size="big"
                    onClick={(e: Event) => {
                        e.stopPropagation();
                        onClick();
                    }}
                    color="black"
                >
                    <Icon name="file text" />
                    <Icon corner name="zoom" />
                </Icon.Group>
            </Popup.Trigger>
            <Popup.Content>{t('detailsIcon')}</Popup.Content>
        </Popup>
    );
};

export default DetailsIcon;
