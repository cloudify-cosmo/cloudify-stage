import styled from 'styled-components';

export const EllipsisWrapper = styled.div`
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

interface TextEllipsisProps {
    content: string | null;
}

const TextEllipsis = ({ content }: TextEllipsisProps) => {
    return <EllipsisWrapper title={content || ''}>{content}</EllipsisWrapper>;
};

export default TextEllipsis;
