/**
 * Created by Tamer on 30/07/2017.
 */

import Actions from './Actions';
import PluginsCatalogList from './PluginsCatalogList';

Stage.defineWidget ({
  id: 'pluginsCatalog',
  name: 'Plugins catalog',
  description: 'Shows plugins catalog',
  initialWidth: 12,
  initialHeight: 20,
  color: 'teal',
  isReact: true,
  permission: Stage.GenericConfig.WIDGET_PERMISSION('pluginsCatalog'),
  initialConfiguration: [
    {
      id: 'jsonPath',
      name: 'Plugins Catalog JSON Source',
      placeHolder: 'Type JSON Path',
      default: 'http://cloudify.co/api/plugins.json',
      type: Stage.Basic.GenericField.STRING_TYPE,
    },
  ],

  /**
   * fetch data from source
   * 
   * @param {any} widget 
   * @param {any} toolbox 
   * @param {any} params 
   * @returns 
   */
  fetchData (widget, toolbox, params) {
    let actions = new Actions ({
      toolbox,
      ...widget.configuration,
    });

    return actions.doGetPluginsList ();
  },

  /**
   * render widget
   * 
   * @param {any} widget 
   * @param {any} data 
   * @param {any} error 
   * @param {any} toolbox 
   * @returns 
   */
  render: function (widget, data, error, toolbox) {
    if (_.isEmpty (data)) {
      return <Stage.Basic.Loading />;
    }

    let actions = new Actions ({
      toolbox,
      ...widget.configuration,
    });

    return (
      <PluginsCatalogList
        widget={widget}
        items={data}
        toolbox={toolbox}
        actions={actions}
      />
    );
  },
});
