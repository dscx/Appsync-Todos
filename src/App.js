import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import { graphqlMutation } from "aws-appsync-react";

const ListTodos = gql`
  query listTodos {
    listTodos {
      items {
        id
        title
        completed
      }
    }
  }
`;

class App extends Component {
  state = { todo: "" };
  addTodo = () => {
    if (this.state.todo === "") return;
    const todo = {
      title: this.state.todo,
      completed: false
    };
    this.props.createTodo(todo);
    this.setState({ todo: "" });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        {this.props.todos.map((item, i) => (
          <p key={i}> {item.title} </p>
        ))}
      </div>
    );
  }
}

export default App;
export default compose(
  graphql(ListTodos, {
    options: {
      fetchPolicy: "cache-and-networkd"
    },
    props: props => ({
      todos: props.data.listTodos ? props.data.listTodos.items : []
    })
  })
)(App);
