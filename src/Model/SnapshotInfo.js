// @flow

export default class SnapshotInfo {
  description: string;

  downloadLink: URL;

  fileName: string;

  md5: string;

  os: string;

  purgesIn: number;

  size: number;

  sticky: boolean;

  uncompressed: number;

  constructor(node: Object) {
    this.description = node.description;
    this.fileName = node.fileName;
    this.os = node.os;
    this.md5 = node.md5;
    this.purgesIn = node.purgesIn;
    this.size = Number(node.size);
    this.sticky = node.sticky;
    this.uncompressed = node.uncompressed;
    this.downloadLink = new URL(node.downloadLink);
  }
}
