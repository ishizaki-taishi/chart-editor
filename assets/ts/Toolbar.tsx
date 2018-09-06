import * as React from "react";

import { observer, inject } from "mobx-react";

import { configure } from "mobx";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

import { Editor } from "./stores/EditorStore";
import {
  withStyles,
  WithStyles,
  createStyles,
  Divider,
  Menu,
  MenuItem
} from "@material-ui/core";

import { IconButton, Badge, Tab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/add";
import MenuIcon from "@material-ui/icons/menu";

const styles = (theme: Theme) =>
  createStyles({
    badge: {
      top: 13,
      right: -8,

      border: `2px solid ${
        theme.palette.type === "light"
          ? theme.palette.grey[200]
          : theme.palette.grey[900]
      }`
    }
  });

interface Props extends WithStyles<typeof styles> {
  editor?: Editor;
}

@inject("editor")
@observer
class Toolbar extends React.Component<Props, {}> {
  state = {
    anchorEl: null
  };

  handleClick = (event: any) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  render() {
    const editor = this.props.editor;
    const { anchorEl } = this.state;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row"
          //margin: "-12px 0"
        }}
      >
        <Badge
          badgeContent={this.props.editor!.setting!.measureDivision}
          color="primary"
          classes={{ badge: this.props.classes.badge }}
        >
          <IconButton aria-label="Delete" onClick={this.handleClick}>
            <MenuIcon />
          </IconButton>
        </Badge>

        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {[1, 2, 3, 4, 8, 16, 32, 64].map(value => (
            <MenuItem
              onClick={(e: any) => {
                this.props.editor!.setting!.setMeasureDivision(value);
                this.handleClose();
              }}
            >
              {value}
            </MenuItem>
          ))}
        </Menu>

        {Array.from({ length: 10 }).map(_ => (
          <IconButton aria-label="Delete">
            <AddIcon />
          </IconButton>
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(Toolbar);
