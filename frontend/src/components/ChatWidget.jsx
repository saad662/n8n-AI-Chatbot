import { useState } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  const [step, setStep] = useState("service");
  const [service, setService] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [urgency, setUrgency] = useState("normal");

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 Welcome to Lutz Electrical. What service do you need?",
    },
  ]);

  const services = [
    "Socket installation",
    "Light installation",
    "Wiring",
    "Inspection",
    "Emergency repair",
  ];

  const addMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  // STEP HANDLERS
  const handleServiceSelect = (s) => {
    setService(s);
    addMessage({ sender: "user", text: s });

    if (s === "Inspection" || s === "Emergency repair") {
      setStep("urgency");
      addMessage({ sender: "bot", text: "Is this urgent?" });
    } else {
      setStep("quantity");
      addMessage({ sender: "bot", text: "How many units/meters?" });
    }
  };

  const handleBooking = async () => {
    console.log("BOOK BUTTON CLICKED");

    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `${service} ${quantity || 1} ${urgency}`,
      }),
    });

    const data = await res.json();

    console.log(data);

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: "Please choose a slot",
        slots: data.slots || [],
      },
    ]);

    setStep("booked");
  };

  const handleSlotSelect = async (slot) => {
    addMessage({ sender: "user", text: slot });

    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "book_slot",
        slot,
      }),
    });

    const data = await res.json();

    console.log("BOOKING RESPONSE:", data);

    addMessage({
      sender: "bot",
      text: data.reply || `Appointment booked for ${slot} ✅`,
    });

    setStep("final");
  };

  const handleQuantity = (q) => {
    setQuantity(q);
    addMessage({ sender: "user", text: `${q}` });
    setStep("urgency");
    addMessage({ sender: "bot", text: "Is this urgent?" });
  };

  const handleUrgency = async (u) => {
    setUrgency(u);
    addMessage({ sender: "user", text: u });

    setStep("loading");

    console.log("SENDING TO N8N:", {
      message: `
    Service: ${service}
    Quantity: ${quantity}
    Urgency: ${u}
  `,
    });

    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `${service} ${quantity || 1} ${u}`,
      }),
    });

    const data = await res.json();

    console.log("N8N RESPONSE:", data);

    addMessage({ sender: "bot", text: data.reply });

    setStep("final");
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <div
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-yellow-400 text-black w-12 h-12 rounded-full flex items-center justify-center text-lg cursor-pointer shadow-xl hover:bg-yellow-300 transition"
      >
        ⚡
      </div>

      {/* CHAT WINDOW */}
      {open && (
        <div className="fixed bottom-20 right-6 w-[320px] h-[420px] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2.5 font-semibold flex items-center justify-between">
            <span>⚡ Lutz Electrical</span>
            <button
              onClick={() => setOpen(false)}
              className="text-black font-bold"
            >
              ✕
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "user" ? "justify-end" : ""}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl shadow text-sm max-w-[75%]
  ${
    msg.sender === "user"
      ? "bg-yellow-400 text-black"
      : "bg-white text-gray-800"
  }`}
                >
                  <div>{msg.text}</div>

                  {msg.slots && msg.slots.length > 0 && (
                    <div className="mt-3 flex flex-col gap-2">
                      {msg.slots.map((slot, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSlotSelect(slot)}
                          className="bg-yellow-400 text-black px-3 py-2 rounded-xl text-xs font-medium hover:bg-yellow-300 transition"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* OPTIONS AREA */}
          <div className="p-2.5 border-t bg-white space-y-2">
            {step === "service" && (
              <div className="flex flex-wrap gap-2">
                {services.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleServiceSelect(s)}
                    className="bg-gray-100 hover:bg-yellow-400 hover:text-black px-3 py-1.5 rounded-full text-xs transition shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {step === "quantity" && (
              <div className="flex gap-2">
                {[1, 5, 10, 20].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuantity(q)}
                    className="bg-gray-100 hover:bg-yellow-400 px-3 py-1.5 rounded-full text-xs transition shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {step === "urgency" && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleUrgency("normal")}
                  className="bg-gray-100 hover:bg-yellow-400 px-3 py-1.5 rounded-full text-xs transition shadow-sm"
                >
                  Normal
                </button>
                <button
                  onClick={() => handleUrgency("urgent")}
                  className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs hover:bg-red-600 transition shadow-sm"
                >
                  Urgent
                </button>
              </div>
            )}

            {step === "loading" && (
              <div className="text-xs text-gray-500">Calculating price...</div>
            )}

            {step === "final" && (
              <div className="flex gap-2">
                <button
                  onClick={handleBooking}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-full text-sm font-semibold shadow-md transition duration-200"
                >
                  Book Appointment
                </button>
                <button>
                  <a
                    href="https://wa.me/4915757046360?text=Hi%20Lutz%20Electrical,%20I%20need%20help."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md transition duration-200"
                  >
                    Talk on WhatsApp
                  </a>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
