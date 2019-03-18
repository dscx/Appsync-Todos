import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";

function Todo({ item, onCheck }) {
  return (
    <ListItem button>
      <ListItemText
        style={{ textDecoration: item.completed ? "line-through" : "none" }}
        primary={item.title}
      />
      <ListItemSecondaryAction>
        <Checkbox onChange={onCheck} checked={item.completed} />
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default Todo;
