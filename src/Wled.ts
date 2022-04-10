// TODO: info.leds.lc & info.leds.seglc

import axios from "axios";
import { Preset } from "./Preset";

export class WLED {
    ip: string;
    private api: string;

    constructor(ip:string) {
        this.ip = ip;
        this.api = `http://${ip}/json`;
    };

    private checkValue(name:string = "value", value: number, min:number = 1, max:number = 255) {
        if (value > max || value < min) {
            throw new Error(`${name} must be between ${min} and ${max}. You provided ${value}.`);
            return false;
        }
        else return true;
    };

    async getState() {
        const {data} = await axios.get(this.api + "/state");
        return data;
    };

    async getInfo(raw: boolean = false) {
        const {data} = await axios.get(this.api + "/info");
        if (raw) return data;
        else {
            let ledsType: string;
            if (data.leds.lc == 0) ledsType = "RGB";
            else if (data.leds.lc == "1") ledsType = "RGBW";
            else if (data.leds.lc == 2) ledsType = "CCT";
            else if (data.leds.lc == 3) ledsType = "White";

            const newData = {
                "version": data.ver,
                "buildId": data.vid,
                "leds": {
                    "count": data.leds.count,
                    "fps": data.leds.fps,
                    "CureentPowerUsage": data.leds.pwr,
                    "maxPowerBudget": data.leds.maxpwr,
                    "maxSegments": data.leds.maxseg,
                    "type": ledsType,
                    "segmentsType": data.leds.seglc
                },
                "syncReciveSend": data.str,
                "name": data.name,
                "udpPort": data.udpport,
                "isLive": data.live,
                "realtimeDataSoruce": {
                    "info": data.lm,
                    "ip": data.lip
                },
                "connectedWebSocketsCount": data.ws,
                "numberOfEffects": data.fxcount,
                "numberOfPalletes": data.palcount,
                "wifi": data.wifi,
                "fileSystem": {
                    "estimateSpace": data.fs.u,
                    "totalSpace": data.fs.t,
                    "lastModificationUnix": data.fs.pmt
                },
                "numberOfOtherWleds": data.ndc,
                "platfromName": data.arch,
                "coreVersion": data.core,
                "freeHeapMemoryAvaible": data.freeheap,
                "uptime": data.uptime,
                "brand": data.brand,
                "productName": data.product,
                "macAdress": data.mac,
                "ip": this.ip
            };
            return newData;
        }
    };

    async getEffects() {
        const {data} = await axios.get(this.api + "/eff");
        return data;
    };

    async getPalettes() {
        const {data} = await axios.get(this.api + "/pal");
        return data;
    };

    async setOn(state: boolean) {
        await axios.post(this.api, {"on": state});
    };

    async isOn(): Promise<boolean> {
        return this.getState().then(data => data.on);
    };

    async setBrightness(brightness: number) {
        if (this.checkValue("Brightness", brightness)) await axios.post(this.api, {"bri": brightness});
    };

    async getBrightness(): Promise<number> {
        return this.getState().then(data => data.bri);
    };

    async setTransitionDuration(duration: number) {
        if (this.checkValue("Transistion duration", duration)) await axios.post(this.api, {"transistion": duration});
    };

    async getTransitionDuration(): Promise<number> {
        return this.getState().then(data => data.transistion);
    };

    async setActivePreset(presetId: number) {
        if (this.checkValue("Preset ID", presetId, -1, 65535)) await axios.post(this.api, {"ps": presetId});
    };

    async getActivePreset(): Promise<number> {
        return this.getState().then(data => data.ps);
    };

    async savePreset(positionId: number) {
        if (this.checkValue("Preset position ID", positionId, 1, 16)) await axios.post(this.api, {"psave": positionId});
    };

    async setPlaylistPlay(state: boolean) {
        if (state) await axios.post(this.api, {"pl": 0});
        else await axios.post(this.api, {"pl": -1});
    };

    async isPlaylistPlay(): Promise<boolean> {
        if (await this.getState().then(data => data.pl) == -1) return false;
        else return true;
    };

    async setNightlightOn(state: boolean) {
        await axios.post(this.api, {"nl": {"on": state} });
    };

    async isNightlightOn(): Promise<boolean> {
        return this.getState().then(data => data.nl.on);
    };

    async setNightlightDuration(duration: number) {
        if (this.checkValue("Nightlight duration", duration)) await axios.post(this.api, {"nl": {"dur": duration} });
    };

    async getNightlightDuration(): Promise<number> {
        return this.getState().then(data => data.nl.dur);
    };

    async setNightlightMode(mode: string | number) {
        if (typeof(mode) == "string") {
            if (mode == "instant") mode = 0;
            else if (mode == "fade") mode = 1;
            else if (mode == "color fade" || mode == "color_fade" || mode == "colorFade") mode = 2;
            else if (mode == "sunrise") mode = 3;
        } else if (typeof(mode) == "number") {
            this.checkValue("Nightlight mode", mode, 0, 3);
        }

        await axios.post(this.api, {"nl": {"mode": mode }})
    };

    async getNightlightMode(returnType: string = "name"): Promise<string | number> {
        if (returnType != "name" && returnType != "id") throw new Error("Incorrect return type!");
        const mode = this.getState().then(data => data.nl.mode);
        const modeNumber: number = await mode
        if (returnType == "name") {
            if (modeNumber == 0) return "instant";
            else if (modeNumber == 1) return "fade";
            else if (modeNumber == 2) return "color fade";
            else if (modeNumber == 3) return "sunrise";
        } else if (returnType == "id") return mode;

    };

    async setNightlightBrightness(brightness: number) {
        if (this.checkValue("Nightlight brightness", brightness)) await axios.post(this.api, {"nl": {"tbri": brightness} });
    };

    async getNightlightBrightness(): Promise<number> {
        return this.getState().then(data => data.nl.tbri);
    };

    async getNightlightRemaningTime(): Promise<number> {
        return this.getState().then(data => data.nl.rem);
    };

    async restart() {
        await axios.post(this.api, {"rb": true });
    };
    
    async setColor(color1: number[] = [255,255,255], color2?: number[], color3?: number[], ) {
        if (!color2 && !color3) await axios.post(this.api, { "seg": [{"col":[color1]}] } );
        else if (!color3) await axios.post(this.api, { "seg": [{"col":[color1, color2]}] } );
        else await axios.post(this.api, { "seg": [{"col":[color1, color2, color3]}] } );
    };

    async setLedColor(colors: any, reset: boolean = false) {
        if (reset) await axios.post(this.api, { "seg": [{"col":[[0,0,0],[0,0,0],[0,0,0]]}] } );
        await axios.post(this.api, { "seg": [{"i":colors}] } );
    };

    async setPlaylist(presetsIds: number[], durations?: number[], transistionTimes?: number[], reapeat?: number, end?: number, ) {
        await axios.post(this.api, { "playlist": {
                "ps": presetsIds,
                "dur": durations,
                "transistion": transistionTimes,
                "repeat": reapeat,
                "end": end
            }
        } );
    };

    async setPreset(preset: Preset) {
        await axios.post(this.api, {
            "on": preset.on,
            "bri": preset.bri,
            "transistion": preset.transistion,
            "mainseg": preset.mainseg,
            "seg": preset.seg
        });
    };
    
    async setEffect(id: string | number) {
        if (typeof(id) == "string") {
            if (id == "~" || id == "~-" || id == "r") await axios.post(this.api, { "seg": [{"fx":id}] } );
        } else await axios.post(this.api, { "seg": [{"fx":id}] } );
    }

    async setEffectSpeed(speed: number) {
        if (this.checkValue("Effect speed", speed)) await axios.post(this.api, { "seg": [{"sx":speed}] } );
    }

    async setEffectIntensity(intensity: number) {
        if (this.checkValue("Effect intensity", intensity)) await axios.post(this.api, { "seg": [{"ix":intensity}] } );
    }

    async setPalette(id: string | number) {
        if (typeof(id) == "string") {
            if (id == "~" || id == "~-" || id == "r") await axios.post(this.api, { "seg": [{"pal":id}] } );
        } else await axios.post(this.api, { "seg": [{"pal":id}] } );
    }

    async exec(data: any) {
        await axios.post(this.api, data);
    };
};