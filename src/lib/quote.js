import dayjs from "dayjs";
import { format } from "$lib/format";
export const q = {
  getPayments: (quote) => {
    const duration = quote.details.duration;
    const date_quote = dayjs(quote.created_at).format("DD MMM YYYY");
    const date_start = dayjs(quote.details.date_start).format("ddd, DD MMM YYYY");
    const date_end = dayjs(quote.details.date_end).format("ddd, DD MMM YYYY");
    let agentFees = [];
    let supplierFees = [];
    let pickupFees = [];

    const totalAgentFee = () => {
      let sum = 0;
      agentFees.forEach((fee) => {
        sum += fee.total;
      });
      return sum;
    };
    const totalAgentCommission = () => {
      let sum = 0;
      agentFees.forEach((fee) => {
        sum += fee.profit;
      });

      sum -= quote.add_discount;
      return sum;
    };
    const totalSupplierFee = () => {
      let sum = 0;
      supplierFees.forEach((fee) => {
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

    if ("terms" in quote.details) {
      terms = quote.details.terms;
    }
    if (terms.pay_counter) {

      console.log(quote.details.daily);
      let toAgent = terms.percentage ? (quote.details.daily.gross * terms.deposit) / 100 : terms.deposit;

      agentFees.push({
        name: `${terms.percentage ? `${terms.deposit}%` : `$${terms.deposit}`} deposit of daily basic rental ${
          terms.percentage ? `($${format.currency(quote.details.daily.gross)} x ${terms.deposit}%)` : ""
        }<br><span style="color: #999999">Daily basic rental: $${format.currency(quote.details.daily.items[0].gross)} x ${duration} days = $${format.currency(quote.details.daily.gross)}</span>`,
        total: toAgent,
        nett: 0,
        profit: toAgent,
      });
      supplierFees.push({
        name: `Balance of daily basic rental ($${format.currency(quote.details.daily.gross)} - $${format.currency(
          toAgent
        )})<br><span style="color: #999999">Daily basic rental: $${format.currency(quote.details.daily.items[0].gross)} x ${duration} days = $${format.currency(quote.details.daily.gross)}</span>`,
        total: quote.details.daily.gross - toAgent,
        nett: 0,
        profit: 0,
      });
      pickupFees.push({
        name: `Balance of daily basic rental ($${format.currency(quote.details.daily.gross)} - $${format.currency(
          toAgent
        )})<br><span style="color: #999999">Daily basic rental: $${format.currency(quote.details.daily.items[0].gross)} x ${duration} days = $${format.currency(quote.details.daily.gross)}</span>`,
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
    if (quote.add_discount < 0) {
      agentFees.push({
        name: `Discount: ${quote.add_discount_remark}`,
        total: quote.add_discount,
        nett: 0,
        profit: 0,
      });
    }

    /**
     * Bonds
     */
    const bond = Object.keys(quote.details.bonds).length ? quote.details.bonds : quote.details.bond;
    pickupFees.push({
      name: `Bond: $${format.currency(
        bond.bond,
        0
      )} is taken from the hirer's credit or debit card <div style="font-size: 14px; color: #999999">Refundable as per supplier's Summary of Terms<div>`,
      total: bond.bond,
      nett: 0,
      profit: 0,
    });

    let gross = 0;
    let nett = 0;
    let profit = 0;

    if ("gross" in bond) {
      gross = bond.gross * duration;
      nett = bond.nett * duration;
      profit = nett > 0 ? gross - nett : 0;
    } else {
      bond.gross = 0;
      bond.nett = 0;
      bond.bond = 0;
    }

    if (bond.gross > 0) {
      const row = {
        name: `${bond.display_name}: $${bond.gross} x ${duration} days`,
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
    }

    /**
     * One-way
     */
    let one_way = quote.details.one_way;
    if (one_way > 0) {
      supplierFees.push({
        name: `One-way fee`,
        total: one_way,
        nett: 0,
        profit: 0,
      });
      pickupFees.push({
        name: `One-way fee`,
        total: one_way,
        nett: 0,
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
    }

    /**
     * Specials
     */
    let special = quote.details.specials;
    if (special.total > 0) {
      special.items.forEach((item) => {
        console.log(item);
        if (item.discount_amount > 0) {
          agentFees.push({
            name: item.name,
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
          nett: 0,
          profit: 0,
        });
        pickupFees.push({
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
      if (!item.own && item.value > 0) {
        supplierFees.push({
          name: item.name,
          total: item.value,
          nett: 0,
          profit: 0,
        });
        totalSupplierAdjustments += item.value;

        pickupFees.push({
          name: item.name,
          total: item.value,
          nett: 0,
          profit: 0,
        });
      } else {
        agentFees.push({
          name: item.name,
          total: item.value,
          nett: 0,
          profit: 0,
        });
        totalAgentAdjustments += item.value;
      }
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
    const totalAgent = totalAgentFee();
    const totalCommission = totalAgentCommission();
    const totalSupplier = totalSupplierFee();

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
          },
        ];
      } else {
        let deposit = quote.details.terms.percentage
          ? (totalAgent * quote.details.terms.deposit) / 100
          : quote.details.terms.deposit;
        let depositOri = deposit;

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
        termsItems = [
          {
            name: `Booking deposit to agent now (${
              terms.percentage ? `${terms.deposit}%` : `$${terms.deposit}`
            }) on ${dayjs(date_quote).format("ddd, DD MMM YYYY")}`,
            total: terms.percentage ? (totalAgent * terms.deposit) / 100 : terms.deposit,
          },
          ...termsItems,
        ];
      }
    }

    return {
      agentItems: agentFees,
      supplierItems: supplierFees,
      pickupItems: pickupFees,
      termsItems: termsItems,
      totalAgent: totalAgent,
      totalCommission: totalCommission,
      totalSupplier: totalSupplier,
      totalAgentAdjustments: totalAgentAdjustments,
      totalSupplierAdjustments: totalSupplierAdjustments,
    };
  },
};
