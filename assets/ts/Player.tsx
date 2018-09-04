import * as React from "react";
import { observer, inject } from "mobx-react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import { withStyles, WithStyles, createStyles } from "@material-ui/core";
import Slider from "@material-ui/lab/Slider";
import PlayArrow from "@material-ui/icons/PlayArrow";
import SpeakerIcon from "@material-ui/icons/VolumeUp";
import SettingsIcon from "@material-ui/icons/Settings";
import { IconButton } from "@material-ui/core";
import { Editor } from "./Store";

const styles = (theme: Theme) =>
  createStyles({
    playerButton: {},
    timeSliderTrack: {
      height: "4px",
      background: "red"
    },
    timeSliderThumb: {
      width: "14px",
      height: "14px",
      background: "red"
    },
    volumeSliderTrack: {
      height: "4px",
      background: "#fff"
    },
    volumeSliderThumb: {
      width: "14px",
      height: "14px",
      background: "#fff"
    }
  });

interface Props extends WithStyles<typeof styles> {
  editor?: Editor;
}

@inject("editor")
@observer
class Player extends React.Component<Props, {}> {
  state = {
    vV: 0,
    currentAudio: ""
  };

  handleChange = (event: any) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  private handleChartChange = (_: any, value: number) => {
    this.props.editor!.setCurrentChart(value);
  };

  render() {
    const editor = this.props.editor;

    const { classes } = this.props;

    return (
      <div>
        <div
          style={{
            display: "flex",
            background: "#000",
            // marginRight: "32px",
            marginTop: "-14px"
          }}
        >
          <Slider
            value={this.state.vV}
            min={0}
            max={1}
            classes={{
              track: classes.timeSliderTrack,
              thumb: classes.timeSliderThumb
            }}
            id="test2"
            onChange={(_, value) => {
              this.setState({ vV: value });
            }}
          />
        </div>

        <div style={{ background: "#000", marginTop: "-14px" }}>
          <IconButton
            style={{ color: "#fff" }}
            className={classes.playerButton}
            aria-label="Delete"
            onClick={() => {
              this.props.editor!.currentChart!.play();
            }}
          >
            <PlayArrow />
          </IconButton>
          <IconButton
            style={{ color: "#fff" }}
            className={classes.playerButton}
            aria-label="Delete"
          >
            <SpeakerIcon />
          </IconButton>
          <Slider
            value={this.state.vV}
            min={0}
            max={1}
            style={{
              width: "100px",
              display: "inline-block",
              marginBottom: "-12px"
            }}
            classes={{
              track: classes.volumeSliderTrack,
              thumb: classes.volumeSliderThumb
            }}
            onChange={(_, value) => {
              this.setState({ vV: value });
            }}
          />
          <span style={{ color: "#fff", fontFamily: "Roboto" }}>
            99:99 / 99:99
          </span>

          <IconButton
            style={{ color: "#fff", float: "right" }}
            className={classes.playerButton}
            aria-label="Delete"
          >
            <SettingsIcon />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Player);
