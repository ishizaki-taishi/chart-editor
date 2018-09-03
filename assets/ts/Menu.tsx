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
  enforceActions: "observed"
});

import { Editor } from "./Store";

import { withStyles, WithStyles, createStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

import AddIcon from "@material-ui/icons/Add";

const styles = (theme: Theme) =>
  createStyles({
    fab: {
      position: "absolute",
      top: theme.spacing.unit * 8,
      right: theme.spacing.unit * 2,
      zIndex: 1
    }
  });

interface Props extends WithStyles<typeof styles> {
  editor?: Editor;
}

@inject("editor")
@observer
class Menu extends React.Component<Props, {}> {
  state = {};

  handleChange = (event: any) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleAudioChange = (event: any) => {
    // this.handleChange(event);
    //this.props.editor!.currentChart!.setAudio()
  };

  render() {
    if (!this.props.editor || !this.props.editor!.currentChart) {
      return <div />;
    }

    const editor = this.props.editor!;

    const classes = this.props.classes;

    const renderMenu = () => {
      if (!this.props.editor) return <div />;

      return this.props.editor!.asset.audioAssetPaths.map((c, i) => (
        <MenuItem value={i} key={i}>
          {c.split('/').pop()}
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

        {"GUID2: " + editor
          ? editor.currentChart
            ? editor.currentChart!.guid
            : ""
          : ""}

        <FormControl style={{ width: "10rem" }}>
          <InputLabel htmlFor="audio">Audio</InputLabel>
          <Select
            value={0}
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

        <Button
          color="primary"
          variant="fab"
          aria-label="Add"
          className={classes.fab}
          onClick={() => {
            // 新規譜面
            this.props.editor!.newChart();
            // 新規譜面をアクティブにする
            this.props.editor!.setCurrentChart(
              this.props.editor!.charts.length - 1
            );
          }}
        >
          <AddIcon />
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(Menu);
