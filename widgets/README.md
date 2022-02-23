# Widgets 

## Built-in widgets

All built-in widgets resides in [this](.) directory.

Documentation for them is available [here](https://docs.cloudify.co/staging/dev/working_with/console/widgets/).

## Custom widgets

This section describes how to create new widget.

### Creating widget

To create your own widget:
1. Create new widget structure following the instructions from [here](https://docs.cloudify.co/staging.dev/developer/writing_widgets/) 
2. Place widget in [widgets](./widgets) directory

### Testing widget

To test your own widget:
1. Start the application (see [Application start section in main README file](../README.md#Setup))
2. Add your widget to the page using **Edit Mode** (check [this](https://docs.cloudify.co/staging/dev/working_with/customization/edit-mode/#adding-widgets) for details)

Since now, every single change in widget's source code should be reflected by webpack dev server after page reload.

### Creating widget package

To use your custom widget outside of the development environment, you need to create widget ZIP package.
Assuming you are working on widget named `myWidget` just run `npm run build:widget myWidget` 
and your custom widget package will be available in `dist/widgets` directory. 

You can install widget ZIP package on Cloudify Manager (check [Adding widget section in Edit Mode page](https://docs.cloudify.co/staging/dev/working_with/customization/edit-mode/#adding-widgets) for details)
