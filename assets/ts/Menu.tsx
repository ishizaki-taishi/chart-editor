import * as React from "react";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { LocalPlay } from "@material-ui/icons";

import { observable, action } from "mobx";
import { observer, inject } from "mobx-react";

import { configure } from "mobx";

configure({
  enforceActions: "always"
});

interface ITodo {
  title: string;
  finished: boolean;

  list: any[];
}
import { Howler, Howl } from "howler";
import HotReload from "./HotReload";

class Todo implements ITodo {
  constructor() {
    async function fetchAudio(name: string) {
      await fetch(name);
    }
  }

  @observable
  title = "www";

  @observable
  finished = false;

  @observable
  list = [1, 2, 3, 4, 5];

  // @action
  setList(list: any[]) {
    this.list = list;
  }
}

import { Provider } from "mobx-react";
import { Editor } from "./Store";

interface Props {
  editor?: Editor;
}

@inject("editor")
@observer
export default class Menu extends React.Component<Props, {}> {
  state = {
    currentAudio: ""
  };

  handleChange = (event: any) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleAudioChange = (event: any) => {
    this.handleChange(event);
    this.props.editor!.setAudio(event.target.value);
  };

  render() {
    const editor = this.props.editor!;

    return (
      <div>
        <Button
          variant="fab"
          color="primary"
          aria-label="Add"
          //className={classes.button}
        >
          <LocalPlay />
        </Button>
        <Button
          variant="fab"
          color="primary"
          aria-label="Add"
          //className={classes.button}
        >
          b
        </Button>

        {editor.currentChart ? editor.currentChart.timer : "null"}

        {/*
        <Button variant="contained" color="primary">
          Hello World
        </Button>
        */}

        <FormControl className={""} style={{ width: "10rem" }}>
          <InputLabel htmlFor="audio">Audio</InputLabel>
          <Select
            value={this.state.currentAudio}
            onChange={this.handleAudioChange}
            inputProps={{ name: "currentAudio", id: "audio" }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>

            {this.props.editor!.audios.map((c, i) => (
              <MenuItem value={c.key} key={i}>
                {c.key}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {editor.currentChart && editor.currentChart!.audio
          ? editor.currentChart!.audio!.duration()
          : "" + "sec"}

        {editor.currentChart && editor.currentChart.audioBuffer ? (
          <div>{editor.currentChart.audioBuffer.duration}</div>
        ) : (
          <div />
        )}

        <TextField
          id="number"
          label="Number"
          value={editor.setting!.laneWidth}
          onChange={(e: any) => {
            editor.setting!.setLaneWidth(e.target.value);
            // console.log(e.target.value);
            // editor.setting.setLaneWidth()
          }}
          type="number"
          InputLabelProps={{
            shrink: true
          }}
          margin="normal"
        />
      </div>
    );
  }
}
