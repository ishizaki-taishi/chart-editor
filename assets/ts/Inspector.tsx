import * as React from "react";

interface IMainProps {
  target: any;
}
interface IMainState {}

import * as PIXI from "pixi.js";

import { GUI } from "dat-gui";

import config from "./config";

class Timeline {
  render() {}
}

export default class Inspector extends React.Component<IMainProps, IMainState> {
  gameCanvas: HTMLDivElement;

  componentDidMount() {
    var size = config.sidebarWidth;

    var scale = 1.2;

    console.log(this.props.target);

    const gui: GUI = new GUI({ width: size * (1 / scale), autoPlace: false });

    gui.domElement.style.transform = `scale(${scale})`;
    gui.domElement.style.marginLeft = `${(size - size * (1 / scale)) / 2}px`;

    let obj = {
      message: "Hello World",
      displayOutline: false,
      maxSize: 6.0,
      speed: 5,
      aaa: "[1, 2, 3]"
    };

    gui.domElement.querySelector(".close-button").remove();

    console.log(Object.keys(obj));

    for (const key of Object.keys(obj)) {
      gui.add(obj, key);
    }

    console.log(gui);
    (window as any).GUI = GUI;

    setInterval(() => {
      // console.log(obj);
    }, 1000);

    this.gameCanvas.appendChild(gui.domElement);
  }

  componentWillUnmount() {}

  render() {
    let component = this;
    return (
      <div
        ref={thisDiv => {
          component.gameCanvas = thisDiv;
        }}
      />
    );
  }
}
