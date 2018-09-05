import * as React from "react";

import { Editor } from "./Store";

interface IMainProps {
  editor?: Editor;
}

import * as PIXI from "pixi.js";

import { observer, inject } from "mobx-react";

@inject("editor")
@observer
export default class Pixi extends React.Component<IMainProps, {}> {
  private app?: PIXI.Application;
  private container?: HTMLDivElement;

  private renderedAudioBuffer?: AudioBuffer;

  constructor(props: any) {
    super(props);
  }

  private graphics?: PIXI.Graphics;

  componentDidMount() {
    this.app = new PIXI.Application(window.innerWidth, window.innerHeight);

    this.app.view.style.width = "100%";
    this.app.view.style.height = "100%";

    this.container!.appendChild(this.app.view);

    const app = this.app;

    app.stage.interactive = true;

    const graphics = (this.graphics = new PIXI.Graphics());

    app.stage.addChild(graphics);

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
    if (!this.app) return;
    console.log("re:render pixi canvas");

    const w = this.app!.renderer.width;
    const h = this.app!.renderer.height;

    const graphics = this.graphics!;

    graphics.clear();

    // 背景
    graphics.beginFill(0x171717);
    graphics.drawRect(0, 0, w, h);

    // 縦に何個小節を配置するか
    var hC = this.props.editor!.setting!.verticalLaneCount;

    var wC = 5;

    const padding = this.props.editor!.setting!.padding;

    const bpm = 120;

    const unitTime = (60 / bpm) * 4;

    while (graphics.children[0]) graphics.removeChild(graphics.children[0]);

    (window as any).g = graphics;

    const laneWidth = this.props.editor!.setting!.laneWidth;

    let index = 0;

    const channel = this.renderedAudioBuffer
      ? this.renderedAudioBuffer.getChannelData(0)
      : null;

    for (var $x = 0; $x < wC; ++$x) {
      for (var i = hC - 1; i >= 0; --i) {
        var hh = (h - padding * 2) / hC;

        const x = padding + $x * (laneWidth + padding);
        const y = padding + hh * i;

        graphics.lineStyle(2, 0xffffff, 1);

        graphics.beginFill(0x333333);
        graphics.drawRect(x, y, laneWidth, hh);

        if (this.renderedAudioBuffer) {
          // TODO: ステレオ判定
          // if (ab.numberOfChannels > 1)

          // 小節の開始時刻、終了時刻
          var b = unitTime * index;
          var e = unitTime * (index + 1);

          (window as any).ch = channel;

          // 小節の開始、終了サンプルインデックス
          var bb = (b / this.renderedAudioBuffer.duration) * channel!.length;
          var ee = (e / this.renderedAudioBuffer.duration) * channel!.length;

          for (var ii = 0; ii < hh; ++ii) {
            //var p1 = i - 1;
            //var p2 = i;

            // 描画 Y 座標の開始、終了サンプルインデックス
            var bbb = bb + ((ee - bb) / hh) * (hh - 1 - ii);
            var eee = bb + ((ee - bb) / hh) * (hh - 1 - ii + 1);

            const renderSample = 3;

            for (var j = 0; j < renderSample; ++j) {
              var value = channel![
                Math.floor(bbb + ((eee - bbb) / renderSample) * j)
              ];

              // -1 ~ 1 を 0 ~ 1 に正規化する
              // value = value * 0.5 + 0.5; //) / 2;

              graphics
                .lineStyle(1, 0x00ff00)
                .moveTo(x + laneWidth / 2 - (value * laneWidth) / 2, y + ii)
                .lineTo(x + laneWidth / 2 + (value * laneWidth) / 2, y + ii);
            }
          }
        }

        let text = new PIXI.Text(index + "", {
          fontFamily: "Arial",
          fontSize: 20,
          fill: 0xffffff,
          align: "center",
          // textBaseline: "middle",
          dropShadow: true,
          dropShadowBlur: 8,
          dropShadowColor: "#000000",
          dropShadowDistance: 0
        });

        text.x = x - 15;
        text.y = y;

        graphics.addChild(text);

        graphics.endFill();

        ++index;
      }
    }
  }

  /**
   * 譜面情報を更新する
   */
  private updateAudioInfo() {
    const currentChart = this.props.editor!.currentChart!;

    this.renderedAudioBuffer = currentChart!.audioBuffer;

    this.renderCanvas();
  }

  render() {
    let component = this;

    console.log("再描画します: pixi", this.props.editor!.currentChart!.name);

    this.updateAudioInfo();

    return (
      <div
        ref={thisDiv => {
          component.container = thisDiv!;
        }}
      />
    );
  }
}
