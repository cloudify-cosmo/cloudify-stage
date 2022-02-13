# Documentation

## Components
Documentation of widget basic components (exposed using `Stage.Basic` global) is available in 
[Widget Components Reference](https://docs.cloudify.co/staging/dev/developer/writing_widgets/widgets-components/).

Version of `cloudify-ui-components` package used in [package.json](../package.json) 
must match the version of `ui_components_link` parameter set in 
[widgets-components.md from docs.getcloudify.org repository](https://raw.githubusercontent.com/cloudify-cosmo/docs.getcloudify.org/master/content/developer/writing_widgets/widgets-components.md).

It means that whenever `cloudify-ui-components` package version needs to be updated in `cloudify-stage`, 
then `ui_components_link` parameter in `widgets-components.md` should be updated first.

## Widgets
Widgets documentation bases on 
[Default Widgets Reference](https://docs.cloudify.co/staging/dev/working_with/console/default-widgets-ref/) 
and is stored in `README.md` files in widgets' root folders (e.g. [widgets/blueprints/README.md](../widgets/blueprints/README.md)).

To update widgets' documentation - instead of modifying `README.md` files directly - you have to:
1. Update it in [docs.getcloudify.org repository](https://github.com/cloudify-cosmo/docs.getcloudify.org/tree/master/content/working_with/console/widgets) 
2. Execute `npm run docWidgets` in this repository. Configuration for update script can be found in: 
   [scripts/readmesConfig.json](./../scripts/readmesConfig.json). 
