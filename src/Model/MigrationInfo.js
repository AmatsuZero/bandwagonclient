// @flow

export default class MigrationInfo {
  /**
   * ID of current location
   */
    currentLocation: string;

    /**
   * IDs of locations available for migration into
   */
    locations: string[];

    /**
   *  Friendly descriptions of available locations
   */
    descriptions: { location: string, desc: string }[];

    /**
   * Some locations may offer more expensive bandwidth where monthly allowance will be lower.
   * This array contains monthly data transfer allowance multipliers for each location.
   */
    dataTransferMultipliers: { location: string, multiplier: number }[];

    constructor(node: Object) {
      this.currentLocation = node.currentLocation;
      this.locations = node.locations;
      this.descriptions = Object
        .entries(node.descriptions)
        .map((value) => {
          const [location, desc] = value;
          return { location, desc };
        });
      this.dataTransferMultipliers = Object
        .entries(node.dataTransferMultipliers)
        .map((value) => {
          const [location, multiplier] = value;
          return { location, multiplier };
        });
    }
}
