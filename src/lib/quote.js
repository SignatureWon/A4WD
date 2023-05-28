import dayjs from "dayjs";
import { format } from "$lib/format";
export const quote = {
  getDetail: (details) => {
    const duration = details.duration;
    const date_quote = dayjs(details.date_book).format("DD MMM YYYY");
    const date_start = dayjs(details.date_start).format("ddd, DD MMM YYYY");
    const date_end = dayjs(details.date_end).format("ddd, DD MMM YYYY");
    let agentFees = [];
    let supplierFees = [];

    const totalAgentFee = () => {
      let sum = 0;
      agentFees.forEach((fee) => {
        sum += fee.total;
      });
      return sum;
    };
    const totalAgentCommission = () => {
      // console.log(agentFees);
      let sum = 0;
      agentFees.forEach((fee) => {
        sum += fee.profit;
      });
      return sum;
    };
    const totalSupplierFee = () => {
      let sum = 0;
      supplierFees.forEach((fee) => {
        sum += fee.total;
      });
      return sum;
    };

    // const getDailyRates = () => {
    let obj = details.daily;
    let type = details.rates_type;
    let arr = obj.items;
    if (type === "flex") {
      let week = 1;
      let day = 0;
      arr.forEach((o, i) => {
        if (i !== 0 && i % 7 === 0) {
          agentFees.push({
            name: `Daily basic rental: Week ${week}: Flex[${arr[i - 1].flex}]: $${format.currency(
              arr[i - 1].gross
            )} x ${day} days`,
            total: arr[i - 1].gross * day,
            nett: arr[i - 1].nett * day,
            profit: arr[i - 1].profit * day,
          });
          day = 1;
          week++;
        } else {
          day++;
        }
        if (i === arr.length - 1) {
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
        name: `Daily basic rental: $${format.currency(obj.gross / arr.length)} x ${arr.length} days`,
        total: obj.gross,
        nett: obj.nett,
        profit: obj.profit,
      });
    }
    // };

    // const getBonds = () => {
    const bond = Object.keys(details.bonds).length ? details.bonds : details.bond;

    let gross = bond.gross * duration;
    let nett = bond.nett * duration;
    let profit = gross - nett;

    if (bond.gross > 0) {
      const row = {
        name: `${bond.display_name}: $${bond.gross} x ${duration} days`,
        total: gross,
        nett: nett,
        profit: profit,
      };
      if (bond.gross > bond.nett) {
        agentFees.push(row);
      } else {
        supplierFees.push(row);
      }
    }
    supplierFees.push({
      name: `Bond: $${format.currency(
        bond.bond,
        0
      )} is taken from the hirer's credit or debit card <div style="font-size: 14px; color: #999999">Refundable as per supplier's Summary of Terms<div>`,
      total: bond.bond,
      nett: 0,
      profit: 0,
    });
    // };

    // const getOneways = () => {
    let one_way = details.one_way;
    if (one_way > 0) {
      supplierFees.push({
        name: `One-way fee`,
        total: one_way,
        nett: 0,
        profit: 0,
      });
    }
    // };
    // const getAddons = () => {
    let addons = details.addons;
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
        name: `Add-on: ${addon.name}${addon.daily ? `$${addon.gross_rate} x ${duration} days` : ""}`,
        total: gross,
        nett: nett,
        profit: gross - nett,
      };
      if (addon.gross_rate > addon.nett_rate) {
        agentFees.push(row);
      } else {
        supplierFees.push(row);
      }
    }
    // };

    // const getSpecials = () => {
    let special = details.specials;
    if (special.total > 0) {
      special.items.forEach((item) => {
        agentFees.push({
          name: item.name,
          total: -item.discount_amount,
          nett: 0,
          profit: 0,
        });
      });
    }
    // };
    // const getFees = () => {
    let fee = details.fees;
    if (fee.total > 0) {
      fee.items.forEach((item) => {
        supplierFees.push({
          name: item.name,
          total: item.fee,
          nett: 0,
          profit: 0,
        });
      });
    }
    // };
    // const getCcs = () => {
    let agentFee = (totalAgentFee() * 2) / 100;
    if (agentFee > 0) {
      agentFees.push({
        name: "Credit card surcharge (2%)",
        total: agentFee,
        nett: 0,
        profit: 0,
      });
    }
    // };

    let termsItems = [];
    // const getTerms = () => {
    let total = totalAgentFee();

    if ("terms" in quote.details) {
      let terms = details.terms;
      let gap = dayjs(date_start).diff(dayjs(date_quote), "day");

      if (gap < terms.balance) {
        termsItems = [
          {
            name: `Full payment to agent on ${dayjs(date_quote).format()}`,
            total: total,
          },
        ];
      } else {
        termsItems = [
          {
            name: `Booking deposit to agent now (${
              terms.percentage ? `${terms.deposit}%` : `$${terms.deposit}`
            }) on ${dayjs(date_quote).format("ddd, DD MMM YYYY")}`,
            total: terms.percentage ? (total * terms.deposit) / 100 : terms.deposit,
          },
        ];
        if (terms.payment2) {
          if (terms.balance2 < gap) {
            termsItems.push({
              name: `First payment to agent (${
                terms.percentage2 ? `${terms.deposit2}%` : `$${terms.deposit2}`
              }) on ${dayjs(date_start).subtract(terms.balance2, "day").format("ddd, DD MMM YYYY")} (${
                terms.balance2
              } days before
                    travel)`,
              total: terms.percentage2 ? (total * terms.deposit2) / 100 : terms.deposit2,
            });
          }
        }
        if (terms.payment3) {
          if (terms.balance3 < gap) {
            termsItems.push({
              name: `Second payment (${terms.percentage3 ? `${terms.deposit3}%` : `$${terms.deposit3}`}) on ${dayjs(
                date_start
              )
                .subtract(terms.balance3, "day")
                .format("ddd, DD MMM YYYY")} (${terms.balance3} days before
                    travel)`,
              total: terms.percentage3 ? (total * terms.deposit3) / 100 : terms.deposit3,
            });
          }
        }
        // balance
        if (terms.balance < gap) {
          let bal = total;
          termsItems.forEach((t) => {
            bal -= t.total;
          });

          termsItems.push({
            name:
              "Balance payment to " +
              (terms.pay_counter
                ? `supplier at pick-up counter on ${date_start.format("ddd, DD MMM YYYY")}`
                : `agent on ${dayjs(date_start).subtract(terms.balance, "day").format("ddd, DD MMM YYYY")}`) +
              ` (${terms.balance} days before travel)`,
            total: bal,
          });
        }
      }
    }
    // };

    return {
      agent: {
        items: agentFees,
        total: totalAgentFee(),
        commission: totalAgentCommission(),
      },
      supplier: {
        items: supplierFees,
        total: totalSupplierFee(),
      },
    };
  },
};
