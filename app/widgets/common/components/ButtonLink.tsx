import type { CSSProperties, FunctionComponent } from 'react';
import React, { useCallback, useMemo } from 'react';
import type { ButtonConfiguration } from 'app/widgets/common/configuration/buttonConfiguration';
import { Button } from '../../../components/basic';

export interface ButtonLinkProps extends ButtonConfiguration {
    url: string;
    fullHeight: boolean;
}

const ButtonLink: FunctionComponent<ButtonLinkProps> = ({ basic, color, icon, label, url, fullHeight }) => {
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
