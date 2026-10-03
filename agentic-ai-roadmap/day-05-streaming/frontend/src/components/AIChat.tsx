import { useState } from "react";

const API_URL = "http://localhost:5000";

export default function AIChat() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!message.trim() || loading) {
      return;
    }

    setAnswer("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/ai/chat/stream`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate response");
      }

      if (!response.body) {
        throw new Error("Streaming is not supported");
      }

      const reader =
        response.body.getReader();

      const decoder = new TextDecoder();

      let buffer = "";

      while (true) {
        const { value, done } =
          await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, {
          stream: true,
        });

        const events = buffer.split("\n\n");

        buffer = events.pop() ?? "";

        for (const event of events) {
          if (!event.startsWith("data:")) {
            continue;
          }

          const json = event
            .replace(/^data:\s*/, "")
            .trim();

          if (!json) {
            continue;
          }

          const parsed = JSON.parse(json);

          if (parsed.error) {
            throw new Error(parsed.error);
          }

          if (parsed.done) {
            continue;
          }

          if (parsed.text) {
            setAnswer((previous) => {
              return previous + parsed.text;
            });
          }
        }
      }
    } catch (error) {
      console.error(error);

      setAnswer(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>AI Programming Assistant</h1>

      <textarea
        value={message}
        onChange={(event) =>
          setMessage(event.target.value)
        }
        placeholder="Ask something..."
        rows={5}
      />

      <br />

      <button
        onClick={sendMessage}
        disabled={loading}
      >
        {loading ? "Generating..." : "Send"}
      </button>

      <div>
        {loading && !answer && (
          <p>Generating...</p>
        )}

        <p>{answer}</p>
      </div>
    </div>
  );
}