
# Filters

Displays the list of defined filters.
The table has 5 columns:

* **Filter name** - filter ID
* **Creator** - filter creator
* **Created** - filter creation date and time
* **System** - system filter indicator - checked when given filter is a system filter, unchecked otherwise
* Actions column

![filters]( /images/ui/widgets/filters.png )

The actions column contains the following action icons:

* **Clone filter** opens the **filter clone** modal allowing to create a modified copy of the selected filter (see <a href="#defining-filter-rules" onclick="document.getElementById(this.getAttribute('href')).scrollIntoView();">defining filter rules</a> for details on rule definition)
* **Edit filter** available only to `user` filters, opens the **filter rules edit** modal (see <a href="#defining-filter-rules" onclick="document.getElementById(this.getAttribute('href')).scrollIntoView();">defining filter rules</a> for details on rule definition)
* **Delete filter** available only to non-`system` filters, removes the selected filter (see note below)

Filters used as a default filter in
[the Deployments View widget](/working_with/console/widgets/deploymentsView)
cannot be deleted.
When trying to delete such a filter a modal shows up describing where (on which page and in which widget) and by whom (by which user) the filter is used.

![filters delete]( /images/ui/widgets/filters-delete.png ) 


Clicking the `Add` button above the table opens the filter add modal allowing to create a new filter by specifying filter ID and filter rules.

## Defining filter rules

Add, edit and clone operation modals share a common component for defining filter rules.

![filters rules]( /images/ui/widgets/filters-rules.png ) 

The component presents a list of rows, each representing a single filter rule. Each row contains three inputs:

* Rule type selection dropdown - selecting the context of the rule which can be based on labels or supported 
  deployment attributes such as blueprint ID, creator, display name, site name or tenant name.
* Rule operator dropdown. The set of available operators to choose from depends on the selected rule type. See **Table 1.** and **Table 2.** below for details.
* Value input (for attribute rules) or key/value input(s) (for label rules). 

<table class="ui celled table">
  <thead>
    <th width="20%">UI</th>
    <th width="15%">API</th>
    <th width="15%">CLI</th>
    <th width="50%">Applied logic</th>
  </thead>
  <tbody>
    <tr>
      <td>is one of</td>
      <td>any_of</td>
      <td>=</td>
      <td>The label key matches the specified key and the label value matches one of the specified values.</td>
    </tr>
    <tr>
      <td>is not one of</td>
      <td>not_any_of</td>
      <td>!=</td>
      <td>The label key matches the specified key and the label value does not match any of the specified values.</td>
    </tr>
    <tr>
      <td>is not one of (or no such key)</td>
      <td>is_not</td>
      <td>is-not</td>
      <td>No label key matches the specified key, or the label key matches the specified key and the label value does not match any of the specified values.</td>
    </tr>
    <tr>
      <td>key is not</td>
      <td>is_null</td>
      <td>is null</td>
      <td>No label key matches the specified key.</td>
    </tr>
    <tr>
      <td>key is</td>
      <td>is_not_null</td>
      <td>is not null</td>
      <td>The label key matches the specified key.</td>
    </tr>
  </tbody>
  <caption style="caption-side: bottom; text-align: left"><strong>Table 1.</strong> Labels operators mapping</caption>
</table>


<table class="ui celled table">
  <thead>
    <th width="20%">UI</th>
    <th width="15%">API</th>
    <th width="15%">CLI</th>
    <th width="50%">Applied logic</th>
  </thead>
  <tbody>
    <tr>
      <td>is one of</td>
      <td>any_of</td>
      <td>=</td>
      <td>The deployment attribute matches one of the specified values.</td>
    </tr>
    <tr>
      <td>is not one of</td>
      <td>not_any_of</td>
      <td>!=</td>
      <td>The deployment attribute does not match any of the specified values.</td>
    </tr>
    <tr>
      <td>contains</td>
      <td>contains</td>
      <td>contains</td>
      <td>The deployment attribute contains the specified value.</td>
    </tr>
    <tr>
      <td>does not contain</td>
      <td>not_contains</td>
      <td>does-not-contain</td>
      <td>The deployment attribute does not contain the specified value.</td>
    </tr>
    <tr>
      <td>starts with</td>
      <td>starts_with</td>
      <td>starts-with</td>
      <td>The deployment attribute starts with the specified value.</td>
    </tr>
    <tr>
      <td>ends with</td>
      <td>ends_with</td>
      <td>ends-with</td>
      <td>The deployment attribute ends with the specified value.</td>
    </tr>
  </tbody>
  <caption style="caption-side: bottom; text-align: left"><strong>Table 2.</strong> Attributes operators 
mapping</caption>
</table>

At any given time it is possible to append a new rule to the list of already defined rules (by clicking `Add new rule` button) or to remove any rule by clicking the trash icon in the corresponding rule row (unless there is only single rule defined).

You can learn more about filters and filter rules [here](/cli/orch_cli/filter-rules).

You can learn more about deployment labels [here](/cli/orch_cli/deployments#labels).


## Settings

* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds
