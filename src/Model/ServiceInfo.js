// @flow
import Utils from '../Utils';

export default class ServiceInfo {
  /**
   * Primary e-mail address of the account
   */
  emil: string;

  /**
   *  Hostname of the VPS
   */
  hostName: string;

  /**
   * IPv4 and IPv6 addresses assigned to VPS (Array)
   */
  ipAddresses: Array<string>;

  /**
   * Operating system
   */
  os: string;

  /**
   * Name of plan
   */
  plan: string;

  /**
   * Disk quota (bytes)
   */
  planDisk: number;

  /**
   * RAM (bytes)
   */
  planRAM: number;

  /**
   * SWAP (bytes)
   */
  planSWAP: number;

  /**
   * Date and time of transfer counter reset
   * (UNIX timestamp)
   */
  dataNextResetDate: Date;

  /**
   * Allowed monthly data transfer (bytes).
   * Needs to be multiplied by monthly_data_multiplier - see below.
   */
  planMonthlyData: number;

  /**
   *  Data transfer used in the current billing month.
   *  Needs to be multiplied by monthly_data_multiplier
   *  - see below.
   */
  dataCounter: number;

  /**
   * Some locations offer more expensive bandwidth;
   * this variable contains the bandwidth accounting coefficient.
   */
  monthlyDataMultiplier: number;

  /**
   * Hypervizor type (ovz or kvm)
   */
  vmType: 'ovz' | 'kvm';

  /**
   * IP address of the physical node
   */
  nodeIP: string;

  /**
   * Internal nickname of the physical node
   */
  nodeAlias: string;

  /**
   * Physical location (country, state)
   */
  nodeLocation: string;

  /**
   * Whether IPv6 is supported at the current location
   */
  locationIpv6Ready: boolean;

  /**
   * Whether or not rDNS records can be set via API
   */
  rdnsApiAvailable: boolean;

  /**
   *  Whether VPS is suspended
   */
  suspended: boolean;

  /**
   * Whether or not rDNS records can be set via API
   */
  rdnsApiAvailable: boolean;

  /**
   * Maximum number of IPv6 addresses allowed by plan
   */
  planMaxIpv6s: number;

  /**
   * rDNS records (Array of two-dimensional arrays: ip=>value)
   */
  ptr: {number: ?string};

  constructor(body: Object) {
    this.emil = body.email;
    this.vmType = body.vm_type;
    this.hostName = body.hostname;
    this.nodeIP = body.node_ip;
    this.nodeAlias = body.node_alias;
    this.nodeLocation = body.node_location;
    this.locationIpv6Ready = body.location_ipv6_ready;
    this.plan = body.plan;
    this.planDisk = body.plan_disk;
    this.planRAM = body.plan_ram;
    this.planSWAP = body.plan_swap;
    this.os = body.os;
    this.planMonthlyData = body.plan_monthly_data;
    this.dataCounter = body.data_counter;
    this.monthlyDataMultiplier = body.monthly_data_multiplier;
    this.dataNextResetDate = Utils.toDate(body.data_next_reset);
    this.ipAddresses = body.ip_addresses;
    this.planMaxIpv6s = body.plan_max_ipv6s;
    this.rdnsApiAvailable = body.rdns_api_available;
    this.ptr = body.ptr;
    this.suspended = body.suspended;
  }

  get tototalSize(): string {
    const size = this.planMonthlyData * this.monthlyDataMultiplier;
    return Utils.formatFileSize(size);
  }

  get remainedSize(): string {
    const size = (this.planMonthlyData - this.dataCounter) * this.monthlyDataMultiplier;
    return Utils.formatFileSize(size);
  }
}
