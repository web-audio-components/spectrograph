var interpolate = require('interpolate-color');

function Spectrograph (context, opts) {
  // Defaults
  opts = opts || {};
  var p = this.meta.params;
  var module = this;

  this.input = this.output =context.createAnalyser();
  this.processor = context.createScriptProcessor(256, 1, 1);

  this.fft = new Uint8Array(this.input.frequencyBinCount);

  'speed range minH minS minL maxH maxS maxL'.split(' ').forEach(function (prop) {
    module[prop] = opts[prop] || p[prop].defaultValue;
  });

  try {
    this.ctx = opts.canvas.getContext('2d');
  } catch (e) {
    throw new Error('Spectrograph must have a valid canvas element');
  }

  this.h = opts.canvas.height;
  this.w = opts.canvas.width;

  this.input.connect(this.processor);
  this.processor.onaudioprocess = function loop () {
    module.input.getByteFrequencyData(module.fft);
    process(module);
  };
}

function process (mod) {
  var ctx = mod.ctx;
  var fft = mod.fft;
  var range = mod.range / 22100 * fft.length;
  var data = ctx.getImageData(0, 0, mod.w, mod.h);
  ctx.putImageData(data, -mod.speed, 0);
  for (var i = 0; i <= range; i++) {
    ctx.fillStyle = interpolate(mod.minColor, mod.maxColor, fft[i] / 255);
    ctx.fillRect(
      mod.w - mod.speed,
      ~~(mod.h - (mod.h / range * i)),
      mod.speed,
      Math.ceil(mod.h / range) || 1
    );
  }
}

var spectrographProperties = {
  connect: {
    value: function (dest) {
      this.output.connect(dest.input ? dest.input : dest);
      this.processor.connect(dest.input ? dest.input : dest);
    }
  },

  disconnect: {
    value: function () {
      this.output.disconnect();
      this.processor.disconnect();
      this.output.connect(this.processor);
    }
  },

  /**
   * Module parameter metadata.
   */

  meta: {
    value: {
      name: "spectrograph",
      type: "tool",
      params: {
        speed: {
          min: 1,
          max: 20,
          defaultValue: 1,
          type: "int",
          description: "How many ms between each FFT update"
        },
        range: {
          values: [5625, 8000, 11250, 22500],
          defaultValue: 11250,
          type: "enum",
          description: "Max frequency of the analysis"
        },
        minH: {
          min: -360,
          max: 360,
          defaultValue: -85,
          type: "int",
          description: "Hue of the minimum amplitude value"
        },
        minS: {
          min: 0,
          max: 100,
          defaultValue: 50,
          type: "int",
          description: "Saturation of the minimum amplitude value"
        },
        minL: {
          min: 0,
          max: 100,
          defaultValue: 10,
          type: "int",
          description: "Lightness of the minimum amplitude value"
        },
        maxH: {
          min: -360,
          max: 360,
          defaultValue: 50,
          type: "int",
          description: "Hue of the maximum amplitude value"
        },
        maxS: {
          min: 0,
          max: 100,
          defaultValue: 100,
          type: "int",
          description: "Saturation of the maximum amplitude value"
        },
        maxL: {
          min: 0,
          max: 100,
          defaultValue: 100,
          type: "int",
          description: "Lightness of the maximum amplitude value"
        }
      }
    }
  }
};

'minH minS minL maxH maxS maxL'.split(' ').forEach(function (prop) {
  spectrographProperties[prop] = {
    enumerable: true,
    get: function () { return this['_' + prop]; },
    set: function (val) {
      this['_' + prop] = val;
      this.minColor = 'hsl(' +
        this.minH + ', ' + this.minS + '%, ' + this.minL + '%)';
      this.maxColor = 'hsl(' +
        this.maxH + ', ' + this.maxS + '%, ' + this.maxL + '%)';
    }
  }
});

Spectrograph.prototype = Object.create(null, spectrographProperties);

/**
 * Exports.
 */

module.exports = Spectrograph;
