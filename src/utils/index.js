module.exports.Globals = {};

module.exports.put = (container, content, key) => {
  container[key] = content;
  return container;
}

module.exports.spread = (container, content) => {
  container = { ...container, ...content };
  return container; 
}

module.exports.extractArgs = (args) => {
  let key = undefined;
  let obj;

  if(args.length === 1) obj = args[0];
  else if (args.length === 2) {
    key = args[0];
    obj = args[1];
  }

  return { key, obj };
}

module.exports.keySwitch = (args, withoutKey, withKey) => {
  let { key, obj } = this.extractArgs(args);

  if(key) { return withKey(key, obj)}
  else return withoutKey(obj);
}

module.exports.toGlobal = (...args) => {
  return this.keySwitch(
    args, (obj) => {
      this.Globals = this.spread(this.Globals, obj);
      return obj;
    }, 
    (key, obj) => {
      this.Globals = this.put(this.Globals, obj, key);
      return obj;
    },
  );
}

module.exports.global = (key) => {
  let obj;
  if(key in this.Globals) obj = this.Globals[key];
  else throw new Error(`[Uki Error]: Key ${key} does not exist in 'global' method.`);

  return obj;
}