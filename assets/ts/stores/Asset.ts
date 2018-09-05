import { action, observable } from "mobx";
import { Editor } from "./EditorStore";

import * as Electrom from "electron";

const __require = (window as any).require;

var fs = (window as any).require("fs");

const util = __require("util");

console.warn("utk", util);

console.log("fs", fs);
const electron = (window as any).require("electron");
const remote = electron.remote as Electrom.Remote;
const BrowserWindow = remote.BrowserWindow;

// import * as config from "config";

interface IStore {}

export default class Asset implements IStore {
  @observable
  audioAssetPaths: string[] = [];

  constructor(debugMode: boolean) {
    if (debugMode) {
      const urlParams = location.search
        .substr(1)
        .split("&")
        .map(v => v.split("="))
        .reduce((a: any, b: any) => {
          a[b[0]] = b[1];
          return a;
        }, {});

      console.warn(urlParams.aap);

      (async () => {
        await this.checkAudioAssetDirectory(decodeURIComponent(urlParams.aap));

        // 譜面を読み込む
        const path = this.audioAssetPaths[24];
        const nn = await this.loadAudioAsset(path);
        Editor.instance!.currentChart!.setAudio(nn, path);
      })();
    }
  }

  @action
  pushAudioAssetPath(path: string) {
    this.audioAssetPaths.push(path);
  }

  async loadAudioAsset(path: string): Promise<Buffer> {
    let r: any;

    console.log("読み込みます");

    const p = new Promise<Buffer>(_r => {
      r = _r;
    });
    console.log("loadAudioAsset");

    fs.readFile(path, function(err: any, content: Buffer) {
      if (err) {
        console.error(err);
      }
      console.log("cont", content);

      r(content);
    });

    const n: Buffer = await p;
    return n;
  }

  @action
  private async checkAudioAssetDirectory(dir: string) {
    const files: any[] = await util.promisify(fs.readdir)(dir);

    var fileList = files.filter(function(file) {
      return fs.statSync(dir + "/" + file).isFile() && /.*\.wav$/.test(file); //絞り込み
    });

    for (const fileName of fileList) {
      this.pushAudioAssetPath(`${dir}/${fileName}`);
    }
  }

  @action
  openAudioAssetDirectory() {
    const [dir] = remote.dialog.showOpenDialog({
      properties: ["openDirectory"]
    });
    this.checkAudioAssetDirectory(dir);
  }
}
