// @flow
import Utils from '../Utils';

class SimpleInfo {
  cpuUsage: number;

  diskReadBytes: number;

  diskWriteBytes: number;

  networkInBytes: number;

  networkOutBytes: number;

  timestamp: Date;

  constructor(info: Object) {
    this.cpuUsage = Number(info.cpu_usage);
    this.diskReadBytes = Number(info.disk_read_bytes);
    this.diskWriteBytes = Number(info.disk_write_bytes);
    this.networkInBytes = Number(info.network_in_bytes);
    this.networkOutBytes = Number(info.network_out_bytes);
    this.timestamp = Utils.toDate(info.timestamp);
  }
}

export default class RawInfo {
  vmType: 'kvm' | 'ovz';

  data: SimpleInfo[];

  constructor(node: Object) {
    this.vmType = node.vm_type;
    this.data = node.data.map(raw => new SimpleInfo(raw));
  }
}
