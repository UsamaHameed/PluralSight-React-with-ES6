import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as courseActions from '../../actions/courseActions';
import CourseForm from './CourseForm';
import toastr from 'toastr';

class ManageCoursePage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            course: Object.assign({}, props.course),
            //don't have to write this.props in constructor, only props
            errors: {},
            loading: false
        };
        this.updateCourseState = this.updateCourseState.bind(this);
        this.saveCourse = this.saveCourse.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.course.id !== nextProps.course.id) {
            //Necessary to populate form when course is loaded directly
            this.setState({course: Object.assign({}, nextProps.course)});
        }
    }
    updateCourseState(event) {
        const field = event.target.name;
        let course = this.state.course;
        course[field] = event.target.value;
        return this.setState({course: course});
    }
    redirect() {
        this.setState({loading: false});
        toastr.success('Course Saved!');
        this.context.router.push('/courses');
    }
    saveCourse(event) {
        event.preventDefault();
        this.setState({loading: true});
        //toastr.success('Saving course...');
        this.props.actions.saveCourse(this.state.course)
            .then(() => this.redirect())
            .catch(error => {
                toastr.error(error);
                this.setState({loading: false});
            });
    }
    render() {
        return (
            <div>
                <CourseForm
                    allAuthors={this.props.authors}
                    course={this.state.course}
                    onSave={this.saveCourse}
                    onChange={this.updateCourseState}
                    errors={this.state.errors}
                    loading={this.state.loading} />
            </div>
        );
    }
}

ManageCoursePage.propTypes = {
    //myprops: PropTypes.object.isRequired
    course: PropTypes.object.isRequired,
    authors: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};

//Pull in the react-router context so that the router is available on
//this.context.router
ManageCoursePage.contextTypes = {
  router: PropTypes.object
};

function getCourseById(courses, id) {
    const course = courses.filter(course => course.id == id);
    if(course.length) return course[0];
    return null;
}

function mapStateToProps(state, ownProps) {
    const courseId = ownProps.params.id; //from the path `course:id`

    let course = {id: "", watchHref: "", title: "", authorId: "", length: "", category: ""};

    if(courseId && state.courses.length > 0) {
        course = getCourseById(state.courses, courseId);
    }

    //we do data transformation in mapStateToProps whenever data in the
    //redux store is not the shape we need on our page
    const authorsFormattedForDropDown = state.authors.map(author => {
        return {
            value: author.id,
            text: author.firstName + ' ' + author.lastName
        };
    });

    return {
        course: course,
        authors: authorsFormattedForDropDown
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(courseActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);