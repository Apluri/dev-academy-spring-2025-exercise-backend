// Creates toJSON method for BigInt prototype, so that JSON.stringify can handle BigInt values
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
