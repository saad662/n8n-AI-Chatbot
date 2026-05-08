import axios from "axios";

export const handleChat = async (req, res) => {
  try {
    const response = await axios.post(
      "https://lordlutz.app.n8n.cloud/webhook/chat",
      req.body,
    );

    return res.json(response.data);
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({
      reply: "Server error",
    });
  }
};
