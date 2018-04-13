export class CounterResult {
    id: string;
    updated: string;
    counter: number;
    auxcounter: number;
    kind: string;

    constructor(orig: ICounterResult) {
        this.id = orig.id + "";
        this.updated = orig.updated;
        this.counter = orig.counter;
        this.auxcounter = orig.auxcounter;
        this.kind = orig.kind;
    }
}