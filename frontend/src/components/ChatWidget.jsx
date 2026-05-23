import { useState, useEffect, useRef } from "react";

// ─── CLOUDINARY CONFIG ──────────────────────────────────────────────
const CLOUDINARY_CLOUD_NAME = "dyjxikbhc";
const CLOUDINARY_UPLOAD_PRESET = "chatbot_upload";
// ────────────────────────────────────────────────────────────────────

// ─── SUPABASE CONFIG ─────────────────────────────────────────────────
const SUPABASE_URL = "https://cthzexnthkybvoebwyth.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aHpleG50aGt5YnZvZWJ3eXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyODM2ODksImV4cCI6MjA5NDg1OTY4OX0.5Bvz4L2EuQOnDCJwT08zJ2lls4RQv0RsnOo99ct5yII";
// ─────────────────────────────────────────────────────────────────────

// ── Save a new lead into Supabase ("leads" table) ───────────────────
async function saveLeadToSupabase({
  customerName,
  phone,
  email,
  address,
  service,
  quantity,
  urgency,
  price,
  slot,
  photoUrl,
}) {
  const newLead = {
    customer_name: customerName,
    phone,
    email,
    address,
    service,
    quantity: quantity || 1,
    urgency,
    price: price || 0,
    slot,
    status: "Booked",
    photo_url: photoUrl || null,
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(newLead),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Supabase insert failed:", err);
    throw new Error("Failed to save lead to Supabase");
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
  const [address, setAddress] = useState("");
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
      text: "Hallo 👋 Willkommen bei Lutz Electrical. Wie heißen Sie?",
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
    if (
      step === "name" ||
      step === "phone" ||
      step === "email" ||
      step === "address"
    ) {
      inputRef.current?.focus();
    }
  }, [step]);

  const handleSubmitInput = () => {
    if (!input.trim()) return;
    if (step === "name") handleName(input);
    else if (step === "phone") handlePhone(input);
    else if (step === "email") handleEmail(input);
    else if (step === "address") handleAddress(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmitInput();
  };

  // ── STEP HANDLERS ──────────────────────────────────────────────────

  const handleName = (value) => {
    setCustomerName(value);
    addMessage({ sender: "user", text: value });
    addMessage({ sender: "bot", text: "Wie lautet Ihre Telefonnummer?" });
    setStep("phone");
  };

  const handlePhone = (value) => {
    setPhone(value);
    addMessage({ sender: "user", text: value });
    addMessage({ sender: "bot", text: "Wie lautet Ihre E-Mail-Adresse?" });
    setStep("email");
  };

  const handleAddress = (value) => {
    setAddress(value);
    addMessage({ sender: "user", text: value });
    addMessage({
      sender: "bot",
      text: "Welche Dienstleistung benötigen Sie?",
    });
    setStep("service");
  };

  const handleEmail = (value) => {
    if (!isValidEmail(value)) {
      addMessage({
        sender: "bot",
        text: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      });
      return;
    }
    setEmail(value);
    addMessage({ sender: "user", text: value });
    addMessage({
      sender: "bot",
      text: "Wie lautet Ihre Straßenadresse?",
    });
    setStep("address");
  };

  const handleServiceSelect = (s) => {
    setService(s);
    addMessage({ sender: "user", text: s });

    if (s === "Inspection" || s === "Emergency repair") {
      setStep("urgency");
      addMessage({ sender: "bot", text: "Ist das dringend?" });
    } else {
      setStep("quantity");
      addMessage({ sender: "bot", text: "Wie viele Einheiten/Meter?" });
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

    const res = await fetch(
      "https://cthzexnthkybvoebwyth.supabase.co/functions/v1/chat",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          email,
          address,
          service,
          quantity,
          urgency: u,
          message: `${service} ${quantity || 1} ${u}`,
        }),
      },
    );

    const data = await res.json();
    addMessage({ sender: "bot", text: data.reply });

    // ── Parse price out of the reply and store it ──────────────────
    const parsedPrice = parsePriceFromReply(data.reply);
    setPrice(parsedPrice);
    // ───────────────────────────────────────────────────────────────

    addMessage({
      sender: "bot",
      text: "📷 Möchten Sie ein Foto senden? (z. B. von Ihrem Sicherungskasten). Dies ist völlig optional.",
    });
    setStep("photo");
  };

  // ── PHOTO HANDLERS ─────────────────────────────────────────────────

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      addMessage({
        sender: "bot",
        text: "Bitte wählen Sie eine Bilddatei aus (JPG, PNG usw.).",
      });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      addMessage({
        sender: "bot",
        text: "Das Bild ist zu groß. Bitte wählen Sie eines unter 10 MB.",
      });
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
      { method: "POST", body: formData },
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
      addMessage({
        sender: "bot",
        text: "✅ Foto hochgeladen! Wir verwenden es, um uns besser auf Ihren Termin vorzubereiten.",
      });
    } catch {
      addMessage({
        sender: "bot",
        text: "⚠️ Das Hochladen des Fotos ist fehlgeschlagen. Sie können trotzdem ohne Foto buchen.",
      });
    } finally {
      setPhotoUploading(false);
      setStep("final");
      addMessage({
        sender: "bot",
        text: "Möchten Sie einen Termin buchen?",
      });
    }
  };

  const handleSkipPhoto = () => {
    addMessage({ sender: "user", text: "Skip photo" });
    setStep("final");
    addMessage({
      sender: "bot",
      text: "Kein Problem! Möchten Sie einen Termin buchen?",
    });
  };

  // ── BOOKING ────────────────────────────────────────────────────────

  const handleBooking = async () => {
    const res = await fetch(
      "https://cthzexnthkybvoebwyth.supabase.co/functions/v1/chat",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_slots",
          customerName,
          phone,
          email,
          address,
          service,
          quantity,
          urgency,
          message: `${service} ${quantity || 1} ${urgency}`,
        }),
      },
    );
    const data = await res.json();
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: "Bitte wählen Sie einen Termin aus",
        slots: data.slots || [],
      },
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
      const res = await fetch(
        "https://cthzexnthkybvoebwyth.supabase.co/functions/v1/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "book_slot",
            slot,
            customerName,
            phone,
            email,
            address,
            service,
            quantity,
            urgency,
            photoUrl: photoUrl || null,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok || data.error) {
        if (res.status === 409) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.slots
                ? { ...msg, slots: msg.slots.filter((s) => s !== slot) }
                : msg,
            ),
          );
          setSelectedDay(null);
        }
        addMessage({
          sender: "bot",
          text: data.reply || "Booking failed. Please try again.",
        });
        return;
      }

      // Save the confirmed lead to Supabase
      // Save the confirmed lead to Supabase
      try {
        await saveLeadToSupabase({
          customerName,
          phone,
          email,
          address,
          service,
          quantity,
          urgency,
          price,
          slot,
          photoUrl: photoUrl || null,
        });
      } catch (saveErr) {
        console.error("Lead save error:", saveErr);
      }
      addMessage({
        sender: "bot",
        text: `✅ Termin bestätigt 📅 ${formattedSlot} 👤 ${customerName} 📍 ${address} 🔧 ${service} Eine Bestätigungs-E-Mail wird in Kürze gesendet.`,
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
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>

      {/* FLOATING BUTTON */}
      <div
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[9999] bg-yellow-400 text-black w-12 h-12 rounded-full flex items-center justify-center text-lg cursor-pointer shadow-xl hover:bg-yellow-300 transition"
      >
        ⚡
      </div>

      {/* MOBILE BACKDROP */}
      {open && (
        <div
          className="fixed inset-0 z-[9998] bg-black/40 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* CHAT WINDOW */}
      {open && (
        <div className="fixed bottom-0 left-0 right-0 h-[75%] sm:inset-auto sm:bottom-20 sm:right-6 sm:left-auto z-[9999] w-full sm:w-[320px] sm:h-[420px] bg-white shadow-2xl rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden border-0 sm:border sm:border-gray-200 [animation:slideUp_0.3s_ease-out] sm:[animation:none]">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2.5 font-semibold flex items-center justify-between">
            <span>⚡ Lutz Elektro</span>
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
                  className={`px-4 py-2 rounded-2xl shadow text-sm max-w-[75%] animate-[fadeIn_0.25s_ease-out] ${
                    msg.sender === "user"
                      ? "bg-yellow-400 text-black"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <div style={{ whiteSpace: "pre-line" }}>{msg.text}</div>

                  {/* SLOT PICKER */}
                  {msg.slots &&
                    msg.slots.length > 0 &&
                    (() => {
                      const grouped = {};
                      [...new Set(msg.slots)].forEach((slot) => {
                        const dayLabel = new Date(slot).toLocaleString(
                          "en-DE",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          },
                        );
                        if (!grouped[dayLabel]) grouped[dayLabel] = [];
                        grouped[dayLabel].push(slot);
                      });
                      const days = Object.keys(grouped);

                      return (
                        <div className="mt-3 flex flex-col gap-2">
                          {!selectedDay && (
                            <>
                              <p className="text-xs text-gray-500 font-medium mb-1">
                                Tag auswählen:
                              </p>
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
                                  ← Zurück
                                </button>
                                <p className="text-xs text-gray-500 font-medium">
                                  {selectedDay} — Uhrzeit auswählen:
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
                                    {new Date(slot).toLocaleString("en-DE", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
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
          <div className="p-2.5 pb-[max(10px,env(safe-area-inset-bottom))] border-t bg-white space-y-2">
            {(step === "name" ||
              step === "phone" ||
              step === "email" ||
              step === "address") && (
              <div className="flex gap-2">
                <input
                  type="text"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    step === "name"
                      ? "Geben Sie Ihren Namen ein"
                      : step === "phone"
                        ? "Telefonnummer eingeben"
                        : step === "email"
                          ? "E-Mail-Adresse eingeben"
                          : step === "address"
                            ? "Straßenadresse eingeben"
                            : ""
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
                  Dringend
                </button>
              </div>
            )}

            {step === "loading" && (
              <div className="flex items-center gap-2 text-xs text-gray-500 px-2 py-1">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
                  <span
                    className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <span
                    className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  />
                </div>
                <span>Preis wird berechnet...</span>
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
                    <img
                      src={photoPreview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
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
                      Senden
                    </button>
                  )}

                  {photoUploading && (
                    <div className="flex items-center gap-1 px-3 py-2 text-xs text-gray-400">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
                      <span
                        className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                      />
                      <span
                        className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      />
                    </div>
                  )}
                </div>

                {!photoUploading && (
                  <button
                    onClick={handleSkipPhoto}
                    className="text-xs text-gray-400 hover:text-gray-600 underline text-center"
                  >
                    Überspringen, kein Foto erforderlich
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
                  Termin buchen
                </button>
                <button>
                  <a
                    href="https://wa.me/4915757046360?text=Hi%20Lutz%20Electrical,%20I%20need%20help."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md transition duration-200"
                  >
                    Über WhatsApp sprechen
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
