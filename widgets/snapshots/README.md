# Snapshots List

Displays a list of snapshots of the Manager - both snapshots that were created on this manager, and snapshots uploaded to it.

<div class="ui message info">
* This widget is only available to users with the ‘admin’ role.
* Snapshots are always created with “private” visibility, which cannot be set to a different visibility level.
</div>

![snapshots-list]( /images/ui/widgets/snapshots-list.png )

## Features

### Snapshot basic information

The widget exposes the following information on each snapshot:

* **Id** - the name given to the snapshot upon creation
* **Visibility** - always “private” for snapshots
* **Creation time**
* **Status** - one of: created/creating/failed/uploading/uploaded
* **Creator**

### Snapshot actions

In the right column of every snapshot, the widget exposes the following action buttons:

* **Restore snapshot**
* **Download snapshot**
* **Delete snapshot**

The widget also exposes the following operations by the buttons on the top right corner:

* **Create** - Create a new snapshot on the current tenant
* **Upload** - Upload a snapshot to the current tenant


#### Creating a Snapshot

The snapshots creation process captures the data of the entire {{< param cfy_manager_name >}}, not just that of a specific tenant. However, the snapshot is created in the context of the current tenant, and therefore must be restored from it.

1. Click **Create** button above the Snapshots table.
2. Specify a unique ID for the snapshot and click **Create** button.   
   It is good practice to use a name that will help you to easily identify the snapshot later.

The creation process begins. If there are active executions when you attempt to create the snapshot, the process waits until the executions are complete before creating the snapshot. You can see the status of executions in the Deployment executions widget.

The snapshot is saved as a ZIP file and appears in the Snapshots table, together with details of its creator, creation date and time, and current status.


#### Restoring a Snapshot

If you restore a snapshot to a {{< param cfy_manager_name >}} instance that already contains data, that data is overwritten. To prevent inadvertent overwriting of existing data, you must explicitly state that you want to force data overwrite.

1. Click **Upload** button in the widget.
2. Either enter the URL of the snapshot or select the snapshot file from your file repository.
3. Enter the Snapshot name.
4. Click **Upload** button and see that snapshot was uploaded and is available in Snapshots table.
5. Click Restore icon ![Restore icon]( /images/ui/icons/restore-icon.png ) on the far right of newly uploaded snapshot's row
   * To restore a snapshot from a tenant-less (legacy) environment, toggle the relevant button.
   * To overwrite all content in the existing {{< param cfy_manager_name >}}, toggle the relevant button.
6. Click **Restore**.
7. The snapshot is restored and its details appear in the Snapshots table.

#### Downloading a Snapshot

1. Click Download icon ![Download icon]( /images/ui/icons/download-icon.png ) for the snapshot entry that you want to download.
2. Wait for the snapshot to be downloaded.


#### Deleting a Snapshot

1. Click Delete icon ![Delete icon]( /images/ui/icons/delete-icon.png ) for the snapshot entry that you want to delete.
2. Click **Yes** to delete the snapshot from the {{< param cfy_manager_name >}}.


## Settings

* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds.
