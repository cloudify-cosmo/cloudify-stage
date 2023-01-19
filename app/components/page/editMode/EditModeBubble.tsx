import type { PropsWithChildren } from 'react';
import React from 'react';
import { Message, Sidebar } from '../../basic';

interface EditModeBubbleProps {
    onDismiss: () => void;
    header: string;
}

export default function EditModeBubble({ onDismiss, header, children }: PropsWithChildren<EditModeBubbleProps>) {
    return (
        <>
            <div className="gridStackBottomSpace" />
            <Sidebar visible as={Message} animation="overlay" direction="bottom" className="editModeSidebar">
                <Message color="yellow" onDismiss={onDismiss}>
                    <Message.Header className="alignCenter" content={header} />
                    <Message.Content className="alignCenter">{children}</Message.Content>
                </Message>
            </Sidebar>
        </>
    );
}
