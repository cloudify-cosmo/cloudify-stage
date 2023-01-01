## Custom icons font

Custom icon font is being used for storing custom icons.  
It enables us to use newly created icons within the application framework.

### Using custom icons

We can use custom icons in a different way, depending on the used component.

1. Using `Icon` component with `name` prop

    > **_NOTE:_** This method may require inserting @ts-ignore annotation.

    We can pass custom icon name to the `name` prop.

    Example

    ```typescript
    <Icon name="cloudify-dashboard" />
    ```

1. Using `Icon` components with `className` prop  
   We can pass custom icon name to the `className` prop.

    Example

    ```typescript
    <Icon className="cloudify-dashboard" />
    ```

1. Using `Button` components with `icon` prop  
   `icon` prop can be either a name of the icon or an object that contains properties passed down to the `Icon` component (e.g. `className`).

    > **_NOTE:_** Passing plain icon name to the `icon` prop may require inserting @ts-ignore annotation.

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

1. Execute `npm run generate:icons-font` command, which will open preconfigured [fontello website](https://fontello.com/)
1. Drag and drop new icon on the [fontello website](https://fontello.com/)
1. Select newly added icon, by clicking it
1. (Optional) Change icon name, if needed  
   To do that, hover over the icon and click appeared pen icon

    > **_Good practice:_** Icon name should uniquely convey its purpose. <br /> It shouldn't be related to a specific use case. <br /> E.g. icon looking like an envelope should be named `envelope`, not `email`.

1. Download updated icons font, by clicking `Download webfont` button
1. Unzip downloaded file
1. Copy `<DOWNLOADED_FILE_PATH>/fontello.config.json` to the `./` directory
1. Copy `<DOWNLOADED_FILE_PATH>/font/cloudify-icons.ttf` to the `./fonts/cloudify-icons/` directory
1. Copy `<DOWNLOADED_FILE_PATH>/css/cloudify-icons-codes.css` file content and insert it into `./site/elements/icon.overrides`

After project recompilation, newly added icons should be available to use.

> **_NOTE:_** During the process all icons will be prefixed with `cloudify-`. <br /> So if you added a `plant` icon, it will be available under the `cloudify-plant` name.
