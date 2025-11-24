// backend/utils/generateOrderId.js
let counter = 1;

export function generateOrderId() {
    const id = String(counter).padStart(5, "0");
    counter++;
    return `FRESH-${id}`;
}
