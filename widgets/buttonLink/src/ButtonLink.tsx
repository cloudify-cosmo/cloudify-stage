import type { SemanticCOLORS, SemanticICONS } from 'semantic-ui-react';
import type { CSSProperties, FunctionComponent } from 'react';
import { useCallback, useMemo } from 'react';

export interface ButtonLinkProps {
    basic: boolean;
    color: SemanticCOLORS;
    icon: SemanticICONS;
    label: string;
    url: string;
    fullHeight: boolean;
}

const ButtonLink: FunctionComponent<ButtonLinkProps> = ({ basic, color, icon, label, url, fullHeight }) => {
    const { Button } = Stage.Basic;

    const dispatch = ReactRedux.useDispatch();
    const handleClick = useCallback(() => {
        if (url.startsWith('http')) window.open(url, '_blank');
        else dispatch(ReactRouter.push(url));
    }, [url]);
    const style: CSSProperties | undefined = useMemo(() => (fullHeight ? { height: '100%' } : undefined), [fullHeight]);

    return (
        <Button
            basic={basic}
            color={color}
            content={label}
            disabled={!url}
            icon={icon}
            fluid
            labelPosition={icon ? 'left' : undefined}
            onClick={handleClick}
            style={style}
        />
    );
};

export default ButtonLink;
