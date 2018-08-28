import * as React from "react";

interface IMainProps {}
interface IMainState {}

import * as PIXI from "pixi.js";

export default class Pixi extends React.Component<IMainProps, IMainState> {
  app: PIXI.Application;
  gameCanvas: HTMLDivElement;

  componentDidMount() {
    this.app = new PIXI.Application(window.innerWidth, window.innerHeight);

    this.app.view.style.width = "100%";
    this.app.view.style.height = "100%";

    this.gameCanvas.appendChild(this.app.view);

    const app = this.app;

    app.stage.interactive = true;

    var graphics = new PIXI.Graphics();

    app.stage.addChild(graphics);

    // Just click on the stage to draw random lines
    app.stage.on("pointertap", onClick);

    app.stage.x = 0;
    app.stage.y = 0;

    function onClick() {}

    app.ticker.add(() => {
      const w = app.view.parentElement.parentElement.clientWidth;
      const h = app.view.parentElement.parentElement.clientHeight;

      app.renderer.resize(w, h);

      graphics.clear();

      // 縦に何個小節を配置するか
      var hC = 3;

      for (var i = 0; i < hC; ++i) {
        var hh = h / hC;

        var y = hh * i;

        graphics.lineStyle(4, 0xff3300, 1);

        graphics.beginFill(0x66ccff);
        graphics.drawRect(0, y, 100, hh);
        graphics.endFill();
      }

      graphics.x = 0;
      graphics.y = 0;

      // app.view.width = app.view.clientWidth;
      // app.view.height = app.view.clientHeight;
    });

    this.app.start();
  }

  componentWillUnmount() {
    this.app.stop();
  }

  render() {
    let component = this;

    console.log(this.gameCanvas);

    return (
      <div
        ref={thisDiv => {
          component.gameCanvas = thisDiv;
        }}
      />
    );
  }
}
