// backend/utils/whatsapp.js
import fetch from "node-fetch";

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WA_PHONE_ID = process.env.WHATSAPP_PHONE_ID; // from Meta

export async function sendWhatsAppText(toNumber, message) {
    if (!WHATSAPP_TOKEN || !WA_PHONE_ID) {
        console.log("WhatsApp config missing, skipping send.");
        return;
    }

    const url = `https://graph.facebook.com/v18.0/${WA_PHONE_ID}/messages`;

    await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messaging_product: "whatsapp",
            to: toNumber, // e.g. "91XXXXXXXXXX"
            type: "text",
            text: { body: message },
        }),
    });
}
