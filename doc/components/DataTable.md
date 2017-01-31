# DataTable component

**DataTable** component enables fetching data using predefined function
and showing tabular data in a simple manner. 

## Features
* data pagination
* selectable rows
* expandable rows
* data sorting by columns

## Usage

Some of the usage examples are presented below.

### DataTable with pagination

```ecmascript 6
this.props = {
  fetchData: ...
  data: {
    items: [
      {
        id: ...,
        blueprint_id: ...,
        created_at: ...,
      }
      ...
    ],
    isSelected: ...,
    total: ...
  },
  onSelectDeployment: ...
}

<DataTable fetchData={this.props.fetchData}
       totalSize={this.props.data.total}
       pageSize={this.props.widget.configuration.pageSize}
       selectable={true}
       className="deploymentTable">

  <DataTable.Column label="Name" name="id" width="25%"/>
  <DataTable.Column label="Blueprint" name="blueprint_id" width="50%"/>
  <DataTable.Column label="Created" name="created_at" width="25%"/>

  {
    this.props.data.items.map((item)=>{
      return (
        <DataTable.Row key={item.id} selected={item.isSelected} onClick={()=>this.props.onSelectDeployment(item)}>
          <DataTable.Data><a className='deploymentName' href="javascript:void(0)">{item.id}</a></DataTable.Data>
          <DataTable.Data>{item.blueprint_id}</DataTable.Data>
          <DataTable.Data>{item.created_at}</DataTable.Data>
        </DataTable.Row>
      );
    })
  }

</DataTable>
```

### DataTable with expandable row and without pagination

```ecmascript 6
<DataTable selectable={true}>

  <DataTable.Column label="Name" name="id" width="40%"/>
  <DataTable.Column label="Date" name="date" width="30%"/>
  <DataTable.Column width="30%"/>

  <DataTable.Row key="drupal" selected={false} onClick={()=>this.onRowClick(item)}>
      <DataTable.Data><a href="javascript:void(0)">Drupal application</a></DataTable.Data>
      <DataTable.Data>2016-03-04</DataTable.Data>
      <DataTable.Data>description for portal</DataTable.Data>
  </DataTable.Row>

  <DataTable.Row key="wordpress" selected={false} onClick={()=>this.onRowClick(item)}>
      <DataTable.Data><a href="javascript:void(0)">Wordpress blog</a></DataTable.Data>
      <DataTable.Data>2016-01-05</DataTable.Data>
      <DataTable.Data>description for blog</DataTable.Data>
  </DataTable.Row>

  <DataTable.Row key="joomla" selected={false} onClick={()=>this.onRowClick(item)}>
      <DataTable.Data><a href="javascript:void(0)">Joomla website</a></DataTable.Data>
      <DataTable.Data>2015-08-14</DataTable.Data>
      <DataTable.Data>description for website</DataTable.Data>
  </DataTable.Row>

  <DataTable.RowExpandable key="prestashop" expanded={true}>
    <DataTable.Row key="prestashop" selected={true} onClick={()=>this.onRowClick(item)}>
      <DataTable.Data><a href="javascript:void(0)">Prestashop store</a></DataTable.Data>
      <DataTable.Data>2017-01-05</DataTable.Data>
      <DataTable.Data>description for e-commerce solution</DataTable.Data>
    </DataTable.Row>
    <DataTable.DataExpandable>
      additional info when row becomes expanded
    </DataTable.DataExpandable>
  </DataTable.RowExpandable>

</DataTable>
```

## Configuration

### Props

Name | Type | Attribute | Description
---- | ---- | --------- | -----------
**fetchData** | function | optional, default: ()=>{} | function used to fetch table data
**totalSize** | number | optional, default: -1 | total number of rows in table, if not specified pagination will not be set
**pageSize** | number | optional, default: 0 | number of displayed rows on page
**sortColumn** | string | optional, default: "" | column name used for data sorting
**sortAscending** | boolean | optional, default: true | true for ascending sort, false for descending sort
**searchable** | boolean | optional, default: false | if true filtering and searching input to be added
**selectable** | boolean | optional, default: false | if true row can be selected and highlighted
**className** | string | optional, default: "" | name of the style class to be added to \<table\> tag 

## Subcomponents

### DataTable.Column (GridColumn)

Defines table columns, renders \<th\> elements.

#### Example

```ecmascript 6
<DataTable.Column label="Name" name="id" width="40%"/>
```

#### Props

Name | Type | Attribute | Description
---- | ---- | --------- | -----------
**label** | string | optional | name of the column to be shown
**name** | string | optional | internal column name used as an identifier, eg. for sorting 
**width** | string | optional, default: "" | column width
**show** | bool | optional, default: true | if true then column will be shown 

Children not required.

### DataTable.Row (GridRow)

Defines table rows, renders \<tr\> elements.

#### Example

```ecmascript 6
<DataTable.Row key="joomla" selected={false} onClick={()=>this.onRowClick(item)}>
  <DataTable.Data><a href="javascript:void(0)">Joomla website</a></DataTable.Data>
  <DataTable.Data>2015-08-14</DataTable.Data>
  <DataTable.Data>description for website</DataTable.Data>
</DataTable.Row>
```

#### Props

Name | Type | Attribute | Description
---- | ---- | --------- | -----------
**selected** | bool | optional, default: false | if true, then row will be marked as selected
**onClick** | func | optional | action to be executed on click event 
**showCols** | array | optional, default: [] | array of column's names to be shown

Children (**DataTable.Data** components) required.

### DataTable.ExpandableRow (GridExpandableRow)

Defines expandable row in grid, two \<tr\> elements are rendered by **DataTable**
component from one **DataTable.ExpandableRow** component.

#### Example

```ecmascript 6
<DataTable.RowExpandable key="prestashop" expanded={true}>
  <DataTable.Row key="prestashop" selected={true} onClick={()=>this.onRowClick(item)}>
    <DataTable.Data><a href="javascript:void(0)">Prestashop store</a></DataTable.Data>
    <DataTable.Data>2017-01-05</DataTable.Data>
    <DataTable.Data>description for e-commerce solution</DataTable.Data>
  </DataTable.Row>
  <DataTable.DataExpandable>
    additional info when row becomes expanded
  </DataTable.DataExpandable>
</DataTable.RowExpandable>
```

#### Props

Name | Type | Attribute | Description
---- | ---- | --------- | -----------
**expanded** | bool | optional, default: false | if true, then expandable part (GridDataExpandable) of the row will be shown

Children (one **DataTable.Row** and one **DataTable.DataExpandable** component) required.

### DataTable.Action (GridAction)

TODO

### DataTable.Filter (GridFilter)

TODO