/**
 * Created by jakubniezgoda on 07/11/2018.
 */

function DeleteConfirm({ className, force, onCancel, onConfirm, onForceChange, open, resourceName }) {
    const { Confirm, Form, Segment } = Stage.Basic;

    return (
        <Confirm
            className={className}
            header={`Are you sure you want to remove ${resourceName}?`}
            content={
                <Segment basic>
                    <Form.Field>
                        <Form.Checkbox name="force" toggle label="Force" checked={force} onChange={onForceChange} />
                    </Form.Field>
                </Segment>
            }
            open={open}
            onConfirm={onConfirm}
            onCancel={onCancel}
        />
    );
}

DeleteConfirm.propTypes = {
    resourceName: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    className: PropTypes.string,
    force: PropTypes.bool,
    onForceChange: PropTypes.func
};

DeleteConfirm.defaultProps = {
    className: '',
    force: false,
    onForceChange: _.noop
};

Stage.defineCommon({
    name: 'DeleteConfirm',
    common: DeleteConfirm
});
