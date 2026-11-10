const chat =
  document.getElementById("chat");

const messageInput =
  document.getElementById("message");

const sendButton =
  document.getElementById("send");

function addMessage(
  message,
  type
) {

  const div =
    document.createElement("div");

  div.className =
    `message ${type}`;

  div.innerHTML =
    message.replace(
      /\n/g,
      "<br>"
    );

  chat.appendChild(div);

  chat.scrollTop =
    chat.scrollHeight;
}

async function sendMessage() {

  const message =
    messageInput.value.trim();

  if (!message) {
    return;
  }

  addMessage(
    message,
    "user"
  );

  try {

    const response =
      await fetch(
        "http://localhost:3000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            sessionId: "demo",
            message
          })
        }
      );

    const data =
      await response.json();

    if (
      data.toolCalls &&
      data.toolCalls.length > 0
    ) {

      const tools =
        data.toolCalls
          .map(
            tool => {

              if (
                typeof tool ===
                "string"
              ) {
                return tool;
              }

              return (
                tool.name ??
                "tool"
              );

            }
          )
          .join(" → ");

      addMessage(
        `🔧 Herramientas ejecutadas:\n${tools}`,
        "agent"
      );

    }

    addMessage(
      data.reply,
      "agent"
    );

    if (
      data.needsConfirmation
    ) {

      addMessage(
        "⚠️ Confirmación requerida",
        "agent"
      );

    }

  } catch (error) {

    console.error(error);

    addMessage(
      "❌ Error conectando con la API",
      "agent"
    );

  }

  messageInput.value = "";

}

sendButton.addEventListener(
  "click",
  sendMessage
);

messageInput.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Enter"
    ) {

      sendMessage();

    }

  }
);