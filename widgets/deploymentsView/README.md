# Deployments View

Presents information about deployments in a single view. Contains:

- a table showing the deployments in the system (the left side)

    The deployments can be further filtered.
    See <a href="#filtering-deployments" onclick="document.getElementById(this.getAttribute('href')).scrollIntoView();">Filtering deployments</a>.

- a pane with the deployment details divided into tabs (the right side)
- a map showing the deployments locations (on the top, opened using the **Map**
  button or automatically, if the widget configuration is changed)

![Deployments View widget](/images/ui/widgets/deployments-view-widget.png)

## Table

The table shows deployments that match the current filter.
See <a href="#filtering-deployments" onclick="document.getElementById(this.getAttribute('href')).scrollIntoView();">Filtering deployments</a>
for more details on filtering.

The columns shown in the table can be shown and hidden using the widget's
configuration.

Clicking a deployment row in the table will select it and affect the contents
of <a href="#details-pane" onclick="document.getElementById(this.getAttribute('href')).scrollIntoView();">the Details pane</a> and the selected marker
in <a href="#deployments-map" onclick="document.getElementById(this.getAttribute('href')).scrollIntoView();">the map</a>.

At the bottom of the table are controls that allow changing the number of
deployments shown in a single table page, as well as moving to other pages in
case there are more deployments that fit a single page.

If there is a workflow in progress for a given environment, there is a progress
bar right under the row in the table.

![Deployments View table progress bar](/images/ui/widgets/deployments-view-table-progress.png)

### Columns

The columns can show:

1. The deployment status represented as an icon

   - No icon - _Good_
   - Yellow spinner
     ![In progress icon](/images/ui/icons/deployments-view-in-progress-icon.png) - _In progress_
   - Red exclamation mark
     ![Requires attention icon](/images/ui/icons/deployments-view-requires-attention-icon.png) - _Requires attention_

    See <a href="#environments-and-services" onclick="document.getElementById(this.getAttribute('href')).scrollIntoView();">the Environments and Services section</a>
    for more information on deployment statuses.

2. ID - the deployment ID

    You can see the exact ID by hovering over the _ID_ button. From the popup
    you can also copy the ID directly to your clipboard.

3. Name - the deployment display name
4. Blueprint Name - the name of the blueprint that this deployment is using
5. Environment Type - the value of the `csys-env-type` label for that
   deployment

    Useful for differentiating deployments that use the same blueprint.

6. Location - the name of the site the deployment is assigned to
7. The counts and statuses of child deployments depending on their type
   (environments or services)

    See <a href="#environments-and-services" onclick="document.getElementById(this.getAttribute('href')).scrollIntoView();">the Environments and Services section</a>
    for more information on child deployments.

    The counts and statuses in those columns are based on **all** child
    deployments (it does not matter whether they are directly or indirectly
    attached to the main deployment).

### Sorting deployments

Deployments in the table can be sorted by clicking a column's header.

Clicking the column again will cycle between ascending and descending sort
order.

## Details pane

The right side of the widget contains details about the currently selected
deployment.

In the header of the right side are:

- the currently selected deployment name
- button to drill-down to deployment details
- buttons to drill-down to child environments or services

    Those buttons will not be visible when there are no child environments or services.

    See <a href="#environments-and-services" onclick="document.getElementById(this.getAttribute('href')).scrollIntoView();">the Environments and Services section</a>
    for more information on child deployments.

- buttons to execute a workflow on that deployment or invoke some other
  deployment action

What follows are different deployment-related widgets divided into 3 tabs:

1. Last Execution - information about the last workflow execution for that
   deployment
2. Deployment Info - general information about the deployment
3. History - a list of workflow executions for that deployment and a list of
   logs

## Environments and Services

For clarity and better organization, deployments can form a hierarchical
structure and be marked as:

- Environments - can hold other environments and services
- Services - the bottommost level of the hierarchy

Marking the deployments happens by adding the following labels to the
deployment:

1. `csys-obj-parent` - the ID of the parent of the current deployment
2. `csys-obj-type` - either `service` or `environment`
    If there is no such label, the deployment is a service by default.

Forming a hierarchical structure allows drilling down into deployments that are
directly attached to a parent environment, as well as aggregating and
propagating statuses of deployments for better problem discovery.

### Deployment status

A single deployment's status is:

- _Requires attention_ (red exclamation mark) if one of the following applies:
   - at least one node is not successfully installed (and there is no workflow
     in progress)
   - the last workflow execution failed
- _In progress_ (yellow spinner) if there is a workflow in progress
- _Good_ - otherwise.

### Propagating deployment statuses

If a deployment has child deployments, then their statuses are propagated so
that:

1. If there is at least one nested deployment that requires attention, the parent's
   status will be _Requires attention_ too.
2. Otherwise, if there is at least one nested deployment that is in progress,
   the parent's status will be _In progress_ too (unless the parent deployment
   itself _Requires attention_).

### Drilling down to child deployments

If a deployment has child deployments, the drill-down buttons in the top part of
the right pane become visible. Clicking them will navigate to a nested page that
present the deployments (only environments or services, depending on the button
clicked) from the next level in the hierarchy.

The nested page has only a single Deployments View widget, but it can be
customized using the
[Edit Mode](/working_with/console/customization/edit-mode).

Drilling down can happen multiple times if there are more levels in the
deployments hierarchy.

To go back to the parent page, use the breadcrumbs in top part of the page.

![Drilled-down Deployments View](/images/ui/widgets/deployments-view-drilled-down.png)

## Features

### Filtering deployments

Deployments visible in the table can be filtered in 3 ways:

1. Typing in the search bar above the table
2. Setting a default filter in the widget's configuration

    This filter will be persisted and used when viewing the widget again.

3. Applying a local filter

    By clicking the "Filter" button in the top-right
    corner of the widget, one can select a local filter. It will override the
    default filter picked in the widget's configuration. The local filter will be
    reset when viewing the widget again.

<div class="ui message info">
<a href="/working_with/console/widgets/filter">The Resource Filter widget</a>
does not influence the filtering performed in the Deployments View widget.
</div>

### Deployments Map

Clicking the _Map_ button in the top part of the widget will open an additional
map section in the top part of the widget. The map presents deployments in the
sites that are attached to them.

![Deployments View map](/images/ui/widgets/deployments-view-map.png)

The height of the map section, as well as whether it should be open by default
can be changed using the widget's configuration.

The color of the marker representing a deployment depends on the deployment's
state:

1. Blue - _Good_
2. Yellow - _In progress_
3. Red - _Requires attention_

The map supports zooming (when scrolling using the mouse or when using the zoom
buttons in the top-left part of the map) and panning (when dragging using the
mouse).

Deployments that are close together are grouped into a cluster that displays the
number of deployments in that clustered group. The color of the cluster icon
depends on the worst state of deployments inside of it. Clicking the marker will
expand the cluster (either by zooming in or by breaking the cluster apart into
individual markers).

The currently selected deployment is marked by an additonal circle underneath
the marker. Such a deployment is not clustered, meaning it will appear outside
of any cluster, even if it is close to other deployments.

Clicking a deployment marker will select it in the table and affect the contents
of <a href="#details-pane" onclick="document.getElementById(this.getAttribute('href')).scrollIntoView();">the Details pane</a> and the selected marker
in <a href="#deployments-map" onclick="document.getElementById(this.getAttribute('href')).scrollIntoView();">the map</a>.

Hovering over a deployment marker will show a tooltip with additonal
information:

- Deployment name
- Deployment blueprint name
- Site name
- Deployment status
- The counts and statuses of child deployments

![Deployments Map tooltip](/images/ui/widgets/deployments-view-map-tooltip.png)

### Bulk Actions

The Deployments View widget also has a _Bulk Actions_ button in the top-right
corner of the widget. It allows invoking actions over all deployments that match
the current filter criteria.

<div class="ui message info">
Keep in mind the actions will be invoked also for deployments that are on other
pages of the table (not only the deployments that are visible in the current
table page).
</div>

#### Deploy On

The _Deploy On_ bulk action will show a modal that guides the user through
deploying additional services on the environments that are matched by the
current filter.

After selecting the base blueprint for the new deployments, providing 
a name suffix and additional labels, there will be a new child deployment created for each
deployment matched by the current filter.
Each generated deployment will be labeled with the Environment ID of the
environment on which it is deployed as a parent label, and the capabilities of
that parent environment can be retrieved using the
[get-environment-capability](/developer/blueprints/spec-intrinsic-functions#get-environment-capability)
intrinsic function.

The newly created child deployments will be automatically installed.

![Deploy On modal](/images/ui/widgets/deployments-view-deploy-on-modal.png)

#### Run Workflow

The _Run Workflow_ bulk action will show a modal that allows selecting a
workflow that will be executed on each deployment that matches the current
filter.

![Run Workflow modal](/images/ui/widgets/deployments-view-run-workflow-modal.png)

## Settings

- `Refresh time interval` - The time interval in which the widget’s data will
  be refreshed, in seconds. Default: 10 seconds
- `Map height` - the height of the map section in pixels
- `List of fields to show in the table`
- `Number of items to show at once in the table`
- `Show map by default`
- `Name of the saved filter to apply` - the name of a filter to use by default
  when there is no local filter applied.

    See <a href="#filtering-deployments" onclick="document.getElementById(this.getAttribute('href')).scrollIntoView();">Filtering deployments</a> for more
    information.

- `Filter by parent deployment` - whether to only show deployments that are
  directly attached to a deployment selected on a previous, parent page.

    This is useful only when manually adding the _Deployments View_ widget inside
    of a drilled-down page.
