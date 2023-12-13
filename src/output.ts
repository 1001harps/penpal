import { Sample, fetchSample } from "./audio";

interface Device {
  init(context?: AudioContext): Promise<void>;
  triggerNote(note: number, timestamp: number, volume?: number): void;
  noteOn(note: number, timestamp: number, volume?: number): void;
  noteOff(note: number, timestamp: number): void;
}

export class SamplePlayer implements Device {
  // @ts-ignore
  context: AudioContext;
  samples: Sample[] = [];
  // @ts-ignore
  currentSample: number = 2;

  async init(context: AudioContext): Promise<void> {
    this.context = context || new AudioContext();

    const samples = await Promise.all(
      ["synth", "synth2", "marimba", "bass", "piano", "epiano"].map(
        async (x) => {
          const sample = await fetchSample(this.context, `samples/${x}.wav`, x);
          return {
            name: sample.name,
            sample: new Sample(this.context, sample.name, sample.buffer),
          };
        }
      )
    );

    this.samples = samples.map((x) => x.sample);
  }

  triggerNote(note: number, timestamp: number, volume: number): void {
    const sample = this.samples[this.currentSample] as Sample;

    const gainNode = this.context.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(this.context.destination);

    sample.play(gainNode, note, timestamp);
  }

  noteOn(note: number, timestamp: number, volume?: number): void {
    throw new Error("Method not implemented.");
  }

  noteOff(note: number, timestamp: number): void {
    throw new Error("Method not implemented.");
  }
}

export interface OutputOptions {
  context?: AudioContext;
}

export interface Output {
  init(options: OutputOptions): Promise<void>;
  triggerNote(
    channel: number,
    note: number,
    timestamp: number,
    volume: number
  ): void;
}

// cute is the vibe, cute drums, fizzy, poppy, flutes etc
// piano, marimba, epiano, bass, brass,

// 0 simpler - piano
// 1
// 2
// 3
// 4 /simpler
// 5 synth
// 6
// 7
// 8
// 9 /synth
// a simpler - bd
// b sd
// c hh
// d clap
// e perc
// f perc

// analogue synth
// fm synth
// simpler - instrument mode
//
// drum synth
// simpler - drum mode
//
//

// some cute sounds! bells, pops, flute
// synth bloops
// cute groovebox
// webaudio light version thats just samples

// lofi, mp3, .flv, early internet, dial up, bad connection

export class SoundBankOutput implements Output {
  // @ts-ignore
  context: AudioContext;

  sampleMap: Sample[] = [];

  async init(options: OutputOptions = {}) {
    this.context = options.context || new AudioContext();

    const samples = await Promise.all(
      [
        "bd",
        "sd",
        "hh",
        "synth",
        "synth2",
        "marimba",
        "bass",
        "piano",
        "epiano",
      ].map(async (x) => {
        const sample = await fetchSample(this.context, `samples/${x}.wav`, x);
        return {
          name: sample.name,
          sample: new Sample(this.context, sample.name, sample.buffer),
        };
      })
    );

    const sampleTable: Record<string, Sample> = samples.reduce(
      (prev, { name, sample }) => {
        return { ...prev, [name]: sample };
      },
      {}
    );

    this.sampleMap[0] = sampleTable["bd"];
    this.sampleMap[1] = sampleTable["sd"];
    this.sampleMap[2] = sampleTable["hh"];
    this.sampleMap[13] = sampleTable["epiano"];
    this.sampleMap[14] = sampleTable["marimba"];
    this.sampleMap[15] = sampleTable["bass"];
  }

  triggerNote(
    channel: number,
    note: number,
    timestamp: number,
    volume: number
  ) {
    const sample = this.sampleMap[channel] as Sample;
    if (!sample) return;

    const gainNode = this.context.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(this.context.destination);

    sample.play(gainNode, note, timestamp);
  }
}
