import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as courseActions from '../../actions/courseActions';
import CourseList from './CourseList';
import {browserHistory} from 'react-router';

class CoursesPage extends React.Component {
    //this is a container component which usually does not have any markup
    //in ideal cases, we would include the markup in some child component
    constructor(props, context) {
        super(props, context);
        // this.onTitleChange = this.onTitleChange.bind(this);
        // this.onClickSave = this.onClickSave.bind(this);
        this.redirectToAddCoursePage = this.redirectToAddCoursePage.bind(this);
    }

    // onTitleChange(event) {
    //     const course = this.state.course;
    //     course.title = event.target.value;
    //     this.setState({course: course});
    // }
    // onClickSave() {
    //     this.props.actions.createCourse(this.state.course);
    // }
    courseRow(course, index) {
        return <div key={index}>{course.title}</div>;
    }
    redirectToAddCoursePage() {
        browserHistory.push('/course');
    }
    render() {
        //de structuring to avoid writing this.props everytime
        const {courses} = this.props;
        return (
            <div>
                <h1>Courses</h1>
                <input type="submit"
                value="Add Course"
                className="btn btn-primary"
                onClick={this.redirectToAddCoursePage}/>
                <CourseList courses={courses} />
            </div>
        );
    }
}
CoursesPage.propTypes = {
    courses: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};
function mapStateToProps(state, ownProps) {
    //ownProps = component's own props, helpful to get props
    //injected by react router
    return {
      courses: state.courses
    };
}
function mapDispatchToProps(dispatch) {
    //dispatch triggers the app flow through redux
    //dispatch is injected in by the connect function only if we do
    //not call mapDispatchToProps
    //functions can be stored as key-value pairs and called in the
    //component... eliminates noise and lengthy code
    return {
        //second method, still very verbose
        //createCourse: course => dispatch(courseActions.createCourse(course))
        actions: bindActionCreators(courseActions, dispatch)
    };
    //when createCourse is called, the parameter is passed to course in
    //the arrow function
}
//mapDispatchToProps is for selecting what action we want to expose to
//our component, it is an optional parameter to connect,
//if we don't pass it, the component gets a default dispatch property
//attached to it injected by connect. use {this.props.dispatch} for it
//dispatch is a functional used to fire off actions like createCourse
//mapDispatchToProps determines what actions will be exposed to the
//component

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);