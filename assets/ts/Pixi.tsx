import * as React from "react";

import { Editor } from "./Store";

interface IMainProps {
  editor?: Editor;
}
interface IMainState {}

import * as PIXI from "pixi.js";

import { observer, inject } from "mobx-react";

/*
(async () => {
  const n = await fetch(a);
  console.log(n);
})();
console.log(a);
*/

@inject("editor")
@observer
export default class Pixi extends React.Component<IMainProps, IMainState> {
  private app?: PIXI.Application;
  private gameCanvas?: HTMLDivElement;

  private renderedAudioBuffer?: AudioBuffer;

  constructor(props: any) {
    super(props);
  }

  private graphics?: PIXI.Graphics;

  componentDidMount() {
    this.app = new PIXI.Application(window.innerWidth, window.innerHeight);

    this.app.view.style.width = "100%";
    this.app.view.style.height = "100%";

    this.gameCanvas!.appendChild(this.app.view);

    const app = this.app;

    app.stage.interactive = true;

    const graphics = (this.graphics = new PIXI.Graphics());

    app.stage.addChild(graphics);

    // app.stage.on("pointertap", onClick);

    app.stage.x = 0;
    app.stage.y = 0;

    function onClick() {}

    app.ticker.add(() => {
      const w = app!.view.parentElement!.parentElement!.clientWidth;
      const h = app!.view.parentElement!.parentElement!.clientHeight;

      // リサイズ
      if (app.renderer.width !== w || app.renderer.height !== h) {
        app.renderer.resize(w, h);
        this.renderCanvas();
      }

      graphics.x = 0;
      graphics.y = 0;

      // app.view.width = app.view.clientWidth;
      // app.view.height = app.view.clientHeight;
    });

    this.app.start();
  }

  componentWillUnmount() {
    this.app!.stop();
  }

  /**
   * canvas を再描画する
   */
  private renderCanvas() {
    console.log("re:render pixi canvas");

    if (!this.app) return;

    const w = this.app!.renderer.width;
    const h = this.app!.renderer.height;

    const graphics = this.graphics!;

    graphics.clear();

    // 縦に何個小節を配置するか
    var hC = 3;

    var wC = 10;

    const padding = 20;

    const bpm = 120;

    const unitTime = (60 / bpm) * 4;

    graphics.children.forEach(g => g.destroy());

    const laneWidth = this.props.editor!.setting!.laneWidth;

    let index = 0;

    for (var $x = 0; $x < wC; ++$x) {
      for (var i = hC - 1; i >= 0; --i) {
        var hh = (h - padding * 2) / hC;

        const x = padding + $x * (laneWidth + padding);
        const y = padding + hh * i;

        graphics.lineStyle(2, 0xffffff, 1);

        graphics.beginFill(0x333333);
        graphics.drawRect(x, y, laneWidth, hh);

        console.log(index);

        let text = new PIXI.Text(index++ + "", {
          fontFamily: "Arial",
          fontSize: 20,
          fill: 0xffffff,
          align: "center",
          dropShadow: true,
          dropShadowBlur: 8,
          dropShadowColor: "#000000",
          dropShadowDistance: 0
        });

        text.x = x - 15;
        text.y = y;

        graphics.addChild(text);

        graphics.endFill();
      }
    }

    if (this.renderedAudioBuffer) {
      // TODO: ステレオ判定
      // if (ab.numberOfChannels > 1)

      var channel = this.renderedAudioBuffer.getChannelData(0);

      for (var i = 0; i < h; ++i) {
        var p1 = i - 1;
        var p2 = i;

        var p11 = Math.floor((channel.length / h) * p1);
        var p22 = Math.floor((channel.length / h) * p2);

        // var range = channel.slice(p11, p22);

        for (var j = 0; j < 10; ++j) {
          var value = channel[Math.floor(p11 + ((p22 - p11) / 10) * j)];

          graphics
            .lineStyle(1, 0x00ff00)
            .moveTo(w / 2 - value * laneWidth, i)
            .lineTo(w / 2 + value * laneWidth, i);
        }

        //          console.log(range);

        //          console.log(value);
        //console.log(p22 - p11);
      }
    }
  }

  /**
   * 譜面情報を更新する
   */
  private updateAudioInfo() {
    const { editor } = this.props;

    if (!editor!.currentChart) return;
    if (!editor!.currentChart!.audioBuffer) return;
    this.renderCanvas();

    const ab = editor!.currentChart!.audioBuffer!;

    // 既に描画済みの AudioBuffer
    if (this.renderedAudioBuffer == ab) return;

    this.renderedAudioBuffer = ab;
  }

  render() {
    let component = this;

    console.log(this.gameCanvas);

    this.updateAudioInfo();

    return (
      <div
        ref={thisDiv => {
          component.gameCanvas = thisDiv!;
        }}
      />
    );
  }
}
