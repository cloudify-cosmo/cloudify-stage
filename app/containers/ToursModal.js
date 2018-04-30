/**
 * Created by edenp on 15/04/2018.
 */

import ToursModal from '../components/ToursModal';
import { connect } from 'react-redux';
import {startTour, redirectStartTour} from '../actions/tours';
import Tours from '../utils/Tours';

const mapStateToProps = (state, ownProps) => {
    return {
        tours: state.tours
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onTourStart: (tour) => {
            if(Tours.shouldRedirectBeforeStarting(tour)){
                dispatch(redirectStartTour(tour.id, tour.startAt));
            } else{
                dispatch(startTour(tour));
            }
        }
    }
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ToursModal);