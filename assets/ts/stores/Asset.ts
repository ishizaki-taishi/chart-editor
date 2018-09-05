import { action, observable } from "mobx";

import * as Electrom from "electron";

var fs = (window as any).require("fs");

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

      this.checkAudioAssetDirectory(decodeURIComponent(urlParams.aap));
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
  private checkAudioAssetDirectory(dir: string) {
    fs.readdir(dir, (err: any, files: any[]) => {
      if (err) throw err;

      var fileList = files.filter(function(file) {
        return fs.statSync(dir + "/" + file).isFile() && /.*\.wav$/.test(file); //絞り込み
      });

      for (const fileName of fileList) {
        this.pushAudioAssetPath(`${dir}/${fileName}`);
      }
    });
  }

  @action
  openAudioAssetDirectory() {
    const [dir] = remote.dialog.showOpenDialog({
      properties: ["openDirectory"]
    });
    this.checkAudioAssetDirectory(dir);
  }
}
