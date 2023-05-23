export const format = {
  currency: (num) => {
    if (!num) {
      num = 0;
    }
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  },
};
