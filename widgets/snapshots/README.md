### Snapshots List

Displays a list of snapshots of the Manager - both snapshots that were created on this manager, and snapshots uploaded to it. This widget is only available to users with the role ‘admin’.


Snapshots are always created with “private” visibility, which cannot be set to a different visibility level.


The widget exposes the following information on each snapshot:

* **Id** - the name given to the snapshot upon creation
* **Visibility** - always “private” for snapshots
* **Creation time**
* **Status** - one of: created/creating/failed/uploading/uploaded
* **Creator**

In the right column of every snapshot, the widget exposes the following action buttons:

* **Restore snapshot**
* **Download snapshot**
* **Delete snapshot**

The widget also exposes the following operations by the buttons on the top right corner:

* **Create** - Create a new snapshot on the current tenant
* **Upload** - Upload a snapshot to the current tenant

![snapshots-list](https://docs.cloudify.co/staging/dev/images/ui/widgets/snapshots-list.png)

#### Widget Settings
* `Refresh time interval` - The time interval in which the widget’s data will be refreshed, in seconds. Default: 30 seconds.
