import twilio from "twilio";

// Initialize twilio client if configuration variables are available
let client;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

/**
 * Sends a real SMS using Twilio SMS API
 * @param {string} toMobile - E.g. '+919876543210' (Include country code)
 * @param {string} message - Text message content
 */
export const sendRealSMS = async (toMobile, message) => {
  try {
    if (!client) {
      // Re-initialize client dynamic lookup in case environment variables were updated in running process
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      } else {
        throw new Error("Twilio client is not configured inside environment variables.");
      }
    }

    // Format phone number to E.164 standard if country code is missing (e.g. India +91)
    let formattedMobile = toMobile.trim();
    if (!formattedMobile.startsWith("+")) {
      formattedMobile = `+91${formattedMobile}`; // Defaulting to +91 if no code is supplied
    }

    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedMobile,
    });

    console.log(`SMS successfully sent. Message SID: ${response.sid}`);
    return response;
  } catch (error) {
    console.error("Twilio Error: Failed to send SMS", error);
    throw new Error("Could not send SMS. Please verify credentials or mobile format.");
  }
};
