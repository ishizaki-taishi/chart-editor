import * as React from "react";
import { observer, inject } from "mobx-react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import {
  Select,
  TextField,
  FormControl,
  MenuItem,
  InputLabel,
  WithStyles,
  withStyles,
  createStyles,
  Button
} from "@material-ui/core";
import { Editor } from "./stores/EditorStore";

const styles = (theme: Theme) =>
  createStyles({
    playerButton: {}
  });

interface Props extends WithStyles<typeof styles> {
  editor?: Editor;
}

/**
 * 譜面設定コンポーネント
 */
@inject("editor")
@observer
class ChartSetting extends React.Component<Props, {}> {
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

  handleAudioChange = async (event: any) => {
    // 音源リセット
    if (event.target.value === -1) {
      this.props.editor!.currentChart!.resetAudio();
      return;
    }

    const path = this.props.editor!.asset.audioAssetPaths[event.target.value];

    // this.props.editor!.currentChart!.setAudio();

    const nn = await this.props.editor!.asset.loadAudioAsset(path);

    // console.warn(nn);

    this.props.editor!.currentChart!.setAudio(nn, path);
  };

  render() {
    const editor = this.props.editor;

    // 譜面が存在しない
    if (!editor || !editor.currentChart) return <div />;

    const { classes } = this.props;

    return (
      <div style={{ width: "100%" }}>
        <TextField
          id="name"
          label="タイトル"
          value={editor.currentChart.name}
          onChange={(e: any) => editor.currentChart!.setName(e.target.value)}
          margin="normal"
        />
        <FormControl>
          <InputLabel htmlFor="audio">音源</InputLabel>
          {(() => {
            if (!this.props.editor) return <div />;
            if (!this.props.editor!.currentChart) return <div />;

            // 選択中の楽曲のインデックス
            const selectIndex = editor.asset.audioAssetPaths.findIndex(
              path => path === editor.currentChart!.audioSource
            );

            return (
              <Select
                value={selectIndex}
                onChange={this.handleAudioChange}
                inputProps={{ name: "currentAudio", id: "audio" }}
              >
                <MenuItem value={-1}>
                  <em>None</em>
                </MenuItem>
                {this.props.editor!.asset.audioAssetPaths.map((c, i) => (
                  <MenuItem value={i} key={i}>
                    {c.split("/").pop()}
                  </MenuItem>
                ))}
              </Select>
            );
          })()}
        </FormControl>

        <FormControl>
          <InputLabel htmlFor="audio">システム</InputLabel>
          {(() => {
            if (!this.props.editor) return <div />;
            if (!this.props.editor!.currentChart) return <div />;

            // 選択中のシステムのインデックス
            const selectIndex = editor.asset.musicGameSystems.findIndex(
              path => path === editor.currentChart!.musicGameSystem
            );

            return (
              <Select
                value={selectIndex}
                // onChange={this.handleAudioChange}
                // inputProps={{ name: "currentAudio", id: "audio" }}
              >
                <MenuItem value={-1}>
                  <em>None</em>
                </MenuItem>
                {this.props.editor!.asset.musicGameSystems.map((c, i) => (
                  <MenuItem value={i} key={i}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            );
          })()}
        </FormControl>

        <div
          style={{
            maxHeight: 200,
            whiteSpace: "pre",
            overflow: "scroll",
            background: "#eee"
          }}
        >
          {editor.currentChart!.toJSON()}
        </div>

        <Button
          onClick={() => {
            localStorage.setItem("chart", editor.currentChart!.toJSON());
          }}
        >
          保存
        </Button>
        <Button
          onClick={() => {
            editor.currentChart!.timeline.optimiseLane();
          }}
        >
          最適化
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(ChartSetting);
