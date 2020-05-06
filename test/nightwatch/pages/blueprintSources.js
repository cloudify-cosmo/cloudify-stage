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
                blueprintHeader: '.nodes-tree .rc-tree-title > div.label',
                blueprintYaml: '.nodes-tree .rc-tree-title strong',
                emptyContent: '.splitter-layout .layout-splitter + .layout-pane i.file.icon',
                contentSnippet:
                    '.splitter-layout .layout-splitter + .layout-pane .alignHighlight code span.hljs-attr:nth-child(1)',
                fullScreenButton: '.splitter-layout .layout-splitter + .layout-pane .alignHighlight div.attached.label'
            }
        }
    },
    elements: {
        overlay: '.ui.dimmer .modal',
        fullScreen: '.ui.dimmer .modal code span.hljs-attr:nth-child(1)'
    },
    props: {
        widgetId: 'blueprintSources',
        blueprintYaml: 'blueprint.yamlMain',
        blueprintSnippet: 'tosca_definitions_version:'
    }
};
