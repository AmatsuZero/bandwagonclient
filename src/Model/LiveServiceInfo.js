// @flow
import ServiceInfo from './ServiceInfo';

class OVZInfo {
  /**
   * array containing OpenVZ beancounters, system load average,
   * number of processes, open files, sockets, memory usage etc
   */
  status: Array<string>;

  /**
   * array containing OpenVZ disk size, inodes and usage info
   */
  quoto: Array<number>;

  /**
   * is CPU throttled.
   * Throttling resets automatically every 2 hours.
   */
  isThrottled: boolean;

  /**
   * SSH port of the VPS
   */
  sshPort: number;

  constructor(node: Object) {
    this.status = node.vz_status;
    this.quoto = node.vz_quota;
    this.isThrottled = node.is_cpu_throttled === 1;
    this.sshPort = node.ssh_port;
  }
}

class KVMInfo {
  isRunning: boolean;

  /**
   * MAC address of primary network interface
   */
  macAddress: string;

  /**
   *  Occupied (mapped) disk space
   */
  usedDiskSpace: number;

  /**
   * Actual size of disk image in GB
   */
  diskQuoto: string;

  /**
   * is CPU throttled.
   * Throttling resets automatically every 2 hours.
   */
  isThrottled: boolean;

  /**
   *  SSH port of the VPS (returned only if VPS is running)
   */
  sshPort: ?number;

  /**
   * Result of "hostname" command executed inside VPS
   */
  liveHostName: string;

  /**
   * Raw load average string
   */
  loadAverage: string;

  /**
   * Amount of available RAM
   */
  memAvailable: number;

  /**
   * Total amount of Swap in bytes
   */
  swapTotal: number;

  /**
   * Amount of available Swap in bytes
   */
  swapAvailable: number;

  constructor(node: Object) {
    this.isRunning = node.ve_status === 'running';
    this.macAddress = node.ve_mac1;
    this.usedDiskSpace = node.ve_used_disk_space_b;
    this.diskQuoto = `${node.ve_disk_quota_gb} GB`;
    this.isThrottled = node.is_cpu_throttled === 1;
    this.sshPort = this.isRunning ? node.ssh_port : null;
    this.liveHostName = node.live_hostname;
    this.loadAverage = node.load_average;
    this.memAvailable = node.mem_available_kb * 1024;
    this.swapTotal = node.swap_total_kb * 1024;
    this.swapAvailable = node.swap_available_kb * 1024;
  }
}

export default class LiveServiceInfo {
  serviceInfo: ServiceInfo;

  vpsInfo: OVZInfo | KVMInfo;

  constructor(node: Object) {
    this.serviceInfo = new ServiceInfo(node);
    this.vpsInfo = this.serviceInfo.vmType === 'kvm' ? new KVMInfo(node) : new OVZInfo(node);
  }
}
