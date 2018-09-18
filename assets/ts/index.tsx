import * as React from "react";
import * as ReactDOM from "react-dom";

import Application from "./Application";

import { types, onSnapshot } from "mobx-state-tree";

const Todo = types
  .model("Todo", {
    title: types.string,
    done: false
  })
  .actions(self => ({
    toggle() {
      self.done = !self.done;
    }
  }));

const Store = types.model("Store", {
  todos: types.array(Todo)
});

// create an instance from a snapshot
const store = Store.create({
  todos: [
    {
      title: "Get coffee"
    }
  ]
});

// listen to new snapshots
onSnapshot(store, snapshot => {
  console.dir(snapshot);
});

// invoke action that modifies the tree
store.todos[0].toggle();

import { configure } from "mobx";

configure({
  enforceActions: "observed"
});

ReactDOM.render(<Application />, document.getElementById("app"));
