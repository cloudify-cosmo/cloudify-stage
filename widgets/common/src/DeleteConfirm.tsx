import type { FunctionComponent } from 'react';
import { StrictCheckboxProps, StrictConfirmProps } from 'semantic-ui-react';

interface DeleteConfirmProps {
    className?: string;
    force?: boolean;
    onForceChange?: StrictCheckboxProps['onChange'];
    open: boolean;
    onCancel?: StrictConfirmProps['onCancel'];
    onConfirm?: StrictConfirmProps['onConfirm'];
    resourceName: string;
}

const DeleteConfirm: FunctionComponent<DeleteConfirmProps> = ({
    className,
    force = false,
    onCancel,
    onConfirm,
    onForceChange,
    open,
    resourceName
}) => {
    const { Confirm, Form, Segment } = Stage.Basic;

    return (
        <Confirm
            className={className}
            header={`Are you sure you want to remove ${resourceName}?`}
            content={
                <Segment basic>
                    <Form.Field>
                        <Form.Checkbox
                            name="force"
                            toggle
                            label="Force"
                            checked={force}
                            onChange={onForceChange}
                            help=""
                        />
                    </Form.Field>
                </Segment>
            }
            open={open}
            onConfirm={onConfirm}
            onCancel={onCancel}
        />
    );
};

DeleteConfirm.propTypes = {
    resourceName: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    className: PropTypes.string,
    force: PropTypes.bool,
    onForceChange: PropTypes.func
};

declare global {
    namespace Stage.Common {
        // eslint-disable-next-line import/prefer-default-export
        export { DeleteConfirm };
    }
}

Stage.defineCommon({
    name: 'DeleteConfirm',
    common: DeleteConfirm
});
