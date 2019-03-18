import React, { Component } from "react";
import "./App.css";

import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import { graphqlMutation } from "aws-appsync-react";
import { buildSubscription } from "aws-appsync";
import List from "@material-ui/core/List";

import Todo from "./Todo";

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

const CreateTodo = gql`
  mutation($title: String!, $completed: Boolean) {
    createTodo(input: { title: $title, completed: $completed }) {
      id
      title
      completed
    }
  }
`;

const UpdateTodo = gql`
  mutation($id: ID!, $title: String!, $completed: Boolean) {
    updateTodo(input: { id: $id, title: $title, completed: $completed }) {
      id
      title
      completed
    }
  }
`;

const SubscribeTodos = gql`
  subscription {
    onCreateTodo {
      id
      title
      completed
    }
    onUpdateTodo {
      id
      title
      completed
    }
  }
`;

class App extends Component {
  state = { todo: "" };

  componentDidMount() {
    this.props.subscribeToMore(buildSubscription(SubscribeTodos, ListTodos));
  }

  addTodo = () => {
    if (this.state.todo === "") return;
    const todo = {
      title: this.state.todo,
      completed: false
    };
    this.props.createTodo(todo);
    this.setState({ todo: "" });
  };

  toggleTodo = todo => {
    this.props.updateTodo({ ...todo, completed: !todo.completed });
  };

  render() {
    return (
      <div className="App">
        <List dense>
          {this.props.todos.map(item => (
            <Todo
              key={item.id}
              item={item}
              onCheck={() => {
                this.toggleTodo(item);
              }}
            />
          ))}
        </List>
        <input
          value={this.state.todo}
          onChange={e => this.setState({ todo: e.target.value })}
          placeholder="Todo Name"
        />
        <button
          style={{ marginTop: 20, marginLeft: 20 }}
          onClick={this.addTodo}
        >
          Add
        </button>
      </div>
    );
  }
}

export default compose(
  graphqlMutation(CreateTodo, ListTodos, "Todo"),
  graphqlMutation(UpdateTodo, ListTodos, "UpdateTodo"),
  graphql(ListTodos, {
    options: {
      fetchPolicy: "cache-and-networkd"
    },
    props: props => ({
      todos: props.data.listTodos ? props.data.listTodos.items : [],
      subscribeToMore: props.data.subscribeToMore
    })
  })
)(App);
