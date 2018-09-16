// @flow
import Frisbee from 'frisbee';
import {
  ServiceInfo,
  LiveServiceInfo,
  RawInfo,
  SnapshotInfo,
  MigrationInfo,
  SuspensionInfo,
} from './Model';

export default class BandwagonClient {
  veid: string;

  apiKey: string;

  api: Frisbee;

  constructor(veid: string, apiKey: string) {
    this.veid = veid;
    this.apiKey = apiKey;
    this.api = new Frisbee({
      baseURI: 'https://api.64clouds.com/v1',
    });
  }

  async _commonRequest(path: string, parameters: ?Object = null): Promise<Object> {
    const res = await this.api.get(path, {
      body: {
        veid: this.veid,
        api_key: this.apiKey,
        ...parameters,
      },
    });
    if (res.err) throw res.err;
    try {
      const body = JSON.parse(res.body);
      if (body.error !== 0) BandwagonClient.throwException(new Error(body.message));
      return body;
    } catch (e) {
      throw e;
    }
  }

  async status(): Promise<ServiceInfo> {
    const res = await this._commonRequest('getServiceInfo');
    return new ServiceInfo(res);
  }

  /**
   * This function returns all data provided by getServiceInfo.
   * In addition, it provides detailed status of the VPS.
   Please note that this call may take up to 15 seconds to complete.
   * @returns {Promise<LiveServiceInfo>}
   */
  async liveStatus(): Promise<LiveServiceInfo> {
    const body = await this._commonRequest('getLiveServiceInfo');
    return new LiveServiceInfo(body);
  }

  /**
   * Starts the VPS
   * @returns {Promise<Object>}
   */
  async start(): Promise<Object> {
    return this._commonRequest('start');
  }

  /**
   * Stops the VPS
   * @returns {Promise<Object>}
   */
  async stop(): Promise<Object> {
    return this._commonRequest('stop');
  }

  /**
   * Reboots the VPS
   * @returns {Promise<Object>}
   */
  async restart(): Promise<Object> {
    return this._commonRequest('restart');
  }

  /**
   * Allows to forcibly stop a VPS that is stuck and cannot be stopped by normal means.
   * Please use this feature with great care as any unsaved data will be lost.
   * @returns {Promise<Object>}
   */
  async kill(): Promise<Object> {
    return this._commonRequest('kill');
  }

  /**
   * installed: Currently installed Operating System
     templates: Array of available OS
   * @returns {Promise<Object>}
   */
  async availableOS(): Promise<{
    installed: string,
    templates: string[]
  }> {
    return this._commonRequest('getAvailableOS');
  }

  /**
   * Reinstall the Operating System.
   * @param os must be specified via "os" variable.
   * Use getAvailableOS call to get list of available systems.
   * @returns {Promise<Object>}
   */
  async reinstall(os: string): Promise<Object> {
    return this._commonRequest('reinstallOS', { os });
  }

  /**
   * Generates and sets a new root password.
   * @returns New root password
   */
  async resetRootPassword(): Promise<string> {
    const pwd = await this._commonRequest('resetRootPassword');
    return pwd.password;
  }

  /**
   * Returns a two-dimensional array with the detailed usage statistics shown
   * under Detailed Statistics in KiwiVM.
   * @returns {Promise<RawInfo>}
   */
  async rawUsage(): Promise<RawInfo> {
    const body = await this._commonRequest('getRawUsageStats');
    return new RawInfo(body);
  }

  /**
   *
   * @param newHostname
   * @returns {Promise<Object>}
   */
  async setHostname(newHostname: string): Promise<Object> {
    return this._commonRequest('setHostname', { newHostname });
  }

  /**
   * Sets new PTR (rDNS) record for IP.
   * @param ip
   * @param ptr
   * @returns {Promise<Object>}
   */
  async setPTR(ip: string, ptr: string): Promise<Object> {
    return this._commonRequest('setPTR', { ip, ptr });
  }

  /**
   * Simulate change of directory inside of the VPS.
   * @param currentDir
   * @param newDir
   * @returns {Promise<*>}
   */
  async cd(currentDir: string, newDir: string): Promise<string> {
    const ret = await this._commonRequest('basicShell/cd', { currentDir, newDir });
    return ret.pwd;
  }

  /**
   * Execute a shell command on the VPS (synchronously).
   * @param command
   * @returns {Promise<{
   *   error: Exit status code of the executed command
      message: Console output of the executed command
   * }>}
   */
  async exec(command: string): Promise<{
    error: number,
    message: string
  }> {
    return this._commonRequest('basicShell/exec', { command });
  }

  /**
   * Execute a shell script on the VPS (asynchronously).
   * @param script
   * @returns Name of the output log file.
   */
  async script(script: string): Promise<string> {
    const output = await this._commonRequest('shellScript/exec', { script });
    return output.log;
  }

  /**
   * Create snapshot
   * @param description
   * @returns E-mail address on file where notification will be sent once task is completed.
   */
  async createSnapshot(description: ?string = null): Promise<string> {
    const ret = await this._commonRequest('snapshot/create', description !== null ? { description } : null);
    return ret.notificationEmail;
  }

  /**
   * Get list of snapshots.
   * @returns {Promise<void>}
   */
  async snapshotList(): Promise<Array<SnapshotInfo>> {
    const lists = await this._commonRequest('snapshot/list');
    return lists.snapshots.map(snapshot => new SnapshotInfo(snapshot));
  }

  /**
   * Delete snapshot by fileName (can be retrieved with snapshot/list call).
   * @param snapshot
   * @returns {Promise<Object>}
   */
  async deleteSnapshot(snapshot: string): Promise<Object> {
    return this._commonRequest('snapshot/delete', { snapshot });
  }

  /**
   * Restores snapshot by fileName (can be retrieved with snapshot/list call).
   * This will overwrite all data on the VPS.
   * @param snapshot
   * @returns {Promise<Object>}
   */
  async restoreSnapshot(snapshot: string): Promise<Object> {
    return this._commonRequest('snapshot/restore', { snapshot });
  }

  /**
   * Set or remove sticky attribute ("sticky" snapshots are never purged).
   * Name of snapshot can be retrieved with snapshot/list call – look for fileName variable.
   * @param snapshot
   * @param sticky 1 to set sticky attribute,  0 to remove sticky attribute
   * @returns {Promise<void>}
   */
  async toggleSticky(snapshot: string, sticky: 0 | 1): Promise<Object> {
    return this._commonRequest('snapshot/toggleSticky', { snapshot, sticky });
  }

  /**
   * Generates a token with which the snapshot can be transferred to another instance.
   * @param snapshot
   * @returns {Promise<Object>}
   */
  async exportSnapshot(snapshot: string): Promise<string> {
    const ret = await this._commonRequest('snapshot/export', { snapshot });
    return ret.token;
  }

  /**
   * Imports a snapshot from another instance identified by VEID and Token.
   * Both VEID and Token must be obtained from another instance
   * beforehand with a snapshot/export call.
   * @param snapshot
   * @param sourceToken
   * @returns {Promise<Object>}
   */
  async importSnapshot(snapshot: string, sourceToken: string): Promise<Object> {
    return this._commonRequest('snapshot/import', { snapshot, sourceToken });
  }

  /**
   * Assigns a new IPv6 address.
   * For initial IPv6 assignment an empty IP is required
   * (call without parameters),
   * and a new IP from the available pool is assigned automatically.
   * All subsequent requested IPv6 addresses must be
   * within the /64 subnet of the first IPv6 address.
   * @param ip
   * @returns Newly assigned IPv6 address
   */
  async addIPbv6(ip: string): Promise<string> {
    const ret = await this._commonRequest('ipv6/add', { ip });
    return ret.ip;
  }

  async deleteIPv6(ip: string): Promise<string> {
    return this._commonRequest('ipv6/delete', { ip });
  }

  /**
   * Return all possible migration locations.
   * @returns {Promise<MigrationInfo>}
   */
  async getMigrateLocations(): Promise<MigrationInfo> {
    const ret = await this._commonRequest('migrate/getLocations');
    return new MigrationInfo(ret);
  }

  /**
   * Start VPS migration to new location.
   * Takes new location ID as input.
   * Note that this will result in all IPv4 addresses to be replaced with new ones,
   * and all IPv6 addresses will be released.
   * @param location
   * @returns {Promise<Object>}
   */
  async startMigration(location: string): Promise<{
    notificationEmail: string,
    newIps: string[]
  }> {
    return this._commonRequest('migrate/start', { location });
  }

  /**
   * (OVZ only) Clone a remote server or VPS.
   * See Migrate from another server for example on how this works.
   * @param externalServerIP
   * @param externalServerSSHport
   * @param externalServerRootPassword
   * @returns {Promise<Object>}
   */
  async cloneOVZ(externalServerIP: string,
    externalServerSSHport: string,
    externalServerRootPassword: string): Promise<Object> {
    return this._commonRequest('cloneFromExternalServer', {
      externalServerIP,
      externalServerSSHport,
      externalServerRootPassword,
    });
  }

  /**
   * Retrieve information related to service suspensions.
   * @returns {Promise<SuspensionInfo>}
   */
  async getSuspensionDetails(): Promise<SuspensionInfo> {
    const ret = await this._commonRequest('getSuspensionDetails');
    return new SuspensionInfo(ret);
  }

  /**
   * Clear abuse issue identified by record_id and unsuspend the VPS.
   * Refer to getSuspensionDetails call for details.
   * @param record_id
   * @returns {Promise<Object>}
   */
  async unsuspend(record_id: string): Promise<Object> {
    return this._commonRequest('unsuspend', { record_id });
  }

  /**
   * When you perform too many API calls in a short amount of time,
   * KiwiVM API may start dropping your requests for a few minutes.
   * This call allows monitoring this matter.
   * @returns
   * remaining_points_15min: Number of "points" available to use in the current 15-minute interval
    remaining_points_24h: Number of "points" available to use in the current 24-hour interval
   */
  async getRateLimitStatus(): Promise<Object> {
    return this._commonRequest('getRateLimitStatus');
  }

  static throwException(exception: Error) {
    throw exception;
  }
}
