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

    const accordionTitleProps =
        activeSection !== undefined
            ? {
                  active: activeSection === index,
                  index,
                  onClick,
                  style: accordionTitleStyle
              }
            : {
                  active: accordionActive,
                  onClick: toggleAccordionActive,
                  style: accordionTitleStyle
              };

    const accordionContentProps =
        activeSection !== undefined
            ? {
                  style: accordionContentStyle,
                  active: activeSection === index
              }
            : {
                  style: accordionContentStyle,
                  active: accordionActive
              };

    return (
        <Segment>
            <Accordion.Title
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...accordionTitleProps}
            >
                <Icon name="dropdown" />
                {title}
            </Accordion.Title>
            <Accordion.Content
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...accordionContentProps}
            >
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
