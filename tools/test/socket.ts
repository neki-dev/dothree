type Listener = {
  event: string
  callback: (data: any) => void
};

type Listeners = {
  client: Listener[]
  server: Listener[]
};

const listeners: Listeners = {
  client: [],
  server: [],
};

function emitateEvent(
  from: keyof Listeners,
  event: string,
  data: any,
) {
  listeners[from].filter((listener) => listener.event === event).forEach((listener) => {
    if (listener.callback) {
      listener.callback(data);
    }
  });
}

function addCallback(
  to: keyof Listeners,
  event: string,
  callback: (data: any) => void,
) {
  listeners[to].push({ event, callback });
}

function removeCallback(
  from: keyof Listeners,
  event: string,
  callback: (data: any) => void,
) {
  const i = listeners[from].findIndex((l) => (
    l.event === event && l.callback === callback
  ));
  if (i !== -1) {
    listeners[from].splice(i, 1);
  }
}

export default {
  id: 'FAKE_SOCKET_ID',

  // @ts-ignore
  emit(event: string, data: any) {
    emitateEvent('server', event, data);
  },

  emitSelf(event: string, data: any) {
    emitateEvent('client', event, data);
  },

  // @ts-ignore
  on(event: string, callback: (data: any) => void) {
    addCallback('client', event, callback);
  },

  // @ts-ignore
  off(event: string, callback: (data: any) => void) {
    removeCallback('client', event, callback);
  },

  hookEmit(event: string) {
    const fn = jest.fn();
    addCallback('server', event, fn);

    return fn;
  },
};
