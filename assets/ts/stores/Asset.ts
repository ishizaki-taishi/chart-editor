import { action, observable } from "mobx";
import { Editor } from "./EditorStore";

import * as Electrom from "electron";

const __require = (window as any).require;

var fs = (window as any).require("fs");

const util = __require("util");

//console.log("fs", fs);
const electron = (window as any).require("electron");
const remote = electron.remote as Electrom.Remote;
const BrowserWindow = remote.BrowserWindow;

// import * as config from "config";

function parseJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return {};
  }
}

interface IStore {}

import MusicGameSystem from "./MusicGameSystem";

export default class Asset implements IStore {
  @observable
  audioAssetPaths: string[] = [];

  @observable
  musicGameSystems: MusicGameSystem[] = [];

  @action
  addMusicGameSystem = (value: MusicGameSystem) =>
    this.musicGameSystems.push(value);

  private async debugInitialize() {
    const urlParams = location.search
      .substr(1)
      .split("&")
      .map(v => v.split("="))
      .reduce((a: any, b: any) => {
        a[b[0]] = b[1];
        return a;
      }, {});

    console.warn(urlParams.aap);
    console.warn(urlParams.mgsp);

    await this.checkAudioAssetDirectory(decodeURIComponent(urlParams.aap));

    // 譜面を読み込む
    const path = this.audioAssetPaths[24];
    const nn = await this.loadAudioAsset(path);
    Editor.instance!.currentChart!.setAudio(nn, path);

    // MusicGameSystem を読み込む
    {
      const files: any[] = await util.promisify(fs.readdir)(urlParams.mgsp);
      console.log(files);

      var fileList = files.filter(file => file.endsWith(".json"));
      console.log(fileList);
      for (const file of fileList) {
        const buffer: Buffer = await util.promisify(fs.readFile)(
          urlParams.mgsp + "/" + file
        );

        const json = parseJSON(buffer.toString());

        this.addMusicGameSystem(json as MusicGameSystem);
      }
      Editor.instance!.currentChart!.setMusicGameSystem(
        this.musicGameSystems.find(mgs => mgs.name === "ongeki")!
      );
    }
  }

  constructor(debugMode: boolean) {
    if (debugMode) {
      this.debugInitialize();
    }
  }

  @action
  pushAudioAssetPath(path: string) {
    this.audioAssetPaths.push(path);
  }

  async loadAudioAsset(path: string) {
    console.log("loadAudioAsset");

    const buffer: Buffer = await util.promisify(fs.readFile)(path);

    return buffer;
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
