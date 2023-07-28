import { calcEv } from "./ev-calc.js";
import { productsMapBySet } from "./setsData.js";

async function main() {
  const set = "Commander Masters";
  const products = productsMapBySet[set];
  for (const productName in products) {
    console.log("Calculating EV for " + productName + "...");
    const unitValue = await calcEv(set, products[productName].template);
    const totalValue = Math.round(unitValue * products[productName].amount * 100) / 100;
    console.log(`Total Value: $${totalValue} = $${unitValue} x ${products[productName].amount}`);
    console.log("=====================================");
  }
}
main();
