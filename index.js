import './styles.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';

// ---------------------------------------------------------------------
// redux store 
// ---------------------------------------------------------------------

const ADD = 'ADD';
const COMP = 'COMP';

// function for adding a task to the state

const addTask = (task) => {
    return {
        type: ADD,
        task: task
    }
};

//function for completing a task

const compTask = (task) => {
    return {
        type: COMP,
        task: task
    }
}

// reducer for the tasklist

const taskReducer = (state = [[],[]], action) => {
    switch(action.type) {
        case ADD: 
            return [state[0].concat(action.task), [...state[1]]];
        case COMP:
            let idx = state[0].indexOf(action.task);
            let beg = state.slice(0, idx);
            let end = state.slice(idx + 1);
            let newState = [[...beg, ...end], [...state[1], action.task]];
            return newState;
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
        this.completeHandler = this.completeHandler.bind(this);
    }
    changeHandler(event) {
        this.setState ({
            input: event.target.value
        })
    }
    submitHandler() {
        this.props.submitNewTask(this.state.input);
        this.setState ({
          input: ''
        })
    }
    completeHandler(event) {
        this.props.completeTask(event.target)
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
                    <ul id = 'currentTasks'>
                        {this.props.tasks.map( (task, idx) => {
                            return (
                                <li onClick = {this.completeHandler} key={idx}>{task}</li>
                            )
                        })
                    }
                    </ul>
                    <ul id = 'completedTasks'>
                        {this.props.compTasks.map( (task, idx) => {
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
        tasks: state[0],
        compTasks: state[1]
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        submitNewTask: (nTask) => {
            dispatch(addTask(nTask))
        },
        completeTask: (cTask) => {
            dispatch(compTask(cTask))
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