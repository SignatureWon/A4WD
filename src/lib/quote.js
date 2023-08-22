import dayjs from "dayjs";
import { format } from "$lib/format";
export const q = {
  getPayments: (quote) => {
    // console.log(quote);
    const duration = quote.details.duration;
    const date_quote = dayjs(quote.created_at).format("DD MMM YYYY");
    const date_start = dayjs(quote.details.date_start).format("ddd, DD MMM YYYY");
    const date_end = dayjs(quote.details.date_end).format("ddd, DD MMM YYYY");
    let summaryFees = [];
    let agentFees = [];
    let supplierFees = [];
    let pickupFees = [];

    // console.log(quote);
    const totalSummaryFee = () => {
      let sum = 0;
      summaryFees.forEach((fee) => {
        sum += fee.total;
      });
      return sum;
    };

    const totalAgentFee = () => {
      let sum = 0;
      agentFees.forEach((fee) => {
        // console.log("fee", fee);
        sum += fee.total;
      });
      return sum;
    };
    const totalAgentCommission = () => {
      let sum = 0;
      agentFees.forEach((fee) => {
        sum += fee.profit;
      });

      // sum += quote.add_discount;
      return sum;
    };
    const totalNettFee = () => {
      let sum = 0;
      agentFees.forEach((fee) => {
        sum += fee.nett;
      });
      // supplierFees.forEach((fee) => {
      //   sum += fee.nett;
      // });

      // sum += quote.add_discount;
      return sum;
    };
    const totalSupplierFee = () => {
      let sum = 0;
      supplierFees.forEach((fee) => {
        // console.log("SUPP", fee);
        sum += fee.total;
      });
      return sum;
    };

    /**
     * Daily Rates
     */
    const daily = quote.details.daily;
    const rateType = quote.details.rates_type;

    let terms = {
      name: null,
      id: null,
      confirmation: null,
      confirmation_terms: null,
      summary: null,
      summary_terms: null,
      counter: null,
      counter_terms: null,
      deposit: 0,
      percentage: false,
      balance: 0,
      description: null,
      payment2: false,
      deposit2: null,
      percentage2: null,
      balance2: null,
      description2: null,
      payment3: null,
      deposit3: null,
      percentage3: null,
      balance3: null,
      description3: null,
      pay_counter: false,
      suppliers: {
        id: null,
        name: null,
      },
    };
    // console.log("quote", quote);

    if ("terms" in quote.details) {
      terms = quote.details.terms;
    }

    // console.log("terms", terms);

    if (terms.pay_counter) {
      // console.log("quote.details", quote.details);
      let toAgent = terms.percentage ? (quote.details.daily.gross * terms.deposit) / 100 : terms.deposit;

      if (quote.details.rates_nett === 1) {
        toAgent = terms.percentage
          ? (quote.details.daily.gross * terms.deposit) / (100 + terms.deposit)
          : terms.deposit;
        agentFees.push({
          // name: `$${format.currency(toAgent)} deposit of daily basic rental to agent`,
          name: `Deposit of daily basic rental to agent`,
          total: toAgent,
          nett: 0,
          profit: toAgent,
        });
      } else {
        agentFees.push({
          name: `${terms.percentage ? `${terms.deposit}%` : `$${terms.deposit}`} deposit of daily basic rental ${
            terms.percentage ? `($${format.currency(quote.details.daily.gross)} x ${terms.deposit}%)` : ""
          }<br><span style="color: #999999">Daily basic rental: $${format.currency(
            quote.details.daily.items[0].gross
          )} x ${duration} days = $${format.currency(quote.details.daily.gross)}</span>`,
          total: toAgent,
          nett: 0,
          profit: toAgent,
        });
      }
      summaryFees.push({
        name: `Daily basic rental ($${format.currency(quote.details.daily.items[0].gross)} x ${duration} days)`,
        total: quote.details.daily.gross,
        nett: 0,
        profit: 0,
      });
      supplierFees.push({
        name: `Balance of daily basic rental ($${format.currency(quote.details.daily.gross)} - $${format.currency(
          toAgent
        )})<br><span style="color: #999999">Daily basic rental: $${format.currency(
          quote.details.daily.items[0].gross
        )} x ${duration} days = $${format.currency(quote.details.daily.gross)}</span>`,
        total: quote.details.daily.gross - toAgent,
        nett: 0,
        profit: 0,
      });
      pickupFees.push({
        name: `Balance of daily basic rental ($${format.currency(quote.details.daily.gross)} - $${format.currency(
          toAgent
        )})<br><span style="color: #999999">Daily basic rental: $${format.currency(
          quote.details.daily.items[0].gross
        )} x ${duration} days = $${format.currency(quote.details.daily.gross)}</span>`,
        total: quote.details.daily.gross - toAgent,
        nett: 0,
        profit: 0,
      });
    } else {
      if (rateType === "flex") {
        let week = 1;
        let day = 0;
        daily.items.forEach((o, i) => {
          if (i !== 0 && i % 7 === 0) {
            agentFees.push({
              name: `Daily basic rental: Week ${week}: Flex[${daily.items[i - 1].flex}]: $${format.currency(
                daily.items[i - 1].gross
              )} x ${day} days`,
              total: daily.items[i - 1].gross * day,
              nett: daily.items[i - 1].nett * day,
              profit: daily.items[i - 1].profit * day,
            });
            day = 1;
            week++;
          } else {
            day++;
          }
          if (i === daily.items.length - 1) {
            agentFees.push({
              name: `Daily basic rental: Week ${week}: Flex[${o.flex}]: $${format.currency(o.gross)} x ${day} days`,
              total: o.gross * day,
              nett: o.nett * day,
              profit: o.profit * day,
            });
          }
        });
      } else {
        agentFees.push({
          name: `Daily basic rental: $${format.currency(daily.gross / daily.items.length)} x ${
            daily.items.length
          } days`,
          total: daily.gross,
          nett: daily.nett,
          profit: daily.profit,
        });
      }
    }

    /**
     * Discount
     */
    if (quote.add_discount < 0 || quote.add_discount_supplier < 0) {
      agentFees.push({
        name: `Discount: ${quote.add_discount_remark}`,
        total: quote.add_discount_supplier || quote.add_discount,
        nett: quote.add_discount_supplier || 0,
        profit: quote.add_discount,
      });
      summaryFees.push({
        name: `Discount: ${quote.add_discount_remark}`,
        total: quote.add_discount_supplier || quote.add_discount,
        nett: 0,
        profit: 0,
      });
    }

    /**
     * Bonds
     */
    // console.log("quote.details", quote.details);
    let bond = null
    if ('bonds' in quote.details) {
      bond = quote.details.bonds
    } else if ('bond' in quote.details) {
      bond = quote.details.bond
    }

    // const bond = Object.keys(quote.details.bonds).length ? quote.details.bonds : quote.details.bond;
    if (bond) {
      pickupFees.push({
        name: `Bond: $${format.currency(
          bond.bond,
          0
        )} is taken from the hirer's credit or debit card ${quote.details.bonds.description ? `<div style="font-size: 13px">${quote.details.bonds.description}<div>` : ""}<div style="font-size: 13px; color: #999999">Refundable as per supplier's Summary of Terms<div>`,
        total: bond.bond,
        nett: 0,
        profit: 0,
      });

      let gross = 0;
      let nett = 0;
      let profit = 0;

      let cap = duration < (bond.cap || 99999) ? duration : bond.cap;

      if ("gross" in bond) {
        gross = bond.gross * cap;
        nett = bond.nett * cap;
        profit = nett > 0 ? gross - nett : 0;
      } else {
        bond.gross = 0;
        bond.nett = 0;
        bond.bond = 0;
      }

      if (bond.gross > 0) {
        const row = {
          name: `${bond.display_name}: $${bond.gross} x ${cap} days`,
          total: gross,
          nett: nett,
          profit: profit,
        };
        if (bond.nett > 0 && bond.gross > bond.nett) {
          agentFees.push(row);
        } else {
          supplierFees.push(row);
          pickupFees.push(row);
        }
        summaryFees.push(row);
      }
    }

    /**
     * One-way
     */
    let one_way = quote.details.one_way;
    if (one_way > 0) {
      summaryFees.push({
        name: `One-way fee`,
        total: one_way,
        nett: 0,
        profit: 0,
      });
      supplierFees.push({
        name: `One-way fee`,
        total: one_way,
        nett: one_way,
        profit: 0,
      });
      pickupFees.push({
        name: `One-way fee`,
        total: one_way,
        nett: one_way,
        profit: 0,
      });
    }

    /**
     * Add-ons
     */
    let addons = quote.details.addons;
    for (const key in addons) {
      const addon = addons[key];
      let gross = addon.gross_rate;
      if (addon.daily) {
        gross = gross * duration;
      }
      if (addon.gross_cap > 0) {
        if (gross > addon.gross_cap) {
          gross = addon.gross_cap;
        }
      }
      let nett = addon.nett_rate;
      if (addon.daily) {
        nett = nett * duration;
      }
      if (addon.nett_cap > 0) {
        if (nett > addon.nett_cap) {
          nett = addon.nett_cap;
        }
      }
      const row = {
        name: `Add-on: ${addon.name} ${addon.daily ? `$${addon.gross_rate} x ${duration} days` : ""}`,
        total: gross,
        nett: nett,
        profit: nett > 0 ? gross - nett : 0,
      };
      if (addon.nett_rate > 0 && addon.gross_rate > addon.nett_rate) {
        agentFees.push(row);
      } else {
        supplierFees.push(row);
        pickupFees.push(row);
      }
      summaryFees.push(row);
    }

    /**
     * Specials
     */
    let special = quote.details.specials;
    if (special.total > 0) {
      special.items.forEach((item) => {
        let special_name = item.name
        item.discount_list.forEach(list => {
          special_name += `<br>${list.calculation}`
        })
        // console.log("specials", item);
        // console.log(item);
        if (item.discount_amount > 0) {
          agentFees.push({
            // name: item.name,
            name: special_name,
            total: -item.discount_amount,
            nett: -item.discount_nett,
            profit: -item.discount_profit,
          });
          summaryFees.push({
            // name: item.name,
            name: special_name,
            total: -item.discount_amount,
            nett: 0,
            profit: 0,
          });
        }
      });
    }

    /**
     * Fees
     */
    let fee = quote.details.fees;
    if (fee.total > 0) {
      fee.items.forEach((item) => {
        supplierFees.push({
          name: item.name,
          total: item.fee,
          nett: item.fee,
          profit: 0,
        });
        pickupFees.push({
          name: item.name,
          total: item.fee,
          nett: item.fee,
          profit: 0,
        });
        summaryFees.push({
          name: item.name,
          total: item.fee,
          nett: 0,
          profit: 0,
        });
      });
    }

    /**
     * Adjustments
     */
    let adjustments = quote.adjustments;
    // let adjAgentItems = []
    // let adjSupplierItems = []
    let totalAgentAdjustments = 0;
    let totalSupplierAdjustments = 0;

    if (!adjustments) {
      adjustments = [];
    }

    adjustments.forEach((item) => {
      if (!item.own) {
        if (item.value > 0) {
          supplierFees.push({
            name: item.name,
            total: item.value,
            nett: item.value,
            profit: 0,
          });
          pickupFees.push({
            name: item.name,
            total: item.value,
            nett: item.value,
            profit: 0,
          });
        } else {
          agentFees.push({
            name: item.name,
            total: item.value,
            nett: item.value,
            profit: 0,
          });
        }
        // totalSupplierAdjustments += item.value;
      } else {
        agentFees.push({
          name: item.name,
          total: item.value,
          nett: 0,
          profit: item.value,
        });
        // totalAgentAdjustments += item.value;
      }
      summaryFees.push({
        name: item.name,
        total: item.value,
        nett: 0,
        profit: 0,
      });
    });

    /**
     * Credit Card
     */
    if (quote.cc_charge) {
      let fee = totalAgentFee() * 0.02;
      if (fee > 0) {
        agentFees.push({
          name: "Credit card surcharge (2%)",
          total: fee,
          nett: 0,
          profit: 0,
        });
      }
    } else {
      agentFees.push({
        name: "Credit card surcharge (WAIVED)",
        total: 0,
        nett: 0,
        profit: 0,
      });
    }

    /**
     * Payment Terms
     */
    const totalSummary = totalSummaryFee();
    const totalAgent = totalAgentFee();
    const totalCommission = totalAgentCommission();
    const totalSupplier = totalSupplierFee();
    const totalNett = totalNettFee();

    let termsItems = [];
    if (terms.pay_counter) {
      termsItems = [
        {
          name: `Total payable to agent`,
          total: totalAgent,
        },
      ];
    } else {
      let gap = dayjs(date_start).diff(dayjs(date_quote), "day");
      // console.log(dayjs(date_start).isBefore(dayjs(date_quote)));
      // if (dayjs(date_start).isBefore(dayjs(date_quote))) {
      //   gap = gap * -1
      // }
      // console.log("gap", gap);

      if (gap <= terms.balance) {
        termsItems = [
          {
            name: `Full payment to agent on ${dayjs(date_quote).format("ddd, DD MMM YYYY")}`,
            total: totalAgent,
            // total: totalAgent + totalSupplier,
          },
        ];
      } else {
        let deposit = terms.percentage ? (totalAgent * terms.deposit) / 100 : terms.deposit;
        let oriDeposit = deposit;

        if (terms.payment2) {
          let total2 = terms.percentage2 ? (totalAgent * terms.deposit2) / 100 : terms.deposit2;
          if (terms.balance2 < gap) {
            termsItems.push({
              name: `First payment to agent (${
                terms.percentage2 ? `${terms.deposit2}%` : `$${terms.deposit2}`
              }) on ${dayjs(date_start).subtract(terms.balance2, "day").format("ddd, DD MMM YYYY")} (${
                terms.balance2
              } days before
              travel)`,
              total: total2,
            });
          } else {
            deposit += total2;
          }
        }
        if (terms.payment3) {
          let total3 = terms.percentage3 ? (totalAgent * terms.deposit3) / 100 : terms.deposit3;
          if (terms.balance3 < gap) {
            termsItems.push({
              name: `First payment to agent (${
                terms.percentage3 ? `${terms.deposit3}%` : `$${terms.deposit3}`
              }) on ${dayjs(date_start).subtract(terms.balance3, "day").format("ddd, DD MMM YYYY")} (${
                terms.balance3
              } days before
              travel)`,
              total: total3,
            });
          } else {
            deposit += total3;
          }
        }

        // balance
        if (terms.balance < gap) {
          let bal = totalAgent;
          termsItems.forEach((t) => {
            bal -= t.total;
          });
          bal -= deposit;

          termsItems.push({
            name:
              "Balance payment to " +
              (terms.pay_counter
                ? `supplier at pick-up counter on ${dayjs(date_start).format("ddd, DD MMM YYYY")}`
                : `agent on ${dayjs(date_start).subtract(terms.balance, "day").format("ddd, DD MMM YYYY")}`) +
              ` (${terms.balance} days before travel)`,
            total: bal,
          });
        } else {
          deposit += bal;
        }
        let depositText = `(${terms.percentage ? `${terms.deposit}%` : `$${terms.deposit}`})`;
        // console.log("deposit", deposit);

        termsItems = [
          {
            name: `Booking Deposit ${deposit === oriDeposit ? depositText : ""}`,
            total: deposit,
          },
          ...termsItems,
        ];

        // console.log("termsItems", termsItems);
        // termsItems = [
        //   {
        //     name: `Booking deposit to agent now (${
        //       terms.percentage ? `${terms.deposit}%` : `$${terms.deposit}`
        //     }) on ${dayjs(date_quote).format("ddd, DD MMM YYYY")}`,
        //     total: terms.percentage ? (totalAgent * terms.deposit) / 100 : terms.deposit,
        //   },
        //   ...termsItems,
        // ];
      }
    }

    // console.log("agentFees", agentFees);

    return {
      summaryItems: summaryFees,
      agentItems: agentFees,
      supplierItems: supplierFees,
      pickupItems: pickupFees,
      termsItems: termsItems,
      totalSummary: totalSummary,
      totalAgent: totalAgent,
      totalCommission: totalCommission,
      totalSupplier: totalSupplier,
      totalNett: totalNett,
      totalAgentAdjustments: totalAgentAdjustments,
      totalSupplierAdjustments: totalSupplierAdjustments,
    };
  },
  getDailyRates: (quote) => {
    const daily = quote.details.daily;
    const rateType = quote.details.rates_type;
    let list = [];

    if (rateType === "flex") {
      let week = 1;
      let day = 0;
      daily.items.forEach((o, i) => {
        if (i !== 0 && i % 7 === 0) {
          list.push({
            name: `Daily basic rental: Week ${week}: Flex[${daily.items[i - 1].flex}]: $${format.currency(
              daily.items[i - 1].gross
            )} x ${day} days`,
            total: daily.items[i - 1].gross * day,
            nett: daily.items[i - 1].nett * day,
            profit: daily.items[i - 1].profit * day,
            week: week,
            days: day,
            flex: daily.items[i - 1].flex,
            daily: {
              gross: daily.items[i - 1].gross,
              nett: daily.items[i - 1].nett,
              profit: daily.items[i - 1].profit,
            },
          });
          day = 1;
          week++;
        } else {
          day++;
        }
        if (i === daily.items.length - 1) {
          list.push({
            name: `Daily basic rental: Week ${week}: Flex[${o.flex}]: $${format.currency(o.gross)} x ${day} days`,
            total: o.gross * day,
            nett: o.nett * day,
            profit: o.profit * day,
            week: week,
            days: day,
            flex: o.flex,
            daily: {
              gross: o.gross,
              nett: o.nett,
              profit: o.profit,
            },
          });
        }
      });
    } else {
      let days = daily.items.length;
      list.push({
        name: `Daily basic rental: $${format.currency(daily.gross / days)} x ${days} days`,
        total: daily.gross,
        nett: daily.nett,
        profit: daily.profit,
        week: null,
        days: days,
        flex: null,
        daily: {
          gross: daily.gross / days,
          nett: daily.nett / days,
          profit: daily.profit / days,
        },
      });
    }
    return list;
  },
  prefix: {
    Booking: "B",
    Request: "Q",
    Provisional: "PT",
    Final: "FT",
  },
  showtime: (str) => {
    let time = str.split(":");
    let hr = Number(time[0]);
    let ampm = "AM";
    if (hr > 12) {
      hr -= 12;
      ampm = "PM";
    }
    if (hr < 10) {
      hr = `0${hr}`;
    }
    return `${hr}:${time[1]}${ampm}`;
  },
};
