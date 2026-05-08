import fs from "fs";
import path from "path";

const filePath = new URL("../data/services.json", import.meta.url);

// Load JSON manually
const services = JSON.parse(fs.readFileSync(filePath));

export const calculatePrice = (serviceName, quantity, urgency) => {
  const service = services.find(s => s.service === serviceName);

  if (!service) return 0;

  let price = service.base_price;

  if (service.unit !== "fixed") {
    price += quantity * service.price_per_unit;
  }

  if (urgency === "urgent") {
    price *= service.urgency_multiplier;
  }

  return Math.round(price);
};