import * as React from "react";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import PlayArrow from "@material-ui/icons/PlayArrow";

import { observer, inject } from "mobx-react";

import { configure } from "mobx";

configure({
  enforceActions: "always"
});

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

    const renderMenu = () => {
      if (!this.props.editor) return <div />;
      if (!this.props.editor!.audios) return <div />;

      return this.props.editor!.audios!.map((c, i) => (
        <MenuItem value={c.key} key={i}>
          {c.key}
        </MenuItem>
      ));
    };

    return (
      <div>
        <Button
          variant="fab"
          color="primary"
          aria-label="Add"
          //className={classes.button}
        >
          <PlayArrow />
        </Button>

        <FormControl style={{ width: "10rem" }}>
          <InputLabel htmlFor="audio">Audio</InputLabel>
          <Select
            value={this.state.currentAudio}
            onChange={this.handleAudioChange}
            inputProps={{ name: "currentAudio", id: "audio" }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>

            {renderMenu()}
          </Select>
        </FormControl>

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
            editor.setting!.setLaneWidth(e.target.value | 0);
          }}
          type="number"
          InputLabelProps={{
            shrink: true
          }}
          margin="normal"
        />

        <TextField
          id="number"
          label="Vertical Lane Count"
          value={editor.setting!.verticalLaneCount}
          onChange={(e: any) => {
            editor.setting!.setVerticalLaneCount(e.target.value | 0);
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
