// @flow

class SuspensionDetail {
  /**
   * Case ID, needed to unsuspend
   the service via "unsuspend" API call
   */
  recordId: number;

  /**
   *  Type of abuse
   */
  flag: string;

  /**
   * If it is true, it means you can unsuspend VPS via API,
   * otherwise ypu must contact support to unsuspend
   */
  isSoft: boolean;

  /**
   * Detailed abuse report ID (see below)
   */
  evidenceRecordId: number;

  constructor(body: Object) {
    this.recordId = body.record_id;
    this.flag = body.flag;
    this.isSoft = body.is_soft === 1;
    this.evidenceRecordId = body.evidence_record_id;
  }
}

export default class SuspensionInfo {
  suspensionCount: number;

  suspensions: ?SuspensionDetail[];

  evidence: ?{ recordId: string, desc: string};

  constructor(body: Object) {
    this.suspensionCount = body.suspension_count === null ? 0 : body.suspensions;
    this.suspensions = this.suspensionCount === 0
      ? []
      : body.suspensions.map(value => new SuspensionDetail(value));
    this.evidence = this.suspensionCount === 0
      ? null
      : Object
        .entries(body.evidence)
        .map((value) => {
          const [recordId, desc] = value;
          return { recordId, desc };
        });
  }
}
