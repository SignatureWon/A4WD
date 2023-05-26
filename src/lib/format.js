export const format = {
  currency: (num, decimal = 2) => {
    if (!num) {
      num = 0;
    }
    return num.toLocaleString("en-US", {
      minimumFractionDigits: decimal,
      maximumFractionDigits: decimal,
    });
  },
};
