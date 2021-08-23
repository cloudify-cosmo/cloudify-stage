import type { SemanticCOLORS, SemanticICONS } from 'semantic-ui-react';
import type { CSSProperties } from 'react';
import { FunctionComponent, useCallback } from 'react';

export interface LinkButtonProps {
    color: SemanticCOLORS;
    icon: SemanticICONS;
    label: string;
    url: string;
    fullHeight: boolean;
}

const LinkButton: FunctionComponent<LinkButtonProps> = ({ color, icon, label, url, fullHeight }) => {
    const { Button } = Stage.Basic;

    const dispatch = ReactRedux.useDispatch();
    const handleClick = useCallback(() => {
        if (url.startsWith('http')) window.open(url, '_blank');
        else dispatch(ReactRouter.push(url));
    }, [url]);
    const style: CSSProperties | undefined = fullHeight ? { height: 'calc(100% + 14px)' } : undefined;

    return (
        <Button
            disabled={!url}
            color={color}
            content={label}
            icon={icon}
            fluid
            labelPosition={icon ? 'left' : undefined}
            onClick={handleClick}
            style={style}
        />
    );
};

export default LinkButton;
