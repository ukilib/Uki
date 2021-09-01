const { 
  keySwitch,
  spread,
  put,
  toGlobal,
  global,
  Globals,
} = require('../utils');

const globals = Globals;

module.exports.UkiInstance = (config) => {
  let ui = {
    constructor: function(config) {
      this.composition = {
        name: config ? (config.name ? config.name : "") : "",
        props: config ? (config.props ? config.props : {}) : {},
        components: config ? (config.components ? config.components : {}) : {},
        emits: config ? (config.emits ? config.emits : []) : [],
        setup: config ? (config.setup ? config.setup : () => {}) : () => {},
      };

      this.locals = {};
      this.limiteds = {};
    },

    toLocal: function(...args) {
      return keySwitch(
        args, (obj) => {
          this.locals = spread(this.locals, obj);
          return obj;
        },
        (key, obj) => {
          this.locals = put(this.locals, obj);
          return obj;
        },
      );
    },

    local: function(key) {
      let obj;

      if(key in this.locals) obj = this.locals[key];
      else throw new Error(`[Uki Error] Key ${key} does not exist in 'local' method.`);

      return obj;
    },

    toLimited: function(...args) {
      return keySwitch(
        args, (obj) => {
          this.limiteds = spread(this.limiteds, obj);
          return obj;
        },
        (key, obj) => {
          this.limiteds = put(this.limiteds, obj);
          return obj;
        },
      );
    },

    limited: function(key) {
      let obj;

      if(key in this.limiteds) obj = this.limiteds[key];
      else throw new Error(`[Uki Error] Key ${key} does not exist in 'limited' method.`);

      return obj;
    },

    toGlobal: function(...args) {return toGlobal(...args)},
    global: function(key) {return global(key)},

    limitedToLocal: function(key) {
      let obj;

      if(key in globals) {
        obj = this.limited[key];
        this.locals = put(this.locals, obj, key);
      } else throw new Error(`[Uki Error]: Key ${key} does not exist in 'limitedToLocal' method.`);

      return obj;
    },

    globalToLocal: function(key) {
      let obj;

      if(key in globals) {
        obj = globals[key];
        this.locals = put(this.locals, obj, key);
      } else throw new Error(`[Uki Error]: Key ${key} does not exist in 'globalToLocal' method.`);

      return obj;
    },

    localOrGlobal: function(key) {
      let result;
      try {
        result = this.local(key);
      } catch(err) {
        try {
          result = this.limited(key);
        } catch(err) {
          result = this.global(key);
        }
      }
      return result;
    },

  }

  ui.constructor(config);
  ui.include = function(funct, props, context) {
    let returned = funct(props, context, ui)
    ui.locals = spread(ui.locals, returned);
  }

  ui.preinclude = function(funct) {funct(ui)}

  return ui;
};