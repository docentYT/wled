export class Preset {
    on: boolean = true;
    bri: number = 128;
    transition: number = 7;
    mainseg: number = 0;
    seg: any;

    constructor(json: any) {
        this.on = json.on;
        this.bri = json.bri;
        this.transition = json.transition;
        this.mainseg = json.mainseg;
        this.seg = json.seg;
    }
};