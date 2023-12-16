// @ts-check

let timerId = null;

self.onmessage = function (e) {
  switch (e.data.type) {
    case "start": {
      console.log("starting clock");
      timerId = setInterval(() => postMessage("tick"), e.data.lookaheadTimeMs);
      break;
    }
    case "stop": {
      console.log("stopping clock");
      clearInterval(timerId);
      break;
    }
  }
};
