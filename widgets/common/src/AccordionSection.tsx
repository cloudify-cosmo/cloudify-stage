import type { FunctionComponent } from 'react';
import type { AccordionTitleProps } from 'semantic-ui-react';

interface Props {
    title: string;
    activeSection: number;
    index: number;
    onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, props: AccordionTitleProps) => void;
}

const AccordionSection: FunctionComponent<Props> = ({ title, activeSection, index, onClick, children }) => {
    const { Accordion, Icon } = Stage.Basic;

    return (
        <>
            <Accordion.Title active={activeSection === index} index={index} onClick={onClick}>
                <Icon name="dropdown" />
                {title}
            </Accordion.Title>
            <Accordion.Content active={activeSection === index}>{children}</Accordion.Content>
        </>
    );
};

export default AccordionSection;
