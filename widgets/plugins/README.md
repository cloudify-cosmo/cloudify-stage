# Plugins List
Displays a list of all the plugins uploaded to the current tenant, according to the user’s permissions, and enables their management. From this widget you can upload, delete, and download the plugins.

## Features

### Plugins details  

The widget displays the following information:

* **Plugin icon**
* **Plugin name**
* **Plugin Package name**
* **Plugin Package version**
* **Supported platform**
* **Distribution the plugin is supported on**
* **Distribution release**
* **Uploaded at**
* **Creator**

Upon hovering over ID label a pop up with the plugin’s ID will open, allowing you to copy it to the clipboard.

![Plugins list]( /images/ui/widgets/plugins-list.png )


### Uploading a Plugin package

1. Click **Upload** above the Plugins table.
2. Click **Upload a package**
3. Either enter the URL of the wagon or select the wagon file from your file repository.
4. Either enter the URL of the plugin yaml file or select the plugin yaml file from your file repository.
5. Provide a title for the plugin (should be automatically filled with package name upon providing YAML file).
6. Optionally provide icon file for the plugin.
7. Click **Upload**.

![Upload Plugin modal]( /images/ui/widgets/plugins_upload-plugin.png )

### Uploading a Plugin from the Marketplace

1. Click **Upload** above the Plugins table.
2. Click **Upload from Marketplace**
3. Upload selected plugins using the displayed [Plugins Catalog widget](/working_with/console/widgets/pluginsCatalog)

### Downloading a Plugin

Click **Download** icon on the right side of the plugin row and wait until the plugin is downloaded.


### Deleting a Plugin

Click **Delete** icon on the right side of the plugin row and confirm deletion in the dialog.


## Settings

* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds.
