# Spectrograph

A spectrograph web audio component

![Spectrograph Web Audio Component](https://raw.github.com/web-audio-components/spectrograph/master/example/screenshot.png)

## Installation

$ component install web-audio-components/spectrograph

## Example Usage

```javascript
var context = new (AudioContext || webkitAudioContext)()
  , buffer = context.createBufferSource()
  , Spectrograph = require("spectrograph")
  , spec = new Spectrograph(context, {
      canvas: canvasEl
    });

// Once the source has a buffer, it's routed through the spectrograph
buffer.connect(spec);
spec.connect(context.destination);

```

For further examples, see the example.

## API

### Spectrograph(context, options)

Instantiate a Spectrograph module. Expects an `AudioContext` as the first parameter.

**Options**

- `speed` Number in milliseconds on how often it should render out the spectrogram
- `range` Upper bound of frequency rendered (default: `11500`)
- `minH` Hue of the minimum amplitude value
- `minS` Saturation of the minimum amplitude value
- `minL` Lightness of the minimum amplitude value
- `maxH` Hue of the maximum amplitude value
- `maxS` Saturation of the maximum amplitude value
- `maxL` Lightness of the maximum amplitude value

### .connect(node)

Connect a Spectrograph module to an `AudioNode`.

### .disconnect()

Disconnect all outgoing connections from a Spectrograph module.


## License

MIT License, Copyright (c) 2013 Jordan Santell
