# Widgets 

All built-in widgets resides in [this](.) directory.

Documentation for them is available [here](https://docs.cloudify.co/latest/working_with/console/widgets/).

## Custom widgets development

To create your own widget:
1. Create new widget structure following the instructions from [here](https://docs.cloudify.co/latest/developer/custom_console/custom-widgets/) 
1. Place widget in [widgets](./widgets) directory
1. Restart webpack dev server (`npm run devServer` from main folder)
1. Install new widget (read [this](https://docs.cloudify.co/latest/working_with/console/configure-display/) for details)

Since now, every single change in widget's source code should be reflected by webpack dev server after page reload.
