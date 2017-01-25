# No Unguarded Global References

**TL;DR: Ensure that all global references to `window` and `document` are guarded inside an if block with the condition `environment.isBrowser()`**

Unguarded global references will break when used with the BPR. This is due to the Node environment
not having global `window` or `document` objects 

To protect against errors during server side rendering, you should ensure you're guarding the usages
of `window` or `document` with a check to `environment.isBrowser()`.

Example 1:

```js
import Ember from 'ember';

Ember.component.extend({
  init() {
    if (environment.isBrowser()) {
      this.element = document.querySelector('.my-element');
    }
  }
});
```

Example 2:

```js
import Ember from 'ember';

Ember.component.extend({
  init() {
    if (environment.isBrowser()) {
      this.location = window.location;
    }
  }
});
```
