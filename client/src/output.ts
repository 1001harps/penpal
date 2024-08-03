import { Device, fetchSample, Sample } from "@9h/lib";

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

export interface SynthParams {
  volume: number;
  sample: number;
  octave: number;
  filterCutoff: number;
  filterRes: number;
  filterEnvMod: number;
  attack: number;
  release: number;
}

export const initialSynthParams = {
  volume: 0.75,
  sample: 0,
  octave: 0.4,
  filterCutoff: 0.5,
  filterRes: 0,
  filterEnvMod: 0,
  attack: 0,
  release: 0.3,
};

export class SamplePlayer implements Device {
  // @ts-ignore
  context: AudioContext;
  samples: Sample[] = [];
  params: SynthParams = initialSynthParams;

  setParam(param: keyof SynthParams, value: number) {
    this.params[param] = value;
  }

  getSampleIndex() {
    return Math.floor(this.params.sample * (this.samples.length - 1));
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

  trigger(note: number, timestamp: number): void {
    const sample = this.samples[this.getSampleIndex()] as Sample;

    const env = new AttackReleaseEnv(this.context);
    env.attack = this.params.attack;
    env.release = this.params.release;

    // filter, TODO: replace this with something nicer
    const filter = this.context.createBiquadFilter();

    filter.type = "lowpass";
    filter.frequency.value = this.params.filterCutoff * 7000;
    filter.Q.value = this.params.filterRes * 30;

    // gain node
    const gainNode = this.context.createGain();
    gainNode.gain.value = 0.8 * this.params.volume * 1.5;

    env.gainNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.context.destination);

    env.trigger(timestamp);
    sample.play(env.gainNode, note, timestamp);
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
  trigger(
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

export interface DrumMachineParams {
  volume: number;
}

export const initialDrumMachineParams = {
  volume: 0.75,
};

export class SoundBankOutput implements Output {
  // @ts-ignore
  context: AudioContext;

  sampleMap: Sample[] = [];

  params = initialDrumMachineParams;

  setParam(param: keyof DrumMachineParams, value: number) {
    this.params[param] = value;
  }

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

  trigger(channel: number, note: number, timestamp: number, volume: number) {
    const sample = this.sampleMap[channel] as Sample;
    if (!sample) return;

    const gainNode = this.context.createGain();
    gainNode.gain.value = volume * this.params.volume;
    gainNode.connect(this.context.destination);

    sample.play(gainNode, note, timestamp);
  }
}
