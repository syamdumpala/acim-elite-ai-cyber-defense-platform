import { ingestAttack } from "./attackIngestion";
import { startLatencyMonitor, updateLatency } from "./latencyMonitor";

let socket = null;
let reconnectTimer = null;
let reconnectAttempts = 0;

const MAX_RECONNECT_ATTEMPTS = 10;
const BASE_DELAY = 2000;

export function initSocket(onMessage) {
  if (socket) return;
  connect(onMessage);
}

function connect(onMessage) {
  socket = new WebSocket("ws://localhost:8000/ws");

  socket.onopen = () => {
    console.log("🟢 ACIM WebSocket Connected");
    reconnectAttempts = 0;
    startLatencyMonitor(socket);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      // ----------------------------------
      // LATENCY PING RESPONSE
      // ----------------------------------
      if (data.type === "pong") {
        updateLatency();
        return;
      }

      // ----------------------------------
      // SYSTEM SNAPSHOT
      // ----------------------------------
      if (data.type === "SYSTEM_SNAPSHOT") {
        onMessage({
          type: "SYSTEM_SNAPSHOT",
          data: data.data
        });
        return;
      }

      // ----------------------------------
      // ATTACK / BURST EVENTS
      // ----------------------------------
      if (
        data.type === "ATTACK_EVENT" ||
        data.type === "BURST_EVENT"
      ) {
        const normalizedAttack = ingestAttack(data.attack);

        onMessage({
          type: data.type,
          attack: normalizedAttack,
          mode: data.mode,
          lockdown: data.lockdown,
          clusters: data.clusters,
          defense: data.defense
        });

        return;
      }

      // ----------------------------------
      // FALLBACK
      // ----------------------------------
      onMessage(data);

    } catch (error) {
      console.error("❌ WebSocket Parse Error:", error);
    }
  };

  socket.onerror = () => {
    console.error("⚠️ WebSocket Error");
    socket.close();
  };

  socket.onclose = () => {
    console.warn("🔴 WebSocket Disconnected");
    attemptReconnect(onMessage);
  };
}

function attemptReconnect(onMessage) {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error("❌ Max reconnect attempts reached");
    return;
  }

  reconnectAttempts++;

  const delay = BASE_DELAY * reconnectAttempts;

  reconnectTimer = setTimeout(() => {
    console.log(`🔄 Reconnecting... Attempt ${reconnectAttempts}`);
    socket = null;
    connect(onMessage);
  }, delay);
}

export function sendMessage(payload) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify(payload));
}

export function getSocket() {
  return socket;
}