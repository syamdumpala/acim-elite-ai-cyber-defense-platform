let latency = 0;
let lastPingTime = 0;
let interval = null;

export function startLatencyMonitor(socket) {
  if (interval) return;

  interval = setInterval(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    lastPingTime = Date.now();
    socket.send(JSON.stringify({ type: "ping" }));
  }, 5000);
}

export function updateLatency() {
  latency = Date.now() - lastPingTime;
}

export function getLatency() {
  return latency;
}