// import './styles.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';

// ---------------------------------------------------------------------
// redux store 
// ---------------------------------------------------------------------

const ADD = 'ADD'

// function for adding a task to the state

const addTask = (task) => {
    return {
        type: ADD,
        task
    }
};

// reducer for the tasklist

const taskReducer = (state = [], action) => {
    switch(action.type) {
        case ADD: 
            return state.concat(action.task);
        default: 
            return state;
    }
}

// create Redux store

const store = createStore(
    taskReducer
)

// ------------------------------------------------------------------
// main react component
// ------------------------------------------------------------------

class Molehills extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }
    changeHandler(event) {
        this.setState ({
            input: event.target.value
        })
    }
    submitHandler() {
        this.props.submitNewTask(this.state.input);
        this.setState ({
          input: '',
        })
      }
    render() {
        return (
            <div id='mainapp'>
                <div id='tasklist'>
                    <input 
                        id = 'newGoal'
                        value = {this.state.input}
                        onChange = {this.changeHandler} />
                    <button 
                        id = 'submitGoal'
                        onClick = {this.submitHandler} >Submit</button>
                    <ul>
                        {this.props.tasks.map( (task, idx) => {
                            return (
                                <li key={idx}>{task}</li>
                            )
                        })
                    }
                    </ul>
                </div>
            </div>
        )
    }
}

// ------------------------------------------------------------------
// react-redux connectors and wrapper
// ------------------------------------------------------------------

const mapStateToProps = (state) => {
    return {
        tasks: state
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        submitNewTask: (newTask) => {
            dispatch(addTask(newTask))
        }
    }
};

const Container = connect (
    mapStateToProps,
    mapDispatchToProps
)(Molehills)

// make a wrapper to incorporate redux

class Wrapper extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Container />
            </Provider>
        )
    }
};

const rootDiv = document.getElementById('root');

ReactDOM.render(<Wrapper />, rootDiv);