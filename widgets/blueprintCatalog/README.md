### Blueprints Catalog

Displays blueprints from a repository under a configurable Github account.
By default, the widget presents the blueprints under cloudify-examples repository, which fit the specific manager’s version. It is configured to read the blueprints URLs from a json file. You can also point the widget to read from a different user account from its settings. The widget includes an upload option for each of the blueprints, which lets you easily upload it to the current tenant on the manager. After uploading a blueprint from the catalog, you will be able to see it under the “local blueprints” widget. 
You can filter the presented blueprints by creating a filter query in the widget’s settings.  
You can and should enter Github credentials for fetching data, as the defaults used by the widgets can reach the restricted query limit of GitHub (~50) . These parameters are pulled from secrets) as the github-username and github-password keys. These parameters are a must if you want to configure the widget to access private repositories.

![blueprints-catalog](https://docs.cloudify.co/4.4.0/images/ui/widgets/blueprints-catalog.png)

#### Widget Settings
* `Blueprint Examples URL` - Specifies the json file from which the Cloudify examples URLs are being read
* `GitHub User` - GitHub user or organization account name which is the owner of the repository to fetch. Default: cloudify-examples
* `GitHub Filter` - Optional filter for GitHub repositories. See GitHub’s web page ‘Searching repositories’ for more details. 
* `Display style` - defines whether the widget’s view is Catalog or Table. Default: Catalog