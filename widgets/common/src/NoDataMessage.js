function NoDataMessage({ repositoryName, children }) {
    const { Message } = Stage.Basic;
    const { MessageContainer } = Stage.Shared;
    return (
        <MessageContainer wide margin="30px auto">
            <Message>
                {children ||
                    `The widget content cannot be displayed because there is no connection to ${repositoryName} repository. Please check network connection and widget's configuration.`}
            </Message>
        </MessageContainer>
    );
}

NoDataMessage.propTypes = {
    repositoryName: PropTypes.string,
    children: PropTypes.node
};

NoDataMessage.defaultProps = {
    repositoryName: null,
    children: null
};

Stage.defineCommon({
    name: 'NoDataMessage',
    common: NoDataMessage
});
