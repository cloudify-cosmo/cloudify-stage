import type { PropsWithChildren } from 'react';
import type { AccordionTitleProps } from 'semantic-ui-react';

const accordionTitleStyle = {
    paddingBottom: 1,
    paddingTop: 5
};

const accordionContentStyle = {
    overflow: 'visible',
    paddingTop: 14
};

interface Props {
    title: string;
    initialActive?: boolean;
    activeSection?: number;
    index?: number;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, props: AccordionTitleProps) => void;
}

export default function AccordionSection({
    title,
    children,
    initialActive = false,
    activeSection,
    index,
    onClick
}: PropsWithChildren<Props>) {
    const { useToggle } = Stage.Hooks;

    const [accordionActive, toggleAccordionActive] = useToggle(initialActive);

    const { Accordion, Icon, Segment } = Stage.Basic;

    const active = activeSection !== undefined ? activeSection === index : accordionActive;

    const handleClick = activeSection !== undefined ? onClick : toggleAccordionActive;

    return (
        <Segment>
            <Accordion.Title style={accordionTitleStyle} active={active} index={index} onClick={handleClick}>
                <Icon name="dropdown" />
                {title}
            </Accordion.Title>
            <Accordion.Content style={accordionContentStyle} active={active}>
                {children}
            </Accordion.Content>
        </Segment>
    );
}
declare global {
    namespace Stage.Common {
        export { AccordionSection };
    }
}

Stage.defineCommon({
    name: 'AccordionSection',
    common: AccordionSection
});
