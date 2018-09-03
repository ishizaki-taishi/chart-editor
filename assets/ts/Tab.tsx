import * as React from "react";

import { observer, inject } from "mobx-react";

import { configure } from "mobx";

configure({
  enforceActions: "observed"
});

import { Editor } from "./Store";

interface Props {
  editor?: Editor;
}

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

@inject("editor")
@observer
export default class ChartTab extends React.Component<Props, {}> {
  state = {
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

    return (
      <Tabs
        value={editor ? editor.currentChartIndex : -1}
        onChange={this.handleChartChange}
        scrollable
        indicatorColor="primary"
        textColor="primary"
        scrollButtons="auto"
      >
        {editor ? (
          editor!.charts.map((chart, index) => (
            <Tab key={index} label={`Item ${index + 1}`} />
          ))
        ) : (
          <div />
        )}
      </Tabs>
    );
  }
}
