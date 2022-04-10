# wled
 npm package for controlling wled lights easily.

```ts
// New WLED instance
const myLamp = new WLED("ip_adress");

// New preset instance
const myPreset = new Preset({presetJsonFromWledPanel})

// Get state from lamp
myLamp.getState().then(data => { console.log(data) });

// Get info from lamp (true -> return raw data, false -> return reorganized data (default false))
myLamp.getInfo(true).then(data => { console.log(data) });

// Get effects list from lamp
myLamp.getEffects().then(data => { console.log(data) });

// Get palettes list from lamp
myLamp.getPalettes().then(data => { console.log(data) });

// Turn lamp on
myLamp.setOn(true);

// Check if lamp is on
myLamp.isOn().then(data => { console.log(data) });

// Set brightness to 128
myLamp.setBrightness(128);

// Returns current brightness
myLamp.getBrightness().then(data => { console.log(data) });

// Set transition duration to 700ms
myLamp.setTransitionDuration(7);

// Get transition duration
myLamp.getTransitionDuration().then(data => { console.log(data) });

// Set current preset to id 3
myLamp.setActivePreset(3);

// Get current preset id
myLamp.getActivePreset().then(data => { console.log(data) });

// Save current state to preset id 3
myLamp.savePreset(3);

// Play playlist
myLamp.setPlaylistPlay(true);

// Check if playlist is playing
myLamp.isPlaylistPlay().then(data => { console.log(data) });

// Set nightlight on
myLamp.setNightlightOn(true);

// Check if nightlight is on
myLamp.isNightlightOn().then(data => { console.log(data) });

// Set nightlight duration to 7 minutes
myLamp.setNightlightDuration(7)

// Get nightlight duration
myLamp.getNightlightDuration().then(data => { console.log(data) });

// Set nightlight mode (instant, fade, color_fade, sunrise)
myLamp.setNightlightMode("fade");

// Get nightlight mode (name -> return name, id -> return id)
myLamp.getNightlightMode("name").then(data => { console.log(data) });

// Set nightlight brightness
myLamp.setNightlightBrightness(128);

// Get nightlight brightness
myLamp.getNightlightBrightness().then(data => { console.log(data) });

// lamp reboot
myLamp.restart();

// Set lamp color
myLamp.setColor([255,0,0]);
myLamp.setColor([255,0,0], [0,255,0]);
myLamp.setColor([255,0,0], [0,255,0], [0,0,255]);

// Set chosen leds color
myLamp.setLedColor([2,[255,0,0]]) // Led 2 to red
myLamp.setLedColor([2,5,[255,0,0]]) // Leds between 2 and 5 to red

// Starts new playlist
myLamp.setPlaylist(presetsIds, durations, transistionTimes, repeat, end );

// Set saved preset to current state
myLamp.setPreset(myPreset);

// Set effect
myLamp.setEffect(id);
myLamp.setEffect(~); // Effect 1 up
myLamp.setEffect(~-); // Effect 1 down
myLamp.setEffect("r"); // Random effect

// Set effect speed
myLamp.setEffectSpeed(128);

// Set effect intensity
myLamp.setEffectIntensity(128);

// Set palette
myLamp.setPalette(id);
myLamp.setPalette(~); // Effect 1 up
myLamp.setPalette(~-); // Effect 1 down
myLamp.setPalette("r"); // Random palette

// Custom api calls
myLamp.exec({"message": "hello world"});
```