import { calcEv } from "./ev-calc.js";
import { productsMapBySet } from "./setsData.js";

async function main() {
  const set = "Commander Masters";
  const products = productsMapBySet[set];
  for (const productName in products) {
    console.log("Calculating EV for \x1b[4m" + productName + "\x1b[0m ...");
    const unitValue = await calcEv(set, products[productName].template);
    const totalValue = Math.round(unitValue * products[productName].amount * 100) / 100;
    console.log(`Total Value: \x1b[32m$${totalValue}\x1b[0m = \x1b[32m$${unitValue}\x1b[0m x ${products[productName].amount}`);
    console.log("=====================================");
  }
}
main();
