class Notifier {
  handlers = [];

  constructor() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    const port = window.location.port;
    this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
    this.socket.onmessage = async (msg) => {
      try {
        const raw = typeof msg.data === 'string' ? msg.data : await msg.data.text();
        const event = JSON.parse(raw);
        this.handlers.forEach((handler) => handler(event));
      } catch {}
    };
  }

  broadcast(text) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ text }));
    }
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }

  removeHandler(handler) {
    this.handlers = this.handlers.filter((item) => item !== handler);
  }
}

const notifier = new Notifier();
export { notifier };
