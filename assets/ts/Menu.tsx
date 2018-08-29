import * as React from "react";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";

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
    const audios = require("../audio/*.wav");

    this.setList(Object.keys(audios));
    console.log(this.setList);

    var sound = new Howl({
      src: [audios["Sakura_1"]]
    });

    //self._webAudio = Howler.usingWebAudio && !self._html5;

    console.log(sound);

    const decodeAudioData2: Function = ((window as any).decodeAudioData2 =
      (window as any).decodeAudioData2 || Howler.ctx.decodeAudioData);

    var context: AudioContext = (sound as any)._sounds[0]._node.context;

    HotReload.override(context, "decodeAudioData", async (base, ...args) => {
      const audioBuffer = await base(...args);

      console.warn("loaded", audioBuffer);

      return audioBuffer;
    });

    if ((window as any).playingSound) {
      ((window as any).playingSound as Howl).stop();
    }

    (window as any).playingSound = sound;
    sound.play();

    console.warn(sound);

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

interface Props {
  count?: ITodo;
}

const stores = {
  count: new Todo()
};

export default class Menu extends React.Component<Props, {}> {
  render() {
    return (
      <Provider {...stores}>
        <Menu2 />
      </Provider>
    );
  }
}

@inject("count")
@observer
export class Menu2 extends React.Component<Props, {}> {
  render() {
    console.log("menu render", this.props.count);
    return (
      <div>
        form area
        <Button variant="contained" color="primary">
          Hello World
        </Button>
        <FormControl className={""}>
          <InputLabel htmlFor="age-simple">Age</InputLabel>
          <Select
            value={0}
            onChange={() => {}}
            inputProps={{
              name: "age",
              id: "age-simple"
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>

            {this.props.count.list.map((c, i) => (
              <MenuItem value={c} key={i}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
  }
}
