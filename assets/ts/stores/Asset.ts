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

  constructor() {}

  @action
  pushAudioAssetPath(path: string) {
    this.audioAssetPaths.push(path);
  }

  @action
  openAudioAssetDirectory() {
    const [dir] = remote.dialog.showOpenDialog({
      properties: ["openDirectory"]
    });
    console.log(dir);

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
}
