# Uki

## Intro

The Uki library allows users to easily create multifile/multipart Vue 3 composition API components with state and store enhanced functions. The purpose of Uki is to facilitate feature separation, allowing for more simplistic and organized API structure.

## Creating a simple multifile Vue 3 composition API component

```js
// Your.js
// This will export a normal Vue 3 composition API object

import { ref } from 'vue'
export default {
  props: { 
    your: {
      type: String,
      default: 'Your'
    }
  },
  emits: ['your'],
  setup(props, context) {
    let your = ref(props.your)
    context.emit('your')
    return { your }
  },
};
```

```js
// Mom.js
// This will export a normal Vue 3 composition API object

import { ref } from 'vue'
export default {
  props: {
    mom: {
      type: String,
      default: 'Mom'
    }
  },
  emits: ['mom'],
  setup(props, context) {
    let mom = ref(props.mom)
    context.emit('mom')
    return { mom }
  },
};
```

```js
// App.vue 
// imports 'Your.js' and 'Mom.js' to join together in an exported Uki object
// the Object is returned as a single working Vue 3 composition API component built from the two individual components

<template>
{{ your }} {{ mom }}
</template>

<script>
import { Uki } from './Uki'
import your from './Your.js'
import mom from './Mom.js'

export default Uki({
  name: 'YourMom',
  parts: [your, mom]
});
</script>

// Output page will combine the two components to return "Your Mom" as a single component.
```

## Managing state and store with Uki

To share variables between parts/files of the same component you can use `local` and `limited` variables.
To share variables between different components you can use `global` variables.

To access these variables, you must first import them from Uki.

```js
import { 
  toLocal,
  local,
  toLimited,
  limited,
  limitedToLocal,
  toGlobal,
  global,
  globalToLocal,
} from './Uki'
```

### Scope limitations 

Please note that functions related to `local` and `limited` variables can only be called from `setup()` and hooks scopes inside Vue 3 composition API components due to use of `getCurrentInstance()` Vue function, which has such limitation. 

If you need `local` or `limited` variables inside another scope, pass them through the correct scope.

A Easier way to access functions related to `local` and `limited` variables from anywhere inside the component can be found in the [Accessing the Uki instance object](#accessing-the-uki-instance-object) section.

### Local variables

Local variables can be accessed from any part/file of the component or from within the template.

```js
// Declare a ref local variable
toLocal('varName', ref('value'))

// Accessing a ref local variable indirectly
let myVar = local('varName');
console.log(myVar.value); 

// Changing a ref local variable indirectly
myVar.value = 'new value'

// Accessing a ref local variable directly
console.log(local('varName').value) 

// Changing a ref local variable directly
local('varName').value = 'new value'

// Declaring/accessing a ref local variable indirectly
let myVar = toLocal('varName', ref('value'))

// Declaring/accessing a ref local variable directly
console.log(toLocal('varName', ref('value')).value)
// or
toLocal('varName', ref('value')).value = 'new value'
```

```html
<!-- To access variable from the template -->
{{ varName }}
```

### Limited variables

Limited variables can be accessed from any part/file of the component, however, they can't be accessed by the template.

```js
// Declaring a ref limited variable
toLimited('varName', ref('value'))

// Accessing a ref limited variable indirectly
let myVar = limited('varName')
console.log(myVar.value)

// Changing a ref limited variable indirectly
myVar.value = 'new value'

// Accessing a ref limited variable directly
console.log(limited('varName').value)

// Changing a ref limited variable directly
limited('varName').value = 'new value'

// Declaring/accessing a ref limited variable indirectly
let myVar = toLimited('varName', ref('value'))

// Declaring/accessing a ref limited variable directly
console.log(toLimited('varName', ref('value')).value)
// or
toLimited('varName', ref('value')).value = 'new value'
```

In order to pass a `limited` variable to the template, you can pass it to a `local` variable:

```js
// Passing a limited variable to a local variable
toLocal('varName', limited('varName'))
// or 
limitedToLocal('varName')
```

### Global variables

Global variables can be accessed from any file/part of any component (global scope).

```js
// Declaring a ref global variable 
toGlobal('varName', ref('value'))

// Accessing a ref global variable indirectly
let myVar = global('varName')
console.log(myVar.value)

// Changing a ref global variable indirectly
myVar.value = 'new value'

// Accessing a ref global variable directly
console.log(global('varName').value)

// Changing a ref global variable directly
global('varName').value = 'new value'

// Declaring/Accessing a ref global variable indirectly
let myVar = toGlobal('varName', ref('value'))
console.log(myVar.value);

// Declaring/Accessing a ref global variable directly
console.log(toGlobal('varName', ref('value')).value)
//or
toGlobal('varName', ref('value')).value = 'new value'
```

In order to pass a `global` variable to the template, you can pass it to a `local` variable.

```js
// Passing a global variable to a local variable
toLocal('varName', global('varName'))
// or
globalToLocal('varName')
```

```html
<!-- To access variable from the template -->
{{ varName }}
```

### Accessing the Uki instance object

Each Vue component instance created by Uki has a Uki instance object attachted to it. By accessing this object, you have full access to the most of Uki functions from anywhere inside the `setup()` method with no scope limitations. Therefore, you can use it to save scope limitations, or avoid `import` statements.

To retrieve the Uki instance object, you must pass a third argument into the `setup()` method declaration:

```js
// Parameter Uki receives the Uki instance object.
setup(props, context, uki) {
  // ...
}
```

Then you can call any Uki function as a method of the Uki instance object, for example:

```js
setup(props, context, uki) {
  anotherScope = () => {
    uki.toLocal('varName', ref('value'))
  }
}
```
