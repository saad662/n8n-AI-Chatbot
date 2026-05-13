import axios from "axios";

const slotLocks = new Map();

const LOCK_TIME = 5 * 60 * 1000;

export const handleChat = async (req, res) => {

  console.log("\n==============================");
  console.log("HANDLE CHAT HIT");
  console.log("TIME:", new Date().toISOString());
  console.log("REQUEST BODY:");
  console.log(JSON.stringify(req.body, null, 2));
  console.log("==============================\n");

  try {

    const { action, slot } = req.body;

    // CLEAN EXPIRED LOCKS
    const now = Date.now();

    console.log("CHECKING FOR EXPIRED LOCKS...");

    for (const [key, value] of slotLocks.entries()) {

      if (value.expiresAt < now) {

        console.log("REMOVING EXPIRED LOCK:", key);

        slotLocks.delete(key);
      }
    }

    console.log("ACTIVE LOCKS:", [...slotLocks.keys()]);

    // =========================
    // BOOK SLOT FLOW
    // =========================
    if (action === "book_slot") {

      console.log("\nBOOK SLOT REQUEST DETECTED");
      console.log("REQUESTED SLOT:", slot);

      // SLOT ALREADY LOCKED
      if (slotLocks.has(slot)) {

        console.log("SLOT BLOCKED - ALREADY LOCKED:", slot);

        return res.status(409).json({
          error: "SLOT_ALREADY_BOOKED",
          reply:
            "Sorry, this slot was just booked by another customer.",
        });
      }

      // LOCK SLOT
      console.log("LOCKING SLOT:", slot);

      slotLocks.set(slot, {
        expiresAt: now + LOCK_TIME,
      });

      console.log("LOCK SUCCESSFUL");
      console.log("UPDATED LOCKS:", [...slotLocks.keys()]);

      try {

        console.log("\nSENDING BOOKING REQUEST TO N8N...");
        console.log("N8N URL:");
        console.log("https://lordlutz.app.n8n.cloud/webhook/chat");

        const response = await axios.post(
          "https://lordlutz.app.n8n.cloud/webhook/chat",
          req.body,
        );

        console.log("\nN8N BOOKING RESPONSE");
        console.log("STATUS:", response.status);
        console.log("RESPONSE DATA:");
        console.log(JSON.stringify(response.data, null, 2));

        // VALIDATE RESPONSE
        if (!response.data || response.data.error) {

          console.log("BOOKING FAILED INSIDE N8N");

          // RELEASE LOCK
          slotLocks.delete(slot);

          return res.status(500).json({
            error: "BOOKING_FAILED",
            reply:
              response.data?.reply ||
              "Booking failed. Please try again.",
          });
        }

        console.log("BOOKING SUCCESSFUL");

        return res.json(response.data);

      } catch (err) {

        console.log("\nN8N BOOKING FAILED");
        console.log("ERROR MESSAGE:", err.message);

        if (err.response) {

          console.log("N8N STATUS:", err.response.status);
          console.log("N8N RESPONSE:");
          console.log(JSON.stringify(err.response.data, null, 2));
        }

        // RELEASE LOCK
        console.log("RELEASING SLOT LOCK:", slot);

        slotLocks.delete(slot);

        console.log("LOCK RELEASED");
        console.log("ACTIVE LOCKS:", [...slotLocks.keys()]);

        return res.status(500).json({
          error: "BOOKING_FAILED",
          reply:
            "Booking failed because calendar service could not be reached.",
        });
      }
    }

    // =========================
    // NORMAL CHAT FLOW
    // =========================

    console.log("\nNORMAL CHAT FLOW");
    console.log("FORWARDING REQUEST TO N8N...");

    const response = await axios.post(
      "https://lordlutz.app.n8n.cloud/webhook/chat",
      req.body,
    );

    console.log("\nN8N CHAT SUCCESS");
    console.log("STATUS:", response.status);
    console.log("RESPONSE DATA:");
    console.log(JSON.stringify(response.data, null, 2));

    return res.json(response.data);

  } catch (error) {

    console.log("\nUNHANDLED SERVER ERROR");
    console.log("ERROR MESSAGE:", error.message);

    if (error.response) {

      console.log("ERROR STATUS:", error.response.status);
      console.log("ERROR RESPONSE:");
      console.log(JSON.stringify(error.response.data, null, 2));
    }

    return res.status(500).json({
      error: "SERVER_ERROR",
      reply: "Server error",
    });
  }
};