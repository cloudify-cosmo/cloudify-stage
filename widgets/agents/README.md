# Agents Management
Displays the following information about a specific agent: 

* **Id** - unique identifier of the agent
* **IP** - IP address of the agent host 
* **Deployment** - Deployment ID associated with agent
* **Node** - Node ID associated with agent
* **System** - agent host operation system
* **Version** - agent version
* **Install Method** - agent installation method (one of described [here](https://docs.cloudify.co/5.1/install_maintain/agents/installation))

![agents-management](https://docs.cloudify.co/5.1/images/ui/widgets/agents-management.png)

By clicking buttons above the table you can execute the following operations:

* `Install` - executes `install_new_agents` workflow on selected deployment. Allows to define Manager IP, Manager Certificate, stop old agents and filter by node(s), node instance(s) and install method(s).  
* `Validate` - executes `validate_agents` workflow on selected deployment. Allows to filter by node(s), node instance(s) and install method(s).

You can find more about agents [here](https://docs.cloudify.co/5.1/install_maintain/agents/index.html).


## Settings

* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 15 seconds
* `List of fields to show in the table` - List of columns to be shown in list of agents table. Some of the fields may be hidden depending on the context, eg. when Deployment ID is set in context then Deployment field will be hidden.
* `Filter Agents by Install Method` - Install Methods to filter Agents. Unset all options to disable this type of filtering. Default: No filtering by Install Methods.
