import React, { PropsWithChildren } from 'react';

export default function TerraformModalAccordion({
    title,
    children,
    initialActive = false
}: PropsWithChildren<{ title: string; initialActive?: boolean }>) {
    const { useToggle } = Stage.Hooks;

    const [accordionActive, toggleAccordionActive] = useToggle(initialActive);

    const { Accordion, Icon, Segment } = Stage.Basic;

    return (
        <Segment>
            <Accordion.Title
                active={accordionActive}
                onClick={toggleAccordionActive}
                style={{ paddingBottom: 1, paddingTop: 5 }}
            >
                <Icon name="dropdown" />
                {title}
            </Accordion.Title>
            <Accordion.Content style={{ overflow: 'visible', paddingTop: 14 }} active={accordionActive}>
                {children}
            </Accordion.Content>
        </Segment>
    );
}
