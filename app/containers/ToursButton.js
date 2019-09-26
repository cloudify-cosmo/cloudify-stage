/**
 * Created by edenp on 15/04/2018.
 */

import { connect } from 'react-redux';
import ToursButton from '../components/ToursButton';
import { startTour } from '../actions/tours';

const mapStateToProps = (state, ownProps) => {
    return {
        tours: state.tours
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onTourStart: tour => dispatch(startTour(tour))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ToursButton);
