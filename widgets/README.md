# Widgets 

## Built-in widgets

All built-in widgets resides in [this](.) directory.

Documentation for them is available [here](https://docs.cloudify.co/staging/dev/working_with/console/widgets/).

Each widget has `README.md` file in root folder (e.g. [widgets/blueprints/README.md](../widgets/blueprints/README.md)
). That file should be in sync with widget description page from [User Documentation]((https://docs.cloudify.co/staging/dev/working_with/console/widgets/)) .

To update widgets' documentation - instead of modifying `README.md` files directly - you have to:
1. Update it in [docs.getcloudify.org repository](https://github.com/cloudify-cosmo/docs.getcloudify.org/tree/master/content/working_with/console/widgets)
2. Execute `npm run docWidgets` in this repository. Configuration for update script can be found in:
   [scripts/readmesConfig.json](./../scripts/readmesConfig.json).

## Custom widgets

This section describes how to create a new widget.

### Creating a widget

To create your own widget:
1. Create new widget structure following the instructions from 
   [here](https://docs.cloudify.co/staging/dev/developer/writing_widgets/) 
2. Place widget in [widgets](./widgets) directory

### Testing a widget

To test your own widget:
1. Start the application (see [Application start section in main README file](../README.md#Setup))
2. Add your widget to the page using **Edit Mode** 
   (check [this](https://docs.cloudify.co/staging/dev/working_with/console/customization/edit-mode/#adding-widgets) 
   for details)

Since now, every single change in widget's source code should be reflected by webpack dev server after page reload.

### Creating widget package

To use your custom widget outside of the development environment, you need to create a widget ZIP package.
Assuming you are working on widget named `myWidget` just run `npm run build:widget myWidget` 
and your custom widget package will be available in `dist/widgets` directory. 

You can install widget ZIP package on Cloudify Manager (check
[Adding widget section in Edit Mode page](https://docs.cloudify.co/staging/dev/working_with/console/customization/edit-mode/#adding-widgets) for details)

## Development guidelines

### Accessing application framework

As widget JS bundle is independently built using Webpack, importing a code from the outside of a widget directory should be avoided to keep widget JS bundle small.

Most common method for accessing application framework code ([app directory](../app)) is through `Stage` global object (see [Stage API definition](../app/typings/stage-api.d.ts)).

### Accessing Redux store

There are a few methods how you can access application Redux store from the widget:

1. In functional components you can use `ReactRedux` global object which provides Redux
   hooks (see `ReactRedux` definition in
   [Stage API definition](../app/typings/stage-api.d.ts))
2. In class components you can use `connectToStore` global function 
   (see `connectToStore` definition in
   [Stage API definition](../app/typings/stage-api.d.ts))
3. You can use `toolbox.getManagerState()` method if you need just `manager` 
   part of the Redux state (see `getManagerState` description in
   [Widget APIs page](https://docs.cloudify.co/staging/dev/developer/writing_widgets/widget-apis/#getmanagerstate))
