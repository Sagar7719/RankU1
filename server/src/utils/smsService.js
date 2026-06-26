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

    const fromNumber = process.env.TWILIO_PHONE_NUMBER ? process.env.TWILIO_PHONE_NUMBER.trim() : "";
    if (fromNumber && !fromNumber.startsWith("+")) {
      console.warn(
        `[Twilio Warning] TWILIO_PHONE_NUMBER ("${fromNumber}") in server/.env does not start with '+'. ` +
        "Twilio phone numbers must be in E.164 format (e.g., +1234567890). If this is your personal number, " +
        "note that you must use a Twilio-purchased phone number or Messaging Service SID as the sender."
      );
    }

    const response = await client.messages.create({
      body: message,
      from: fromNumber,
      to: formattedMobile,
    });

    console.log(`SMS successfully sent. Message SID: ${response.sid}`);
    return response;
  } catch (error) {
    console.error("Twilio Error: Failed to send SMS", error);
    if (error.code === 21212) {
      throw new Error(
        `Could not send SMS: Invalid Sender Number "${process.env.TWILIO_PHONE_NUMBER}". ` +
        "Ensure TWILIO_PHONE_NUMBER in server/.env is a valid Twilio-purchased number starting with '+'."
      );
    }
    throw new Error(`Could not send SMS: ${error.message || "Please verify credentials or mobile format."}`);
  }
};
