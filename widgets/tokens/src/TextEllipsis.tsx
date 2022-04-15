import { EllipsisWrapper } from './TextEllipsis.styles';

interface TextEllipsisProps {
    content: string | null;
}

const TextEllipsis = ({ content }: TextEllipsisProps) => {
    return <EllipsisWrapper title={content || ''}>{content}</EllipsisWrapper>;
};

export default TextEllipsis;
