import * as React from "react";
import Drawer from "@material-ui/core/Drawer";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import AppBar from "@material-ui/core/AppBar";

import classNames from "classnames";
import Toolbar from "@material-ui/core/Toolbar";

import { withStyles, WithStyles, createStyles } from "@material-ui/core";

import Pixi from "./Pixi";
import Inspector from "./Inspector";

import config from "./config";

const drawerWidth: number = config.sidebarWidth;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      /* ... */
    },

    drawerPaper: {
      position: "relative",
      width: drawerWidth
    },
    appFrame: {
      zIndex: 1,
      overflow: "hidden",
      position: "relative",
      display: "flex",
      width: "100%"
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`
    },
    "appBar-left": {
      marginLeft: drawerWidth
    },
    toolbar: theme.mixins.toolbar,

    paper: {
      /* ... */
    },
    button: {
      /* ... */
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default
      // padding: theme.spacing.unit * 3
    }
  });

import { Editor } from "./Store";

interface Props extends WithStyles<typeof styles> {
  editor?: Editor;
}

import Menu from "./Menu";
import { Provider, inject, observer } from "mobx-react";

import stores from "./Store";
import { observable } from "mobx";
import Slider from "@material-ui/lab/Slider";

import ChartTab from "./Tab";

class Application extends React.Component<Props, {}> {
  state = {
    hV: 0,
    vV: 0,

    tabIndex: 0
  };

  componentDidMount() {
    setInterval(() => {
      var t = document.querySelector("#test") as HTMLDivElement;

      t.style.height =
        (t.parentElement as HTMLDivElement).offsetHeight - 16 + "px";

      var t2 = document.querySelector("#test") as HTMLDivElement;
      /*
      t2.style.width =
        (t2.parentElement as HTMLDivElement).offsetWidth - 16 + "px";
        */
    }, 100);
  }

  render() {
    const { classes } = this.props;

    return (
      <Provider {...stores}>
        <div style={{ flexGrow: 1 }}>
          <div className={classes.appFrame}>
            <AppBar
              position="absolute"
              color="default"
              className={classNames(classes.appBar, classes[`appBar-left`])}
            >
              <ChartTab />
            </AppBar>

            <Drawer
              variant="permanent"
              classes={{
                paper: classes.drawerPaper
              }}
              anchor="left"
            >
              left drawer
              <Inspector target={{ a: 0, b: "b" }} />
              inspector bottom
            </Drawer>
            <main
              className={classes.content}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div className={classes.toolbar} />

              <div style={{ padding: "1rem" }}>
                <Menu />
              </div>

              <div style={{ flex: 1, display: "flex" }}>
                <Pixi />
                <div style={{ display: "flex" }}>
                  <Slider
                    id="test"
                    value={this.state.hV}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(_, value) => {
                      this.setState({ hV: value });
                    }}
                    vertical
                  />
                </div>
              </div>

              <div style={{ display: "flex" }}>
                <Slider
                  value={this.state.vV}
                  min={0}
                  max={1}
                  step={0.01}
                  id="test2"
                  onChange={(_, value) => {
                    this.setState({ vV: value });
                  }}
                />
              </div>
            </main>
          </div>
        </div>
      </Provider>
    );
  }
}

export default withStyles(styles)(Application);
