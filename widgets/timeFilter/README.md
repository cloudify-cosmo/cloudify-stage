### Time Filter
Displays a time filter for deployment metric graphs. It allows to define:

* **Time range** - Enables you to choose start (`From`) and end (`To`) dates
     * by defining custom range
         * using text input - Influx-compatible date/time is allowed. It is possible to define both absolute and relative date/time. For details, see the [Influx documentation - Date time strings](https://docs.cloudify.co/4.5.0https://docs.influxdata.com/influxdb/v0.8/api/query_language/#date-time-strings). Examples: `now() - 15m`  or `2017-09-21 10:10`
         * using calendar picker - You can choose date and time from the calendar/time pickers
     * by choosing predefined range - There are few predefined time ranges available. You can apply them with one click using the buttons on the left side of the filter

* **Time resolution** - Enables you to group the metrics according to time, to reduce the volume of displayed data. For example, although data might be collected every 10 msecs, you might specify that you only see points on the graph for every minute. Allowed time resolution units: `microseconds`, `milliseconds`, `seconds`, `minutes`, `hours`, `days` and `weeks`. Value ranges from 1 to 1000. 

The filter provides also the following features:

* **Time resolution optimization** - Automatic time resolution is set when you specify predefined range. It optimizes number of points to fetch from database to maximum 200 per chart. You can also optimize time resolution for custom ranges by clicking `Optimize` button. 

* **Time range and resolution reset** - When you click `Reset` button, both time range and time resolution are reset to default values.

* **Data validation** - When you click `Apply` button time range is validated. If invalid data is provided, then appropriate input field is marked with red color and time filter window will not be closed.  

![Time Filter](https://docs.cloudify.co/4.5.0/images/ui/widgets/time-filter.png)

#### Widget Settings 
None
