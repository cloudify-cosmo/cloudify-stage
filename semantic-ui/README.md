## Custom icons font

Custom icon font is being used for storing custom icons.  
It enables us to use newly created icons within the application framework

### Using custom icons

We can defer the usage of custom icons, depending on the used component

1. Using `Icon` component with `name` prop

    > **_NOTE:_** This method may require inserting @ts-ignore annotation

    We can pass custom icon name to the `name` prop

    Example

    ```typescript
    <Icon name="cloudify-dashboard" />
    ```

1. Using `Icon` components with `className` prop  
   We can pass custom icon name to the `className` prop

    Example

    ```typescript
    <Icon className="cloudify-dashboard" />
    ```

1. Using `Button` components with `icon` prop  
   `icon` prop can be either a name of the icon or an object that contains properties passed down to the `Icon` component (e.g. `className`)

    > **_NOTE:_** Passing plain icon name to the `icon` prop may require inserting @ts-ignore annotation

    Example of passing icon name

    ```typescript
    <Button
        content="Example"
        icon="cloudify-dashboard"
    >
    ```

    Example of passing icon name as a `className`

    ```typescript
    <Button
        content="Example"
        icon={{
            className: "cloudify-dashboard"
        }}
    >
    ```

### Adding new icon
