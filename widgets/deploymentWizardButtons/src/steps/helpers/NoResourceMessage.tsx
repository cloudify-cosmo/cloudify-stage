// @ts-nocheck File not migrated fully to TS

export default function NoResourceMessage({ resourceName }) {
    const { Message } = Stage.Basic;

    return (
        <Message
            success
            icon="checkmark"
            header={`No ${resourceName} required`}
            content="You can go to the next step."
        />
    );
}
NoResourceMessage.propTypes = {
    resourceName: PropTypes.string.isRequired
};
