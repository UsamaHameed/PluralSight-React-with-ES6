import authorApi from '../api/mockAuthorApi';
import * as types from './actionTypes';
import {beginAjaxCall} from './ajaxStatusActions';

export function loadAuthorsSuccess(authors) {
   return {type: types.LOAD_AUTHORS_SUCCESS, authors};
}
export function loadAuthors() {
    //this here is a thunk
    //called at the app entry point in index.js
    //it returns a function that makes a manual dispatch call
    //something that mapDispatchToProps does *for* us
    return function(dispatch) {
        dispatch(beginAjaxCall());
        return authorApi.getAllAuthors().then(authors => {
            dispatch(loadAuthorsSuccess(authors));
        }).catch(error => {
            throw(error);
        });
    };
}