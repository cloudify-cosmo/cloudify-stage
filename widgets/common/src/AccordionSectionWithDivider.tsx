import type { PropsWithChildren } from 'react';
import type { AccordionTitleProps } from 'semantic-ui-react';
import AccordionSection from './AccordionSection';

const dividerStyle = {
    margin: '0 -14px 14px'
};

interface Props {
    title: string;
    initialActive?: boolean;
    activeSection?: number;
    index?: number;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, props: AccordionTitleProps) => void;
}

export default function AccordionSectionWithDivider({
    title,
    children,
    initialActive = false,
    index,
    activeSection,
    onClick
}: PropsWithChildren<Props>) {
    const { Divider } = Stage.Basic;

    return (
        <AccordionSection
            title={title}
            initialActive={initialActive}
            index={index}
            activeSection={activeSection}
            onClick={onClick}
        >
            <Divider style={dividerStyle} />
            {children}
        </AccordionSection>
    );
}
