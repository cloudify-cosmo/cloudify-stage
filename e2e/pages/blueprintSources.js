/**
 * Created by pposel on 05/07/2017.
 */

module.exports = {
    sections: {
        noBlueprintSelected: {
            selector: '.blueprintSourcesWidget',
            elements: {
                message: '.widgetContent .ui.info.message'
            }
        },

        source: {
            selector: '.blueprintSourcesWidget',
            elements: {
                tree: '.nodes-tree',
                blueprintHeader: '.nodes-tree .rc-tree-title .label',
                blueprintYaml: '.nodes-tree ul ul li:nth-child(3) .rc-tree-node-content-wrapper',
                emptyContent: '.splitter-layout .layout-splitter + .layout-pane i.file.icon',
                contentSnippet: '.splitter-layout .layout-splitter + .layout-pane .alignHighlight code span.hljs-attr:nth-child(1)',
                fullScreenButton: '.splitter-layout .layout-splitter + .layout-pane .alignHighlight div.attached.label'
            }
        }
    },
    elements: {
        overlay: '.ui.dimmer .overlay',
        fullScreen: '.ui.dimmer .overlay code span.hljs-attr:nth-child(1)'
    },
    props: {
        widgetId: 'blueprintSources',
        blueprintYaml: 'blueprint.yaml',
        blueprintSnippet: 'tosca_definitions_version:'
    }
};
