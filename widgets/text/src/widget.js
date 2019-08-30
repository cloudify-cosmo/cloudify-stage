/**
 * Created by jakubniezgoda on 21/03/2018.
 */

const textFonts = [
    { name: 'Sans Serif', value: 'sans-serif' }, // used as default
    { name: 'Serif', value: 'serif' },
    { name: 'Monospace', value: 'monospace' }
];

Stage.defineWidget({
    id: 'text',
    name: 'Text box',
    description: 'Adds text box',
    showHeader: false,
    showBorder: false,
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('text'),
    initialConfiguration: [
        { id: 'header', name: 'Header', default: 'Header text', type: Stage.Basic.GenericField.STRING_TYPE },
        {
            id: 'content',
            name: 'Content',
            description: 'Markdown is supported',
            default: 'Markdown supported content. Update in widget configuration.',
            type: Stage.Basic.GenericField.CUSTOM_TYPE,
            component: Stage.Basic.Form.TextArea
        },

        {
            id: 'headerTextColor',
            name: 'Header text color',
            default: '#000000',
            type: Stage.Basic.GenericField.CUSTOM_TYPE,
            component: Stage.Basic.Form.ColorPicker
        },
        {
            id: 'headerTextSize',
            name: 'Header text size [px]',
            default: '20',
            type: Stage.Basic.GenericField.NUMBER_TYPE,
            min: 6,
            max: 100
        },
        {
            id: 'headerTextFont',
            name: 'Header text font',
            default: textFonts[0].value,
            items: textFonts,
            type: Stage.Basic.GenericField.LIST_TYPE
        },

        {
            id: 'contentTextColor',
            name: 'Content text color',
            default: '#000000',
            type: Stage.Basic.GenericField.CUSTOM_TYPE,
            component: Stage.Basic.Form.ColorPicker
        },
        {
            id: 'contentTextSize',
            name: 'Content text size [px]',
            default: '14',
            type: Stage.Basic.GenericField.NUMBER_TYPE,
            min: 6,
            max: 100
        },
        {
            id: 'contentTextFont',
            name: 'Content text font',
            default: textFonts[0].value,
            items: textFonts,
            type: Stage.Basic.GenericField.LIST_TYPE
        }
    ],

    render(widget, data, error, toolbox) {
        const header = widget.configuration.header ? widget.configuration.header : '';
        const content = widget.configuration.content ? markdown.parse(widget.configuration.content) : '';

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
                {content && <div style={contentStyle} dangerouslySetInnerHTML={{ __html: content }} />}
            </div>
        );
    }
});
