# Blueprints Catalog

Displays blueprints from a repository under a configurable Github account or from an HTTP endpoint providing JSON response.

By default, the widget presents the blueprints listed in JSON file taken from widget configuration.

The widget includes an upload option for each of the blueprints, which lets you easily upload it to the current tenant on the manager.
After uploading a blueprint from the catalog, you will be able to see it under the **Blueprints** widget.

You can also point the widget to read from a GitHub user account.
You can then filter the presented blueprints by providing a filter query in the widget’s settings. Check [Searching for repositories](https://help.github.com/en/github/searching-for-information-on-github/searching-for-repositories) page to get more information on how to filter data in GitHub.

You can and should enter Github credentials for fetching data, as the defaults used by the widgets can reach the restricted query limit of GitHub (~50).
These parameters are pulled from secrets as the github-username and github-password keys.
These parameters are a must if you want to configure the widget to access private repositories.

![blueprints-catalog](https://docs.cloudify.co/latest/images/ui/widgets/blueprints-catalog.png)


## Settings

* `Blueprint Examples URL` - Specifies the JSON file from which the blueprints are being read
* `GitHub User` - GitHub user or organization account name which is the owner of the repository to fetch. Default: cloudify-examples
* `GitHub Filter` - Optional filter for GitHub repositories. See GitHub’s web page ‘Searching repositories’ for more details.
* `Display style` - defines whether the widget’s view is Catalog or Table. Default: Catalog
* `Sort by name` -  if set to true, then blueprints will be sorted by name. Default: No
