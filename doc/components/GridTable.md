# GridTable (Table) component

**Table** component enables fetching data using predefined function 
and showing tabular data in a simple manner. 

## Features
* data pagination
* selectable rows
* expandable rows
* data sorting by columns

## Usage

Some of the usage examples are presented below.

### Table with pagination

```javascript
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

<Table fetchData={this.props.fetchData}
       totalSize={this.props.data.total}
       pageSize={this.props.widget.configuration.pageSize}
       selectable={true}
       className="deploymentTable">

  <Table.Column label="Name" name="id" width="25%"/>
  <Table.Column label="Blueprint" name="blueprint_id" width="50%"/>
  <Table.Column label="Created" name="created_at" width="25%"/>

  {
    this.props.data.items.map((item)=>{
      return (
        <Table.Row key={item.id} selected={item.isSelected} onClick={()=>this.props.onSelectDeployment(item)}>
          <Table.Data><a className='deploymentName' href="javascript:void(0)">{item.id}</a></Grid.Table>
          <Table.Data>{item.blueprint_id}</Grid.Table>
          <Table.Data>{item.created_at}</Grid.Table>
        </Table.Row>
      );
    })
  }

</Table>
```

### Table with expandable row and without pagination

```javascript
<Table selectable={true}>

  <Table.Column label="Name" name="id" width="40%"/>
  <Table.Column label="Date" name="date" width="30%"/>
  <Table.Column width="30%"/>

  <Table.Row key="drupal" selected={false} onClick={()=>this.onRowClick(item)}>
      <Table.Data><a href="javascript:void(0)">Drupal application</a></Table.Data>
      <Table.Data>2016-03-04</Table.Data>
      <Table.Data>description for portal</Table.Data>
  </Table.Row>

  <Table.Row key="wordpress" selected={false} onClick={()=>this.onRowClick(item)}>
      <Table.Data><a href="javascript:void(0)">Wordpress blog</a></Table.Data>
      <Table.Data>2016-01-05</Table.Data>
      <Table.Data>description for blog</Table.Data>
  </Table.Row>

  <Table.Row key="joomla" selected={false} onClick={()=>this.onRowClick(item)}>
      <Table.Data><a href="javascript:void(0)">Joomla website</a></Table.Data>
      <Table.Data>2015-08-14</Table.Data>
      <Table.Data>description for website</Table.Data>
  </Table.Row>

  <Table.RowExpandable key="prestashop" expanded={true}>
    <Table.Row key="prestashop" selected={true} onClick={()=>this.onRowClick(item)}>
      <Table.Data><a href="javascript:void(0)">Prestashop store</a></Table.Data>
      <Table.Data>2017-01-05</Table.Data>
      <Table.Data>description for e-commerce solution</Table.Data>
    </Table.Row>
    <Table.DataExpandable>
      additional info when row becomes expanded
    </Table.DataExpandable>
  </Table.RowExpandable>

</Table>
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

### Table.Column (GridColumn)

Defines table columns, renders \<th\> elements.

#### Example

```javascript
<Table.Column label="Name" name="id" width="40%"/>
```

#### Props

Name | Type | Attribute | Description
---- | ---- | --------- | -----------
**label** | string | optional | name of the column to be shown
**name** | string | optional | internal column name used as an identifier, eg. for sorting 
**width** | string | optional, default: "" | column width
**show** | bool | optional, default: true | if true then column will be shown 

Children not required.

### Table.Row (GridRow)

Defines table rows, renders \<tr\> elements.

#### Example

```javascript
<Table.Row key="joomla" selected={false} onClick={()=>this.onRowClick(item)}>
  <Table.Data><a href="javascript:void(0)">Joomla website</a></Table.Data>
  <Table.Data>2015-08-14</Table.Data>
  <Table.Data>description for website</Table.Data>
</Table.Row>
```

#### Props

Name | Type | Attribute | Description
---- | ---- | --------- | -----------
**selected** | bool | optional, default: false | if true, then row will be marked as selected
**onClick** | func | optional | action to be executed on click event 
**showCols** | array | optional, default: [] | array of column's names to be shown

Children (**Table.Data** components) required.

### Table.ExpandableRow (GridExpandableRow)

Defines expandable row in grid, two \<tr\> elements are rendered by **Table** 
component from one **Table.ExpandableRow** component.

#### Example

```javascript
<Table.RowExpandable key="prestashop" expanded={true}>
  <Table.Row key="prestashop" selected={true} onClick={()=>this.onRowClick(item)}>
    <Table.Data><a href="javascript:void(0)">Prestashop store</a></Table.Data>
    <Table.Data>2017-01-05</Table.Data>
    <Table.Data>description for e-commerce solution</Table.Data>
  </Table.Row>
  <Table.DataExpandable>
    additional info when row becomes expanded
  </Table.DataExpandable>
</Table.RowExpandable>
```

#### Props

Name | Type | Attribute | Description
---- | ---- | --------- | -----------
**expanded** | bool | optional, default: false | if true, then expandable part (GridDataExpandable) of the row will be shown

Children (one **Table.Row** and one **Table.DataExpandable** component) required.

### Table.Action (GridAction)

TODO

### Table.Filter (GridFilter)

TODO