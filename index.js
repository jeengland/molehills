import './styles.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';
import { EventEmitter } from 'events';

// ---------------------------------------------------------------------
// redux store 
// ---------------------------------------------------------------------

const ADD = 'ADD';
const COMP = 'COMP';
const DEL = 'DEL';
const UNCOMP = 'UNCOMP';

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

// function for uncompleting a task

const uncTask = (task) => {
    return {
        type: UNCOMP,
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
        case UNCOMP: 
            let uIdx = state.compTasks.indexOf(action.task);
            let uBeg = state.compTasks.slice(0, uIdx);
            let uEnd = state.compTasks.slice(uIdx + 1, );
            let newStateUnc = { tasks: state.tasks.concat(action.task), compTasks: [...uBeg, ...uEnd] };
            return newStateUnc;
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
        this.uncompleteHandler = this.uncompleteHandler.bind(this);
        this.enterHandler = this.enterHandler.bind(this);
    }
    changeHandler(event) {
        this.setState ({
            input: event.target.value
        })
    }
    submitHandler() {
        if (this.state.input != '') {
            this.props.submitNewTask(this.state.input);
            this.setState ({
            input: ''
            })
        }
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
    uncompleteHandler(event) {
        this.props.uncompleteTask(event.target.innerHTML)
    }
    enterHandler(event) {
        if (event.key == 'Enter'){
            document.getElementById('submitGoal').click()
        }
    }
    render() {
        const delTog = this.state.delTog;
        // set up toggle for the trash icon
        let trash
        if (delTog) {
            trash = <i id = 'trash' className = "fas fa-trash-alt"></i>
        }
        else {
            trash = null;
        }
        return (
            <div id='mainapp'>
                <div id='tasklist'>
                    <input 
                        id = 'newGoal'
                        value = {this.state.input}
                        onChange = {this.changeHandler}
                        onKeyPress = {this.enterHandler} />
                    <div id = "buttonbar">
                        <button 
                            id = 'submitGoal'
                            onClick = {this.submitHandler} >Submit</button>
                        <button 
                            id = 'toggleDelete'
                            onClick = {this.deleteToggleHandler} >Delete Task</button>
                        { trash }
                    </div>
                    {/* list for tasks that still need to be completed */}
                    <ul id = 'currentTasks'>
                        {this.props.tasks.map( (task, idx) => {
                            // maps tasks from state, with logic for the toggling of the delete function
                            if (this.state.delTog) {
                                return (
                                    <div>
                                        <li className = 'listItem delItem' onClick = {this.deleteHandler} key = {idx}>{task}</li>
                                    </div>
                                )
                            }
                            else {
                                return (
                                    <div>
                                        <li className = 'listItem' onClick = {this.completeHandler} key = {idx}>{task}</li>
                                    </div>
                                )
                            }
                        })
                    }
                    </ul>
                    {/* list for completed tasks */}
                    <ul id = 'completedTasks'>
                        {this.props.compTasks.map( (task, idx) => {
                            return (
                                <li className = 'completeItem' onClick = {this.uncompleteHandler} key={idx}>{task}</li>
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
        },
        uncompleteTask: (uTask) => {
            dispatch(uncTask(uTask))
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