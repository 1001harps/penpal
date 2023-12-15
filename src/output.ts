import { Sample, fetchSample } from "./audio";

export default class AttackReleaseEnv {
  private context: AudioContext;
  private _attack: number = 0;
  private _release: number = 0.5;
  public gainNode: GainNode;
  constructor(context: AudioContext) {
    this.context = context;

    this.gainNode = this.context.createGain();
    this.gainNode.gain.value = 0;
  }
  trigger(timestamp: number) {
    this.gainNode.gain.cancelScheduledValues(0);
    this.gainNode.gain.value = 0;

    if (timestamp === 0) {
      timestamp = this.context.currentTime;
    }

    if (this._attack === 0) {
      this.gainNode.gain.setValueAtTime(0.3, timestamp);
    } else {
      this.gainNode.gain.linearRampToValueAtTime(0.3, timestamp + this.attack);
    }
    this.gainNode.gain.linearRampToValueAtTime(
      0,
      timestamp + this.attack + this.release
    );
  }
  get attack() {
    return this._attack;
  }
  set attack(value: number) {
    this._attack = value;
  }
  get release() {
    return this._release;
  }
  set release(value: number) {
    this._release = value;
  }
}

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
  currentSample: number = 0;

  filterCutoff = 0.5;
  filterRes = 0;
  attack = 0;
  release = 0.3;

  getSampleIndex() {
    return Math.floor(this.currentSample * (this.samples.length - 1));
  }

  async init(context: AudioContext): Promise<void> {
    this.context = context || new AudioContext();

    const samples = await Promise.all(
      ["synth", "synth2", "marimba", "bass", "piano", "epiano"].map(
        async (x) => {
          const sample = await fetchSample(
            this.context,
            `/samples/${x}.wav`,
            x
          );
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
    const sample = this.samples[this.getSampleIndex()] as Sample;

    const env = new AttackReleaseEnv(this.context);
    env.attack = this.attack;
    env.release = this.release;

    // filter, TODO: replace this with something nicer
    const filter = this.context.createBiquadFilter();

    filter.type = "lowpass";
    filter.frequency.value = this.filterCutoff * 7000;
    filter.Q.value = this.filterRes * 30;

    // gain node
    const gainNode = this.context.createGain();
    gainNode.gain.value = volume;

    env.gainNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.context.destination);

    env.trigger(timestamp);
    sample.play(env.gainNode, note, timestamp);
  }

  setCurrentSample(value: number) {
    this.currentSample = value;
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
      ["bd", "rs", "sd", "cp", "hh", "oh", "mt", "lt"].map(async (x) => {
        const sample = await fetchSample(
          this.context,
          `/samples/drums/${x}.wav`,
          x
        );
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
    this.sampleMap[1] = sampleTable["rs"];
    this.sampleMap[2] = sampleTable["sd"];
    this.sampleMap[3] = sampleTable["cp"];
    this.sampleMap[4] = sampleTable["hh"];
    this.sampleMap[5] = sampleTable["oh"];
    this.sampleMap[6] = sampleTable["mt"];
    this.sampleMap[7] = sampleTable["lt"];
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
