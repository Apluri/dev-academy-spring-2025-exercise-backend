/* eslint-disable */

// Extend the BigInt interface to include the toJSON method
interface BigInt {
  toJSON: () => string;
}

// Creates toJSON method for BigInt prototype, so that JSON.stringify can handle BigInt values
BigInt.prototype.toJSON = function () {
  return this.toString();
};
