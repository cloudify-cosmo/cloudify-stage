export {};

const translate = Stage.Utils.getT('widgets.text');

type Configuration = {
    header: string;
    content: string;
    headerTextFont: string;
    headerTextColor: string;
    headerTextSize: number;
    contentTextFont: string;
    contentTextColor: string;
    contentTextSize: number;
};

const textFonts = [
    { name: 'Sans Serif', value: 'sans-serif' }, // used as default
    { name: 'Serif', value: 'serif' },
    { name: 'Monospace', value: 'monospace' }
];

Stage.defineWidget<never, never, Configuration>({
    id: 'text',
    showHeader: false,
    showBorder: false,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('text'),
    initialConfiguration: [
        {
            id: 'header',
            name: translate('configuration.header.name'),
            default: translate('configuration.header.default'),
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'content',
            name: translate('configuration.content.name'),
            description: translate('configuration.description.name'),
            default: translate('configuration.content.default'),
            type: Stage.Basic.GenericField.CUSTOM_TYPE,
            // @ts-ignore TODO(RD-6138): Fix once proper typing is added to `StageCustomConfigurationComponentProps` and `GenericField`
            component: Stage.Basic.Form.TextArea
        },
        {
            id: 'headerTextColor',
            name: translate('configuration.headerTextColor.name'),
            default: '#000000',
            type: Stage.Basic.GenericField.CUSTOM_TYPE,
            component: Stage.Basic.Form.ColorPicker
        },
        {
            id: 'headerTextSize',
            name: translate('configuration.headerTextSize.name'),
            default: 20,
            type: Stage.Basic.GenericField.NUMBER_TYPE,
            min: 6,
            max: 100
        },
        {
            id: 'headerTextFont',
            name: translate('configuration.headerTextFont.name'),
            default: textFonts[0].value,
            items: textFonts,
            type: Stage.Basic.GenericField.LIST_TYPE
        },

        {
            id: 'contentTextColor',
            name: translate('configuration.contentTextColor.name'),
            default: '#000000',
            type: Stage.Basic.GenericField.CUSTOM_TYPE,
            component: Stage.Basic.Form.ColorPicker
        },
        {
            id: 'contentTextSize',
            name: translate('configuration.contentTextSize.name'),
            default: 14,
            type: Stage.Basic.GenericField.NUMBER_TYPE,
            min: 6,
            max: 100
        },
        {
            id: 'contentTextFont',
            name: translate('configuration.contentTextFont.name'),
            default: textFonts[0].value,
            items: textFonts,
            type: Stage.Basic.GenericField.LIST_TYPE
        }
    ],

    render(widget) {
        const header = widget.configuration.header ? widget.configuration.header : '';
        const content = widget.configuration.content ? Stage.Utils.parseMarkdown(widget.configuration.content) : '';

        const headerStyle = {
            fontFamily: widget.configuration.headerTextFont,
            color: widget.configuration.headerTextColor,
            fontSize: widget.configuration.headerTextSize
        };
        const contentStyle = {
            fontFamily: widget.configuration.contentTextFont,
            color: widget.configuration.contentTextColor,
            fontSize: widget.configuration.contentTextSize
        };

        return (
            <div>
                {header && <h3 style={headerStyle}>{header}</h3>}
                {/* eslint-disable-next-line react/no-danger */}
                {content && <div style={contentStyle} dangerouslySetInnerHTML={{ __html: content }} />}
            </div>
        );
    }
});
