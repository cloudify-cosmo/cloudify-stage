/**
 * Created by edenp on 28/03/2018.
 */

import { connect } from 'react-redux';
import TourDimmer from '../components/TourDimmer';
import {welcomeTour} from '../actions/tour';

const mapStateToProps = (state, ownProps) => {
    return {
        shouldShowDimmer: () => {
            try{
                var usersParticipated = JSON.parse(localStorage.getItem('hello-cloudify'));
            }
            catch (err) {
                return true;
            }
            var currentUser = state.manager.username;
            return !_.isArray(usersParticipated) || !_.includes(usersParticipated, currentUser);
        },
        onTourDone: () => {
            try{
                var usersParticipated = JSON.parse(localStorage.getItem('hello-cloudify')) || [];
                var currentUser = state.manager.username;
                if(!_.includes(usersParticipated, currentUser)){
                    usersParticipated.push(currentUser);
                    localStorage.setItem('hello-cloudify', JSON.stringify(usersParticipated))
                }
            }
            catch (err){}
        }
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        startTour: () => {
            dispatch(welcomeTour());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TourDimmer);
