// @flow

export default class Utils {
  static toDate(date: number | string): Date {
    return new Date(parseInt(date, 10) * 1000);
  }

  static formatFileSize(fileSize: number, si: number = 1024): string {
    let bytes = fileSize;
    const thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
      return `${bytes} B`;
    }
    const units = si
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    do {
      bytes /= thresh;
      u += 1;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return `${bytes.toFixed(1)} ${units[u]}`;
  }
}
