# GridTable component

**GridTable** component enables fetching data using predefined function 
and showing tabular data in a simple manner. 

## Features
* data pagination
* selectable rows
* expandable rows
* data sorting by columns

## Usage

Some of the usage examples are presented below.

### Grid table with pagination

```ecmascript 6
this.props = {
  fetchData: ...
  data: {
    items: [
      {
        id: ...,
        blueprint_id: ...,
        created_at: ...,
        blueprint_id: ...,
      }
      ...
    ],
    isSelected: ...,
    total: ...
  },
  onSelectDeployment: ...
}

<Grid.Table fetchData={this.props.fetchData}
            totalSize={this.props.data.total}
            pageSize={this.props.widget.plugin.pageSize}
            selectable={true}
            className="deploymentTable">

  <Grid.Column label="Name" name="id" width="25%"/>
  <Grid.Column label="Blueprint" name="blueprint_id" width="50%"/>
  <Grid.Column label="Created" name="created_at" width="25%"/>

  {
    this.props.data.items.map((item)=>{
      return (
        <Grid.Row key={item.id} selected={item.isSelected} onClick={()=>this.props.onSelectDeployment(item)}>
          <Grid.Data><a className='deploymentName' href="javascript:void(0)">{item.id}</a></Grid.Data>
          <Grid.Data>{item.blueprint_id}</Grid.Data>
          <Grid.Data>{item.created_at}</Grid.Data>
        </Grid.Row>
      );
    })
  }

</Grid.Table>
```

### Grid table with expandable row and without pagination

```ecmascript 6
<Grid.Table selectable={true}>

  <Grid.Column label="Name" name="id" width="40%"/>
  <Grid.Column label="Date" name="date" width="30%"/>
  <Grid.Column width="30%"/>

  <Grid.Row key="drupal" selected={false} onClick={()=>this.onRowClick(item)}>
      <Grid.Data><a href="javascript:void(0)">Drupal application</a></Grid.Data>
      <Grid.Data>2016-03-04</Grid.Data>
      <Grid.Data>description for portal</Grid.Data>
  </Grid.Row>

  <Grid.Row key="wordpress" selected={false} onClick={()=>this.onRowClick(item)}>
      <Grid.Data><a href="javascript:void(0)">Wordpress blog</a></Grid.Data>
      <Grid.Data>2016-01-05</Grid.Data>
      <Grid.Data>description for blog</Grid.Data>
  </Grid.Row>

  <Grid.Row key="joomla" selected={false} onClick={()=>this.onRowClick(item)}>
      <Grid.Data><a href="javascript:void(0)">Joomla website</a></Grid.Data>
      <Grid.Data>2015-08-14</Grid.Data>
      <Grid.Data>description for website</Grid.Data>
  </Grid.Row>

  <Grid.RowExpandable key="prestashop" expanded={true}>
    <Grid.Row key="prestashop" selected={true} onClick={()=>this.onRowClick(item)}>
      <Grid.Data><a href="javascript:void(0)">Prestashop store</a></Grid.Data>
      <Grid.Data>2017-01-05</Grid.Data>
      <Grid.Data>description for e-commerce solution</Grid.Data>
    </Grid.Row>
    <Grid.DataExpandable>
      additional info when row becomes expanded
    </Grid.DataExpandable>
  </Grid.RowExpandable>

</Grid.Table>
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

### GridColumn

Defines grid columns, renders \<th\> elements.

#### Example

```ecmascript 6
<Grid.Column label="Name" name="id" width="40%"/>
```

#### Props

Name | Type | Attribute | Description
---- | ---- | --------- | -----------
**label** | string | optional | name of the column to be shown
**name** | string | optional | internal column name used as an identifier, eg. for sorting 
**width** | string | optional, default: "" | column width
**show** | bool | optional, default: true | if true then column will be shown 

Children not required.

### GridRow

Defines grid rows, renders \<tr\> elements.

#### Example

```ecmascript 6
<Grid.Row key="joomla" selected={false} onClick={()=>this.onRowClick(item)}>
  <Grid.Data><a href="javascript:void(0)">Joomla website</a></Grid.Data>
  <Grid.Data>2015-08-14</Grid.Data>
  <Grid.Data>description for website</Grid.Data>
</Grid.Row>
```

#### Props

Name | Type | Attribute | Description
---- | ---- | --------- | -----------
**selected** | bool | optional, default: false | if true, then row will be marked as selected
**onClick** | func | optional | action to be executed on click event 
**showCols** | array | optional, default: [] | array of column's names to be shown

Children (**GridData** components) required.

### GridExpandableRow

Defines expandable row in grid, two \<tr\> elements are rendered by **GridTable** 
component from one **GridExpandableRow** component.

#### Example

```ecmascript 6
<Grid.RowExpandable key="prestashop" expanded={true}>
  <Grid.Row key="prestashop" selected={true} onClick={()=>this.onRowClick(item)}>
    <Grid.Data><a href="javascript:void(0)">Prestashop store</a></Grid.Data>
    <Grid.Data>2017-01-05</Grid.Data>
    <Grid.Data>description for e-commerce solution</Grid.Data>
  </Grid.Row>
  <Grid.DataExpandable>
    additional info when row becomes expanded
  </Grid.DataExpandable>
</Grid.RowExpandable>
```

#### Props

Name | Type | Attribute | Description
---- | ---- | --------- | -----------
**expanded** | bool | optional, default: false | if true, then expandable part (GridDataExpandable) of the row will be shown

Children (one **GridRow** and one **GridDataExpandable** component) required.

### GridAction

TODO

### GridFilter

TODO