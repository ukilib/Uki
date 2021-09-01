const { UkiInstance } = require('./client/UkiInstance');
const { getCurrentInstance } = require('vue') 

module.exports.Uki = (config) => {
  const ui = UkiInstance(config);

  if(config.setupParts) {
    ui.composition.setup = (props, context) => {
      (() => {
        getCurrentInstance().UkiInstance = ui;
      })();

      config.setupParts.forEach((item) => {
        ui.include(item, props, context);
      });

      return { ...ui.locals };
    };
  }

  if(config.parts) {
    config.parts.forEach((item) => {
      if(item.name) ui.composition.name = item.name;

      ui.composition.props = spread(ui.composition.props, item.props);
      ui.composition.components = spread(ui.composition.components, item.components);

      ui.composition.emits = ui.composition.emits.concat(item.emits);
    });

    config.parts.forEach((item) => {
      if(item.preset) ui.preinclude(item.preset);
    });

    ui.composition.setup = (props, context) => {
      (() => {
        getCurrentInstance().ukiInstance = ui;
      })();

      config.parts.forEach((item) => {
        ui.include(item.setup, props, context);
      });

      return { ...ui.locals };
    };
  }

  return ui.composition;
}

module.exports.getInstance = (functionName) =>{
  let result;

  try {
    result = getCurrentInstance().UkiInstance
  } catch(err) {
    if(err) throw new Error(`[Uki Error]: Cannot use ${functionName} outside of setup and hooks scopes.`)
  }

  return result;
}

module.exports.toLocal = (...args) => {
  let ui = this.getInstance('toLocal');
  return ui.toLocal(...args);
}

module.exports.local = (key) => {
  let ui = this.getInstance('local');
  return ui.local(key);
}

module.exports.toLimited = (...args) => {
  let ui = this.getInstance('toLimited');
  return ui.toLimited(...args);
}

module.exports.limited = (key) => {
  let ui = this.getInstance('limited');
  return ui.limited(key);
}

module.exports.limitedToLocal = (key) => {
  let ui = this.getInstance('limitedToLocal');
  return ui.limitedToLocal(key);
}

module.exports.globalToLocal = (key) => {
  let ui = this.getInstance('globalToLocal');
  return ui.globalToLocal(key);
}

module.exports.localOrGlobal = (key) => {
  let ui = this.getInstance('localOrGlobal');
  return ui.localOrGlobal(key);
};