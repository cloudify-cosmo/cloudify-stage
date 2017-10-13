/**
 * Created by Tamer on 14/08/2017.
 */

import MyResourcesCheckbox from './MyResourcesCheckbox';

Stage.defineWidget ({
  id: 'onlyMyResources',
  name: 'only my resources',
  description: 'show only my resources checkbox, work with (plugins, snapshots, blueprints, deployments)',
  initialWidth: 12,
  initialHeight: 4,
  color: 'yellow',
  showHeader: false,
  showBorder: false,
  isReact: true,
  permission: Stage.GenericConfig.WIDGET_PERMISSION('onlyMyResources'),

  render: function (widget, data, error, toolbox) {
    return <MyResourcesCheckbox widget={widget} toolbox={toolbox} />;
  },
});
