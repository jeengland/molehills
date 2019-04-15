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
const DEL = 'DEL'

// function for adding a task to the state

const addTask = (task) => {
    return {
        type: ADD,
        task: task
    }
};

// function for completing a task

const compTask = (task) => {
    return {
        type: COMP,
        task: task
    }
}

// function for deleting a task

const delTask = (task) => {
    return {
        type: DEL,
        task: task
    }
}

// reducer for the tasklist

const taskReducer = (state = { tasks: [] , compTasks: [] }, action) => {
    switch(action.type) {
        case ADD: 
            return { tasks: state.tasks.concat(action.task), compTasks: state.compTasks }
        case COMP:
            let cIdx = state.tasks.indexOf(action.task);
            let cBeg = state.tasks.slice(0, cIdx);
            let cEnd = state.tasks.slice(cIdx + 1, );
            let newStateComp = { tasks: [...cBeg, ...cEnd], compTasks: state.compTasks.concat(action.task) };
            return newStateComp;
        case DEL:
            let dIdx = state.tasks.indexOf(action.task);
            let dBeg = state.tasks.slice(0, dIdx);
            let dEnd = state.tasks.slice(dIdx + 1, );
            let newStateDel = { tasks: [...dBeg, ...dEnd], compTasks: state.compTasks };
            return newStateDel; 
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
            delTog: false
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.completeHandler = this.completeHandler.bind(this);
        this.deleteToggleHandler = this.deleteToggleHandler.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
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
        this.props.completeTask(event.target.innerHTML)
    }
    deleteToggleHandler() {
        if (this.state.delTog) {
            this.setState ({
                delTog: false
            })
        }
        else {
            this.setState ({
                delTog: true
            })
        } 
    }
    deleteHandler(event) {
        this.props.deleteTask(event.target.innerHTML)
    }
    render() {
        const delTog = this.state.delTog;
        let trash
        if (delTog) {
            trash = <i className = "fas fa-trash-alt"></i>
        }
        else
            trash = null;
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
                    <button 
                        id = 'toggleDelete'
                        onClick = {this.deleteToggleHandler} >Delete Task</button>
                    { trash }
                    <ul id = 'currentTasks'>
                        {this.props.tasks.map( (task, idx) => {
                            // maps tasks from state, with logic for the toggling of the delete button 
                            if (this.state.delTog) {
                                return (
                                    <div className = 'itemWrapper'>
                                        <li className = 'listItem delItem' onClick = {this.deleteHandler} key = {idx}>{task}</li>
                                    </div>
                                )
                            }
                            else {
                                return (
                                    <li onClick = {this.completeHandler} key = {idx}>{task}</li>
                                )
                            }
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
        tasks: state.tasks,
        compTasks: state.compTasks
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        submitNewTask: (nTask) => {
            dispatch(addTask(nTask))
        },
        completeTask: (cTask) => {
            dispatch(compTask(cTask))
        },
        deleteTask: (dTask) => {
            dispatch(delTask(dTask))
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