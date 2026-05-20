import { useState, useEffect, useRef } from "react";

// ─── CLOUDINARY CONFIG ──────────────────────────────────────────────
const CLOUDINARY_CLOUD_NAME = "dyjxikbhc";
const CLOUDINARY_UPLOAD_PRESET = "chatbot_upload";
// ────────────────────────────────────────────────────────────────────

// ── Save a new lead into localStorage ("lutz_leads") ────────────────
function saveLeadToStorage({ customerName, phone, email, service, quantity, urgency, price, slot, photoUrl }) {
  const existing = JSON.parse(localStorage.getItem("lutz_leads") || "[]");
  const newLead = {
    id: Date.now().toString(),
    customerName,
    phone,
    email,
    service,
    quantity: quantity || 1,
    urgency,
    price: price || 0,
    slot,
    status: "Booked",
    photoUrl: photoUrl || null,
    createdAt: new Date().toISOString(),
  };
  // Avoid duplicate slots for same customer
  const alreadyExists = existing.some(
    (l) => l.customerName === customerName && l.slot === slot
  );
  if (!alreadyExists) {
    localStorage.setItem("lutz_leads", JSON.stringify([...existing, newLead]));
  }
}

// ── Parse price from bot reply text e.g. "Your estimate is €150" ────
function parsePriceFromReply(text) {
  const match = text.match(/€\s*(\d+(?:[.,]\d+)?)/);
  if (!match) return 0;
  return parseFloat(match[1].replace(",", ".")) || 0;
}
// ────────────────────────────────────────────────────────────────────

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  const [step, setStep] = useState("name");
  const [service, setService] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [input, setInput] = useState("");
  const [quantity, setQuantity] = useState(null);
  const [urgency, setUrgency] = useState("normal");
  const [price, setPrice] = useState(0); // ← parsed from backend reply
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  // ── Photo upload state ──
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 Welcome to Lutz Electrical. What is your name?",
    },
  ]);

  const services = [
    "Socket installation",
    "Light installation",
    "Wiring",
    "Inspection",
    "Emergency repair",
  ];

  const addMessage = (msg) => setMessages((prev) => [...prev, msg]);

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (step === "name" || step === "phone" || step === "email") {
      inputRef.current?.focus();
    }
  }, [step]);

  const handleSubmitInput = () => {
    if (!input.trim()) return;
    if (step === "name") handleName(input);
    else if (step === "phone") handlePhone(input);
    else if (step === "email") handleEmail(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmitInput();
  };

  // ── STEP HANDLERS ──────────────────────────────────────────────────

  const handleName = (value) => {
    setCustomerName(value);
    addMessage({ sender: "user", text: value });
    addMessage({ sender: "bot", text: "What is your phone number?" });
    setStep("phone");
  };

  const handlePhone = (value) => {
    setPhone(value);
    addMessage({ sender: "user", text: value });
    addMessage({ sender: "bot", text: "What is your email?" });
    setStep("email");
  };

  const handleEmail = (value) => {
    if (!isValidEmail(value)) {
      addMessage({ sender: "bot", text: "Please enter a valid email address." });
      return;
    }
    setEmail(value);
    addMessage({ sender: "user", text: value });
    addMessage({ sender: "bot", text: "What service do you need?" });
    setStep("service");
  };

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

    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName,
        phone,
        email,
        service,
        quantity,
        urgency: u,
        message: `${service} ${quantity || 1} ${u}`,
      }),
    });

    const data = await res.json();
    addMessage({ sender: "bot", text: data.reply });

    // ── Parse price out of the reply and store it ──────────────────
    const parsedPrice = parsePriceFromReply(data.reply);
    setPrice(parsedPrice);
    // ───────────────────────────────────────────────────────────────

    addMessage({
      sender: "bot",
      text: "📷 Would you like to send a photo? (e.g. your electrical board). This is completely optional.",
    });
    setStep("photo");
  };

  // ── PHOTO HANDLERS ─────────────────────────────────────────────────

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      addMessage({ sender: "bot", text: "Please select an image file (JPG, PNG, etc.)." });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      addMessage({ sender: "bot", text: "Image is too large. Please choose one under 10MB." });
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoUrl(null);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "lutz-electrical");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );
    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    return data.secure_url;
  };

  const handlePhotoSubmit = async () => {
    if (!photoFile) return;
    setPhotoUploading(true);
    addMessage({ sender: "user", text: `📎 Photo: ${photoFile.name}` });
    try {
      const url = await uploadToCloudinary(photoFile);
      setPhotoUrl(url);
      addMessage({ sender: "bot", text: "✅ Photo uploaded! We'll use it to better prepare for your visit." });
    } catch {
      addMessage({ sender: "bot", text: "⚠️ Photo upload failed. You can still book without it." });
    } finally {
      setPhotoUploading(false);
      setStep("final");
      addMessage({ sender: "bot", text: "Would you like to book an appointment?" });
    }
  };

  const handleSkipPhoto = () => {
    addMessage({ sender: "user", text: "Skip photo" });
    setStep("final");
    addMessage({ sender: "bot", text: "No problem! Would you like to book an appointment?" });
  };

  // ── BOOKING ────────────────────────────────────────────────────────

  const handleBooking = async () => {
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `${service} ${quantity || 1} ${urgency}`,
      }),
    });
    const data = await res.json();
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Please choose a slot", slots: data.slots || [] },
    ]);
    setSelectedDay(null);
    setStep("booked");
  };

  const handleSlotSelect = async (slot) => {
    if (bookingLoading) return;
    setBookingLoading(true);

    const formattedSlot = new Date(slot).toLocaleString("en-DE", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

    addMessage({ sender: "user", text: formattedSlot });

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "book_slot",
          slot,
          customerName,
          phone,
          email,
          service,
          quantity,
          urgency,
          photoUrl: photoUrl || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        if (res.status === 409) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.slots
                ? { ...msg, slots: msg.slots.filter((s) => s !== slot) }
                : msg
            )
          );
          setSelectedDay(null);
        }
        addMessage({ sender: "bot", text: data.reply || "Booking failed. Please try again." });
        return;
      }

      // ── Save the confirmed lead to localStorage so AdminDashboard picks it up ──
      saveLeadToStorage({
        customerName,
        phone,
        email,
        service,
        quantity,
        urgency,
        price,       // ← the number we parsed from the backend reply
        slot,
        photoUrl: photoUrl || null,
      });
      // ──────────────────────────────────────────────────────────────────────────

      addMessage({
        sender: "bot",
        text: `✅ Appointment Confirmed\n\n📅 ${formattedSlot}\n\n👤 ${customerName}\n🔧 ${service}\n\nA confirmation email will be sent shortly.`,
      });

      setStep("final_done");
    } catch (err) {
      console.error(err);
      addMessage({ sender: "bot", text: "Booking failed. Please try again." });
    } finally {
      setBookingLoading(false);
    }
  };

  // ── RENDER ─────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* FLOATING BUTTON */}
      <div
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[9999] bg-yellow-400 text-black w-12 h-12 rounded-full flex items-center justify-center text-lg cursor-pointer shadow-xl hover:bg-yellow-300 transition"
      >
        ⚡
      </div>

      {/* CHAT WINDOW */}
      {open && (
        <div className="fixed bottom-20 right-6 z-[9999] w-[320px] h-[420px] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2.5 font-semibold flex items-center justify-between">
            <span>⚡ Lutz Electrical</span>
            <button onClick={() => setOpen(false)} className="text-black font-bold">✕</button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : ""}`}>
                <div
                  className={`px-4 py-2 rounded-2xl shadow text-sm max-w-[75%] animate-[fadeIn_0.25s_ease-out] ${
                    msg.sender === "user"
                      ? "bg-yellow-400 text-black"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <div style={{ whiteSpace: "pre-line" }}>{msg.text}</div>

                  {/* SLOT PICKER */}
                  {msg.slots && msg.slots.length > 0 && (() => {
                    const grouped = {};
                    [...new Set(msg.slots)].forEach((slot) => {
                      const dayLabel = new Date(slot).toLocaleString("en-DE", {
                        weekday: "short", month: "short", day: "numeric",
                      });
                      if (!grouped[dayLabel]) grouped[dayLabel] = [];
                      grouped[dayLabel].push(slot);
                    });
                    const days = Object.keys(grouped);

                    return (
                      <div className="mt-3 flex flex-col gap-2">
                        {!selectedDay && (
                          <>
                            <p className="text-xs text-gray-500 font-medium mb-1">Choose a day:</p>
                            <div className="flex flex-wrap gap-1.5">
                              {days.map((day, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setSelectedDay(day)}
                                  className="px-4 py-2 rounded-2xl text-xs font-semibold bg-white border border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 transition-all duration-200 shadow-sm"
                                >
                                  {day}
                                </button>
                              ))}
                            </div>
                          </>
                        )}

                        {selectedDay && (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <button
                                onClick={() => setSelectedDay(null)}
                                className="text-xs text-gray-400 hover:text-gray-600 underline"
                              >
                                ← Back
                              </button>
                              <p className="text-xs text-gray-500 font-medium">
                                {selectedDay} — choose a time:
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {grouped[selectedDay].map((slot, idx) => (
                                <button
                                  key={idx}
                                  disabled={bookingLoading}
                                  onClick={() => handleSlotSelect(slot)}
                                  className={`min-w-[72px] px-4 py-2 rounded-2xl text-xs font-semibold transition-all duration-200 shadow-sm border ${
                                    bookingLoading
                                      ? "bg-gray-300 text-gray-400 cursor-not-allowed border-gray-300"
                                      : "bg-yellow-400 text-black hover:bg-yellow-300 hover:scale-105 border-yellow-500"
                                  }`}
                                >
                                  {new Date(slot).toLocaleString("en-DE", { hour: "2-digit", minute: "2-digit" })}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* OPTIONS AREA */}
          <div className="p-2.5 border-t bg-white space-y-2">
            {(step === "name" || step === "phone" || step === "email") && (
              <div className="flex gap-2">
                <input
                  type="text"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    step === "name" ? "Enter your name"
                    : step === "phone" ? "Enter phone number"
                    : "Enter your email"
                  }
                  className="flex-1 border rounded-xl px-3 py-2 text-sm outline-none"
                />
                <button
                  onClick={handleSubmitInput}
                  className="bg-yellow-400 px-4 py-2 rounded-xl text-sm font-semibold"
                >
                  Send
                </button>
              </div>
            )}

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
              <div className="flex items-center gap-2 text-xs text-gray-500 px-2 py-1">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
                <span>Calculating price...</span>
              </div>
            )}

            {step === "photo" && (
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {photoPreview && (
                  <div className="relative w-full h-24 rounded-xl overflow-hidden border border-gray-200">
                    <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1"
                  >
                    📷 {photoFile ? "Change photo" : "Choose photo"}
                  </button>

                  {photoFile && !photoUploading && (
                    <button
                      onClick={handlePhotoSubmit}
                      className="bg-yellow-400 hover:bg-yellow-500 px-3 py-2 rounded-xl text-xs font-semibold transition"
                    >
                      Send
                    </button>
                  )}

                  {photoUploading && (
                    <div className="flex items-center gap-1 px-3 py-2 text-xs text-gray-400">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                      <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                    </div>
                  )}
                </div>

                {!photoUploading && (
                  <button
                    onClick={handleSkipPhoto}
                    className="text-xs text-gray-400 hover:text-gray-600 underline text-center"
                  >
                    Skip, no photo needed
                  </button>
                )}
              </div>
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
