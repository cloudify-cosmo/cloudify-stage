/**
 * Created by pawelposel on 13/02/2017.
 */

import type { CSSProperties } from 'react';

interface ButtonLinkWidgetConfiguration {
    color: string;
    label: string;
    url: string;
    fullHeight: boolean;
}

Stage.defineWidget<unknown, unknown, ButtonLinkWidgetConfiguration>({
    id: 'buttonLink',
    name: 'Button link',
    description: 'Opens provided URL in a different tab',
    initialWidth: 2,
    initialHeight: 4,
    showHeader: false,
    showBorder: false,
    categories: [Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    initialConfiguration: [
        { id: 'label', name: 'Button label', default: 'Button Link', type: Stage.Basic.GenericField.STRING_TYPE },
        { id: 'url', name: 'URL address', default: '', type: Stage.Basic.GenericField.STRING_TYPE },
        { id: 'fullHeight', name: 'Full height', default: false, type: Stage.Basic.GenericField.BOOLEAN_TYPE },
        {
            id: 'color',
            name: 'Color',
            default: '#21ba45',
            type: Stage.Basic.GenericField.CUSTOM_TYPE,
            component: Stage.Basic.Form.ColorPicker
        }
    ],
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('buttonLink'),

    render({ configuration: { color, fullHeight, label, url } }) {
        const { Button } = Stage.Basic;
        const style: CSSProperties = { color: 'white' };

        if (fullHeight) {
            style.height = 'calc(100% + 14px)';
        }

        if (color) {
            style.backgroundColor = color;
        }

        return (
            <Button
                className="labeled icon"
                fluid
                icon="external"
                disabled={!url}
                onClick={() => {
                    window.open(url, '_blank');
                }}
                content={label}
                style={style}
            />
        );
    }
});
