### Plugins List
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
* **Distribute release**
* **Uploaded at**
* **Creator** 
   
Upon hovering over ID label a pop up with the plugin’s ID will open, allowing you to copy it to the clipboard. 

![Plugins list](https://docs.cloudify.co/5.1/images/ui/widgets/plugins-list.png)


### Uploading a Plugin

1. Click **Upload** above the Plugins table.
2. Either enter the URL of the wagon or select the wagon file from your file repository.
3. Either enter the URL of the plugin yaml file or select the plugin yaml file from your file repository.
4. Provide a title for the plugin (should be automatically filled with package name upon providing YAML file).
5. Optionally provide icon file for the plugin.
6. Click **Upload**.

![Upload Plugin modal](https://docs.cloudify.co/5.1/images/ui/widgets/plugins_upload-plugin.png)


### Downloading a Plugin

Click **Download** icon on the right side of the plugin row and wait until the plugin is downloaded.


### Deleting a Plugin

Click **Delete** icon on the right side of the plugin row and confirm deletion in the dialog.


## Settings
 
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds.
