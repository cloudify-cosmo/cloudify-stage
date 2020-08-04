/**
 * Created by kinneretzin on 30/08/2016.
 */
import PropTypes from 'prop-types';
import React from 'react';

export default function AddButton({ children, className, onClick }) {
    return (
        // eslint-disable-next-line react/button-has-type
        <button className={`ui labeled icon button tiny teal basic compact ${className}`} onClick={onClick}>
            <i className="plus icon" />
            {children}
        </button>
    );
}

AddButton.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func
};

AddButton.defaultProps = {
    className: '',
    onClick: _.noop
};
