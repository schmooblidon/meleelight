# requestAnimationFrame 
## Introduction ##

requestAnimationFrame polyfill by Paul Irish & Erik Möller.  
This is just a AMD-modularized bower-ready fork.  



## Install ##


#### With bower: ####

``` 
bower install requestAnimationFrame
```


#### With src="requestAnimationFrame.js" ####


Inlude app/requestAnimationFrame.js into your html page

```html
<script src="[path_to_source]/requestAnimationFrame.js>"></script>
```

## Use ##

This is a polyfill, just use requestAnimationFrame as you would have.

### With amd
Point `requestAnimationFrame` to `[bower_components_path]/requestAnimationFrame/app/requestAnimationFrame.js` into your requirejs path config 
and load it with requirejs:  

```javascript
require(['requestAnimationFrame'], function( requestAnimationFrame ){

})
```



## Authors ##
* [Erik Möller]  
* [Paul Irish]  
* [Cyril Agosta](https://github.com/cagosta)


## License ##

[MIT License](http://www.opensource.org/licenses/mit-license.php)

