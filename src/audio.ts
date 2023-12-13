export const fetchSample = (context: AudioContext, path: string, name: string) => {
  return new Promise<{ buffer: AudioBuffer; name: string }>((resolve, reject) =>
    fetch(path)
      .then((r) => r.arrayBuffer())
      .then((buffer) => context.decodeAudioData(buffer))
      .then((buffer) => resolve({ buffer, name }))
      .catch((err) => reject(err))
  );
};

export class Sample {
  context: AudioContext;
  name: string;
  buffer: AudioBuffer;

  constructor(context: AudioContext, name: string, buffer: AudioBuffer) {
    this.context = context;
    this.name = name;
    this.buffer = buffer;
  }

  play(destination: AudioNode, note: number, time: number) {
    const source = this.context.createBufferSource();
    source.buffer = this.buffer;

    const rootFrequency = midiNoteToFrequency(60);
    const targetFrequency = midiNoteToFrequency(note);

    const rate = targetFrequency / rootFrequency;
    source.playbackRate.value = rate;

    source.connect(destination);
    source.start(time);
  }
}

export const midiNoteToFrequency = (note: number) => {
  const a4 = 69;
  return 440 * Math.pow(2, (note - a4) / 12);
};
