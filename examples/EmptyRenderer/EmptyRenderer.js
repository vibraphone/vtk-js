/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _RenderWindow = __webpack_require__(1);

	var _RenderWindow2 = _interopRequireDefault(_RenderWindow);

	var _RenderWindow3 = __webpack_require__(34);

	var _RenderWindow4 = _interopRequireDefault(_RenderWindow3);

	var _Renderer = __webpack_require__(35);

	var _Renderer2 = _interopRequireDefault(_Renderer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var renWin = _RenderWindow4.default.newInstance();
	var ren = _Renderer2.default.newInstance();
	renWin.addRenderer(ren);
	ren.setBackground(0.7, 1.0, 0.7);

	var glwindow = _RenderWindow2.default.newInstance();
	glwindow.setContainer(document.querySelector('body'));
	glwindow.setRenderable(renWin);
	glwindow.traverseAllPasses();

	var animating = false;

	function animate() {
	  glwindow.traverseAllPasses();

	  if (animating) {
	    window.requestAnimationFrame(animate);
	  }
	}

	var button = document.createElement('button');
	button.setAttribute('type', 'input');
	button.innerHTML = 'start';
	document.getElementsByTagName('body')[0].appendChild(button);
	button.addEventListener('click', function () {
	  animating = !animating;
	  button.innerHTML = animating ? 'stop' : 'start';
	  if (animating) {
	    window.requestAnimationFrame(animate);
	  }
	});

	animate();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newInstance = undefined;
	exports.vtkOpenGLRenderWindow = vtkOpenGLRenderWindow;
	exports.extend = extend;

	var _macro = __webpack_require__(2);

	var macro = _interopRequireWildcard(_macro);

	var _ViewNodeFactory = __webpack_require__(3);

	var _ViewNodeFactory2 = _interopRequireDefault(_ViewNodeFactory);

	var _ShaderCache = __webpack_require__(32);

	var _ShaderCache2 = _interopRequireDefault(_ShaderCache);

	var _ViewNode = __webpack_require__(6);

	var _ViewNode2 = _interopRequireDefault(_ViewNode);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// ----------------------------------------------------------------------------
	// vtkOpenGLRenderWindow methods
	// ----------------------------------------------------------------------------

	function vtkOpenGLRenderWindow(publicAPI, model) {
	  // Set our className
	  model.classHierarchy.push('vtkOpenGLRenderWindow');

	  // Auto update style
	  function updateWindow() {
	    // Canvas size
	    if (model.renderable) {
	      model.canvas.setAttribute('width', model.size[0]);
	      model.canvas.setAttribute('height', model.size[1]);
	    }
	    // Offscreen ?
	    model.canvas.style.display = model.useOffScreen ? 'none' : 'block';

	    // Cursor type
	    if (model.el) {
	      model.el.style.cursor = model.cursorVisibility ? model.cursor : 'none';
	    }
	  }
	  publicAPI.onModified(updateWindow);

	  // Builds myself.
	  publicAPI.build = function (prepass) {
	    if (prepass) {
	      if (!model.renderable) {
	        return;
	      }

	      publicAPI.prepareNodes();
	      publicAPI.addMissingNodes(model.renderable.getRenderers());
	      publicAPI.removeUnusedNodes();
	    }
	  };

	  publicAPI.initialize = function () {
	    if (!model.initialized) {
	      model.context = publicAPI.get3DContext();
	      model.shaderCache.setContext(model.context);
	      model.initialized = true;
	    }
	  };

	  publicAPI.makeCurrent = function () {
	    model.context.makeCurrent();
	  };

	  publicAPI.frame = function () {};

	  // Renders myself
	  publicAPI.render = function (prepass) {
	    if (prepass) {
	      publicAPI.initialize();
	      model.children.forEach(function (child) {
	        child.setContext(model.context);
	      });
	    } else {
	      publicAPI.frame();
	    }
	  };

	  publicAPI.setContainer = function (el) {
	    if (model.el && model.el !== el) {
	      // Remove canvas from previous container
	      if (model.canvas.parentNode === model.el) {
	        model.el.removeChild(model.canvas);
	      } else {
	        console.log('Error: canvas parent node does not match container');
	      }
	    }

	    if (model.el !== el) {
	      model.el = el;
	      model.el.appendChild(model.canvas);

	      // Trigger modified()
	      publicAPI.modified();
	    }
	  };

	  publicAPI.isInViewport = function (x, y, viewport) {
	    var vCoords = viewport.getViewport();
	    var size = model.size;
	    if (vCoords[0] * size[0] <= x && vCoords[2] * size[0] >= x && vCoords[1] * size[1] <= y && vCoords[3] * size[1] >= y) {
	      return true;
	    }
	    return false;
	  };

	  publicAPI.getViewportSize = function (viewport) {
	    var vCoords = viewport.getViewport();
	    var size = model.size;
	    return [(vCoords[2] - vCoords[0]) * size[0], (vCoords[3] - vCoords[1]) * size[1]];
	  };

	  publicAPI.getViewportCenter = function (viewport) {
	    var size = publicAPI.getViewportSize(viewport);
	    return [size[0] * 0.5, size[1] * 0.5];
	  };

	  publicAPI.displayToNormalizedDisplay = function (x, y, z) {
	    return [x / (model.size[0] - 1), y / (model.size[1] - 1), z];
	  };

	  publicAPI.normalizedDisplayToDisplay = function (x, y, z) {
	    return [x * (model.size[0] - 1), y * (model.size[1] - 1), z];
	  };

	  publicAPI.get2DContext = function () {
	    return model.canvas.getContext('2d');
	  };

	  publicAPI.get3DContext = function () {
	    var options = arguments.length <= 0 || arguments[0] === undefined ? { preserveDrawingBuffer: true, premultipliedAlpha: false } : arguments[0];
	    return model.canvas.getContext('webgl', options) || model.canvas.getContext('experimental-webgl', options);
	  };
	}

	// ----------------------------------------------------------------------------
	// Object factory
	// ----------------------------------------------------------------------------

	var DEFAULT_VALUES = {
	  shaderCache: null,
	  initialized: false,
	  context: null,
	  canvas: null,
	  size: [300, 300],
	  cursorVisibility: true,
	  cursor: 'pointer'
	};

	// ----------------------------------------------------------------------------

	function extend(publicAPI, model) {
	  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  Object.assign(model, DEFAULT_VALUES, initialValues);

	  // Create internal instances
	  model.canvas = document.createElement('canvas');

	  // Inheritance
	  _ViewNode2.default.extend(publicAPI, model);

	  model.myFactory = _ViewNodeFactory2.default.newInstance();
	  model.shaderCache = _ShaderCache2.default.newInstance();

	  // Build VTK API
	  macro.get(publicAPI, model, ['shaderCache']);
	  macro.setGet(publicAPI, model, ['initialized', 'context']);

	  macro.setGetArray(publicAPI, model, ['size'], 2);

	  // Object methods
	  vtkOpenGLRenderWindow(publicAPI, model);
	}

	// ----------------------------------------------------------------------------

	var newInstance = exports.newInstance = macro.newInstance(extend);

	// ----------------------------------------------------------------------------

	exports.default = { newInstance: newInstance, extend: extend };

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.capitalize = capitalize;
	exports.obj = obj;
	exports.get = get;
	exports.set = set;
	exports.setGet = setGet;
	exports.getArray = getArray;
	exports.setArray = setArray;
	exports.setGetArray = setGetArray;
	exports.algo = algo;
	exports.event = event;
	exports.newInstance = newInstance;

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var globalMTime = 0;
	// ----------------------------------------------------------------------------
	// capitilze provided string
	// ----------------------------------------------------------------------------

	function capitalize(str) {
	  return str.charAt(0).toUpperCase() + str.slice(1);
	}

	// ----------------------------------------------------------------------------
	// vtkObject: modified(), onModified(callback), delete()
	// ----------------------------------------------------------------------------

	function obj(publicAPI) {
	  var model = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  var callbacks = [];
	  model.mtime = globalMTime;
	  model.classHierarchy = ['vtkObject'];

	  function off(index) {
	    callbacks[index] = null;
	  }

	  function on(index) {
	    function unsubscribe() {
	      off(index);
	    }
	    return Object.freeze({ unsubscribe: unsubscribe });
	  }

	  publicAPI.modified = function () {
	    if (model.deleted) {
	      console.log('instance deleted - can not call any method');
	      return;
	    }

	    model.mtime = ++globalMTime;
	    callbacks.forEach(function (callback) {
	      return callback && callback(publicAPI);
	    });
	  };

	  publicAPI.onModified = function (callback) {
	    if (model.deleted) {
	      console.log('instance deleted - can not call any method');
	      return null;
	    }

	    var index = callbacks.length;
	    callbacks.push(callback);
	    return on(index);
	  };

	  publicAPI.getMTime = function () {
	    return model.mtime;
	  };

	  publicAPI.isA = function (className) {
	    return model.classHierarchy.indexOf(className) !== -1;
	  };

	  publicAPI.getClassName = function () {
	    return model.classHierarchy.slice(-1)[0];
	  };

	  publicAPI.set = function () {
	    var map = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    Object.keys(map).forEach(function (name) {
	      if (Array.isArray(map[name])) {
	        publicAPI['set' + capitalize(name)].apply(publicAPI, _toConsumableArray(map[name]));
	      } else {
	        publicAPI['set' + capitalize(name)](map[name]);
	      }
	    });
	  };

	  publicAPI.get = function () {
	    for (var _len = arguments.length, list = Array(_len), _key = 0; _key < _len; _key++) {
	      list[_key] = arguments[_key];
	    }

	    if (!list) {
	      return model;
	    }
	    var subset = {};
	    list.forEach(function (name) {
	      subset[name] = model[name];
	    });
	    return subset;
	  };

	  publicAPI.delete = function () {
	    Object.keys(model).forEach(function (field) {
	      return delete model[field];
	    });
	    callbacks.forEach(function (el, index) {
	      return off(index);
	    });

	    // Flag the instance beeing deleted
	    model.deleted = true;
	  };
	}

	// ----------------------------------------------------------------------------
	// getXXX: add getters
	// ----------------------------------------------------------------------------

	function get(publicAPI, model, fieldNames) {
	  fieldNames.forEach(function (field) {
	    if ((typeof field === 'undefined' ? 'undefined' : _typeof(field)) === 'object') {
	      publicAPI['get' + capitalize(field.name)] = function () {
	        return model[field];
	      };
	    } else {
	      publicAPI['get' + capitalize(field)] = function () {
	        return model[field];
	      };
	    }
	  });
	}

	// ----------------------------------------------------------------------------
	// setXXX: add setters
	// ----------------------------------------------------------------------------

	var objectSetterMap = {
	  enum: function _enum(publicAPI, model, field) {
	    return function (value) {
	      if (typeof value === 'string') {
	        if (model.enum[value] !== undefined) {
	          if (model[field.name] !== model.enum[value]) {
	            model[field.name] = model.enum[value];
	            publicAPI.modified();
	            return true;
	          }
	          return false;
	        }
	        console.log('Set Enum with invalid argument', field, value);
	        return null;
	      }
	      if (typeof value === 'number') {
	        if (model[field.name] !== value) {
	          if (Object.keys(field.enum).map(function (key) {
	            return field.enum[key];
	          }).indexOf(value) !== -1) {
	            model[field.name] = value;
	            publicAPI.modified();
	            return true;
	          }
	          console.log('Set Enum outside range', field, value);
	        }
	        return false;
	      }
	      console.log('Set Enum with invalid argument (String/Number)', field, value);
	      return null;
	    };
	  }
	};

	function findSetter(field) {
	  if ((typeof field === 'undefined' ? 'undefined' : _typeof(field)) === 'object') {
	    var _ret = function () {
	      var fn = objectSetterMap[field.type];
	      if (fn) {
	        return {
	          v: function v(publicAPI, model) {
	            return fn(publicAPI, model, field);
	          }
	        };
	      }

	      console.error('No setter for field', field);
	    }();

	    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	  }
	  return function getSetter(publicAPI, model) {
	    return function setter(value) {
	      if (model.deleted) {
	        console.log('instance deleted - can not call any method');
	        return false;
	      }

	      if (model[field] !== value) {
	        model[field] = value;
	        publicAPI.modified();
	        return true;
	      }
	      return false;
	    };
	  };
	}

	function set(publicAPI, model, fields) {
	  fields.forEach(function (field) {
	    publicAPI['set' + capitalize(field)] = findSetter(field)(publicAPI, model);
	  });
	}

	// ----------------------------------------------------------------------------
	// set/get XXX: add both setters and getters
	// ----------------------------------------------------------------------------

	function setGet(publicAPI, model, fieldNames) {
	  get(publicAPI, model, fieldNames);
	  set(publicAPI, model, fieldNames);
	}

	// ----------------------------------------------------------------------------
	// getXXX: add getters for object of type array
	// ----------------------------------------------------------------------------

	function getArray(publicAPI, model, fieldNames) {
	  fieldNames.forEach(function (field) {
	    publicAPI['get' + capitalize(field)] = function () {
	      return [].concat(model[field]);
	    };
	  });
	}

	// ----------------------------------------------------------------------------
	// setXXX: add setter for object of type array
	// ----------------------------------------------------------------------------

	function setArray(publicAPI, model, fieldNames, size) {
	  fieldNames.forEach(function (field) {
	    publicAPI['set' + capitalize(field)] = function () {
	      for (var _len2 = arguments.length, array = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        array[_key2] = arguments[_key2];
	      }

	      if (model.deleted) {
	        console.log('instance deleted - can not call any method');
	        return;
	      }

	      var changeDetected = false;
	      model[field].forEach(function (item, index) {
	        if (item !== array[index]) {
	          if (changeDetected) {
	            return;
	          }
	          changeDetected = true;
	        }
	      });

	      if (changeDetected) {
	        model[field] = [].concat(array);
	        publicAPI.modified();
	      }
	    };
	  });
	}

	// ----------------------------------------------------------------------------
	// set/get XXX: add setter and getter for object of type array
	// ----------------------------------------------------------------------------

	function setGetArray(publicAPI, model, fieldNames, size) {
	  getArray(publicAPI, model, fieldNames);
	  setArray(publicAPI, model, fieldNames, size);
	}

	// ----------------------------------------------------------------------------
	// vtkAlgorithm: setInputData(), setInputConnection(), getOutput(), getOutputPort()
	// ----------------------------------------------------------------------------

	function algo(publicAPI, model, numberOfInputs, numberOfOutputs) {
	  model.inputData = [];
	  model.inputConnection = [];
	  model.output = [];

	  // Methods
	  function setInputData(dataset) {
	    var port = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	    if (model.deleted) {
	      console.log('instance deleted - can not call any method');
	      return;
	    }
	    model.inputData[port] = dataset;
	    model.inputConnection[port] = null;
	  }

	  function getInputData() {
	    var port = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

	    return model.inputData[port] || model.inputConnection[port]();
	  }

	  function setInputConnection(outputPort) {
	    var port = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	    if (model.deleted) {
	      console.log('instance deleted - can not call any method');
	      return;
	    }
	    model.inputData[port] = null;
	    model.inputConnection[port] = outputPort;
	  }

	  function getOutput() {
	    var port = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

	    if (model.deleted) {
	      console.log('instance deleted - can not call any method');
	      return null;
	    }
	    publicAPI.update();
	    return model.output[port];
	  }

	  function getOutputPort() {
	    var port = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

	    return function () {
	      return getOutput(port);
	    };
	  }

	  // Handle input if needed
	  if (numberOfInputs) {
	    // Reserve inputs
	    var count = numberOfInputs;
	    while (count--) {
	      model.inputData.push(null);
	      model.inputConnection.push(null);
	    }

	    // Expose public methods
	    publicAPI.setInputData = setInputData;
	    publicAPI.setInputConnection = setInputConnection;
	    publicAPI.getInputData = getInputData;
	  }

	  if (numberOfOutputs) {
	    publicAPI.getOutput = getOutput;
	    publicAPI.getOutputPort = getOutputPort;
	  }
	}

	// ----------------------------------------------------------------------------
	// Event handling: onXXX(callback), invokeXXX(args...)
	// ----------------------------------------------------------------------------

	function event(publicAPI, model, eventName) {
	  var callbacks = [];
	  var previousDelete = publicAPI.delete;

	  function off(index) {
	    callbacks[index] = null;
	  }

	  function on(index) {
	    function unsubscribe() {
	      off(index);
	    }
	    return Object.freeze({ unsubscribe: unsubscribe });
	  }

	  publicAPI['invoke' + capitalize(eventName)] = function () {
	    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	      args[_key3] = arguments[_key3];
	    }

	    if (model.deleted) {
	      console.log('instance deleted - can not call any method');
	      return;
	    }

	    callbacks.forEach(function (callback) {
	      return callback && callback.apply(publicAPI, args);
	    });
	  };

	  publicAPI['on' + capitalize(eventName)] = function (callback) {
	    if (model.deleted) {
	      console.log('instance deleted - can not call any method');
	      return null;
	    }

	    var index = callbacks.length;
	    callbacks.push(callback);
	    return on(index);
	  };

	  publicAPI.delete = function () {
	    previousDelete();
	    callbacks.forEach(function (el, index) {
	      return off(index);
	    });
	  };
	}

	// ----------------------------------------------------------------------------
	// newInstance
	// ----------------------------------------------------------------------------

	function newInstance(extend) {
	  return function () {
	    var initialValues = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    var model = {};
	    var publicAPI = {};
	    extend(publicAPI, model, initialValues);
	    return Object.freeze(publicAPI);
	  };
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newInstance = undefined;
	exports.vtkOpenGLViewNodeFactory = vtkOpenGLViewNodeFactory;
	exports.extend = extend;

	var _macro = __webpack_require__(2);

	var macro = _interopRequireWildcard(_macro);

	var _ViewNodeFactory = __webpack_require__(4);

	var _ViewNodeFactory2 = _interopRequireDefault(_ViewNodeFactory);

	var _RenderWindow = __webpack_require__(1);

	var _RenderWindow2 = _interopRequireDefault(_RenderWindow);

	var _Renderer = __webpack_require__(5);

	var _Renderer2 = _interopRequireDefault(_Renderer);

	var _Actor = __webpack_require__(7);

	var _Actor2 = _interopRequireDefault(_Actor);

	var _Camera = __webpack_require__(8);

	var _Camera2 = _interopRequireDefault(_Camera);

	var _PolyDataMapper = __webpack_require__(19);

	var _PolyDataMapper2 = _interopRequireDefault(_PolyDataMapper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// ----------------------------------------------------------------------------
	// vtkOpenGLViewNodeFactory methods
	// ----------------------------------------------------------------------------

	function vtkOpenGLViewNodeFactory(publicAPI, model) {
	  // Set our className
	  model.classHierarchy.push('vtkOpenGLViewNodeFactory');
	}

	// ----------------------------------------------------------------------------
	// Object factory
	// ----------------------------------------------------------------------------

	var DEFAULT_VALUES = {};

	// ----------------------------------------------------------------------------

	function extend(publicAPI, model) {
	  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  Object.assign(model, DEFAULT_VALUES, initialValues);

	  // Inheritance
	  _ViewNodeFactory2.default.extend(publicAPI, model);

	  // Object methods
	  vtkOpenGLViewNodeFactory(publicAPI, model);

	  // Initialization
	  publicAPI.registerOverride('vtkRenderWindow', _RenderWindow2.default.newInstance);
	  publicAPI.registerOverride('vtkRenderer', _Renderer2.default.newInstance);
	  publicAPI.registerOverride('vtkActor', _Actor2.default.newInstance);
	  publicAPI.registerOverride('vtkMapper', _PolyDataMapper2.default.newInstance);
	  publicAPI.registerOverride('vtkCamera', _Camera2.default.newInstance);
	}

	// ----------------------------------------------------------------------------

	var newInstance = exports.newInstance = macro.newInstance(extend);

	// ----------------------------------------------------------------------------

	exports.default = { newInstance: newInstance, extend: extend };

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newInstance = undefined;
	exports.extend = extend;

	var _macro = __webpack_require__(2);

	var macro = _interopRequireWildcard(_macro);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// ----------------------------------------------------------------------------
	// vtkViewNodeFactory methods
	// ----------------------------------------------------------------------------

	function vtkViewNodeFactory(publicAPI, model) {
	  // Set our className
	  model.classHierarchy.push('vtkViewNodeFactory');

	  publicAPI.createNode = function (dataObject) {
	    if (Object.keys(model.overrides).indexOf(dataObject.getClassName()) === -1) {
	      return null;
	    }
	    var vn = model.overrides[dataObject.getClassName()]();
	    vn.setMyFactory(publicAPI);
	    return vn;
	  };

	  publicAPI.registerOverride = function (className, func) {
	    model.overrides[className] = func;
	  };
	}

	// ----------------------------------------------------------------------------
	// Object factory
	// ----------------------------------------------------------------------------

	var DEFAULT_VALUES = {
	  overrides: {}
	};

	// ----------------------------------------------------------------------------

	function extend(publicAPI, model) {
	  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  Object.assign(model, DEFAULT_VALUES, initialValues);

	  // Build VTK API
	  macro.obj(publicAPI, model);

	  // Object methods
	  vtkViewNodeFactory(publicAPI, model);
	}

	// ----------------------------------------------------------------------------

	var newInstance = exports.newInstance = macro.newInstance(extend);

	// ----------------------------------------------------------------------------

	exports.default = { newInstance: newInstance, extend: extend };

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newInstance = undefined;
	exports.vtkOpenGLRenderer = vtkOpenGLRenderer;
	exports.extend = extend;

	var _macro = __webpack_require__(2);

	var macro = _interopRequireWildcard(_macro);

	var _ViewNode = __webpack_require__(6);

	var _ViewNode2 = _interopRequireDefault(_ViewNode);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// ----------------------------------------------------------------------------
	// vtkOpenGLRenderer methods
	// ----------------------------------------------------------------------------

	function vtkOpenGLRenderer(publicAPI, model) {
	  // Set our className
	  model.classHierarchy.push('vtkOpenGLRenderer');

	  // Builds myself.
	  publicAPI.build = function (prepass) {
	    if (prepass) {
	      if (!model.renderable) {
	        return;
	      }

	      // make sure we have a camera
	      if (!model.renderable.isActiveCameraCreated()) {
	        model.renderable.resetCamera();
	      }
	      publicAPI.updateLights();
	      publicAPI.prepareNodes();
	      publicAPI.addMissingNode(model.renderable.getActiveCamera());
	      publicAPI.addMissingNodes(model.renderable.getActors());
	      publicAPI.removeUnusedNodes();
	    }
	  };

	  publicAPI.updateLights = function () {
	    var count = 0;

	    model.renderable.getLights().forEach(function (light) {
	      if (light.getSwitch() > 0.0) {
	        count++;
	      }
	    });

	    if (!count) {
	      console.debug('No lights are on, creating one.');
	      model.renderable.createLight();
	    }

	    return count;
	  };

	  // Renders myself
	  publicAPI.render = function (prepass) {
	    if (prepass) {
	      model.context = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderWindow').getContext();
	      publicAPI.clear();
	    } else {
	      // else
	    }
	  };

	  publicAPI.clear = function () {
	    var clearMask = 0;
	    var gl = model.context;

	    if (!model.renderable.getTransparent()) {
	      var background = model.renderable.getBackground();
	      model.context.clearColor(background[0], background[1], background[2], 1.0);
	      clearMask |= gl.COLOR_BUFFER_BIT;
	    }

	    if (!model.renderable.getPreserveDepthBuffer()) {
	      gl.clearDepth(1.0);
	      clearMask |= gl.DEPTH_BUFFER_BIT;
	      gl.depthMask(true);
	    }

	    gl.colorMask(true, true, true, true);
	    gl.clear(clearMask);

	    gl.enable(gl.DEPTH_TEST);
	  };
	}

	// ----------------------------------------------------------------------------
	// Object factory
	// ----------------------------------------------------------------------------

	var DEFAULT_VALUES = {
	  context: null
	};

	// ----------------------------------------------------------------------------

	function extend(publicAPI, model) {
	  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  Object.assign(model, DEFAULT_VALUES, initialValues);

	  // Inheritance
	  _ViewNode2.default.extend(publicAPI, model);

	  // Build VTK API
	  macro.get(publicAPI, model, ['shaderCache']);

	  macro.setGet(publicAPI, model, ['context']);

	  // Object methods
	  vtkOpenGLRenderer(publicAPI, model);
	}

	// ----------------------------------------------------------------------------

	var newInstance = exports.newInstance = macro.newInstance(extend);

	// ----------------------------------------------------------------------------

	exports.default = { newInstance: newInstance, extend: extend };

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newInstance = exports.PASS_TYPES = undefined;
	exports.extend = extend;

	var _macro = __webpack_require__(2);

	var macro = _interopRequireWildcard(_macro);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var PASS_TYPES = exports.PASS_TYPES = ['Build', 'Render'];

	// ----------------------------------------------------------------------------
	// vtkViewNode methods
	// ----------------------------------------------------------------------------

	function vtkViewNode(publicAPI, model) {
	  // Set our className
	  model.classHierarchy.push('vtkViewNode');

	  // Builds myself.
	  publicAPI.build = function (prepass) {};

	  // Renders myself
	  publicAPI.render = function (prepass) {};

	  publicAPI.getViewNodeFor = function (dataObject) {
	    if (model.renderable === dataObject) {
	      return publicAPI;
	    }

	    return model.children.find(function (child) {
	      var vn = child.getViewNodeFor(dataObject);
	      return !!vn;
	    });
	  };

	  publicAPI.getFirstAncestorOfType = function (type) {
	    if (!model.parent) {
	      return null;
	    }
	    if (model.parent.isA(type)) {
	      return model.parent;
	    }
	    return model.parent.getFirstAncestorOfType(type);
	  };

	  publicAPI.traverse = function (operation) {
	    publicAPI.apply(operation, true);

	    model.children.forEach(function (child) {
	      child.traverse(operation);
	    });

	    publicAPI.apply(operation, false);
	  };

	  publicAPI.traverseAllPasses = function () {
	    publicAPI.traverse('Build');
	    publicAPI.traverse('Render');
	  };

	  publicAPI.apply = function (operation, prepass) {
	    switch (operation) {
	      case 'Build':
	        publicAPI.build(prepass);
	        break;
	      case 'Render':
	        publicAPI.render(prepass);
	        break;
	      default:
	        console.log('UNKNOWN OPERATION  ' + operation);
	    }
	  };

	  publicAPI.addMissingNode = function (dataObj) {
	    publicAPI.addMissingNodes([dataObj]);
	  };

	  publicAPI.addMissingNodes = function (dataObjs) {
	    model.preparedNodes = model.preparedNodes.concat(dataObjs);

	    // if any dataObj is not a renderable of a child
	    // then create child for that dataObj with renderable set to the
	    // dataObj

	    var childDOs = model.children.map(function (node) {
	      return node.getRenderable();
	    });

	    var newNodes = dataObjs.filter(function (node) {
	      return childDOs.indexOf(node) === -1;
	    }).map(function (node) {
	      var newNode = publicAPI.createViewNode(node);
	      if (newNode) {
	        newNode.setParent(publicAPI);
	        newNode.setRenderable(node);
	      }
	      return newNode;
	    });

	    model.children = model.children.concat(newNodes);
	  };

	  publicAPI.prepareNodes = function () {
	    model.preparedNodes = [];
	  };

	  publicAPI.removeUnusedNodes = function () {
	    model.children = model.children.filter(function (node) {
	      return model.preparedNodes.indexOf(node.getRenderable()) !== -1;
	    });
	    publicAPI.prepareNodes();
	  };

	  publicAPI.createViewNode = function (dataObj) {
	    if (!model.myFactory) {
	      console.log('Can not create view nodes without my own factory');
	      return null;
	    }
	    var ret = model.myFactory.createNode(dataObj);
	    if (ret) {
	      ret.setRenderable(dataObj);
	    }
	    return ret;
	  };
	}

	// ----------------------------------------------------------------------------
	// Object factory
	// ----------------------------------------------------------------------------

	var DEFAULT_VALUES = {
	  parent: null,
	  renderable: null,
	  myFactory: null,
	  children: [],
	  preparedNodes: []
	};

	// ----------------------------------------------------------------------------

	function extend(publicAPI, model) {
	  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  Object.assign(model, DEFAULT_VALUES, initialValues);

	  // Build VTK API
	  macro.obj(publicAPI, model);
	  macro.event(publicAPI, model, 'event');
	  macro.setGet(publicAPI, model, ['parent', 'renderable', 'myFactory']);
	  macro.getArray(publicAPI, model, ['children']);

	  // Object methods
	  vtkViewNode(publicAPI, model);
	}

	// ----------------------------------------------------------------------------

	var newInstance = exports.newInstance = macro.newInstance(extend);

	// ----------------------------------------------------------------------------

	exports.default = { newInstance: newInstance, extend: extend, PASS_TYPES: PASS_TYPES };

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newInstance = undefined;
	exports.extend = extend;

	var _macro = __webpack_require__(2);

	var macro = _interopRequireWildcard(_macro);

	var _ViewNode = __webpack_require__(6);

	var _ViewNode2 = _interopRequireDefault(_ViewNode);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// ----------------------------------------------------------------------------
	// vtkOpenGLActor methods
	// ----------------------------------------------------------------------------

	function vtkOpenGLActor(publicAPI, model) {
	  // Set our className
	  model.classHierarchy.push('vtkOpenGLActor');

	  // Builds myself.
	  publicAPI.build = function (prepass) {
	    if (prepass) {
	      if (!model.renderable) {
	        return;
	      }

	      publicAPI.prepareNodes();
	      publicAPI.addMissingNode(model.renderable.getMapper());
	      publicAPI.removeUnusedNodes();
	    }
	  };

	  // Renders myself
	  publicAPI.render = function (prepass) {
	    if (prepass) {
	      model.context = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderWindow').getContext();
	      publicAPI.preRender();
	    } else {
	      var opaque = model.renderable.getIsOpaque() !== 0;
	      if (!opaque) {
	        model.context.depthMask(true);
	      }
	    }
	  };

	  publicAPI.preRender = function () {
	    // get opacity
	    var opaque = model.renderable.getIsOpaque() !== 0;
	    if (opaque) {
	      model.context.depthMask(true);
	    } else {
	      model.context.depthMask(false);
	    }
	  };
	}

	// ----------------------------------------------------------------------------
	// Object factory
	// ----------------------------------------------------------------------------

	var DEFAULT_VALUES = {
	  context: null
	};

	// ----------------------------------------------------------------------------

	function extend(publicAPI, model) {
	  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  Object.assign(model, DEFAULT_VALUES, initialValues);

	  // Inheritance
	  _ViewNode2.default.extend(publicAPI, model);

	  // Build VTK API
	  macro.setGet(publicAPI, model, ['context']);

	  // Object methods
	  vtkOpenGLActor(publicAPI, model);
	}

	// ----------------------------------------------------------------------------

	var newInstance = exports.newInstance = macro.newInstance(extend);

	// ----------------------------------------------------------------------------

	exports.default = { newInstance: newInstance, extend: extend };

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newInstance = undefined;
	exports.extend = extend;

	var _macro = __webpack_require__(2);

	var macro = _interopRequireWildcard(_macro);

	var _ViewNode = __webpack_require__(6);

	var _ViewNode2 = _interopRequireDefault(_ViewNode);

	var _glMatrix = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// ----------------------------------------------------------------------------
	// vtkOpenGLCamera methods
	// ----------------------------------------------------------------------------

	function vtkOpenGLCamera(publicAPI, model) {
	  // Set our className
	  model.classHierarchy.push('vtkOpenGLCamera');

	  // Builds myself.
	  publicAPI.build = function (prepass) {
	    if (prepass) {
	      if (!model.renderable) {
	        return;
	      }
	    }
	  };

	  // Renders myself
	  publicAPI.render = function (prepass) {
	    if (prepass) {
	      model.context = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderWindow').getContext();
	      var ren = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderer');
	      publicAPI.preRender(ren);
	    }
	  };

	  publicAPI.preRender = function (ren) {
	    // ren.getTiledSizeAndOrigin(&usize, &vsize, lowerLeft, lowerLeft+1);
	    // sconst gl = model.context;
	    // gl.viewport(lowerLeft[0], lowerLeft[1], usize, vsize);
	  };

	  publicAPI.getKeyMatrices = function (ren) {
	    // has the camera changed?
	    if (ren !== model.lastRenderer || publicAPI.getMTime() > model.keyMatrixTime.getMTime() || ren.getMTime() > model.keyMatrixTime.getMTime()) {
	      model.WCVCMatrix = model.renderable.getViewTransformMatrix();

	      _glMatrix.mat3.fromMat4(model.normalMatrix, model.WCVCMatrix);
	      _glMatrix.mat3.invert(model.normalMatrix, model.normalMatrix);
	      _glMatrix.mat4.transpose(model.WCVCMatrix, model.WCVCMatrix);

	      // double aspect[2];
	      // int  lowerLeft[2];
	      // let usize;
	      // let vsize;
	      //  ren.getTiledSizeAndOrigin(&usize, &vsize, lowerLeft, lowerLeft+1);

	      // ren->ComputeAspect();
	      // ren->GetAspect(aspect);
	      // double aspect2[2];
	      // ren->vtkViewport::ComputeAspect();
	      // ren->vtkViewport::GetAspect(aspect2);
	      // double aspectModification = aspect[0] * aspect2[1] / (aspect[1] * aspect2[0]);

	      //  if (usize && vsize) {
	      model.VCDCMatrix = model.renderable.getProjectionTransformMatrix(
	      //                           aspectModification * usize / vsize, -1, 1);
	      1.0, -1, 1);
	      _glMatrix.mat4.transpose(model.VCDCMatrix, model.VCDCMatrix);
	      //  }

	      model.WCDCMatrix = _glMatrix.mat4.create();
	      _glMatrix.mat4.multiply(model.WCDCMatrix, model.VCDCMatrix, model.WCVCMatrix);
	      //      mat4.multiply(model.WCDCMatrix, model.WCVCMatrix, model.VCDCMatrix);

	      model.keyMatrixTime.modified();
	      model.lastRenderer = ren;
	    }

	    return { wcvc: model.WCVCMatrix, normalMatrix: model.normalMatrix, vcdc: model.VCDCMatrix, wcdc: model.WCDCMatrix };
	  };
	}

	// ----------------------------------------------------------------------------
	// Object factory
	// ----------------------------------------------------------------------------

	var DEFAULT_VALUES = {
	  context: null,
	  lastRenderer: null,
	  keyMatrixTime: null,
	  normalMatrix: null
	};

	// ----------------------------------------------------------------------------

	function extend(publicAPI, model) {
	  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  Object.assign(model, DEFAULT_VALUES, initialValues);

	  // Inheritance
	  _ViewNode2.default.extend(publicAPI, model);

	  model.keyMatrixTime = {};
	  model.normalMatrix = _glMatrix.mat3.create();

	  macro.obj(model.keyMatrixTime);

	  // Build VTK API
	  macro.setGet(publicAPI, model, ['context', 'keyMatrixTime']);

	  // Object methods
	  vtkOpenGLCamera(publicAPI, model);
	}

	// ----------------------------------------------------------------------------

	var newInstance = exports.newInstance = macro.newInstance(extend);

	// ----------------------------------------------------------------------------

	exports.default = { newInstance: newInstance, extend: extend };

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @fileoverview gl-matrix - High performance matrix and vector operations
	 * @author Brandon Jones
	 * @author Colin MacKenzie IV
	 * @version 2.3.0
	 */

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */
	// END HEADER

	exports.glMatrix = __webpack_require__(10);
	exports.mat2 = __webpack_require__(11);
	exports.mat2d = __webpack_require__(12);
	exports.mat3 = __webpack_require__(13);
	exports.mat4 = __webpack_require__(14);
	exports.quat = __webpack_require__(15);
	exports.vec2 = __webpack_require__(18);
	exports.vec3 = __webpack_require__(16);
	exports.vec4 = __webpack_require__(17);

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */

	/**
	 * @class Common utilities
	 * @name glMatrix
	 */
	var glMatrix = {};

	// Constants
	glMatrix.EPSILON = 0.000001;
	glMatrix.ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
	glMatrix.RANDOM = Math.random;

	/**
	 * Sets the type of array used when creating new vectors and matrices
	 *
	 * @param {Type} type Array type, such as Float32Array or Array
	 */
	glMatrix.setMatrixArrayType = function (type) {
	  GLMAT_ARRAY_TYPE = type;
	};

	var degree = Math.PI / 180;

	/**
	* Convert Degree To Radian
	*
	* @param {Number} Angle in Degrees
	*/
	glMatrix.toRadian = function (a) {
	  return a * degree;
	};

	module.exports = glMatrix;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */

	var glMatrix = __webpack_require__(10);

	/**
	 * @class 2x2 Matrix
	 * @name mat2
	 */
	var mat2 = {};

	/**
	 * Creates a new identity mat2
	 *
	 * @returns {mat2} a new 2x2 matrix
	 */
	mat2.create = function () {
	    var out = new glMatrix.ARRAY_TYPE(4);
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 1;
	    return out;
	};

	/**
	 * Creates a new mat2 initialized with values from an existing matrix
	 *
	 * @param {mat2} a matrix to clone
	 * @returns {mat2} a new 2x2 matrix
	 */
	mat2.clone = function (a) {
	    var out = new glMatrix.ARRAY_TYPE(4);
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    return out;
	};

	/**
	 * Copy the values from one mat2 to another
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the source matrix
	 * @returns {mat2} out
	 */
	mat2.copy = function (out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    return out;
	};

	/**
	 * Set a mat2 to the identity matrix
	 *
	 * @param {mat2} out the receiving matrix
	 * @returns {mat2} out
	 */
	mat2.identity = function (out) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 1;
	    return out;
	};

	/**
	 * Transpose the values of a mat2
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the source matrix
	 * @returns {mat2} out
	 */
	mat2.transpose = function (out, a) {
	    // If we are transposing ourselves we can skip a few steps but have to cache some values
	    if (out === a) {
	        var a1 = a[1];
	        out[1] = a[2];
	        out[2] = a1;
	    } else {
	        out[0] = a[0];
	        out[1] = a[2];
	        out[2] = a[1];
	        out[3] = a[3];
	    }

	    return out;
	};

	/**
	 * Inverts a mat2
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the source matrix
	 * @returns {mat2} out
	 */
	mat2.invert = function (out, a) {
	    var a0 = a[0],
	        a1 = a[1],
	        a2 = a[2],
	        a3 = a[3],


	    // Calculate the determinant
	    det = a0 * a3 - a2 * a1;

	    if (!det) {
	        return null;
	    }
	    det = 1.0 / det;

	    out[0] = a3 * det;
	    out[1] = -a1 * det;
	    out[2] = -a2 * det;
	    out[3] = a0 * det;

	    return out;
	};

	/**
	 * Calculates the adjugate of a mat2
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the source matrix
	 * @returns {mat2} out
	 */
	mat2.adjoint = function (out, a) {
	    // Caching this value is nessecary if out == a
	    var a0 = a[0];
	    out[0] = a[3];
	    out[1] = -a[1];
	    out[2] = -a[2];
	    out[3] = a0;

	    return out;
	};

	/**
	 * Calculates the determinant of a mat2
	 *
	 * @param {mat2} a the source matrix
	 * @returns {Number} determinant of a
	 */
	mat2.determinant = function (a) {
	    return a[0] * a[3] - a[2] * a[1];
	};

	/**
	 * Multiplies two mat2's
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the first operand
	 * @param {mat2} b the second operand
	 * @returns {mat2} out
	 */
	mat2.multiply = function (out, a, b) {
	    var a0 = a[0],
	        a1 = a[1],
	        a2 = a[2],
	        a3 = a[3];
	    var b0 = b[0],
	        b1 = b[1],
	        b2 = b[2],
	        b3 = b[3];
	    out[0] = a0 * b0 + a2 * b1;
	    out[1] = a1 * b0 + a3 * b1;
	    out[2] = a0 * b2 + a2 * b3;
	    out[3] = a1 * b2 + a3 * b3;
	    return out;
	};

	/**
	 * Alias for {@link mat2.multiply}
	 * @function
	 */
	mat2.mul = mat2.multiply;

	/**
	 * Rotates a mat2 by the given angle
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat2} out
	 */
	mat2.rotate = function (out, a, rad) {
	    var a0 = a[0],
	        a1 = a[1],
	        a2 = a[2],
	        a3 = a[3],
	        s = Math.sin(rad),
	        c = Math.cos(rad);
	    out[0] = a0 * c + a2 * s;
	    out[1] = a1 * c + a3 * s;
	    out[2] = a0 * -s + a2 * c;
	    out[3] = a1 * -s + a3 * c;
	    return out;
	};

	/**
	 * Scales the mat2 by the dimensions in the given vec2
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the matrix to rotate
	 * @param {vec2} v the vec2 to scale the matrix by
	 * @returns {mat2} out
	 **/
	mat2.scale = function (out, a, v) {
	    var a0 = a[0],
	        a1 = a[1],
	        a2 = a[2],
	        a3 = a[3],
	        v0 = v[0],
	        v1 = v[1];
	    out[0] = a0 * v0;
	    out[1] = a1 * v0;
	    out[2] = a2 * v1;
	    out[3] = a3 * v1;
	    return out;
	};

	/**
	 * Creates a matrix from a given angle
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2.identity(dest);
	 *     mat2.rotate(dest, dest, rad);
	 *
	 * @param {mat2} out mat2 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat2} out
	 */
	mat2.fromRotation = function (out, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad);
	    out[0] = c;
	    out[1] = s;
	    out[2] = -s;
	    out[3] = c;
	    return out;
	};

	/**
	 * Creates a matrix from a vector scaling
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2.identity(dest);
	 *     mat2.scale(dest, dest, vec);
	 *
	 * @param {mat2} out mat2 receiving operation result
	 * @param {vec2} v Scaling vector
	 * @returns {mat2} out
	 */
	mat2.fromScaling = function (out, v) {
	    out[0] = v[0];
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = v[1];
	    return out;
	};

	/**
	 * Returns a string representation of a mat2
	 *
	 * @param {mat2} mat matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	mat2.str = function (a) {
	    return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
	};

	/**
	 * Returns Frobenius norm of a mat2
	 *
	 * @param {mat2} a the matrix to calculate Frobenius norm of
	 * @returns {Number} Frobenius norm
	 */
	mat2.frob = function (a) {
	    return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2));
	};

	/**
	 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
	 * @param {mat2} L the lower triangular matrix 
	 * @param {mat2} D the diagonal matrix 
	 * @param {mat2} U the upper triangular matrix 
	 * @param {mat2} a the input matrix to factorize
	 */

	mat2.LDU = function (L, D, U, a) {
	    L[2] = a[2] / a[0];
	    U[0] = a[0];
	    U[1] = a[1];
	    U[3] = a[3] - L[2] * U[1];
	    return [L, D, U];
	};

	module.exports = mat2;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */

	var glMatrix = __webpack_require__(10);

	/**
	 * @class 2x3 Matrix
	 * @name mat2d
	 * 
	 * @description 
	 * A mat2d contains six elements defined as:
	 * <pre>
	 * [a, c, tx,
	 *  b, d, ty]
	 * </pre>
	 * This is a short form for the 3x3 matrix:
	 * <pre>
	 * [a, c, tx,
	 *  b, d, ty,
	 *  0, 0, 1]
	 * </pre>
	 * The last row is ignored so the array is shorter and operations are faster.
	 */
	var mat2d = {};

	/**
	 * Creates a new identity mat2d
	 *
	 * @returns {mat2d} a new 2x3 matrix
	 */
	mat2d.create = function () {
	    var out = new glMatrix.ARRAY_TYPE(6);
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 1;
	    out[4] = 0;
	    out[5] = 0;
	    return out;
	};

	/**
	 * Creates a new mat2d initialized with values from an existing matrix
	 *
	 * @param {mat2d} a matrix to clone
	 * @returns {mat2d} a new 2x3 matrix
	 */
	mat2d.clone = function (a) {
	    var out = new glMatrix.ARRAY_TYPE(6);
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    return out;
	};

	/**
	 * Copy the values from one mat2d to another
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the source matrix
	 * @returns {mat2d} out
	 */
	mat2d.copy = function (out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    return out;
	};

	/**
	 * Set a mat2d to the identity matrix
	 *
	 * @param {mat2d} out the receiving matrix
	 * @returns {mat2d} out
	 */
	mat2d.identity = function (out) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 1;
	    out[4] = 0;
	    out[5] = 0;
	    return out;
	};

	/**
	 * Inverts a mat2d
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the source matrix
	 * @returns {mat2d} out
	 */
	mat2d.invert = function (out, a) {
	    var aa = a[0],
	        ab = a[1],
	        ac = a[2],
	        ad = a[3],
	        atx = a[4],
	        aty = a[5];

	    var det = aa * ad - ab * ac;
	    if (!det) {
	        return null;
	    }
	    det = 1.0 / det;

	    out[0] = ad * det;
	    out[1] = -ab * det;
	    out[2] = -ac * det;
	    out[3] = aa * det;
	    out[4] = (ac * aty - ad * atx) * det;
	    out[5] = (ab * atx - aa * aty) * det;
	    return out;
	};

	/**
	 * Calculates the determinant of a mat2d
	 *
	 * @param {mat2d} a the source matrix
	 * @returns {Number} determinant of a
	 */
	mat2d.determinant = function (a) {
	    return a[0] * a[3] - a[1] * a[2];
	};

	/**
	 * Multiplies two mat2d's
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the first operand
	 * @param {mat2d} b the second operand
	 * @returns {mat2d} out
	 */
	mat2d.multiply = function (out, a, b) {
	    var a0 = a[0],
	        a1 = a[1],
	        a2 = a[2],
	        a3 = a[3],
	        a4 = a[4],
	        a5 = a[5],
	        b0 = b[0],
	        b1 = b[1],
	        b2 = b[2],
	        b3 = b[3],
	        b4 = b[4],
	        b5 = b[5];
	    out[0] = a0 * b0 + a2 * b1;
	    out[1] = a1 * b0 + a3 * b1;
	    out[2] = a0 * b2 + a2 * b3;
	    out[3] = a1 * b2 + a3 * b3;
	    out[4] = a0 * b4 + a2 * b5 + a4;
	    out[5] = a1 * b4 + a3 * b5 + a5;
	    return out;
	};

	/**
	 * Alias for {@link mat2d.multiply}
	 * @function
	 */
	mat2d.mul = mat2d.multiply;

	/**
	 * Rotates a mat2d by the given angle
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat2d} out
	 */
	mat2d.rotate = function (out, a, rad) {
	    var a0 = a[0],
	        a1 = a[1],
	        a2 = a[2],
	        a3 = a[3],
	        a4 = a[4],
	        a5 = a[5],
	        s = Math.sin(rad),
	        c = Math.cos(rad);
	    out[0] = a0 * c + a2 * s;
	    out[1] = a1 * c + a3 * s;
	    out[2] = a0 * -s + a2 * c;
	    out[3] = a1 * -s + a3 * c;
	    out[4] = a4;
	    out[5] = a5;
	    return out;
	};

	/**
	 * Scales the mat2d by the dimensions in the given vec2
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the matrix to translate
	 * @param {vec2} v the vec2 to scale the matrix by
	 * @returns {mat2d} out
	 **/
	mat2d.scale = function (out, a, v) {
	    var a0 = a[0],
	        a1 = a[1],
	        a2 = a[2],
	        a3 = a[3],
	        a4 = a[4],
	        a5 = a[5],
	        v0 = v[0],
	        v1 = v[1];
	    out[0] = a0 * v0;
	    out[1] = a1 * v0;
	    out[2] = a2 * v1;
	    out[3] = a3 * v1;
	    out[4] = a4;
	    out[5] = a5;
	    return out;
	};

	/**
	 * Translates the mat2d by the dimensions in the given vec2
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the matrix to translate
	 * @param {vec2} v the vec2 to translate the matrix by
	 * @returns {mat2d} out
	 **/
	mat2d.translate = function (out, a, v) {
	    var a0 = a[0],
	        a1 = a[1],
	        a2 = a[2],
	        a3 = a[3],
	        a4 = a[4],
	        a5 = a[5],
	        v0 = v[0],
	        v1 = v[1];
	    out[0] = a0;
	    out[1] = a1;
	    out[2] = a2;
	    out[3] = a3;
	    out[4] = a0 * v0 + a2 * v1 + a4;
	    out[5] = a1 * v0 + a3 * v1 + a5;
	    return out;
	};

	/**
	 * Creates a matrix from a given angle
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2d.identity(dest);
	 *     mat2d.rotate(dest, dest, rad);
	 *
	 * @param {mat2d} out mat2d receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat2d} out
	 */
	mat2d.fromRotation = function (out, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad);
	    out[0] = c;
	    out[1] = s;
	    out[2] = -s;
	    out[3] = c;
	    out[4] = 0;
	    out[5] = 0;
	    return out;
	};

	/**
	 * Creates a matrix from a vector scaling
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2d.identity(dest);
	 *     mat2d.scale(dest, dest, vec);
	 *
	 * @param {mat2d} out mat2d receiving operation result
	 * @param {vec2} v Scaling vector
	 * @returns {mat2d} out
	 */
	mat2d.fromScaling = function (out, v) {
	    out[0] = v[0];
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = v[1];
	    out[4] = 0;
	    out[5] = 0;
	    return out;
	};

	/**
	 * Creates a matrix from a vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2d.identity(dest);
	 *     mat2d.translate(dest, dest, vec);
	 *
	 * @param {mat2d} out mat2d receiving operation result
	 * @param {vec2} v Translation vector
	 * @returns {mat2d} out
	 */
	mat2d.fromTranslation = function (out, v) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 1;
	    out[4] = v[0];
	    out[5] = v[1];
	    return out;
	};

	/**
	 * Returns a string representation of a mat2d
	 *
	 * @param {mat2d} a matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	mat2d.str = function (a) {
	    return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ')';
	};

	/**
	 * Returns Frobenius norm of a mat2d
	 *
	 * @param {mat2d} a the matrix to calculate Frobenius norm of
	 * @returns {Number} Frobenius norm
	 */
	mat2d.frob = function (a) {
	    return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1);
	};

	module.exports = mat2d;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */

	var glMatrix = __webpack_require__(10);

	/**
	 * @class 3x3 Matrix
	 * @name mat3
	 */
	var mat3 = {};

	/**
	 * Creates a new identity mat3
	 *
	 * @returns {mat3} a new 3x3 matrix
	 */
	mat3.create = function () {
	    var out = new glMatrix.ARRAY_TYPE(9);
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 1;
	    out[5] = 0;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 1;
	    return out;
	};

	/**
	 * Copies the upper-left 3x3 values into the given mat3.
	 *
	 * @param {mat3} out the receiving 3x3 matrix
	 * @param {mat4} a   the source 4x4 matrix
	 * @returns {mat3} out
	 */
	mat3.fromMat4 = function (out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[4];
	    out[4] = a[5];
	    out[5] = a[6];
	    out[6] = a[8];
	    out[7] = a[9];
	    out[8] = a[10];
	    return out;
	};

	/**
	 * Creates a new mat3 initialized with values from an existing matrix
	 *
	 * @param {mat3} a matrix to clone
	 * @returns {mat3} a new 3x3 matrix
	 */
	mat3.clone = function (a) {
	    var out = new glMatrix.ARRAY_TYPE(9);
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    out[6] = a[6];
	    out[7] = a[7];
	    out[8] = a[8];
	    return out;
	};

	/**
	 * Copy the values from one mat3 to another
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the source matrix
	 * @returns {mat3} out
	 */
	mat3.copy = function (out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    out[6] = a[6];
	    out[7] = a[7];
	    out[8] = a[8];
	    return out;
	};

	/**
	 * Set a mat3 to the identity matrix
	 *
	 * @param {mat3} out the receiving matrix
	 * @returns {mat3} out
	 */
	mat3.identity = function (out) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 1;
	    out[5] = 0;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 1;
	    return out;
	};

	/**
	 * Transpose the values of a mat3
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the source matrix
	 * @returns {mat3} out
	 */
	mat3.transpose = function (out, a) {
	    // If we are transposing ourselves we can skip a few steps but have to cache some values
	    if (out === a) {
	        var a01 = a[1],
	            a02 = a[2],
	            a12 = a[5];
	        out[1] = a[3];
	        out[2] = a[6];
	        out[3] = a01;
	        out[5] = a[7];
	        out[6] = a02;
	        out[7] = a12;
	    } else {
	        out[0] = a[0];
	        out[1] = a[3];
	        out[2] = a[6];
	        out[3] = a[1];
	        out[4] = a[4];
	        out[5] = a[7];
	        out[6] = a[2];
	        out[7] = a[5];
	        out[8] = a[8];
	    }

	    return out;
	};

	/**
	 * Inverts a mat3
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the source matrix
	 * @returns {mat3} out
	 */
	mat3.invert = function (out, a) {
	    var a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a10 = a[3],
	        a11 = a[4],
	        a12 = a[5],
	        a20 = a[6],
	        a21 = a[7],
	        a22 = a[8],
	        b01 = a22 * a11 - a12 * a21,
	        b11 = -a22 * a10 + a12 * a20,
	        b21 = a21 * a10 - a11 * a20,


	    // Calculate the determinant
	    det = a00 * b01 + a01 * b11 + a02 * b21;

	    if (!det) {
	        return null;
	    }
	    det = 1.0 / det;

	    out[0] = b01 * det;
	    out[1] = (-a22 * a01 + a02 * a21) * det;
	    out[2] = (a12 * a01 - a02 * a11) * det;
	    out[3] = b11 * det;
	    out[4] = (a22 * a00 - a02 * a20) * det;
	    out[5] = (-a12 * a00 + a02 * a10) * det;
	    out[6] = b21 * det;
	    out[7] = (-a21 * a00 + a01 * a20) * det;
	    out[8] = (a11 * a00 - a01 * a10) * det;
	    return out;
	};

	/**
	 * Calculates the adjugate of a mat3
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the source matrix
	 * @returns {mat3} out
	 */
	mat3.adjoint = function (out, a) {
	    var a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a10 = a[3],
	        a11 = a[4],
	        a12 = a[5],
	        a20 = a[6],
	        a21 = a[7],
	        a22 = a[8];

	    out[0] = a11 * a22 - a12 * a21;
	    out[1] = a02 * a21 - a01 * a22;
	    out[2] = a01 * a12 - a02 * a11;
	    out[3] = a12 * a20 - a10 * a22;
	    out[4] = a00 * a22 - a02 * a20;
	    out[5] = a02 * a10 - a00 * a12;
	    out[6] = a10 * a21 - a11 * a20;
	    out[7] = a01 * a20 - a00 * a21;
	    out[8] = a00 * a11 - a01 * a10;
	    return out;
	};

	/**
	 * Calculates the determinant of a mat3
	 *
	 * @param {mat3} a the source matrix
	 * @returns {Number} determinant of a
	 */
	mat3.determinant = function (a) {
	    var a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a10 = a[3],
	        a11 = a[4],
	        a12 = a[5],
	        a20 = a[6],
	        a21 = a[7],
	        a22 = a[8];

	    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
	};

	/**
	 * Multiplies two mat3's
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the first operand
	 * @param {mat3} b the second operand
	 * @returns {mat3} out
	 */
	mat3.multiply = function (out, a, b) {
	    var a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a10 = a[3],
	        a11 = a[4],
	        a12 = a[5],
	        a20 = a[6],
	        a21 = a[7],
	        a22 = a[8],
	        b00 = b[0],
	        b01 = b[1],
	        b02 = b[2],
	        b10 = b[3],
	        b11 = b[4],
	        b12 = b[5],
	        b20 = b[6],
	        b21 = b[7],
	        b22 = b[8];

	    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
	    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
	    out[2] = b00 * a02 + b01 * a12 + b02 * a22;

	    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
	    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
	    out[5] = b10 * a02 + b11 * a12 + b12 * a22;

	    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
	    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
	    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
	    return out;
	};

	/**
	 * Alias for {@link mat3.multiply}
	 * @function
	 */
	mat3.mul = mat3.multiply;

	/**
	 * Translate a mat3 by the given vector
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the matrix to translate
	 * @param {vec2} v vector to translate by
	 * @returns {mat3} out
	 */
	mat3.translate = function (out, a, v) {
	    var a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a10 = a[3],
	        a11 = a[4],
	        a12 = a[5],
	        a20 = a[6],
	        a21 = a[7],
	        a22 = a[8],
	        x = v[0],
	        y = v[1];

	    out[0] = a00;
	    out[1] = a01;
	    out[2] = a02;

	    out[3] = a10;
	    out[4] = a11;
	    out[5] = a12;

	    out[6] = x * a00 + y * a10 + a20;
	    out[7] = x * a01 + y * a11 + a21;
	    out[8] = x * a02 + y * a12 + a22;
	    return out;
	};

	/**
	 * Rotates a mat3 by the given angle
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat3} out
	 */
	mat3.rotate = function (out, a, rad) {
	    var a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a10 = a[3],
	        a11 = a[4],
	        a12 = a[5],
	        a20 = a[6],
	        a21 = a[7],
	        a22 = a[8],
	        s = Math.sin(rad),
	        c = Math.cos(rad);

	    out[0] = c * a00 + s * a10;
	    out[1] = c * a01 + s * a11;
	    out[2] = c * a02 + s * a12;

	    out[3] = c * a10 - s * a00;
	    out[4] = c * a11 - s * a01;
	    out[5] = c * a12 - s * a02;

	    out[6] = a20;
	    out[7] = a21;
	    out[8] = a22;
	    return out;
	};

	/**
	 * Scales the mat3 by the dimensions in the given vec2
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the matrix to rotate
	 * @param {vec2} v the vec2 to scale the matrix by
	 * @returns {mat3} out
	 **/
	mat3.scale = function (out, a, v) {
	    var x = v[0],
	        y = v[1];

	    out[0] = x * a[0];
	    out[1] = x * a[1];
	    out[2] = x * a[2];

	    out[3] = y * a[3];
	    out[4] = y * a[4];
	    out[5] = y * a[5];

	    out[6] = a[6];
	    out[7] = a[7];
	    out[8] = a[8];
	    return out;
	};

	/**
	 * Creates a matrix from a vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat3.identity(dest);
	 *     mat3.translate(dest, dest, vec);
	 *
	 * @param {mat3} out mat3 receiving operation result
	 * @param {vec2} v Translation vector
	 * @returns {mat3} out
	 */
	mat3.fromTranslation = function (out, v) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 1;
	    out[5] = 0;
	    out[6] = v[0];
	    out[7] = v[1];
	    out[8] = 1;
	    return out;
	};

	/**
	 * Creates a matrix from a given angle
	 * This is equivalent to (but much faster than):
	 *
	 *     mat3.identity(dest);
	 *     mat3.rotate(dest, dest, rad);
	 *
	 * @param {mat3} out mat3 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat3} out
	 */
	mat3.fromRotation = function (out, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad);

	    out[0] = c;
	    out[1] = s;
	    out[2] = 0;

	    out[3] = -s;
	    out[4] = c;
	    out[5] = 0;

	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 1;
	    return out;
	};

	/**
	 * Creates a matrix from a vector scaling
	 * This is equivalent to (but much faster than):
	 *
	 *     mat3.identity(dest);
	 *     mat3.scale(dest, dest, vec);
	 *
	 * @param {mat3} out mat3 receiving operation result
	 * @param {vec2} v Scaling vector
	 * @returns {mat3} out
	 */
	mat3.fromScaling = function (out, v) {
	    out[0] = v[0];
	    out[1] = 0;
	    out[2] = 0;

	    out[3] = 0;
	    out[4] = v[1];
	    out[5] = 0;

	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 1;
	    return out;
	};

	/**
	 * Copies the values from a mat2d into a mat3
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat2d} a the matrix to copy
	 * @returns {mat3} out
	 **/
	mat3.fromMat2d = function (out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = 0;

	    out[3] = a[2];
	    out[4] = a[3];
	    out[5] = 0;

	    out[6] = a[4];
	    out[7] = a[5];
	    out[8] = 1;
	    return out;
	};

	/**
	* Calculates a 3x3 matrix from the given quaternion
	*
	* @param {mat3} out mat3 receiving operation result
	* @param {quat} q Quaternion to create matrix from
	*
	* @returns {mat3} out
	*/
	mat3.fromQuat = function (out, q) {
	    var x = q[0],
	        y = q[1],
	        z = q[2],
	        w = q[3],
	        x2 = x + x,
	        y2 = y + y,
	        z2 = z + z,
	        xx = x * x2,
	        yx = y * x2,
	        yy = y * y2,
	        zx = z * x2,
	        zy = z * y2,
	        zz = z * z2,
	        wx = w * x2,
	        wy = w * y2,
	        wz = w * z2;

	    out[0] = 1 - yy - zz;
	    out[3] = yx - wz;
	    out[6] = zx + wy;

	    out[1] = yx + wz;
	    out[4] = 1 - xx - zz;
	    out[7] = zy - wx;

	    out[2] = zx - wy;
	    out[5] = zy + wx;
	    out[8] = 1 - xx - yy;

	    return out;
	};

	/**
	* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
	*
	* @param {mat3} out mat3 receiving operation result
	* @param {mat4} a Mat4 to derive the normal matrix from
	*
	* @returns {mat3} out
	*/
	mat3.normalFromMat4 = function (out, a) {
	    var a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a03 = a[3],
	        a10 = a[4],
	        a11 = a[5],
	        a12 = a[6],
	        a13 = a[7],
	        a20 = a[8],
	        a21 = a[9],
	        a22 = a[10],
	        a23 = a[11],
	        a30 = a[12],
	        a31 = a[13],
	        a32 = a[14],
	        a33 = a[15],
	        b00 = a00 * a11 - a01 * a10,
	        b01 = a00 * a12 - a02 * a10,
	        b02 = a00 * a13 - a03 * a10,
	        b03 = a01 * a12 - a02 * a11,
	        b04 = a01 * a13 - a03 * a11,
	        b05 = a02 * a13 - a03 * a12,
	        b06 = a20 * a31 - a21 * a30,
	        b07 = a20 * a32 - a22 * a30,
	        b08 = a20 * a33 - a23 * a30,
	        b09 = a21 * a32 - a22 * a31,
	        b10 = a21 * a33 - a23 * a31,
	        b11 = a22 * a33 - a23 * a32,


	    // Calculate the determinant
	    det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

	    if (!det) {
	        return null;
	    }
	    det = 1.0 / det;

	    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
	    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
	    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

	    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
	    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
	    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

	    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
	    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
	    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

	    return out;
	};

	/**
	 * Returns a string representation of a mat3
	 *
	 * @param {mat3} mat matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	mat3.str = function (a) {
	    return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' + a[8] + ')';
	};

	/**
	 * Returns Frobenius norm of a mat3
	 *
	 * @param {mat3} a the matrix to calculate Frobenius norm of
	 * @returns {Number} Frobenius norm
	 */
	mat3.frob = function (a) {
	    return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2));
	};

	module.exports = mat3;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */

	var glMatrix = __webpack_require__(10);

	/**
	 * @class 4x4 Matrix
	 * @name mat4
	 */
	var mat4 = {};

	/**
	 * Creates a new identity mat4
	 *
	 * @returns {mat4} a new 4x4 matrix
	 */
	mat4.create = function () {
	    var out = new glMatrix.ARRAY_TYPE(16);
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = 1;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 1;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	};

	/**
	 * Creates a new mat4 initialized with values from an existing matrix
	 *
	 * @param {mat4} a matrix to clone
	 * @returns {mat4} a new 4x4 matrix
	 */
	mat4.clone = function (a) {
	    var out = new glMatrix.ARRAY_TYPE(16);
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    out[6] = a[6];
	    out[7] = a[7];
	    out[8] = a[8];
	    out[9] = a[9];
	    out[10] = a[10];
	    out[11] = a[11];
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	    return out;
	};

	/**
	 * Copy the values from one mat4 to another
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	mat4.copy = function (out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    out[6] = a[6];
	    out[7] = a[7];
	    out[8] = a[8];
	    out[9] = a[9];
	    out[10] = a[10];
	    out[11] = a[11];
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	    return out;
	};

	/**
	 * Set a mat4 to the identity matrix
	 *
	 * @param {mat4} out the receiving matrix
	 * @returns {mat4} out
	 */
	mat4.identity = function (out) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = 1;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 1;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	};

	/**
	 * Transpose the values of a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	mat4.transpose = function (out, a) {
	    // If we are transposing ourselves we can skip a few steps but have to cache some values
	    if (out === a) {
	        var a01 = a[1],
	            a02 = a[2],
	            a03 = a[3],
	            a12 = a[6],
	            a13 = a[7],
	            a23 = a[11];

	        out[1] = a[4];
	        out[2] = a[8];
	        out[3] = a[12];
	        out[4] = a01;
	        out[6] = a[9];
	        out[7] = a[13];
	        out[8] = a02;
	        out[9] = a12;
	        out[11] = a[14];
	        out[12] = a03;
	        out[13] = a13;
	        out[14] = a23;
	    } else {
	        out[0] = a[0];
	        out[1] = a[4];
	        out[2] = a[8];
	        out[3] = a[12];
	        out[4] = a[1];
	        out[5] = a[5];
	        out[6] = a[9];
	        out[7] = a[13];
	        out[8] = a[2];
	        out[9] = a[6];
	        out[10] = a[10];
	        out[11] = a[14];
	        out[12] = a[3];
	        out[13] = a[7];
	        out[14] = a[11];
	        out[15] = a[15];
	    }

	    return out;
	};

	/**
	 * Inverts a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	mat4.invert = function (out, a) {
	    var a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a03 = a[3],
	        a10 = a[4],
	        a11 = a[5],
	        a12 = a[6],
	        a13 = a[7],
	        a20 = a[8],
	        a21 = a[9],
	        a22 = a[10],
	        a23 = a[11],
	        a30 = a[12],
	        a31 = a[13],
	        a32 = a[14],
	        a33 = a[15],
	        b00 = a00 * a11 - a01 * a10,
	        b01 = a00 * a12 - a02 * a10,
	        b02 = a00 * a13 - a03 * a10,
	        b03 = a01 * a12 - a02 * a11,
	        b04 = a01 * a13 - a03 * a11,
	        b05 = a02 * a13 - a03 * a12,
	        b06 = a20 * a31 - a21 * a30,
	        b07 = a20 * a32 - a22 * a30,
	        b08 = a20 * a33 - a23 * a30,
	        b09 = a21 * a32 - a22 * a31,
	        b10 = a21 * a33 - a23 * a31,
	        b11 = a22 * a33 - a23 * a32,


	    // Calculate the determinant
	    det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

	    if (!det) {
	        return null;
	    }
	    det = 1.0 / det;

	    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
	    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
	    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
	    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
	    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
	    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
	    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
	    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
	    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
	    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
	    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
	    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
	    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
	    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
	    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
	    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

	    return out;
	};

	/**
	 * Calculates the adjugate of a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	mat4.adjoint = function (out, a) {
	    var a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a03 = a[3],
	        a10 = a[4],
	        a11 = a[5],
	        a12 = a[6],
	        a13 = a[7],
	        a20 = a[8],
	        a21 = a[9],
	        a22 = a[10],
	        a23 = a[11],
	        a30 = a[12],
	        a31 = a[13],
	        a32 = a[14],
	        a33 = a[15];

	    out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
	    out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
	    out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
	    out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
	    out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
	    out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
	    out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
	    out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
	    out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
	    out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
	    out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
	    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
	    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
	    out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
	    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
	    out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
	    return out;
	};

	/**
	 * Calculates the determinant of a mat4
	 *
	 * @param {mat4} a the source matrix
	 * @returns {Number} determinant of a
	 */
	mat4.determinant = function (a) {
	    var a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a03 = a[3],
	        a10 = a[4],
	        a11 = a[5],
	        a12 = a[6],
	        a13 = a[7],
	        a20 = a[8],
	        a21 = a[9],
	        a22 = a[10],
	        a23 = a[11],
	        a30 = a[12],
	        a31 = a[13],
	        a32 = a[14],
	        a33 = a[15],
	        b00 = a00 * a11 - a01 * a10,
	        b01 = a00 * a12 - a02 * a10,
	        b02 = a00 * a13 - a03 * a10,
	        b03 = a01 * a12 - a02 * a11,
	        b04 = a01 * a13 - a03 * a11,
	        b05 = a02 * a13 - a03 * a12,
	        b06 = a20 * a31 - a21 * a30,
	        b07 = a20 * a32 - a22 * a30,
	        b08 = a20 * a33 - a23 * a30,
	        b09 = a21 * a32 - a22 * a31,
	        b10 = a21 * a33 - a23 * a31,
	        b11 = a22 * a33 - a23 * a32;

	    // Calculate the determinant
	    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
	};

	/**
	 * Multiplies two mat4's
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the first operand
	 * @param {mat4} b the second operand
	 * @returns {mat4} out
	 */
	mat4.multiply = function (out, a, b) {
	    var a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a03 = a[3],
	        a10 = a[4],
	        a11 = a[5],
	        a12 = a[6],
	        a13 = a[7],
	        a20 = a[8],
	        a21 = a[9],
	        a22 = a[10],
	        a23 = a[11],
	        a30 = a[12],
	        a31 = a[13],
	        a32 = a[14],
	        a33 = a[15];

	    // Cache only the current line of the second matrix
	    var b0 = b[0],
	        b1 = b[1],
	        b2 = b[2],
	        b3 = b[3];
	    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

	    b0 = b[4];b1 = b[5];b2 = b[6];b3 = b[7];
	    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

	    b0 = b[8];b1 = b[9];b2 = b[10];b3 = b[11];
	    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

	    b0 = b[12];b1 = b[13];b2 = b[14];b3 = b[15];
	    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
	    return out;
	};

	/**
	 * Alias for {@link mat4.multiply}
	 * @function
	 */
	mat4.mul = mat4.multiply;

	/**
	 * Translate a mat4 by the given vector
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to translate
	 * @param {vec3} v vector to translate by
	 * @returns {mat4} out
	 */
	mat4.translate = function (out, a, v) {
	    var x = v[0],
	        y = v[1],
	        z = v[2],
	        a00,
	        a01,
	        a02,
	        a03,
	        a10,
	        a11,
	        a12,
	        a13,
	        a20,
	        a21,
	        a22,
	        a23;

	    if (a === out) {
	        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
	        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
	        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
	        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
	    } else {
	        a00 = a[0];a01 = a[1];a02 = a[2];a03 = a[3];
	        a10 = a[4];a11 = a[5];a12 = a[6];a13 = a[7];
	        a20 = a[8];a21 = a[9];a22 = a[10];a23 = a[11];

	        out[0] = a00;out[1] = a01;out[2] = a02;out[3] = a03;
	        out[4] = a10;out[5] = a11;out[6] = a12;out[7] = a13;
	        out[8] = a20;out[9] = a21;out[10] = a22;out[11] = a23;

	        out[12] = a00 * x + a10 * y + a20 * z + a[12];
	        out[13] = a01 * x + a11 * y + a21 * z + a[13];
	        out[14] = a02 * x + a12 * y + a22 * z + a[14];
	        out[15] = a03 * x + a13 * y + a23 * z + a[15];
	    }

	    return out;
	};

	/**
	 * Scales the mat4 by the dimensions in the given vec3
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to scale
	 * @param {vec3} v the vec3 to scale the matrix by
	 * @returns {mat4} out
	 **/
	mat4.scale = function (out, a, v) {
	    var x = v[0],
	        y = v[1],
	        z = v[2];

	    out[0] = a[0] * x;
	    out[1] = a[1] * x;
	    out[2] = a[2] * x;
	    out[3] = a[3] * x;
	    out[4] = a[4] * y;
	    out[5] = a[5] * y;
	    out[6] = a[6] * y;
	    out[7] = a[7] * y;
	    out[8] = a[8] * z;
	    out[9] = a[9] * z;
	    out[10] = a[10] * z;
	    out[11] = a[11] * z;
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	    return out;
	};

	/**
	 * Rotates a mat4 by the given angle around the given axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @param {vec3} axis the axis to rotate around
	 * @returns {mat4} out
	 */
	mat4.rotate = function (out, a, rad, axis) {
	    var x = axis[0],
	        y = axis[1],
	        z = axis[2],
	        len = Math.sqrt(x * x + y * y + z * z),
	        s,
	        c,
	        t,
	        a00,
	        a01,
	        a02,
	        a03,
	        a10,
	        a11,
	        a12,
	        a13,
	        a20,
	        a21,
	        a22,
	        a23,
	        b00,
	        b01,
	        b02,
	        b10,
	        b11,
	        b12,
	        b20,
	        b21,
	        b22;

	    if (Math.abs(len) < glMatrix.EPSILON) {
	        return null;
	    }

	    len = 1 / len;
	    x *= len;
	    y *= len;
	    z *= len;

	    s = Math.sin(rad);
	    c = Math.cos(rad);
	    t = 1 - c;

	    a00 = a[0];a01 = a[1];a02 = a[2];a03 = a[3];
	    a10 = a[4];a11 = a[5];a12 = a[6];a13 = a[7];
	    a20 = a[8];a21 = a[9];a22 = a[10];a23 = a[11];

	    // Construct the elements of the rotation matrix
	    b00 = x * x * t + c;b01 = y * x * t + z * s;b02 = z * x * t - y * s;
	    b10 = x * y * t - z * s;b11 = y * y * t + c;b12 = z * y * t + x * s;
	    b20 = x * z * t + y * s;b21 = y * z * t - x * s;b22 = z * z * t + c;

	    // Perform rotation-specific matrix multiplication
	    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
	    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
	    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
	    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
	    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
	    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
	    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
	    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
	    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
	    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
	    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
	    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

	    if (a !== out) {
	        // If the source and destination differ, copy the unchanged last row
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }
	    return out;
	};

	/**
	 * Rotates a matrix by the given angle around the X axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.rotateX = function (out, a, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad),
	        a10 = a[4],
	        a11 = a[5],
	        a12 = a[6],
	        a13 = a[7],
	        a20 = a[8],
	        a21 = a[9],
	        a22 = a[10],
	        a23 = a[11];

	    if (a !== out) {
	        // If the source and destination differ, copy the unchanged rows
	        out[0] = a[0];
	        out[1] = a[1];
	        out[2] = a[2];
	        out[3] = a[3];
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }

	    // Perform axis-specific matrix multiplication
	    out[4] = a10 * c + a20 * s;
	    out[5] = a11 * c + a21 * s;
	    out[6] = a12 * c + a22 * s;
	    out[7] = a13 * c + a23 * s;
	    out[8] = a20 * c - a10 * s;
	    out[9] = a21 * c - a11 * s;
	    out[10] = a22 * c - a12 * s;
	    out[11] = a23 * c - a13 * s;
	    return out;
	};

	/**
	 * Rotates a matrix by the given angle around the Y axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.rotateY = function (out, a, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad),
	        a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a03 = a[3],
	        a20 = a[8],
	        a21 = a[9],
	        a22 = a[10],
	        a23 = a[11];

	    if (a !== out) {
	        // If the source and destination differ, copy the unchanged rows
	        out[4] = a[4];
	        out[5] = a[5];
	        out[6] = a[6];
	        out[7] = a[7];
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }

	    // Perform axis-specific matrix multiplication
	    out[0] = a00 * c - a20 * s;
	    out[1] = a01 * c - a21 * s;
	    out[2] = a02 * c - a22 * s;
	    out[3] = a03 * c - a23 * s;
	    out[8] = a00 * s + a20 * c;
	    out[9] = a01 * s + a21 * c;
	    out[10] = a02 * s + a22 * c;
	    out[11] = a03 * s + a23 * c;
	    return out;
	};

	/**
	 * Rotates a matrix by the given angle around the Z axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.rotateZ = function (out, a, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad),
	        a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a03 = a[3],
	        a10 = a[4],
	        a11 = a[5],
	        a12 = a[6],
	        a13 = a[7];

	    if (a !== out) {
	        // If the source and destination differ, copy the unchanged last row
	        out[8] = a[8];
	        out[9] = a[9];
	        out[10] = a[10];
	        out[11] = a[11];
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }

	    // Perform axis-specific matrix multiplication
	    out[0] = a00 * c + a10 * s;
	    out[1] = a01 * c + a11 * s;
	    out[2] = a02 * c + a12 * s;
	    out[3] = a03 * c + a13 * s;
	    out[4] = a10 * c - a00 * s;
	    out[5] = a11 * c - a01 * s;
	    out[6] = a12 * c - a02 * s;
	    out[7] = a13 * c - a03 * s;
	    return out;
	};

	/**
	 * Creates a matrix from a vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, dest, vec);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {vec3} v Translation vector
	 * @returns {mat4} out
	 */
	mat4.fromTranslation = function (out, v) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = 1;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 1;
	    out[11] = 0;
	    out[12] = v[0];
	    out[13] = v[1];
	    out[14] = v[2];
	    out[15] = 1;
	    return out;
	};

	/**
	 * Creates a matrix from a vector scaling
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.scale(dest, dest, vec);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {vec3} v Scaling vector
	 * @returns {mat4} out
	 */
	mat4.fromScaling = function (out, v) {
	    out[0] = v[0];
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = v[1];
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = v[2];
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	};

	/**
	 * Creates a matrix from a given angle around a given axis
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.rotate(dest, dest, rad, axis);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @param {vec3} axis the axis to rotate around
	 * @returns {mat4} out
	 */
	mat4.fromRotation = function (out, rad, axis) {
	    var x = axis[0],
	        y = axis[1],
	        z = axis[2],
	        len = Math.sqrt(x * x + y * y + z * z),
	        s,
	        c,
	        t;

	    if (Math.abs(len) < glMatrix.EPSILON) {
	        return null;
	    }

	    len = 1 / len;
	    x *= len;
	    y *= len;
	    z *= len;

	    s = Math.sin(rad);
	    c = Math.cos(rad);
	    t = 1 - c;

	    // Perform rotation-specific matrix multiplication
	    out[0] = x * x * t + c;
	    out[1] = y * x * t + z * s;
	    out[2] = z * x * t - y * s;
	    out[3] = 0;
	    out[4] = x * y * t - z * s;
	    out[5] = y * y * t + c;
	    out[6] = z * y * t + x * s;
	    out[7] = 0;
	    out[8] = x * z * t + y * s;
	    out[9] = y * z * t - x * s;
	    out[10] = z * z * t + c;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	};

	/**
	 * Creates a matrix from the given angle around the X axis
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.rotateX(dest, dest, rad);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.fromXRotation = function (out, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad);

	    // Perform axis-specific matrix multiplication
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = c;
	    out[6] = s;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = -s;
	    out[10] = c;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	};

	/**
	 * Creates a matrix from the given angle around the Y axis
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.rotateY(dest, dest, rad);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.fromYRotation = function (out, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad);

	    // Perform axis-specific matrix multiplication
	    out[0] = c;
	    out[1] = 0;
	    out[2] = -s;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = 1;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = s;
	    out[9] = 0;
	    out[10] = c;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	};

	/**
	 * Creates a matrix from the given angle around the Z axis
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.rotateZ(dest, dest, rad);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.fromZRotation = function (out, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad);

	    // Perform axis-specific matrix multiplication
	    out[0] = c;
	    out[1] = s;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = -s;
	    out[5] = c;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 1;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	};

	/**
	 * Creates a matrix from a quaternion rotation and vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, vec);
	 *     var quatMat = mat4.create();
	 *     quat4.toMat4(quat, quatMat);
	 *     mat4.multiply(dest, quatMat);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat4} q Rotation quaternion
	 * @param {vec3} v Translation vector
	 * @returns {mat4} out
	 */
	mat4.fromRotationTranslation = function (out, q, v) {
	    // Quaternion math
	    var x = q[0],
	        y = q[1],
	        z = q[2],
	        w = q[3],
	        x2 = x + x,
	        y2 = y + y,
	        z2 = z + z,
	        xx = x * x2,
	        xy = x * y2,
	        xz = x * z2,
	        yy = y * y2,
	        yz = y * z2,
	        zz = z * z2,
	        wx = w * x2,
	        wy = w * y2,
	        wz = w * z2;

	    out[0] = 1 - (yy + zz);
	    out[1] = xy + wz;
	    out[2] = xz - wy;
	    out[3] = 0;
	    out[4] = xy - wz;
	    out[5] = 1 - (xx + zz);
	    out[6] = yz + wx;
	    out[7] = 0;
	    out[8] = xz + wy;
	    out[9] = yz - wx;
	    out[10] = 1 - (xx + yy);
	    out[11] = 0;
	    out[12] = v[0];
	    out[13] = v[1];
	    out[14] = v[2];
	    out[15] = 1;

	    return out;
	};

	/**
	 * Creates a matrix from a quaternion rotation, vector translation and vector scale
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, vec);
	 *     var quatMat = mat4.create();
	 *     quat4.toMat4(quat, quatMat);
	 *     mat4.multiply(dest, quatMat);
	 *     mat4.scale(dest, scale)
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat4} q Rotation quaternion
	 * @param {vec3} v Translation vector
	 * @param {vec3} s Scaling vector
	 * @returns {mat4} out
	 */
	mat4.fromRotationTranslationScale = function (out, q, v, s) {
	    // Quaternion math
	    var x = q[0],
	        y = q[1],
	        z = q[2],
	        w = q[3],
	        x2 = x + x,
	        y2 = y + y,
	        z2 = z + z,
	        xx = x * x2,
	        xy = x * y2,
	        xz = x * z2,
	        yy = y * y2,
	        yz = y * z2,
	        zz = z * z2,
	        wx = w * x2,
	        wy = w * y2,
	        wz = w * z2,
	        sx = s[0],
	        sy = s[1],
	        sz = s[2];

	    out[0] = (1 - (yy + zz)) * sx;
	    out[1] = (xy + wz) * sx;
	    out[2] = (xz - wy) * sx;
	    out[3] = 0;
	    out[4] = (xy - wz) * sy;
	    out[5] = (1 - (xx + zz)) * sy;
	    out[6] = (yz + wx) * sy;
	    out[7] = 0;
	    out[8] = (xz + wy) * sz;
	    out[9] = (yz - wx) * sz;
	    out[10] = (1 - (xx + yy)) * sz;
	    out[11] = 0;
	    out[12] = v[0];
	    out[13] = v[1];
	    out[14] = v[2];
	    out[15] = 1;

	    return out;
	};

	/**
	 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, vec);
	 *     mat4.translate(dest, origin);
	 *     var quatMat = mat4.create();
	 *     quat4.toMat4(quat, quatMat);
	 *     mat4.multiply(dest, quatMat);
	 *     mat4.scale(dest, scale)
	 *     mat4.translate(dest, negativeOrigin);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat4} q Rotation quaternion
	 * @param {vec3} v Translation vector
	 * @param {vec3} s Scaling vector
	 * @param {vec3} o The origin vector around which to scale and rotate
	 * @returns {mat4} out
	 */
	mat4.fromRotationTranslationScaleOrigin = function (out, q, v, s, o) {
	    // Quaternion math
	    var x = q[0],
	        y = q[1],
	        z = q[2],
	        w = q[3],
	        x2 = x + x,
	        y2 = y + y,
	        z2 = z + z,
	        xx = x * x2,
	        xy = x * y2,
	        xz = x * z2,
	        yy = y * y2,
	        yz = y * z2,
	        zz = z * z2,
	        wx = w * x2,
	        wy = w * y2,
	        wz = w * z2,
	        sx = s[0],
	        sy = s[1],
	        sz = s[2],
	        ox = o[0],
	        oy = o[1],
	        oz = o[2];

	    out[0] = (1 - (yy + zz)) * sx;
	    out[1] = (xy + wz) * sx;
	    out[2] = (xz - wy) * sx;
	    out[3] = 0;
	    out[4] = (xy - wz) * sy;
	    out[5] = (1 - (xx + zz)) * sy;
	    out[6] = (yz + wx) * sy;
	    out[7] = 0;
	    out[8] = (xz + wy) * sz;
	    out[9] = (yz - wx) * sz;
	    out[10] = (1 - (xx + yy)) * sz;
	    out[11] = 0;
	    out[12] = v[0] + ox - (out[0] * ox + out[4] * oy + out[8] * oz);
	    out[13] = v[1] + oy - (out[1] * ox + out[5] * oy + out[9] * oz);
	    out[14] = v[2] + oz - (out[2] * ox + out[6] * oy + out[10] * oz);
	    out[15] = 1;

	    return out;
	};

	mat4.fromQuat = function (out, q) {
	    var x = q[0],
	        y = q[1],
	        z = q[2],
	        w = q[3],
	        x2 = x + x,
	        y2 = y + y,
	        z2 = z + z,
	        xx = x * x2,
	        yx = y * x2,
	        yy = y * y2,
	        zx = z * x2,
	        zy = z * y2,
	        zz = z * z2,
	        wx = w * x2,
	        wy = w * y2,
	        wz = w * z2;

	    out[0] = 1 - yy - zz;
	    out[1] = yx + wz;
	    out[2] = zx - wy;
	    out[3] = 0;

	    out[4] = yx - wz;
	    out[5] = 1 - xx - zz;
	    out[6] = zy + wx;
	    out[7] = 0;

	    out[8] = zx + wy;
	    out[9] = zy - wx;
	    out[10] = 1 - xx - yy;
	    out[11] = 0;

	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;

	    return out;
	};

	/**
	 * Generates a frustum matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {Number} left Left bound of the frustum
	 * @param {Number} right Right bound of the frustum
	 * @param {Number} bottom Bottom bound of the frustum
	 * @param {Number} top Top bound of the frustum
	 * @param {Number} near Near bound of the frustum
	 * @param {Number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	mat4.frustum = function (out, left, right, bottom, top, near, far) {
	    var rl = 1 / (right - left),
	        tb = 1 / (top - bottom),
	        nf = 1 / (near - far);
	    out[0] = near * 2 * rl;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = near * 2 * tb;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = (right + left) * rl;
	    out[9] = (top + bottom) * tb;
	    out[10] = (far + near) * nf;
	    out[11] = -1;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = far * near * 2 * nf;
	    out[15] = 0;
	    return out;
	};

	/**
	 * Generates a perspective projection matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {number} fovy Vertical field of view in radians
	 * @param {number} aspect Aspect ratio. typically viewport width/height
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	mat4.perspective = function (out, fovy, aspect, near, far) {
	    var f = 1.0 / Math.tan(fovy / 2),
	        nf = 1 / (near - far);
	    out[0] = f / aspect;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = f;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = (far + near) * nf;
	    out[11] = -1;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 2 * far * near * nf;
	    out[15] = 0;
	    return out;
	};

	/**
	 * Generates a perspective projection matrix with the given field of view.
	 * This is primarily useful for generating projection matrices to be used
	 * with the still experiemental WebVR API.
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {number} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	mat4.perspectiveFromFieldOfView = function (out, fov, near, far) {
	    var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0),
	        downTan = Math.tan(fov.downDegrees * Math.PI / 180.0),
	        leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0),
	        rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0),
	        xScale = 2.0 / (leftTan + rightTan),
	        yScale = 2.0 / (upTan + downTan);

	    out[0] = xScale;
	    out[1] = 0.0;
	    out[2] = 0.0;
	    out[3] = 0.0;
	    out[4] = 0.0;
	    out[5] = yScale;
	    out[6] = 0.0;
	    out[7] = 0.0;
	    out[8] = -((leftTan - rightTan) * xScale * 0.5);
	    out[9] = (upTan - downTan) * yScale * 0.5;
	    out[10] = far / (near - far);
	    out[11] = -1.0;
	    out[12] = 0.0;
	    out[13] = 0.0;
	    out[14] = far * near / (near - far);
	    out[15] = 0.0;
	    return out;
	};

	/**
	 * Generates a orthogonal projection matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {number} left Left bound of the frustum
	 * @param {number} right Right bound of the frustum
	 * @param {number} bottom Bottom bound of the frustum
	 * @param {number} top Top bound of the frustum
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	mat4.ortho = function (out, left, right, bottom, top, near, far) {
	    var lr = 1 / (left - right),
	        bt = 1 / (bottom - top),
	        nf = 1 / (near - far);
	    out[0] = -2 * lr;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = -2 * bt;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 2 * nf;
	    out[11] = 0;
	    out[12] = (left + right) * lr;
	    out[13] = (top + bottom) * bt;
	    out[14] = (far + near) * nf;
	    out[15] = 1;
	    return out;
	};

	/**
	 * Generates a look-at matrix with the given eye position, focal point, and up axis
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {vec3} eye Position of the viewer
	 * @param {vec3} center Point the viewer is looking at
	 * @param {vec3} up vec3 pointing up
	 * @returns {mat4} out
	 */
	mat4.lookAt = function (out, eye, center, up) {
	    var x0,
	        x1,
	        x2,
	        y0,
	        y1,
	        y2,
	        z0,
	        z1,
	        z2,
	        len,
	        eyex = eye[0],
	        eyey = eye[1],
	        eyez = eye[2],
	        upx = up[0],
	        upy = up[1],
	        upz = up[2],
	        centerx = center[0],
	        centery = center[1],
	        centerz = center[2];

	    if (Math.abs(eyex - centerx) < glMatrix.EPSILON && Math.abs(eyey - centery) < glMatrix.EPSILON && Math.abs(eyez - centerz) < glMatrix.EPSILON) {
	        return mat4.identity(out);
	    }

	    z0 = eyex - centerx;
	    z1 = eyey - centery;
	    z2 = eyez - centerz;

	    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
	    z0 *= len;
	    z1 *= len;
	    z2 *= len;

	    x0 = upy * z2 - upz * z1;
	    x1 = upz * z0 - upx * z2;
	    x2 = upx * z1 - upy * z0;
	    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
	    if (!len) {
	        x0 = 0;
	        x1 = 0;
	        x2 = 0;
	    } else {
	        len = 1 / len;
	        x0 *= len;
	        x1 *= len;
	        x2 *= len;
	    }

	    y0 = z1 * x2 - z2 * x1;
	    y1 = z2 * x0 - z0 * x2;
	    y2 = z0 * x1 - z1 * x0;

	    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
	    if (!len) {
	        y0 = 0;
	        y1 = 0;
	        y2 = 0;
	    } else {
	        len = 1 / len;
	        y0 *= len;
	        y1 *= len;
	        y2 *= len;
	    }

	    out[0] = x0;
	    out[1] = y0;
	    out[2] = z0;
	    out[3] = 0;
	    out[4] = x1;
	    out[5] = y1;
	    out[6] = z1;
	    out[7] = 0;
	    out[8] = x2;
	    out[9] = y2;
	    out[10] = z2;
	    out[11] = 0;
	    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
	    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
	    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
	    out[15] = 1;

	    return out;
	};

	/**
	 * Returns a string representation of a mat4
	 *
	 * @param {mat4} mat matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	mat4.str = function (a) {
	    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' + a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
	};

	/**
	 * Returns Frobenius norm of a mat4
	 *
	 * @param {mat4} a the matrix to calculate Frobenius norm of
	 * @returns {Number} Frobenius norm
	 */
	mat4.frob = function (a) {
	    return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2));
	};

	module.exports = mat4;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */

	var glMatrix = __webpack_require__(10);
	var mat3 = __webpack_require__(13);
	var vec3 = __webpack_require__(16);
	var vec4 = __webpack_require__(17);

	/**
	 * @class Quaternion
	 * @name quat
	 */
	var quat = {};

	/**
	 * Creates a new identity quat
	 *
	 * @returns {quat} a new quaternion
	 */
	quat.create = function () {
	    var out = new glMatrix.ARRAY_TYPE(4);
	    out[0] = 0;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 1;
	    return out;
	};

	/**
	 * Sets a quaternion to represent the shortest rotation from one
	 * vector to another.
	 *
	 * Both vectors are assumed to be unit length.
	 *
	 * @param {quat} out the receiving quaternion.
	 * @param {vec3} a the initial vector
	 * @param {vec3} b the destination vector
	 * @returns {quat} out
	 */
	quat.rotationTo = function () {
	    var tmpvec3 = vec3.create();
	    var xUnitVec3 = vec3.fromValues(1, 0, 0);
	    var yUnitVec3 = vec3.fromValues(0, 1, 0);

	    return function (out, a, b) {
	        var dot = vec3.dot(a, b);
	        if (dot < -0.999999) {
	            vec3.cross(tmpvec3, xUnitVec3, a);
	            if (vec3.length(tmpvec3) < 0.000001) vec3.cross(tmpvec3, yUnitVec3, a);
	            vec3.normalize(tmpvec3, tmpvec3);
	            quat.setAxisAngle(out, tmpvec3, Math.PI);
	            return out;
	        } else if (dot > 0.999999) {
	            out[0] = 0;
	            out[1] = 0;
	            out[2] = 0;
	            out[3] = 1;
	            return out;
	        } else {
	            vec3.cross(tmpvec3, a, b);
	            out[0] = tmpvec3[0];
	            out[1] = tmpvec3[1];
	            out[2] = tmpvec3[2];
	            out[3] = 1 + dot;
	            return quat.normalize(out, out);
	        }
	    };
	}();

	/**
	 * Sets the specified quaternion with values corresponding to the given
	 * axes. Each axis is a vec3 and is expected to be unit length and
	 * perpendicular to all other specified axes.
	 *
	 * @param {vec3} view  the vector representing the viewing direction
	 * @param {vec3} right the vector representing the local "right" direction
	 * @param {vec3} up    the vector representing the local "up" direction
	 * @returns {quat} out
	 */
	quat.setAxes = function () {
	    var matr = mat3.create();

	    return function (out, view, right, up) {
	        matr[0] = right[0];
	        matr[3] = right[1];
	        matr[6] = right[2];

	        matr[1] = up[0];
	        matr[4] = up[1];
	        matr[7] = up[2];

	        matr[2] = -view[0];
	        matr[5] = -view[1];
	        matr[8] = -view[2];

	        return quat.normalize(out, quat.fromMat3(out, matr));
	    };
	}();

	/**
	 * Creates a new quat initialized with values from an existing quaternion
	 *
	 * @param {quat} a quaternion to clone
	 * @returns {quat} a new quaternion
	 * @function
	 */
	quat.clone = vec4.clone;

	/**
	 * Creates a new quat initialized with the given values
	 *
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @param {Number} w W component
	 * @returns {quat} a new quaternion
	 * @function
	 */
	quat.fromValues = vec4.fromValues;

	/**
	 * Copy the values from one quat to another
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the source quaternion
	 * @returns {quat} out
	 * @function
	 */
	quat.copy = vec4.copy;

	/**
	 * Set the components of a quat to the given values
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @param {Number} w W component
	 * @returns {quat} out
	 * @function
	 */
	quat.set = vec4.set;

	/**
	 * Set a quat to the identity quaternion
	 *
	 * @param {quat} out the receiving quaternion
	 * @returns {quat} out
	 */
	quat.identity = function (out) {
	    out[0] = 0;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 1;
	    return out;
	};

	/**
	 * Sets a quat from the given angle and rotation axis,
	 * then returns it.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {vec3} axis the axis around which to rotate
	 * @param {Number} rad the angle in radians
	 * @returns {quat} out
	 **/
	quat.setAxisAngle = function (out, axis, rad) {
	    rad = rad * 0.5;
	    var s = Math.sin(rad);
	    out[0] = s * axis[0];
	    out[1] = s * axis[1];
	    out[2] = s * axis[2];
	    out[3] = Math.cos(rad);
	    return out;
	};

	/**
	 * Adds two quat's
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @returns {quat} out
	 * @function
	 */
	quat.add = vec4.add;

	/**
	 * Multiplies two quat's
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @returns {quat} out
	 */
	quat.multiply = function (out, a, b) {
	    var ax = a[0],
	        ay = a[1],
	        az = a[2],
	        aw = a[3],
	        bx = b[0],
	        by = b[1],
	        bz = b[2],
	        bw = b[3];

	    out[0] = ax * bw + aw * bx + ay * bz - az * by;
	    out[1] = ay * bw + aw * by + az * bx - ax * bz;
	    out[2] = az * bw + aw * bz + ax * by - ay * bx;
	    out[3] = aw * bw - ax * bx - ay * by - az * bz;
	    return out;
	};

	/**
	 * Alias for {@link quat.multiply}
	 * @function
	 */
	quat.mul = quat.multiply;

	/**
	 * Scales a quat by a scalar number
	 *
	 * @param {quat} out the receiving vector
	 * @param {quat} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {quat} out
	 * @function
	 */
	quat.scale = vec4.scale;

	/**
	 * Rotates a quaternion by the given angle about the X axis
	 *
	 * @param {quat} out quat receiving operation result
	 * @param {quat} a quat to rotate
	 * @param {number} rad angle (in radians) to rotate
	 * @returns {quat} out
	 */
	quat.rotateX = function (out, a, rad) {
	    rad *= 0.5;

	    var ax = a[0],
	        ay = a[1],
	        az = a[2],
	        aw = a[3],
	        bx = Math.sin(rad),
	        bw = Math.cos(rad);

	    out[0] = ax * bw + aw * bx;
	    out[1] = ay * bw + az * bx;
	    out[2] = az * bw - ay * bx;
	    out[3] = aw * bw - ax * bx;
	    return out;
	};

	/**
	 * Rotates a quaternion by the given angle about the Y axis
	 *
	 * @param {quat} out quat receiving operation result
	 * @param {quat} a quat to rotate
	 * @param {number} rad angle (in radians) to rotate
	 * @returns {quat} out
	 */
	quat.rotateY = function (out, a, rad) {
	    rad *= 0.5;

	    var ax = a[0],
	        ay = a[1],
	        az = a[2],
	        aw = a[3],
	        by = Math.sin(rad),
	        bw = Math.cos(rad);

	    out[0] = ax * bw - az * by;
	    out[1] = ay * bw + aw * by;
	    out[2] = az * bw + ax * by;
	    out[3] = aw * bw - ay * by;
	    return out;
	};

	/**
	 * Rotates a quaternion by the given angle about the Z axis
	 *
	 * @param {quat} out quat receiving operation result
	 * @param {quat} a quat to rotate
	 * @param {number} rad angle (in radians) to rotate
	 * @returns {quat} out
	 */
	quat.rotateZ = function (out, a, rad) {
	    rad *= 0.5;

	    var ax = a[0],
	        ay = a[1],
	        az = a[2],
	        aw = a[3],
	        bz = Math.sin(rad),
	        bw = Math.cos(rad);

	    out[0] = ax * bw + ay * bz;
	    out[1] = ay * bw - ax * bz;
	    out[2] = az * bw + aw * bz;
	    out[3] = aw * bw - az * bz;
	    return out;
	};

	/**
	 * Calculates the W component of a quat from the X, Y, and Z components.
	 * Assumes that quaternion is 1 unit in length.
	 * Any existing W component will be ignored.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a quat to calculate W component of
	 * @returns {quat} out
	 */
	quat.calculateW = function (out, a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2];

	    out[0] = x;
	    out[1] = y;
	    out[2] = z;
	    out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
	    return out;
	};

	/**
	 * Calculates the dot product of two quat's
	 *
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @returns {Number} dot product of a and b
	 * @function
	 */
	quat.dot = vec4.dot;

	/**
	 * Performs a linear interpolation between two quat's
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {quat} out
	 * @function
	 */
	quat.lerp = vec4.lerp;

	/**
	 * Performs a spherical linear interpolation between two quat
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {quat} out
	 */
	quat.slerp = function (out, a, b, t) {
	    // benchmarks:
	    //    http://jsperf.com/quaternion-slerp-implementations

	    var ax = a[0],
	        ay = a[1],
	        az = a[2],
	        aw = a[3],
	        bx = b[0],
	        by = b[1],
	        bz = b[2],
	        bw = b[3];

	    var omega, cosom, sinom, scale0, scale1;

	    // calc cosine
	    cosom = ax * bx + ay * by + az * bz + aw * bw;
	    // adjust signs (if necessary)
	    if (cosom < 0.0) {
	        cosom = -cosom;
	        bx = -bx;
	        by = -by;
	        bz = -bz;
	        bw = -bw;
	    }
	    // calculate coefficients
	    if (1.0 - cosom > 0.000001) {
	        // standard case (slerp)
	        omega = Math.acos(cosom);
	        sinom = Math.sin(omega);
	        scale0 = Math.sin((1.0 - t) * omega) / sinom;
	        scale1 = Math.sin(t * omega) / sinom;
	    } else {
	        // "from" and "to" quaternions are very close
	        //  ... so we can do a linear interpolation
	        scale0 = 1.0 - t;
	        scale1 = t;
	    }
	    // calculate final values
	    out[0] = scale0 * ax + scale1 * bx;
	    out[1] = scale0 * ay + scale1 * by;
	    out[2] = scale0 * az + scale1 * bz;
	    out[3] = scale0 * aw + scale1 * bw;

	    return out;
	};

	/**
	 * Performs a spherical linear interpolation with two control points
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @param {quat} c the third operand
	 * @param {quat} d the fourth operand
	 * @param {Number} t interpolation amount
	 * @returns {quat} out
	 */
	quat.sqlerp = function () {
	    var temp1 = quat.create();
	    var temp2 = quat.create();

	    return function (out, a, b, c, d, t) {
	        quat.slerp(temp1, a, d, t);
	        quat.slerp(temp2, b, c, t);
	        quat.slerp(out, temp1, temp2, 2 * t * (1 - t));

	        return out;
	    };
	}();

	/**
	 * Calculates the inverse of a quat
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a quat to calculate inverse of
	 * @returns {quat} out
	 */
	quat.invert = function (out, a) {
	    var a0 = a[0],
	        a1 = a[1],
	        a2 = a[2],
	        a3 = a[3],
	        dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3,
	        invDot = dot ? 1.0 / dot : 0;

	    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

	    out[0] = -a0 * invDot;
	    out[1] = -a1 * invDot;
	    out[2] = -a2 * invDot;
	    out[3] = a3 * invDot;
	    return out;
	};

	/**
	 * Calculates the conjugate of a quat
	 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a quat to calculate conjugate of
	 * @returns {quat} out
	 */
	quat.conjugate = function (out, a) {
	    out[0] = -a[0];
	    out[1] = -a[1];
	    out[2] = -a[2];
	    out[3] = a[3];
	    return out;
	};

	/**
	 * Calculates the length of a quat
	 *
	 * @param {quat} a vector to calculate length of
	 * @returns {Number} length of a
	 * @function
	 */
	quat.length = vec4.length;

	/**
	 * Alias for {@link quat.length}
	 * @function
	 */
	quat.len = quat.length;

	/**
	 * Calculates the squared length of a quat
	 *
	 * @param {quat} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 * @function
	 */
	quat.squaredLength = vec4.squaredLength;

	/**
	 * Alias for {@link quat.squaredLength}
	 * @function
	 */
	quat.sqrLen = quat.squaredLength;

	/**
	 * Normalize a quat
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a quaternion to normalize
	 * @returns {quat} out
	 * @function
	 */
	quat.normalize = vec4.normalize;

	/**
	 * Creates a quaternion from the given 3x3 rotation matrix.
	 *
	 * NOTE: The resultant quaternion is not normalized, so you should be sure
	 * to renormalize the quaternion yourself where necessary.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {mat3} m rotation matrix
	 * @returns {quat} out
	 * @function
	 */
	quat.fromMat3 = function (out, m) {
	    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
	    // article "Quaternion Calculus and Fast Animation".
	    var fTrace = m[0] + m[4] + m[8];
	    var fRoot;

	    if (fTrace > 0.0) {
	        // |w| > 1/2, may as well choose w > 1/2
	        fRoot = Math.sqrt(fTrace + 1.0); // 2w
	        out[3] = 0.5 * fRoot;
	        fRoot = 0.5 / fRoot; // 1/(4w)
	        out[0] = (m[5] - m[7]) * fRoot;
	        out[1] = (m[6] - m[2]) * fRoot;
	        out[2] = (m[1] - m[3]) * fRoot;
	    } else {
	        // |w| <= 1/2
	        var i = 0;
	        if (m[4] > m[0]) i = 1;
	        if (m[8] > m[i * 3 + i]) i = 2;
	        var j = (i + 1) % 3;
	        var k = (i + 2) % 3;

	        fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
	        out[i] = 0.5 * fRoot;
	        fRoot = 0.5 / fRoot;
	        out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
	        out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
	        out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
	    }

	    return out;
	};

	/**
	 * Returns a string representation of a quatenion
	 *
	 * @param {quat} vec vector to represent as a string
	 * @returns {String} string representation of the vector
	 */
	quat.str = function (a) {
	    return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
	};

	module.exports = quat;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */

	var glMatrix = __webpack_require__(10);

	/**
	 * @class 3 Dimensional Vector
	 * @name vec3
	 */
	var vec3 = {};

	/**
	 * Creates a new, empty vec3
	 *
	 * @returns {vec3} a new 3D vector
	 */
	vec3.create = function () {
	    var out = new glMatrix.ARRAY_TYPE(3);
	    out[0] = 0;
	    out[1] = 0;
	    out[2] = 0;
	    return out;
	};

	/**
	 * Creates a new vec3 initialized with values from an existing vector
	 *
	 * @param {vec3} a vector to clone
	 * @returns {vec3} a new 3D vector
	 */
	vec3.clone = function (a) {
	    var out = new glMatrix.ARRAY_TYPE(3);
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    return out;
	};

	/**
	 * Creates a new vec3 initialized with the given values
	 *
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @returns {vec3} a new 3D vector
	 */
	vec3.fromValues = function (x, y, z) {
	    var out = new glMatrix.ARRAY_TYPE(3);
	    out[0] = x;
	    out[1] = y;
	    out[2] = z;
	    return out;
	};

	/**
	 * Copy the values from one vec3 to another
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the source vector
	 * @returns {vec3} out
	 */
	vec3.copy = function (out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    return out;
	};

	/**
	 * Set the components of a vec3 to the given values
	 *
	 * @param {vec3} out the receiving vector
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @returns {vec3} out
	 */
	vec3.set = function (out, x, y, z) {
	    out[0] = x;
	    out[1] = y;
	    out[2] = z;
	    return out;
	};

	/**
	 * Adds two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	vec3.add = function (out, a, b) {
	    out[0] = a[0] + b[0];
	    out[1] = a[1] + b[1];
	    out[2] = a[2] + b[2];
	    return out;
	};

	/**
	 * Subtracts vector b from vector a
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	vec3.subtract = function (out, a, b) {
	    out[0] = a[0] - b[0];
	    out[1] = a[1] - b[1];
	    out[2] = a[2] - b[2];
	    return out;
	};

	/**
	 * Alias for {@link vec3.subtract}
	 * @function
	 */
	vec3.sub = vec3.subtract;

	/**
	 * Multiplies two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	vec3.multiply = function (out, a, b) {
	    out[0] = a[0] * b[0];
	    out[1] = a[1] * b[1];
	    out[2] = a[2] * b[2];
	    return out;
	};

	/**
	 * Alias for {@link vec3.multiply}
	 * @function
	 */
	vec3.mul = vec3.multiply;

	/**
	 * Divides two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	vec3.divide = function (out, a, b) {
	    out[0] = a[0] / b[0];
	    out[1] = a[1] / b[1];
	    out[2] = a[2] / b[2];
	    return out;
	};

	/**
	 * Alias for {@link vec3.divide}
	 * @function
	 */
	vec3.div = vec3.divide;

	/**
	 * Returns the minimum of two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	vec3.min = function (out, a, b) {
	    out[0] = Math.min(a[0], b[0]);
	    out[1] = Math.min(a[1], b[1]);
	    out[2] = Math.min(a[2], b[2]);
	    return out;
	};

	/**
	 * Returns the maximum of two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	vec3.max = function (out, a, b) {
	    out[0] = Math.max(a[0], b[0]);
	    out[1] = Math.max(a[1], b[1]);
	    out[2] = Math.max(a[2], b[2]);
	    return out;
	};

	/**
	 * Scales a vec3 by a scalar number
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {vec3} out
	 */
	vec3.scale = function (out, a, b) {
	    out[0] = a[0] * b;
	    out[1] = a[1] * b;
	    out[2] = a[2] * b;
	    return out;
	};

	/**
	 * Adds two vec3's after scaling the second operand by a scalar value
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @param {Number} scale the amount to scale b by before adding
	 * @returns {vec3} out
	 */
	vec3.scaleAndAdd = function (out, a, b, scale) {
	    out[0] = a[0] + b[0] * scale;
	    out[1] = a[1] + b[1] * scale;
	    out[2] = a[2] + b[2] * scale;
	    return out;
	};

	/**
	 * Calculates the euclidian distance between two vec3's
	 *
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {Number} distance between a and b
	 */
	vec3.distance = function (a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1],
	        z = b[2] - a[2];
	    return Math.sqrt(x * x + y * y + z * z);
	};

	/**
	 * Alias for {@link vec3.distance}
	 * @function
	 */
	vec3.dist = vec3.distance;

	/**
	 * Calculates the squared euclidian distance between two vec3's
	 *
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {Number} squared distance between a and b
	 */
	vec3.squaredDistance = function (a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1],
	        z = b[2] - a[2];
	    return x * x + y * y + z * z;
	};

	/**
	 * Alias for {@link vec3.squaredDistance}
	 * @function
	 */
	vec3.sqrDist = vec3.squaredDistance;

	/**
	 * Calculates the length of a vec3
	 *
	 * @param {vec3} a vector to calculate length of
	 * @returns {Number} length of a
	 */
	vec3.length = function (a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2];
	    return Math.sqrt(x * x + y * y + z * z);
	};

	/**
	 * Alias for {@link vec3.length}
	 * @function
	 */
	vec3.len = vec3.length;

	/**
	 * Calculates the squared length of a vec3
	 *
	 * @param {vec3} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 */
	vec3.squaredLength = function (a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2];
	    return x * x + y * y + z * z;
	};

	/**
	 * Alias for {@link vec3.squaredLength}
	 * @function
	 */
	vec3.sqrLen = vec3.squaredLength;

	/**
	 * Negates the components of a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to negate
	 * @returns {vec3} out
	 */
	vec3.negate = function (out, a) {
	    out[0] = -a[0];
	    out[1] = -a[1];
	    out[2] = -a[2];
	    return out;
	};

	/**
	 * Returns the inverse of the components of a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to invert
	 * @returns {vec3} out
	 */
	vec3.inverse = function (out, a) {
	    out[0] = 1.0 / a[0];
	    out[1] = 1.0 / a[1];
	    out[2] = 1.0 / a[2];
	    return out;
	};

	/**
	 * Normalize a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to normalize
	 * @returns {vec3} out
	 */
	vec3.normalize = function (out, a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2];
	    var len = x * x + y * y + z * z;
	    if (len > 0) {
	        //TODO: evaluate use of glm_invsqrt here?
	        len = 1 / Math.sqrt(len);
	        out[0] = a[0] * len;
	        out[1] = a[1] * len;
	        out[2] = a[2] * len;
	    }
	    return out;
	};

	/**
	 * Calculates the dot product of two vec3's
	 *
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {Number} dot product of a and b
	 */
	vec3.dot = function (a, b) {
	    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	};

	/**
	 * Computes the cross product of two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	vec3.cross = function (out, a, b) {
	    var ax = a[0],
	        ay = a[1],
	        az = a[2],
	        bx = b[0],
	        by = b[1],
	        bz = b[2];

	    out[0] = ay * bz - az * by;
	    out[1] = az * bx - ax * bz;
	    out[2] = ax * by - ay * bx;
	    return out;
	};

	/**
	 * Performs a linear interpolation between two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {vec3} out
	 */
	vec3.lerp = function (out, a, b, t) {
	    var ax = a[0],
	        ay = a[1],
	        az = a[2];
	    out[0] = ax + t * (b[0] - ax);
	    out[1] = ay + t * (b[1] - ay);
	    out[2] = az + t * (b[2] - az);
	    return out;
	};

	/**
	 * Performs a hermite interpolation with two control points
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @param {vec3} c the third operand
	 * @param {vec3} d the fourth operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {vec3} out
	 */
	vec3.hermite = function (out, a, b, c, d, t) {
	    var factorTimes2 = t * t,
	        factor1 = factorTimes2 * (2 * t - 3) + 1,
	        factor2 = factorTimes2 * (t - 2) + t,
	        factor3 = factorTimes2 * (t - 1),
	        factor4 = factorTimes2 * (3 - 2 * t);

	    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
	    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
	    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;

	    return out;
	};

	/**
	 * Performs a bezier interpolation with two control points
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @param {vec3} c the third operand
	 * @param {vec3} d the fourth operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {vec3} out
	 */
	vec3.bezier = function (out, a, b, c, d, t) {
	    var inverseFactor = 1 - t,
	        inverseFactorTimesTwo = inverseFactor * inverseFactor,
	        factorTimes2 = t * t,
	        factor1 = inverseFactorTimesTwo * inverseFactor,
	        factor2 = 3 * t * inverseFactorTimesTwo,
	        factor3 = 3 * factorTimes2 * inverseFactor,
	        factor4 = factorTimes2 * t;

	    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
	    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
	    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;

	    return out;
	};

	/**
	 * Generates a random vector with the given scale
	 *
	 * @param {vec3} out the receiving vector
	 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
	 * @returns {vec3} out
	 */
	vec3.random = function (out, scale) {
	    scale = scale || 1.0;

	    var r = glMatrix.RANDOM() * 2.0 * Math.PI;
	    var z = glMatrix.RANDOM() * 2.0 - 1.0;
	    var zScale = Math.sqrt(1.0 - z * z) * scale;

	    out[0] = Math.cos(r) * zScale;
	    out[1] = Math.sin(r) * zScale;
	    out[2] = z * scale;
	    return out;
	};

	/**
	 * Transforms the vec3 with a mat4.
	 * 4th vector component is implicitly '1'
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to transform
	 * @param {mat4} m matrix to transform with
	 * @returns {vec3} out
	 */
	vec3.transformMat4 = function (out, a, m) {
	    var x = a[0],
	        y = a[1],
	        z = a[2],
	        w = m[3] * x + m[7] * y + m[11] * z + m[15];
	    w = w || 1.0;
	    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
	    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
	    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
	    return out;
	};

	/**
	 * Transforms the vec3 with a mat3.
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to transform
	 * @param {mat4} m the 3x3 matrix to transform with
	 * @returns {vec3} out
	 */
	vec3.transformMat3 = function (out, a, m) {
	    var x = a[0],
	        y = a[1],
	        z = a[2];
	    out[0] = x * m[0] + y * m[3] + z * m[6];
	    out[1] = x * m[1] + y * m[4] + z * m[7];
	    out[2] = x * m[2] + y * m[5] + z * m[8];
	    return out;
	};

	/**
	 * Transforms the vec3 with a quat
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to transform
	 * @param {quat} q quaternion to transform with
	 * @returns {vec3} out
	 */
	vec3.transformQuat = function (out, a, q) {
	    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

	    var x = a[0],
	        y = a[1],
	        z = a[2],
	        qx = q[0],
	        qy = q[1],
	        qz = q[2],
	        qw = q[3],


	    // calculate quat * vec
	    ix = qw * x + qy * z - qz * y,
	        iy = qw * y + qz * x - qx * z,
	        iz = qw * z + qx * y - qy * x,
	        iw = -qx * x - qy * y - qz * z;

	    // calculate result * inverse quat
	    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
	    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
	    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
	    return out;
	};

	/**
	 * Rotate a 3D vector around the x-axis
	 * @param {vec3} out The receiving vec3
	 * @param {vec3} a The vec3 point to rotate
	 * @param {vec3} b The origin of the rotation
	 * @param {Number} c The angle of rotation
	 * @returns {vec3} out
	 */
	vec3.rotateX = function (out, a, b, c) {
	    var p = [],
	        r = [];
	    //Translate point to the origin
	    p[0] = a[0] - b[0];
	    p[1] = a[1] - b[1];
	    p[2] = a[2] - b[2];

	    //perform rotation
	    r[0] = p[0];
	    r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c);
	    r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c);

	    //translate to correct position
	    out[0] = r[0] + b[0];
	    out[1] = r[1] + b[1];
	    out[2] = r[2] + b[2];

	    return out;
	};

	/**
	 * Rotate a 3D vector around the y-axis
	 * @param {vec3} out The receiving vec3
	 * @param {vec3} a The vec3 point to rotate
	 * @param {vec3} b The origin of the rotation
	 * @param {Number} c The angle of rotation
	 * @returns {vec3} out
	 */
	vec3.rotateY = function (out, a, b, c) {
	    var p = [],
	        r = [];
	    //Translate point to the origin
	    p[0] = a[0] - b[0];
	    p[1] = a[1] - b[1];
	    p[2] = a[2] - b[2];

	    //perform rotation
	    r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c);
	    r[1] = p[1];
	    r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c);

	    //translate to correct position
	    out[0] = r[0] + b[0];
	    out[1] = r[1] + b[1];
	    out[2] = r[2] + b[2];

	    return out;
	};

	/**
	 * Rotate a 3D vector around the z-axis
	 * @param {vec3} out The receiving vec3
	 * @param {vec3} a The vec3 point to rotate
	 * @param {vec3} b The origin of the rotation
	 * @param {Number} c The angle of rotation
	 * @returns {vec3} out
	 */
	vec3.rotateZ = function (out, a, b, c) {
	    var p = [],
	        r = [];
	    //Translate point to the origin
	    p[0] = a[0] - b[0];
	    p[1] = a[1] - b[1];
	    p[2] = a[2] - b[2];

	    //perform rotation
	    r[0] = p[0] * Math.cos(c) - p[1] * Math.sin(c);
	    r[1] = p[0] * Math.sin(c) + p[1] * Math.cos(c);
	    r[2] = p[2];

	    //translate to correct position
	    out[0] = r[0] + b[0];
	    out[1] = r[1] + b[1];
	    out[2] = r[2] + b[2];

	    return out;
	};

	/**
	 * Perform some operation over an array of vec3s.
	 *
	 * @param {Array} a the array of vectors to iterate over
	 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
	 * @param {Number} offset Number of elements to skip at the beginning of the array
	 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
	 * @param {Function} fn Function to call for each vector in the array
	 * @param {Object} [arg] additional argument to pass to fn
	 * @returns {Array} a
	 * @function
	 */
	vec3.forEach = function () {
	    var vec = vec3.create();

	    return function (a, stride, offset, count, fn, arg) {
	        var i, l;
	        if (!stride) {
	            stride = 3;
	        }

	        if (!offset) {
	            offset = 0;
	        }

	        if (count) {
	            l = Math.min(count * stride + offset, a.length);
	        } else {
	            l = a.length;
	        }

	        for (i = offset; i < l; i += stride) {
	            vec[0] = a[i];vec[1] = a[i + 1];vec[2] = a[i + 2];
	            fn(vec, vec, arg);
	            a[i] = vec[0];a[i + 1] = vec[1];a[i + 2] = vec[2];
	        }

	        return a;
	    };
	}();

	/**
	 * Get the angle between two 3D vectors
	 * @param {vec3} a The first operand
	 * @param {vec3} b The second operand
	 * @returns {Number} The angle in radians
	 */
	vec3.angle = function (a, b) {

	    var tempA = vec3.fromValues(a[0], a[1], a[2]);
	    var tempB = vec3.fromValues(b[0], b[1], b[2]);

	    vec3.normalize(tempA, tempA);
	    vec3.normalize(tempB, tempB);

	    var cosine = vec3.dot(tempA, tempB);

	    if (cosine > 1.0) {
	        return 0;
	    } else {
	        return Math.acos(cosine);
	    }
	};

	/**
	 * Returns a string representation of a vector
	 *
	 * @param {vec3} vec vector to represent as a string
	 * @returns {String} string representation of the vector
	 */
	vec3.str = function (a) {
	    return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
	};

	module.exports = vec3;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */

	var glMatrix = __webpack_require__(10);

	/**
	 * @class 4 Dimensional Vector
	 * @name vec4
	 */
	var vec4 = {};

	/**
	 * Creates a new, empty vec4
	 *
	 * @returns {vec4} a new 4D vector
	 */
	vec4.create = function () {
	    var out = new glMatrix.ARRAY_TYPE(4);
	    out[0] = 0;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    return out;
	};

	/**
	 * Creates a new vec4 initialized with values from an existing vector
	 *
	 * @param {vec4} a vector to clone
	 * @returns {vec4} a new 4D vector
	 */
	vec4.clone = function (a) {
	    var out = new glMatrix.ARRAY_TYPE(4);
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    return out;
	};

	/**
	 * Creates a new vec4 initialized with the given values
	 *
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @param {Number} w W component
	 * @returns {vec4} a new 4D vector
	 */
	vec4.fromValues = function (x, y, z, w) {
	    var out = new glMatrix.ARRAY_TYPE(4);
	    out[0] = x;
	    out[1] = y;
	    out[2] = z;
	    out[3] = w;
	    return out;
	};

	/**
	 * Copy the values from one vec4 to another
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the source vector
	 * @returns {vec4} out
	 */
	vec4.copy = function (out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    return out;
	};

	/**
	 * Set the components of a vec4 to the given values
	 *
	 * @param {vec4} out the receiving vector
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @param {Number} w W component
	 * @returns {vec4} out
	 */
	vec4.set = function (out, x, y, z, w) {
	    out[0] = x;
	    out[1] = y;
	    out[2] = z;
	    out[3] = w;
	    return out;
	};

	/**
	 * Adds two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	vec4.add = function (out, a, b) {
	    out[0] = a[0] + b[0];
	    out[1] = a[1] + b[1];
	    out[2] = a[2] + b[2];
	    out[3] = a[3] + b[3];
	    return out;
	};

	/**
	 * Subtracts vector b from vector a
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	vec4.subtract = function (out, a, b) {
	    out[0] = a[0] - b[0];
	    out[1] = a[1] - b[1];
	    out[2] = a[2] - b[2];
	    out[3] = a[3] - b[3];
	    return out;
	};

	/**
	 * Alias for {@link vec4.subtract}
	 * @function
	 */
	vec4.sub = vec4.subtract;

	/**
	 * Multiplies two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	vec4.multiply = function (out, a, b) {
	    out[0] = a[0] * b[0];
	    out[1] = a[1] * b[1];
	    out[2] = a[2] * b[2];
	    out[3] = a[3] * b[3];
	    return out;
	};

	/**
	 * Alias for {@link vec4.multiply}
	 * @function
	 */
	vec4.mul = vec4.multiply;

	/**
	 * Divides two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	vec4.divide = function (out, a, b) {
	    out[0] = a[0] / b[0];
	    out[1] = a[1] / b[1];
	    out[2] = a[2] / b[2];
	    out[3] = a[3] / b[3];
	    return out;
	};

	/**
	 * Alias for {@link vec4.divide}
	 * @function
	 */
	vec4.div = vec4.divide;

	/**
	 * Returns the minimum of two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	vec4.min = function (out, a, b) {
	    out[0] = Math.min(a[0], b[0]);
	    out[1] = Math.min(a[1], b[1]);
	    out[2] = Math.min(a[2], b[2]);
	    out[3] = Math.min(a[3], b[3]);
	    return out;
	};

	/**
	 * Returns the maximum of two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	vec4.max = function (out, a, b) {
	    out[0] = Math.max(a[0], b[0]);
	    out[1] = Math.max(a[1], b[1]);
	    out[2] = Math.max(a[2], b[2]);
	    out[3] = Math.max(a[3], b[3]);
	    return out;
	};

	/**
	 * Scales a vec4 by a scalar number
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {vec4} out
	 */
	vec4.scale = function (out, a, b) {
	    out[0] = a[0] * b;
	    out[1] = a[1] * b;
	    out[2] = a[2] * b;
	    out[3] = a[3] * b;
	    return out;
	};

	/**
	 * Adds two vec4's after scaling the second operand by a scalar value
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @param {Number} scale the amount to scale b by before adding
	 * @returns {vec4} out
	 */
	vec4.scaleAndAdd = function (out, a, b, scale) {
	    out[0] = a[0] + b[0] * scale;
	    out[1] = a[1] + b[1] * scale;
	    out[2] = a[2] + b[2] * scale;
	    out[3] = a[3] + b[3] * scale;
	    return out;
	};

	/**
	 * Calculates the euclidian distance between two vec4's
	 *
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {Number} distance between a and b
	 */
	vec4.distance = function (a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1],
	        z = b[2] - a[2],
	        w = b[3] - a[3];
	    return Math.sqrt(x * x + y * y + z * z + w * w);
	};

	/**
	 * Alias for {@link vec4.distance}
	 * @function
	 */
	vec4.dist = vec4.distance;

	/**
	 * Calculates the squared euclidian distance between two vec4's
	 *
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {Number} squared distance between a and b
	 */
	vec4.squaredDistance = function (a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1],
	        z = b[2] - a[2],
	        w = b[3] - a[3];
	    return x * x + y * y + z * z + w * w;
	};

	/**
	 * Alias for {@link vec4.squaredDistance}
	 * @function
	 */
	vec4.sqrDist = vec4.squaredDistance;

	/**
	 * Calculates the length of a vec4
	 *
	 * @param {vec4} a vector to calculate length of
	 * @returns {Number} length of a
	 */
	vec4.length = function (a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2],
	        w = a[3];
	    return Math.sqrt(x * x + y * y + z * z + w * w);
	};

	/**
	 * Alias for {@link vec4.length}
	 * @function
	 */
	vec4.len = vec4.length;

	/**
	 * Calculates the squared length of a vec4
	 *
	 * @param {vec4} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 */
	vec4.squaredLength = function (a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2],
	        w = a[3];
	    return x * x + y * y + z * z + w * w;
	};

	/**
	 * Alias for {@link vec4.squaredLength}
	 * @function
	 */
	vec4.sqrLen = vec4.squaredLength;

	/**
	 * Negates the components of a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to negate
	 * @returns {vec4} out
	 */
	vec4.negate = function (out, a) {
	    out[0] = -a[0];
	    out[1] = -a[1];
	    out[2] = -a[2];
	    out[3] = -a[3];
	    return out;
	};

	/**
	 * Returns the inverse of the components of a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to invert
	 * @returns {vec4} out
	 */
	vec4.inverse = function (out, a) {
	    out[0] = 1.0 / a[0];
	    out[1] = 1.0 / a[1];
	    out[2] = 1.0 / a[2];
	    out[3] = 1.0 / a[3];
	    return out;
	};

	/**
	 * Normalize a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to normalize
	 * @returns {vec4} out
	 */
	vec4.normalize = function (out, a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2],
	        w = a[3];
	    var len = x * x + y * y + z * z + w * w;
	    if (len > 0) {
	        len = 1 / Math.sqrt(len);
	        out[0] = x * len;
	        out[1] = y * len;
	        out[2] = z * len;
	        out[3] = w * len;
	    }
	    return out;
	};

	/**
	 * Calculates the dot product of two vec4's
	 *
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {Number} dot product of a and b
	 */
	vec4.dot = function (a, b) {
	    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
	};

	/**
	 * Performs a linear interpolation between two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {vec4} out
	 */
	vec4.lerp = function (out, a, b, t) {
	    var ax = a[0],
	        ay = a[1],
	        az = a[2],
	        aw = a[3];
	    out[0] = ax + t * (b[0] - ax);
	    out[1] = ay + t * (b[1] - ay);
	    out[2] = az + t * (b[2] - az);
	    out[3] = aw + t * (b[3] - aw);
	    return out;
	};

	/**
	 * Generates a random vector with the given scale
	 *
	 * @param {vec4} out the receiving vector
	 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
	 * @returns {vec4} out
	 */
	vec4.random = function (out, scale) {
	    scale = scale || 1.0;

	    //TODO: This is a pretty awful way of doing this. Find something better.
	    out[0] = glMatrix.RANDOM();
	    out[1] = glMatrix.RANDOM();
	    out[2] = glMatrix.RANDOM();
	    out[3] = glMatrix.RANDOM();
	    vec4.normalize(out, out);
	    vec4.scale(out, out, scale);
	    return out;
	};

	/**
	 * Transforms the vec4 with a mat4.
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the vector to transform
	 * @param {mat4} m matrix to transform with
	 * @returns {vec4} out
	 */
	vec4.transformMat4 = function (out, a, m) {
	    var x = a[0],
	        y = a[1],
	        z = a[2],
	        w = a[3];
	    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
	    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
	    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
	    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
	    return out;
	};

	/**
	 * Transforms the vec4 with a quat
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the vector to transform
	 * @param {quat} q quaternion to transform with
	 * @returns {vec4} out
	 */
	vec4.transformQuat = function (out, a, q) {
	    var x = a[0],
	        y = a[1],
	        z = a[2],
	        qx = q[0],
	        qy = q[1],
	        qz = q[2],
	        qw = q[3],


	    // calculate quat * vec
	    ix = qw * x + qy * z - qz * y,
	        iy = qw * y + qz * x - qx * z,
	        iz = qw * z + qx * y - qy * x,
	        iw = -qx * x - qy * y - qz * z;

	    // calculate result * inverse quat
	    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
	    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
	    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
	    out[3] = a[3];
	    return out;
	};

	/**
	 * Perform some operation over an array of vec4s.
	 *
	 * @param {Array} a the array of vectors to iterate over
	 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
	 * @param {Number} offset Number of elements to skip at the beginning of the array
	 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
	 * @param {Function} fn Function to call for each vector in the array
	 * @param {Object} [arg] additional argument to pass to fn
	 * @returns {Array} a
	 * @function
	 */
	vec4.forEach = function () {
	    var vec = vec4.create();

	    return function (a, stride, offset, count, fn, arg) {
	        var i, l;
	        if (!stride) {
	            stride = 4;
	        }

	        if (!offset) {
	            offset = 0;
	        }

	        if (count) {
	            l = Math.min(count * stride + offset, a.length);
	        } else {
	            l = a.length;
	        }

	        for (i = offset; i < l; i += stride) {
	            vec[0] = a[i];vec[1] = a[i + 1];vec[2] = a[i + 2];vec[3] = a[i + 3];
	            fn(vec, vec, arg);
	            a[i] = vec[0];a[i + 1] = vec[1];a[i + 2] = vec[2];a[i + 3] = vec[3];
	        }

	        return a;
	    };
	}();

	/**
	 * Returns a string representation of a vector
	 *
	 * @param {vec4} vec vector to represent as a string
	 * @returns {String} string representation of the vector
	 */
	vec4.str = function (a) {
	    return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
	};

	module.exports = vec4;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */

	var glMatrix = __webpack_require__(10);

	/**
	 * @class 2 Dimensional Vector
	 * @name vec2
	 */
	var vec2 = {};

	/**
	 * Creates a new, empty vec2
	 *
	 * @returns {vec2} a new 2D vector
	 */
	vec2.create = function () {
	    var out = new glMatrix.ARRAY_TYPE(2);
	    out[0] = 0;
	    out[1] = 0;
	    return out;
	};

	/**
	 * Creates a new vec2 initialized with values from an existing vector
	 *
	 * @param {vec2} a vector to clone
	 * @returns {vec2} a new 2D vector
	 */
	vec2.clone = function (a) {
	    var out = new glMatrix.ARRAY_TYPE(2);
	    out[0] = a[0];
	    out[1] = a[1];
	    return out;
	};

	/**
	 * Creates a new vec2 initialized with the given values
	 *
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @returns {vec2} a new 2D vector
	 */
	vec2.fromValues = function (x, y) {
	    var out = new glMatrix.ARRAY_TYPE(2);
	    out[0] = x;
	    out[1] = y;
	    return out;
	};

	/**
	 * Copy the values from one vec2 to another
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the source vector
	 * @returns {vec2} out
	 */
	vec2.copy = function (out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    return out;
	};

	/**
	 * Set the components of a vec2 to the given values
	 *
	 * @param {vec2} out the receiving vector
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @returns {vec2} out
	 */
	vec2.set = function (out, x, y) {
	    out[0] = x;
	    out[1] = y;
	    return out;
	};

	/**
	 * Adds two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.add = function (out, a, b) {
	    out[0] = a[0] + b[0];
	    out[1] = a[1] + b[1];
	    return out;
	};

	/**
	 * Subtracts vector b from vector a
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.subtract = function (out, a, b) {
	    out[0] = a[0] - b[0];
	    out[1] = a[1] - b[1];
	    return out;
	};

	/**
	 * Alias for {@link vec2.subtract}
	 * @function
	 */
	vec2.sub = vec2.subtract;

	/**
	 * Multiplies two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.multiply = function (out, a, b) {
	    out[0] = a[0] * b[0];
	    out[1] = a[1] * b[1];
	    return out;
	};

	/**
	 * Alias for {@link vec2.multiply}
	 * @function
	 */
	vec2.mul = vec2.multiply;

	/**
	 * Divides two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.divide = function (out, a, b) {
	    out[0] = a[0] / b[0];
	    out[1] = a[1] / b[1];
	    return out;
	};

	/**
	 * Alias for {@link vec2.divide}
	 * @function
	 */
	vec2.div = vec2.divide;

	/**
	 * Returns the minimum of two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.min = function (out, a, b) {
	    out[0] = Math.min(a[0], b[0]);
	    out[1] = Math.min(a[1], b[1]);
	    return out;
	};

	/**
	 * Returns the maximum of two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.max = function (out, a, b) {
	    out[0] = Math.max(a[0], b[0]);
	    out[1] = Math.max(a[1], b[1]);
	    return out;
	};

	/**
	 * Scales a vec2 by a scalar number
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {vec2} out
	 */
	vec2.scale = function (out, a, b) {
	    out[0] = a[0] * b;
	    out[1] = a[1] * b;
	    return out;
	};

	/**
	 * Adds two vec2's after scaling the second operand by a scalar value
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @param {Number} scale the amount to scale b by before adding
	 * @returns {vec2} out
	 */
	vec2.scaleAndAdd = function (out, a, b, scale) {
	    out[0] = a[0] + b[0] * scale;
	    out[1] = a[1] + b[1] * scale;
	    return out;
	};

	/**
	 * Calculates the euclidian distance between two vec2's
	 *
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {Number} distance between a and b
	 */
	vec2.distance = function (a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1];
	    return Math.sqrt(x * x + y * y);
	};

	/**
	 * Alias for {@link vec2.distance}
	 * @function
	 */
	vec2.dist = vec2.distance;

	/**
	 * Calculates the squared euclidian distance between two vec2's
	 *
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {Number} squared distance between a and b
	 */
	vec2.squaredDistance = function (a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1];
	    return x * x + y * y;
	};

	/**
	 * Alias for {@link vec2.squaredDistance}
	 * @function
	 */
	vec2.sqrDist = vec2.squaredDistance;

	/**
	 * Calculates the length of a vec2
	 *
	 * @param {vec2} a vector to calculate length of
	 * @returns {Number} length of a
	 */
	vec2.length = function (a) {
	    var x = a[0],
	        y = a[1];
	    return Math.sqrt(x * x + y * y);
	};

	/**
	 * Alias for {@link vec2.length}
	 * @function
	 */
	vec2.len = vec2.length;

	/**
	 * Calculates the squared length of a vec2
	 *
	 * @param {vec2} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 */
	vec2.squaredLength = function (a) {
	    var x = a[0],
	        y = a[1];
	    return x * x + y * y;
	};

	/**
	 * Alias for {@link vec2.squaredLength}
	 * @function
	 */
	vec2.sqrLen = vec2.squaredLength;

	/**
	 * Negates the components of a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to negate
	 * @returns {vec2} out
	 */
	vec2.negate = function (out, a) {
	    out[0] = -a[0];
	    out[1] = -a[1];
	    return out;
	};

	/**
	 * Returns the inverse of the components of a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to invert
	 * @returns {vec2} out
	 */
	vec2.inverse = function (out, a) {
	    out[0] = 1.0 / a[0];
	    out[1] = 1.0 / a[1];
	    return out;
	};

	/**
	 * Normalize a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to normalize
	 * @returns {vec2} out
	 */
	vec2.normalize = function (out, a) {
	    var x = a[0],
	        y = a[1];
	    var len = x * x + y * y;
	    if (len > 0) {
	        //TODO: evaluate use of glm_invsqrt here?
	        len = 1 / Math.sqrt(len);
	        out[0] = a[0] * len;
	        out[1] = a[1] * len;
	    }
	    return out;
	};

	/**
	 * Calculates the dot product of two vec2's
	 *
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {Number} dot product of a and b
	 */
	vec2.dot = function (a, b) {
	    return a[0] * b[0] + a[1] * b[1];
	};

	/**
	 * Computes the cross product of two vec2's
	 * Note that the cross product must by definition produce a 3D vector
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec3} out
	 */
	vec2.cross = function (out, a, b) {
	    var z = a[0] * b[1] - a[1] * b[0];
	    out[0] = out[1] = 0;
	    out[2] = z;
	    return out;
	};

	/**
	 * Performs a linear interpolation between two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {vec2} out
	 */
	vec2.lerp = function (out, a, b, t) {
	    var ax = a[0],
	        ay = a[1];
	    out[0] = ax + t * (b[0] - ax);
	    out[1] = ay + t * (b[1] - ay);
	    return out;
	};

	/**
	 * Generates a random vector with the given scale
	 *
	 * @param {vec2} out the receiving vector
	 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
	 * @returns {vec2} out
	 */
	vec2.random = function (out, scale) {
	    scale = scale || 1.0;
	    var r = glMatrix.RANDOM() * 2.0 * Math.PI;
	    out[0] = Math.cos(r) * scale;
	    out[1] = Math.sin(r) * scale;
	    return out;
	};

	/**
	 * Transforms the vec2 with a mat2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to transform
	 * @param {mat2} m matrix to transform with
	 * @returns {vec2} out
	 */
	vec2.transformMat2 = function (out, a, m) {
	    var x = a[0],
	        y = a[1];
	    out[0] = m[0] * x + m[2] * y;
	    out[1] = m[1] * x + m[3] * y;
	    return out;
	};

	/**
	 * Transforms the vec2 with a mat2d
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to transform
	 * @param {mat2d} m matrix to transform with
	 * @returns {vec2} out
	 */
	vec2.transformMat2d = function (out, a, m) {
	    var x = a[0],
	        y = a[1];
	    out[0] = m[0] * x + m[2] * y + m[4];
	    out[1] = m[1] * x + m[3] * y + m[5];
	    return out;
	};

	/**
	 * Transforms the vec2 with a mat3
	 * 3rd vector component is implicitly '1'
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to transform
	 * @param {mat3} m matrix to transform with
	 * @returns {vec2} out
	 */
	vec2.transformMat3 = function (out, a, m) {
	    var x = a[0],
	        y = a[1];
	    out[0] = m[0] * x + m[3] * y + m[6];
	    out[1] = m[1] * x + m[4] * y + m[7];
	    return out;
	};

	/**
	 * Transforms the vec2 with a mat4
	 * 3rd vector component is implicitly '0'
	 * 4th vector component is implicitly '1'
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to transform
	 * @param {mat4} m matrix to transform with
	 * @returns {vec2} out
	 */
	vec2.transformMat4 = function (out, a, m) {
	    var x = a[0],
	        y = a[1];
	    out[0] = m[0] * x + m[4] * y + m[12];
	    out[1] = m[1] * x + m[5] * y + m[13];
	    return out;
	};

	/**
	 * Perform some operation over an array of vec2s.
	 *
	 * @param {Array} a the array of vectors to iterate over
	 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
	 * @param {Number} offset Number of elements to skip at the beginning of the array
	 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
	 * @param {Function} fn Function to call for each vector in the array
	 * @param {Object} [arg] additional argument to pass to fn
	 * @returns {Array} a
	 * @function
	 */
	vec2.forEach = function () {
	    var vec = vec2.create();

	    return function (a, stride, offset, count, fn, arg) {
	        var i, l;
	        if (!stride) {
	            stride = 2;
	        }

	        if (!offset) {
	            offset = 0;
	        }

	        if (count) {
	            l = Math.min(count * stride + offset, a.length);
	        } else {
	            l = a.length;
	        }

	        for (i = offset; i < l; i += stride) {
	            vec[0] = a[i];vec[1] = a[i + 1];
	            fn(vec, vec, arg);
	            a[i] = vec[0];a[i + 1] = vec[1];
	        }

	        return a;
	    };
	}();

	/**
	 * Returns a string representation of a vector
	 *
	 * @param {vec2} vec vector to represent as a string
	 * @returns {String} string representation of the vector
	 */
	vec2.str = function (a) {
	    return 'vec2(' + a[0] + ', ' + a[1] + ')';
	};

	module.exports = vec2;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newInstance = undefined;
	exports.vtkOpenGLPolyDataMapper = vtkOpenGLPolyDataMapper;
	exports.extend = extend;

	var _macro = __webpack_require__(2);

	var macro = _interopRequireWildcard(_macro);

	var _Helper = __webpack_require__(20);

	var _Helper2 = _interopRequireDefault(_Helper);

	var _Math = __webpack_require__(29);

	var _Math2 = _interopRequireDefault(_Math);

	var _ShaderProgram = __webpack_require__(26);

	var _ShaderProgram2 = _interopRequireDefault(_ShaderProgram);

	var _ViewNode = __webpack_require__(6);

	var _ViewNode2 = _interopRequireDefault(_ViewNode);

	var _Constants = __webpack_require__(25);

	var _vtkPolyDataVS = __webpack_require__(30);

	var _vtkPolyDataVS2 = _interopRequireDefault(_vtkPolyDataVS);

	var _vtkPolyDataFS = __webpack_require__(31);

	var _vtkPolyDataFS2 = _interopRequireDefault(_vtkPolyDataFS);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// ----------------------------------------------------------------------------
	// vtkOpenGLPolyDataMapper methods
	// ----------------------------------------------------------------------------

	function vtkOpenGLPolyDataMapper(publicAPI, model) {
	  // Set our className
	  model.classHierarchy.push('vtkOpenGLPolyDataMapper');

	  // Builds myself.
	  publicAPI.build = function (prepass) {
	    if (prepass) {
	      if (!model.renderable) {
	        return;
	      }
	    }
	  };

	  // Renders myself
	  publicAPI.render = function (prepass) {
	    if (prepass) {
	      model.openglRenderWindow = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderWindow');
	      model.context = model.openglRenderWindow.getContext();
	      model.points.setContext(model.context);
	      model.lines.setContext(model.context);
	      model.tris.setContext(model.context);
	      model.triStrips.setContext(model.context);
	      var actor = publicAPI.getFirstAncestorOfType('vtkOpenGLActor').getRenderable();
	      var openglRenderer = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderer');
	      var ren = openglRenderer.getRenderable();
	      model.openglCamera = openglRenderer.getViewNodeFor(ren.getActiveCamera());
	      publicAPI.renderPiece(ren, actor);
	    } else {
	      // something
	    }
	  };

	  publicAPI.buildShaders = function (shaders, ren, actor) {
	    publicAPI.getShaderTemplate(shaders, ren, actor);
	    publicAPI.replaceShaderValues(shaders, ren, actor);
	  };

	  publicAPI.getShaderTemplate = function (shaders, ren, actor) {
	    shaders.Vertex = _vtkPolyDataVS2.default;
	    shaders.Fragment = _vtkPolyDataFS2.default;
	    shaders.Geometry = '';
	  };

	  publicAPI.replaceShaderColor = function (shaders, ren, actor) {
	    var FSSource = shaders.Fragment;

	    var lastLightComplexity = model.lastLightComplexity.get(model.lastBoundBO);

	    // create the material/color property declarations, and VS implementation
	    // these are always defined
	    var colorDec = ['uniform float opacityUniform; // the fragment opacity', 'uniform vec3 ambientColorUniform; // intensity weighted color', 'uniform vec3 diffuseColorUniform; // intensity weighted color'];
	    // add more for specular
	    if (lastLightComplexity) {
	      colorDec = colorDec.concat(['uniform vec3 specularColorUniform; // intensity weighted color', 'uniform float specularPowerUniform;']);
	    }
	    FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Color::Dec', colorDec).result;

	    // now handle the more complex fragment shader implementation
	    // the following are always defined variables.  We start
	    // by assiging a default value from the uniform
	    var colorImpl = ['vec3 ambientColor;', '  vec3 diffuseColor;', '  float opacity;'];
	    if (lastLightComplexity) {
	      colorImpl = colorImpl.concat(['  vec3 specularColor;', '  float specularPower;']);
	    }
	    colorImpl = colorImpl.concat(['  ambientColor = ambientColorUniform;', '  diffuseColor = diffuseColorUniform;', '  opacity = opacityUniform;']);
	    if (lastLightComplexity) {
	      colorImpl = colorImpl.concat(['  specularColor = specularColorUniform;', '  specularPower = specularPowerUniform;']);
	    }

	    FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Color::Impl', colorImpl).result;

	    shaders.Fragment = FSSource;
	  };

	  publicAPI.replaceShaderLight = function (shaders, ren, actor) {
	    var FSSource = shaders.Fragment;

	    // check for shadow maps
	    var shadowFactor = '';

	    var lastLightComplexity = model.lastLightComplexity.get(model.lastBoundBO);

	    switch (lastLightComplexity) {
	      case 0:
	        // no lighting or RENDER_VALUES
	        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Light::Impl', ['  gl_FragData[0] = vec4(ambientColor + diffuseColor, opacity);', '  //VTK::Light::Impl'], false).result;
	        break;

	      case 1:
	        // headlight
	        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Light::Impl', ['  float df = max(0.0, normalVCVSOutput.z);', '  float sf = pow(df, specularPower);', '  vec3 diffuse = df * diffuseColor;', '  vec3 specular = sf * specularColor;', '  gl_FragData[0] = vec4(ambientColor + diffuse + specular, opacity);', '  //VTK::Light::Impl'], false).result;
	        break;

	      case 2:
	        // light kit
	        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Light::Dec', [
	        // only allow for up to 6 active lights
	        'uniform int numberOfLights;',
	        // intensity weighted color
	        'uniform vec3 lightColor[6];', 'uniform vec3 lightDirectionVC[6]; // normalized', 'uniform vec3 lightHalfAngleVC[6]; // normalized']).result;
	        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Light::Impl', ['vec3 diffuse = vec3(0,0,0);', '  vec3 specular = vec3(0,0,0);', '  for (int lightNum = 0; lightNum < numberOfLights; lightNum++)', '    {', '    float df = max(0.0, dot(normalVCVSOutput, -lightDirectionVC[lightNum]));', '    diffuse += ((df' + shadowFactor + ') * lightColor[lightNum]);', '    if (dot(normalVCVSOutput, lightDirectionVC[lightNum]) < 0.0)', '      {', '      float sf = pow( max(0.0, dot(lightHalfAngleVC[lightNum],normalVCVSOutput)), specularPower);', '      specular += ((sf' + shadowFactor + ') * lightColor[lightNum]);', '      }', '    }', '  diffuse = diffuse * diffuseColor;', '  specular = specular * specularColor;', '  gl_FragData[0] = vec4(ambientColor + diffuse + specular, opacity);', '  //VTK::Light::Impl'], false).result;
	        break;

	      case 3:
	        // positional
	        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Light::Dec', [
	        // only allow for up to 6 active lights
	        'uniform int numberOfLights;',
	        // intensity weighted color
	        'uniform vec3 lightColor[6];', 'uniform vec3 lightDirectionVC[6]; // normalized', 'uniform vec3 lightHalfAngleVC[6]; // normalized', 'uniform vec3 lightPositionVC[6];', 'uniform vec3 lightAttenuation[6];', 'uniform float lightConeAngle[6];', 'uniform float lightExponent[6];', 'uniform int lightPositional[6];']).result;
	        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Light::Impl', ['  vec3 diffuse = vec3(0,0,0);', '  vec3 specular = vec3(0,0,0);', '  vec3 vertLightDirectionVC;', '  for (int lightNum = 0; lightNum < numberOfLights; lightNum++)', '    {', '    float attenuation = 1.0;', '    if (lightPositional[lightNum] == 0)', '      {', '      vertLightDirectionVC = lightDirectionVC[lightNum];', '      }', '    else', '      {', '      vertLightDirectionVC = vertexVC.xyz - lightPositionVC[lightNum];', '      float distanceVC = length(vertLightDirectionVC);', '      vertLightDirectionVC = normalize(vertLightDirectionVC);', '      attenuation = 1.0 /', '        (lightAttenuation[lightNum].x', '         + lightAttenuation[lightNum].y * distanceVC', '         + lightAttenuation[lightNum].z * distanceVC * distanceVC);', '      // per OpenGL standard cone angle is 90 or less for a spot light', '      if (lightConeAngle[lightNum] <= 90.0)', '        {', '        float coneDot = dot(vertLightDirectionVC, lightDirectionVC[lightNum]);', '        // if inside the cone', '        if (coneDot >= cos(radians(lightConeAngle[lightNum])))', '          {', '          attenuation = attenuation * pow(coneDot, lightExponent[lightNum]);', '          }', '        else', '          {', '          attenuation = 0.0;', '          }', '        }', '      }', '    float df = max(0.0, attenuation*dot(normalVCVSOutput, -vertLightDirectionVC));', '    diffuse += ((df' + shadowFactor + ') * lightColor[lightNum]);', '    if (dot(normalVCVSOutput, vertLightDirectionVC) < 0.0)', '      {', '      float sf = attenuation*pow( max(0.0, dot(lightHalfAngleVC[lightNum],normalVCVSOutput)), specularPower);', '      specular += ((sf' + shadowFactor + ') * lightColor[lightNum]);', '      }', '    }', '  diffuse = diffuse * diffuseColor;', '  specular = specular * specularColor;', '  gl_FragData[0] = vec4(ambientColor + diffuse + specular, opacity);', '  //VTK::Light::Impl'], false).result;
	        break;
	      default:
	        console.error('bad light complexity');
	    }

	    shaders.Fragment = FSSource;
	  };

	  publicAPI.replaceShaderNormal = function (shaders, ren, actor) {
	    if (model.lastLightComplexity.get(model.lastBoundBO) > 0) {
	      var VSSource = shaders.Vertex;
	      var GSSource = shaders.Geometry;
	      var FSSource = shaders.Fragment;

	      if (model.lastBoundBO.getCABO().getNormalOffset()) {
	        VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::Normal::Dec', ['attribute vec3 normalMC;', 'uniform mat3 normalMatrix;', 'varying vec3 normalVCVSOutput;']).result;
	        VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::Normal::Impl', ['normalVCVSOutput = normalMatrix * normalMC;']).result;
	        GSSource = _ShaderProgram2.default.substitute(GSSource, '//VTK::Normal::Dec', ['in vec3 normalVCVSOutput[];', 'out vec3 normalVCGSOutput;']).result;
	        GSSource = _ShaderProgram2.default.substitute(GSSource, '//VTK::Normal::Impl', ['normalVCGSOutput = normalVCVSOutput[i];']).result;
	        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Normal::Dec', ['varying vec3 normalVCVSOutput;']).result;
	        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Normal::Impl', ['vec3 normalVCVSOutput = normalize(normalVCVSOutput);',
	        //  if (!gl_FrontFacing) does not work in intel hd4000 mac
	        //  if (int(gl_FrontFacing) == 0) does not work on mesa
	        '  if (gl_FrontFacing == false) { normalVCVSOutput = -normalVCVSOutput; }']).result;
	      } else {
	        if (model.haveCellNormals) {
	          FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Normal::Dec', ['uniform mat3 normalMatrix;', 'uniform samplerBuffer textureN;']).result;
	          FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Normal::Impl', ['vec3 normalVCVSOutput = normalize(normalMatrix *', '    texelFetchBuffer(textureN, gl_PrimitiveID + PrimitiveIDOffset).xyz);', '  if (gl_FrontFacing == false) { normalVCVSOutput = -normalVCVSOutput; }']).result;
	        } else {
	          if (actor.getProperty().getRepresentation() === _Constants.REPRESENTATIONS.VTK_WIREFRAME) {
	            // generate a normal for lines, it will be perpendicular to the line
	            // and maximally aligned with the camera view direction
	            // no clue if this is the best way to do this.
	            // the code below has been optimized a bit so what follows is
	            // an explanation of the basic approach. Compute the gradient of the line
	            // with respect to x and y, the the larger of the two
	            // cross that with the camera view direction. That gives a vector
	            // orthogonal to the camera view and the line. Note that the line and the camera
	            // view are probably not orthogonal. Which is why when we cross result that with
	            // the line gradient again we get a reasonable normal. It will be othogonal to
	            // the line (which is a plane but maximally aligned with the camera view.
	            FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::UniformFlow::Impl', ['  vec3 fdx = vec3(dFdx(vertexVC.x),dFdx(vertexVC.y),dFdx(vertexVC.z));', '  vec3 fdy = vec3(dFdy(vertexVC.x),dFdy(vertexVC.y),dFdy(vertexVC.z));', '  //VTK::UniformFlow::Impl'] // For further replacements
	            ).result;
	            FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Normal::Impl', ['vec3 normalVCVSOutput;', '  fdx = normalize(fdx);', '  fdy = normalize(fdy);', '  if (abs(fdx.x) > 0.0)', '    { normalVCVSOutput = normalize(cross(vec3(fdx.y, -fdx.x, 0.0), fdx)); }', '  else { normalVCVSOutput = normalize(cross(vec3(fdy.y, -fdy.x, 0.0), fdy));}']).result;
	          } else {
	            FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Normal::Dec', ['uniform int cameraParallel;']).result;

	            FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::UniformFlow::Impl', [
	            // '  vec3 fdx = vec3(dFdx(vertexVC.x),dFdx(vertexVC.y),dFdx(vertexVC.z));',
	            // '  vec3 fdy = vec3(dFdy(vertexVC.x),dFdy(vertexVC.y),dFdy(vertexVC.z));',
	            '  vec3 fdx = dFdx(vertexVC.xyz);', '  vec3 fdy = dFdy(vertexVC.xyz);', '  //VTK::UniformFlow::Impl'] // For further replacements
	            ).result;
	            FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Normal::Impl', ['  fdx = normalize(fdx);', '  fdy = normalize(fdy);', '  vec3 normalVCVSOutput = normalize(cross(fdx,fdy));',
	            // the code below is faster, but does not work on some devices
	            // 'vec3 normalVC = normalize(cross(dFdx(vertexVC.xyz), dFdy(vertexVC.xyz)));',
	            '  if (cameraParallel == 1 && normalVCVSOutput.z < 0.0) { normalVCVSOutput = -1.0*normalVCVSOutput; }', '  if (cameraParallel == 0 && dot(normalVCVSOutput,vertexVC.xyz) > 0.0) { normalVCVSOutput = -1.0*normalVCVSOutput; }']).result;
	          }
	        }
	      }
	      shaders.Vertex = VSSource;
	      shaders.Geometry = GSSource;
	      shaders.Fragment = FSSource;
	    }
	  };

	  publicAPI.replaceShaderPositionVC = function (shaders, ren, actor) {
	    var VSSource = shaders.Vertex;
	    var GSSource = shaders.Geometry;
	    var FSSource = shaders.Fragment;

	    // do we need the vertex in the shader in View Coordinates
	    if (model.lastLightComplexity.get(model.lastBoundBO) > 0) {
	      VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::PositionVC::Dec', ['varying vec4 vertexVCVSOutput;']).result;
	      VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::PositionVC::Impl', ['vertexVCVSOutput = MCVCMatrix * vertexMC;', '  gl_Position = MCDCMatrix * vertexMC;']).result;
	      VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::Camera::Dec', ['uniform mat4 MCDCMatrix;', 'uniform mat4 MCVCMatrix;']).result;
	      GSSource = _ShaderProgram2.default.substitute(GSSource, '//VTK::PositionVC::Dec', ['in vec4 vertexVCVSOutput[];', 'out vec4 vertexVCGSOutput;']).result;
	      GSSource = _ShaderProgram2.default.substitute(GSSource, '//VTK::PositionVC::Impl', ['vertexVCGSOutput = vertexVCVSOutput[i];']).result;
	      FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::PositionVC::Dec', ['varying vec4 vertexVCVSOutput;']).result;
	      FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::PositionVC::Impl', ['vec4 vertexVC = vertexVCVSOutput;']).result;
	    } else {
	      VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::Camera::Dec', ['uniform mat4 MCDCMatrix;']).result;
	      VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::PositionVC::Impl', ['  gl_Position = MCDCMatrix * vertexMC;']).result;
	    }
	    shaders.Vertex = VSSource;
	    shaders.Geometry = GSSource;
	    shaders.Fragment = FSSource;
	  };

	  publicAPI.replaceShaderValues = function (shaders, ren, actor) {
	    publicAPI.replaceShaderColor(shaders, ren, actor);
	    publicAPI.replaceShaderNormal(shaders, ren, actor);
	    publicAPI.replaceShaderLight(shaders, ren, actor);
	    publicAPI.replaceShaderPositionVC(shaders, ren, actor);
	  };

	  publicAPI.getNeedToRebuildShaders = function (cellBO, ren, actor) {
	    var lightComplexity = 0;

	    // wacky backwards compatibility with old VTK lighting
	    // soooo there are many factors that determine if a primative is lit or not.
	    // three that mix in a complex way are representation POINT, Interpolation FLAT
	    // and having normals or not.
	    var needLighting = false;
	    var haveNormals = false; // (model.currentInput.getPointData().getNormals() != null);
	    if (actor.getProperty().getRepresentation() === _Constants.REPRESENTATIONS.VTK_POINTS) {
	      needLighting = actor.getProperty().getInterpolation() !== _Constants.SHADINGS.VTK_FLAT && haveNormals;
	    } else {
	      var isTrisOrStrips = cellBO === model.tris || cellBO === model.triStrips;
	      needLighting = isTrisOrStrips || !isTrisOrStrips && actor.getProperty().getInterpolation() !== _Constants.SHADINGS.VTK_FLAT && haveNormals;
	    }

	    // do we need lighting?
	    if (actor.getProperty().getLighting() && needLighting) {
	      (function () {
	        // consider the lighting complexity to determine which case applies
	        // simple headlight, Light Kit, the whole feature set of VTK
	        lightComplexity = 0;
	        var numberOfLights = 0;

	        ren.getLights().forEach(function (light) {
	          var status = light.getSwitch();
	          if (status > 0) {
	            numberOfLights++;
	            if (lightComplexity === 0) {
	              lightComplexity = 1;
	            }
	          }

	          if (lightComplexity === 1 && (numberOfLights > 1 || light.getIntensity() !== 1.0 || !light.lightTypeIsHeadLight())) {
	            lightComplexity = 2;
	          }
	          if (lightComplexity < 3 && light.getPositional()) {
	            lightComplexity = 3;
	          }
	        });
	      })();
	    }

	    if (model.lastLightComplexity.get(cellBO) !== lightComplexity) {
	      model.lightComplexityChanged.get(cellBO).modified();
	      model.lastLightComplexity.set(cellBO, lightComplexity);
	    }

	    // has something changed that would require us to recreate the shader?
	    // candidates are
	    // property modified (representation interpolation and lighting)
	    // input modified
	    // light complexity changed
	    if (cellBO.getProgram() === 0 || cellBO.getShaderSourceTime().getMTime() < publicAPI.getMTime() || cellBO.getShaderSourceTime().getMTime() < actor.getMTime() || cellBO.getShaderSourceTime().getMTime() < model.currentInput.getMTime() || cellBO.getShaderSourceTime().getMTime() < model.lightComplexityChanged.get(cellBO).getMTime()) {
	      return true;
	    }

	    return false;
	  };

	  publicAPI.updateShaders = function (cellBO, ren, actor) {
	    cellBO.getVAO().bind();
	    model.lastBoundBO = cellBO;

	    // has something changed that would require us to recreate the shader?
	    if (publicAPI.getNeedToRebuildShaders(cellBO, ren, actor)) {
	      var shaders = { Vertex: null, Fragment: null, Geometry: null };

	      publicAPI.buildShaders(shaders, ren, actor);

	      // compile and bind the program if needed
	      var newShader = model.openglRenderWindow.getShaderCache().readyShaderProgramArray(shaders.Vertex, shaders.Fragment, shaders.Geometry);

	      // if the shader changed reinitialize the VAO
	      if (newShader !== cellBO.getProgram()) {
	        cellBO.setProgram(newShader);
	        // reset the VAO as the shader has changed
	        cellBO.getVAO().releaseGraphicsResources();
	      }

	      cellBO.getShaderSourceTime().modified();
	    } else {
	      model.openglRenderWindow.getShaderCache().readyShaderProgram(cellBO.getProgram());
	    }

	    publicAPI.setMapperShaderParameters(cellBO, ren, actor);
	    publicAPI.setPropertyShaderParameters(cellBO, ren, actor);
	    publicAPI.setCameraShaderParameters(cellBO, ren, actor);
	    publicAPI.setLightingShaderParameters(cellBO, ren, actor);
	  };

	  publicAPI.setMapperShaderParameters = function (cellBO, ren, actor) {
	    // Now to update the VAO too, if necessary.
	    cellBO.getProgram().setUniformi('PrimitiveIDOffset', model.primitiveIDOffset);

	    if (cellBO.getCABO().getElementCount() && (model.VBOBuildTime > cellBO.getAttributeUpdateTime().getMTime() || cellBO.getShaderSourceTime().getMTime() > cellBO.getAttributeUpdateTime().getMTime())) {
	      cellBO.getCABO().bind();
	      if (cellBO.getProgram().isAttributeUsed('vertexMC')) {
	        if (!cellBO.getVAO().addAttributeArray(cellBO.getProgram(), cellBO.getCABO(), 'vertexMC', cellBO.getCABO().getVertexOffset(), cellBO.getCABO().getStride(), model.context.FLOAT, 3, model.context.FALSE)) {
	          console.error('Error setting vertexMC in shader VAO.');
	        }
	      }
	      if (cellBO.getProgram().isAttributeUsed('normalMC') && cellBO.getCABO().getNormalOffset() && model.lastLightComplexity.get(cellBO) > 0) {
	        if (!cellBO.getVAO().addAttributeArray(cellBO.getProgram(), cellBO.getCABO(), 'normalMC', cellBO.getCABO().getNormalOffset(), cellBO.getCABO().getStride(), model.context.FLOAT, 3, model.context.FALSE)) {
	          console.error('Error setting normalMC in shader VAO.');
	        }
	      }
	      //   if (model.VBO.TCoordComponents && !model.DrawingEdges &&
	      //       cellBO.Program.IsAttributeUsed('tcoordMC'))
	      //     {
	      //     if (!cellBO.getVAO().AddAttributeArray(cellBO.Program, model.VBO,
	      //                                     'tcoordMC', model.VBO.TCoordOffset,
	      //                                     model.VBO.Stride, VTK_FLOAT, model.VBO.TCoordComponents, false))
	      //       {
	      //       console.error(<< 'Error setting 'tcoordMC' in shader VAO.');
	      //       }
	      //     }
	      //   if (model.VBO.ColorComponents != 0 && !model.DrawingEdges &&
	      //       cellBO.Program.IsAttributeUsed('scalarColor'))
	      //     {
	      //     if (!cellBO.getVAO().AddAttributeArray(cellBO.Program, model.VBO,
	      //                                     'scalarColor', model.VBO.ColorOffset,
	      //                                     model.VBO.Stride, VTK_UNSIGNED_CHAR,
	      //                                     model.VBO.ColorComponents, true))
	      //       {
	      //       console.error(<< 'Error setting 'scalarColor' in shader VAO.');
	      //       }
	    }
	  };

	  publicAPI.setLightingShaderParameters = function (cellBO, ren, actor) {
	    // for unlit and headlight there are no lighting parameters
	    if (model.lastLightComplexity.get(cellBO) < 2) {
	      return;
	    }

	    var program = cellBO.getProgram();

	    // for lightkit case there are some parameters to set
	    // const cam = ren.getActiveCamera();
	    // const viewTF = cam.getModelViewTransformObject();

	    // bind some light settings
	    var numberOfLights = 0;

	    var lightColor = [];
	    // const lightDirection = [];
	    // const lightHalfAngle = [];
	    var lights = ren.getLights();
	    Object.keys(lights).map(function (key) {
	      return lights[key];
	    }).forEach(function (light) {
	      var status = light.getSwitch();
	      if (status > 0.0) {
	        var dColor = light.getDiffuseColor();
	        var intensity = light.getIntensity();
	        lightColor[numberOfLights][0] = dColor[0] * intensity;
	        lightColor[numberOfLights][1] = dColor[1] * intensity;
	        lightColor[numberOfLights][2] = dColor[2] * intensity;
	        // get required info from light
	        // double *lfp = light.getTransformedFocalPoint();
	        // double *lp = light.getTransformedPosition();
	        // double lightDir[3];
	        // vtkMath::Subtract(lfp,lp,lightDir);
	        // vtkMath::Normalize(lightDir);
	        // double *tDir = viewTF.TransformNormal(lightDir);
	        // lightDirection[numberOfLights][0] = tDir[0];
	        // lightDirection[numberOfLights][1] = tDir[1];
	        // lightDirection[numberOfLights][2] = tDir[2];
	        // lightDir[0] = -tDir[0];
	        // lightDir[1] = -tDir[1];
	        // lightDir[2] = -tDir[2]+1.0;
	        // vtkMath::Normalize(lightDir);
	        // lightHalfAngle[numberOfLights][0] = lightDir[0];
	        // lightHalfAngle[numberOfLights][1] = lightDir[1];
	        // lightHalfAngle[numberOfLights][2] = lightDir[2];
	        numberOfLights++;
	      }
	    });

	    program.setUniform3fv('lightColor', numberOfLights, lightColor);
	    // program.setUniform3fv('lightDirectionVC', numberOfLights, lightDirection);
	    // program.setUniform3fv('lightHalfAngleVC', numberOfLights, lightHalfAngle);
	    program.setUniformi('numberOfLights', numberOfLights);

	    // // we are done unless we have positional lights
	    if (model.lastLightComplexity.get(cellBO) < 3) {
	      return;
	    }

	    // // if positional lights pass down more parameters
	    // let lightAttenuation[6][3];
	    // let lightPosition[6][3];
	    // let lightConeAngle[6];
	    // let lightExponent[6];
	    // int lightPositional[6];
	    // numberOfLights = 0;
	    // for(lc.InitTraversal(sit);
	    //     (light = lc.getNextLight(sit)); )
	    //   {
	    //   let status = light.getSwitch();
	    //   if (status > 0.0)
	    //     {
	    //     double *attn = light.getAttenuationValues();
	    //     lightAttenuation[numberOfLights][0] = attn[0];
	    //     lightAttenuation[numberOfLights][1] = attn[1];
	    //     lightAttenuation[numberOfLights][2] = attn[2];
	    //     lightExponent[numberOfLights] = light.getExponent();
	    //     lightConeAngle[numberOfLights] = light.getConeAngle();
	    //     double *lp = light.getTransformedPosition();
	    //     double *tlp = viewTF.TransformPoint(lp);
	    //     lightPosition[numberOfLights][0] = tlp[0];
	    //     lightPosition[numberOfLights][1] = tlp[1];
	    //     lightPosition[numberOfLights][2] = tlp[2];
	    //     lightPositional[numberOfLights] = light.getPositional();
	    //     numberOfLights++;
	    //     }
	    //   }
	    // program.SetUniform3fv('lightAttenuation', numberOfLights, lightAttenuation);
	    // program.SetUniform1iv('lightPositional', numberOfLights, lightPositional);
	    // program.SetUniform3fv('lightPositionVC', numberOfLights, lightPosition);
	    // program.SetUniform1fv('lightExponent', numberOfLights, lightExponent);
	    // program.SetUniform1fv('lightConeAngle', numberOfLights, lightConeAngle);
	  };

	  publicAPI.setCameraShaderParameters = function (cellBO, ren, actor) {
	    var program = cellBO.getProgram();

	    var keyMats = model.openglCamera.getKeyMatrices(ren);
	    var cam = ren.getActiveCamera();

	    // // [WMVD]C == {world, model, view, display} coordinates
	    // // E.g., WCDC == world to display coordinate transformation
	    program.setUniformMatrix('MCDCMatrix', keyMats.wcdc);
	    if (program.isUniformUsed('MCVCMatrix')) {
	      program.setUniformMatrix('MCVCMatrix', keyMats.wcvc);
	    }
	    if (program.isUniformUsed('normalMatrix')) {
	      program.setUniformMatrix3x3('normalMatrix', keyMats.normalMatrix);
	    }

	    if (program.isUniformUsed('cameraParallel')) {
	      program.setUniformi('cameraParallel', cam.getParallelProjection());
	    }
	  };

	  publicAPI.setPropertyShaderParameters = function (cellBO, ren, actor) {
	    var program = cellBO.getProgram();

	    var ppty = actor.getProperty();

	    var opacity = ppty.getOpacity();
	    var aColor = ppty.getAmbientColor();
	    var aIntensity = ppty.getAmbient();
	    var ambientColor = [aColor[0] * aIntensity, aColor[1] * aIntensity, aColor[2] * aIntensity];
	    var dColor = ppty.getDiffuseColor();
	    var dIntensity = ppty.getDiffuse();
	    var diffuseColor = [dColor[0] * dIntensity, dColor[1] * dIntensity, dColor[2] * dIntensity];

	    program.setUniformf('opacityUniform', opacity);
	    program.setUniform3f('ambientColorUniform', ambientColor);
	    program.setUniform3f('diffuseColorUniform', diffuseColor);
	    // we are done unless we have lighting
	    if (model.lastLightComplexity.get(cellBO) < 1) {
	      return;
	    }
	    var sColor = ppty.getSpecularColor();
	    var sIntensity = ppty.getSpecular();
	    var specularColor = [sColor[0] * sIntensity, sColor[1] * sIntensity, sColor[2] * sIntensity];
	    program.setUniform3f('specularColorUniform', specularColor);
	    var specularPower = ppty.getSpecularPower();
	    program.setUniformf('specularPowerUniform', specularPower);

	    // // now set the backface properties if we have them
	    // if (actor.getBackfaceProperty() && !model.DrawingEdges)
	    //   {
	    //   ppty = actor.getBackfaceProperty();

	    //   let opacity = static_cast<float>(ppty.getOpacity());
	    //   double *aColor = ppty.getAmbientColor();
	    //   double aIntensity = ppty.getAmbient();  // ignoring renderer ambient
	    //   let ambientColor[3] = {static_cast<float>(aColor[0] * aIntensity),
	    //     static_cast<float>(aColor[1] * aIntensity),
	    //     static_cast<float>(aColor[2] * aIntensity)};
	    //   double *dColor = ppty.getDiffuseColor();
	    //   double dIntensity = ppty.getDiffuse();
	    //   let diffuseColor[3] = {static_cast<float>(dColor[0] * dIntensity),
	    //     static_cast<float>(dColor[1] * dIntensity),
	    //     static_cast<float>(dColor[2] * dIntensity)};
	    //   double *sColor = ppty.getSpecularColor();
	    //   double sIntensity = ppty.getSpecular();
	    //   let specularColor[3] = {static_cast<float>(sColor[0] * sIntensity),
	    //     static_cast<float>(sColor[1] * sIntensity),
	    //     static_cast<float>(sColor[2] * sIntensity)};
	    //   double specularPower = ppty.getSpecularPower();

	    //   program.SetUniformf('opacityUniformBF', opacity);
	    //   program.SetUniform3f('ambientColorUniformBF', ambientColor);
	    //   program.SetUniform3f('diffuseColorUniformBF', diffuseColor);
	    //   // we are done unless we have lighting
	    //   if (model.LastLightComplexity[&cellBO] < 1)
	    //     {
	    //     return;
	    //     }
	    //   program.SetUniform3f('specularColorUniformBF', specularColor);
	    //   program.SetUniformf('specularPowerUniformBF', specularPower);
	    //   }
	  };

	  publicAPI.renderPieceStart = function (ren, actor) {
	    model.primitiveIDOffset = 0;

	    // make sure the BOs are up to date
	    publicAPI.updateBufferObjects(ren, actor);

	    // Bind the OpenGL, this is shared between the different primitive/cell types.
	    model.lastBoundBO = null;
	  };

	  publicAPI.renderPieceDraw = function (ren, actor) {
	    var representation = actor.getProperty().getRepresentation();

	    var gl = model.context;

	    // draw points
	    if (model.points.getCABO().getElementCount()) {
	      // Update/build/etc the shader.
	      publicAPI.updateShaders(model.points, ren, actor);
	      gl.drawArrays(gl.POINTS, 0, model.Points.getCABO().getElementCount());
	      model.primitiveIDOffset += model.Points.getCABO().getElementCount();
	    }

	    // draw lines
	    if (model.lines.getCABO().getElementCount()) {
	      publicAPI.updateShaders(model.lines, ren, actor);
	      if (representation === _Constants.REPRESENTATIONS.VTK_POINTS) {
	        gl.drawArrays(gl.POINTS, 0, model.Lines.getCABO().getElementCount());
	      } else {
	        gl.drawArrays(gl.LINES, 0, model.Lines.getCABO().getElementCount());
	      }
	      model.primitiveIDOffset += model.lines.getCABO().getElementCount() / 2;
	    }

	    // draw polygons
	    if (model.tris.getCABO().getElementCount()) {
	      // First we do the triangles, update the shader, set uniforms, etc.
	      publicAPI.updateShaders(model.tris, ren, actor);
	      var mode = gl.POINTS;
	      if (representation === _Constants.REPRESENTATIONS.VTK_WIREFRAME) {
	        mode = gl.LINES;
	      }
	      if (representation === _Constants.REPRESENTATIONS.VTK_SURFACE) {
	        mode = gl.TRIANGLES;
	      }
	      gl.drawArrays(mode, 0, model.tris.getCABO().getElementCount());
	      model.primitiveIDOffset += model.tris.getCABO().getElementCount() / 3;
	    }

	    // draw strips
	    if (model.triStrips.getCABO().getElementCount()) {
	      // Use the tris shader program/VAO, but triStrips ibo.
	      model.updateShaders(model.triStrips, ren, actor);
	      if (representation === _Constants.REPRESENTATIONS.VTK_POINTS) {
	        gl.drawArrays(gl.POINTS, 0, model.triStrips.getCABO().getElementCount());
	      }
	      if (representation === _Constants.REPRESENTATIONS.VTK_WIREFRAME) {
	        gl.drawArays(gl.LINES, 0, model.triStrips.getCABO().getElementCount());
	      }
	      if (representation === _Constants.REPRESENTATIONS.VTK_SURFACE) {
	        gl.drawArrays(gl.TRIANGLES, 0, model.triStrips.getCABO().getElementCount());
	      }
	      // just be safe and divide by 3
	      model.primitiveIDOffset += model.triStrips.getCABO().getElementCount() / 3;
	    }
	  };

	  publicAPI.renderPieceFinish = function (ren, actor) {
	    if (model.LastBoundBO) {
	      model.LastBoundBO.getVAO().release();
	    }
	  };

	  publicAPI.renderPiece = function (ren, actor) {
	    // Make sure that we have been properly initialized.
	    // if (ren.getRenderWindow().checkAbortStatus()) {
	    //   return;
	    // }

	    model.currentInput = model.renderable.getInputData();

	    if (model.currentInput === null) {
	      console.error('No input!');
	      return;
	    }

	    publicAPI.invokeEvent({ type: 'StartEvent' });
	    // if (!model.Static) {
	    //   this.getInputAlgorithm().update();
	    // }
	    publicAPI.invokeEvent({ type: 'EndEvent' });

	    // if there are no points then we are done
	    if (!model.currentInput.getPoints || !model.currentInput.getPoints().getNumberOfValues()) {
	      return;
	    }

	    publicAPI.renderPieceStart(ren, actor);
	    publicAPI.renderPieceDraw(ren, actor);
	    // publicAPI.renderEdges(ren, actor);
	    publicAPI.renderPieceFinish(ren, actor);
	  };

	  publicAPI.computeBounds = function (ren, actor) {
	    if (!publicAPI.getInput()) {
	      _Math2.default.uninitializeBounds(model.Bounds);
	      return;
	    }
	    model.bounnds = publicAPI.getInput().getBounds();
	  };

	  publicAPI.updateBufferObjects = function (ren, actor) {
	    // Rebuild buffers if needed
	    if (publicAPI.getNeedToRebuildBufferObjects(ren, actor)) {
	      publicAPI.buildBufferObjects(ren, actor);
	    }
	  };

	  publicAPI.getNeedToRebuildBufferObjects = function (ren, actor) {
	    // first do a coarse check
	    if (model.VBOBuildTime.getMTime() < publicAPI.getMTime() || model.VBOBuildTime.getMTime() < actor.getMTime() || model.VBOBuildTime.getMTime() < actor.getProperty().getMTime() || model.VBOBuildTime.getMTime() < model.currentInput.getMTime()) {
	      return true;
	    }
	    return false;
	  };

	  publicAPI.buildBufferObjects = function (ren, actor) {
	    var poly = model.currentInput;

	    if (poly === null) {
	      return;
	    }

	    // Do we have normals?
	    var n = actor.getProperty().getInterpolation() !== _Constants.SHADINGS.VTK_FLAT ? poly.getPointData().getNormals() : null;

	    // rebuild the VBO if the data has changed we create a string for the VBO what
	    // can change the VBO? points normals tcoords colors so what can change those?
	    // the input data is clearly one as it can change all four items tcoords may
	    // haveTextures or not colors may change based on quite a few mapping
	    // parameters in the mapper

	    var representation = actor.getProperty().getRepresentation();
	    var toString = poly.getMTime() + 'A' + representation + 'B' + poly.getMTime() + 'C' + (n ? n.getMTime() : 1) + 'C';

	    var tcoords = null;
	    var c = null;
	    if (model.VBOBuildString !== toString) {
	      // Build the VBOs
	      var points = poly.getPoints();

	      model.points.getCABO().createVBO(poly.getVerts(), 'verts', representation, points, n, tcoords, c);
	      model.lines.getCABO().createVBO(poly.getLines(), 'lines', representation, points, n, tcoords, c);
	      model.tris.getCABO().createVBO(poly.getPolys(), 'polys', representation, points, n, tcoords, c);
	      model.triStrips.getCABO().createVBO(poly.getStrips(), 'strips', representation, points, n, tcoords, c);

	      model.VBOBuildTime.modified();
	      model.VBOBuildString = toString;
	    }
	  };
	}

	// ----------------------------------------------------------------------------
	// Object factory
	// ----------------------------------------------------------------------------

	var DEFAULT_VALUES = {
	  context: null,
	  VBOBuildTime: 0,
	  VBOBuildString: null,
	  lightComplexityChanged: null,
	  lastLightComplexity: null
	};

	// ----------------------------------------------------------------------------

	function extend(publicAPI, model) {
	  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  Object.assign(model, DEFAULT_VALUES, initialValues);

	  // Inheritance
	  _ViewNode2.default.extend(publicAPI, model);

	  model.points = _Helper2.default.newInstance();
	  model.lines = _Helper2.default.newInstance();
	  model.tris = _Helper2.default.newInstance();
	  model.triStrips = _Helper2.default.newInstance();

	  // Build VTK API
	  macro.get(publicAPI, model, ['shaderCache']);
	  macro.setGet(publicAPI, model, ['context']);

	  model.VBOBuildTime = {};
	  macro.obj(model.VBOBuildTime);

	  model.lightComplexityChanged = new Map();
	  model.lightComplexityChanged.set(model.points, {});
	  macro.obj(model.lightComplexityChanged.get(model.points));
	  model.lightComplexityChanged.set(model.lines, {});
	  macro.obj(model.lightComplexityChanged.get(model.lines));
	  model.lightComplexityChanged.set(model.tris, {});
	  macro.obj(model.lightComplexityChanged.get(model.tris));
	  model.lightComplexityChanged.set(model.triStrips, {});
	  macro.obj(model.lightComplexityChanged.get(model.triStrips));

	  model.lastLightComplexity = new Map();
	  model.lastLightComplexity.set(model.points, 0);
	  model.lastLightComplexity.set(model.lines, 0);
	  model.lastLightComplexity.set(model.tris, 0);
	  model.lastLightComplexity.set(model.triStrips, 0);

	  // Object methods
	  vtkOpenGLPolyDataMapper(publicAPI, model);
	}

	// ----------------------------------------------------------------------------

	var newInstance = exports.newInstance = macro.newInstance(extend);

	// ----------------------------------------------------------------------------

	exports.default = { newInstance: newInstance, extend: extend };

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newInstance = undefined;
	exports.vtkOpenGLHelper = vtkOpenGLHelper;
	exports.extend = extend;

	var _macro = __webpack_require__(2);

	var macro = _interopRequireWildcard(_macro);

	var _CellArrayBufferObject = __webpack_require__(21);

	var _CellArrayBufferObject2 = _interopRequireDefault(_CellArrayBufferObject);

	var _ShaderProgram = __webpack_require__(26);

	var _ShaderProgram2 = _interopRequireDefault(_ShaderProgram);

	var _VertexArrayObject = __webpack_require__(28);

	var _VertexArrayObject2 = _interopRequireDefault(_VertexArrayObject);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// ----------------------------------------------------------------------------
	// vtkOpenGLHelper methods
	// ----------------------------------------------------------------------------

	function vtkOpenGLHelper(publicAPI, model) {
	  // Set our className
	  model.classHierarchy.push('vtkOpenGLHelper');

	  publicAPI.setContext = function (ctx) {
	    model.program.setContext(ctx);
	    model.VAO.setContext(ctx);
	    model.CABO.setContext(ctx);
	  };
	}

	// ----------------------------------------------------------------------------
	// Object factory
	// ----------------------------------------------------------------------------

	var DEFAULT_VALUES = {
	  program: null,
	  shaderSourceTime: null,
	  VAO: null,
	  attributeUpdateTime: null,
	  IBO: null,
	  CABO: null
	};

	// ----------------------------------------------------------------------------

	function extend(publicAPI, model) {
	  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  Object.assign(model, DEFAULT_VALUES, initialValues);

	  // Build VTK API
	  macro.obj(publicAPI, model);

	  model.shaderSourceTime = {};
	  macro.obj(model.shaderSourceTime);

	  model.attributeUpdateTime = {};
	  macro.obj(model.attributeUpdateTime);

	  macro.setGet(publicAPI, model, ['program', 'shaderSourceTime', 'VAO', 'attributeUpdateTime', 'CABO']);

	  model.program = _ShaderProgram2.default.newInstance();
	  model.VAO = _VertexArrayObject2.default.newInstance();
	  model.CABO = _CellArrayBufferObject2.default.newInstance();

	  // Object methods
	  vtkOpenGLHelper(publicAPI, model);
	}

	// ----------------------------------------------------------------------------

	var newInstance = exports.newInstance = macro.newInstance(extend);

	// ----------------------------------------------------------------------------

	exports.default = { newInstance: newInstance, extend: extend };

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newInstance = undefined;
	exports.extend = extend;

	var _macro = __webpack_require__(2);

	var macro = _interopRequireWildcard(_macro);

	var _BufferObject = __webpack_require__(22);

	var _BufferObject2 = _interopRequireDefault(_BufferObject);

	var _DynamicTypedArray = __webpack_require__(24);

	var _Constants = __webpack_require__(23);

	var _Constants2 = __webpack_require__(25);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// ----------------------------------------------------------------------------
	// vtkOpenGLCellArrayBufferObject methods
	// ----------------------------------------------------------------------------

	function vtkOpenGLCellArrayBufferObject(publicAPI, model) {
	  // Set our className
	  model.classHierarchy.push('vtkOpenGLCellArrayBufferObject');

	  var packedVBO = new _DynamicTypedArray.DynamicTypedArray({ chunkSize: 65500, arrayType: 'Float32Array' }); // the data

	  publicAPI.setType(_Constants.OBJECT_TYPE.ARRAY_BUFFER);

	  publicAPI.createVBO = function (cellArray, inRep, outRep, points, normals, tcoords, colors) {
	    if (!cellArray.getData() || !cellArray.getData().length) {
	      model.elementCount = 0;
	      return;
	    }

	    // Figure out how big each block will be, currently 6 or 7 floats.
	    model.blockSize = 3;
	    model.vertexOffset = 0;
	    model.normalOffset = 0;
	    model.tCoordOffset = 0;
	    model.tCoordComponents = 0;
	    model.colorComponents = 0;
	    model.colorOffset = 0;

	    var pointData = points.getData();
	    var normalData = null;
	    var tcoordData = null;
	    var colorData = null;

	    var colorComponents = colors ? colors.getNumberOfComponents() : 0;
	    var textureComponents = tcoords ? tcoords.getNumberOfComponents() : 0;

	    if (normals !== null) {
	      model.normalOffset = /* sizeof(float) */4 * model.blockSize;
	      model.blockSize += 3;
	      normalData = normals.getData();
	    }

	    if (tcoords !== null) {
	      model.tCoordOffset = /* sizeof(float) */4 * model.blockSize;
	      model.tCoordComponents = textureComponents;
	      model.blockSize += textureComponents;
	      tcoordData = tcoords.getData();
	    }

	    if (colors !== null) {
	      model.colorComponents = colors.getNumberOfComponents();
	      model.colorOffset = /* sizeof(float) */4 * model.blockSize;
	      model.blockSize += 1;
	      colorData = colors.getData();
	    }
	    model.stride = /* sizeof(float) */4 * model.blockSize;

	    var pointIdx = 0;
	    var normalIdx = 0;
	    var tcoordIdx = 0;
	    var colorIdx = 0;

	    var colorHolder = new Uint8Array(4);

	    var addAPoint = function addAPoint(i) {
	      // Vertices
	      pointIdx = i * 3;
	      normalIdx = i * 3;
	      tcoordIdx = i * textureComponents;
	      colorIdx = i * colorComponents;

	      packedVBO.push(pointData[pointIdx++]);
	      packedVBO.push(pointData[pointIdx++]);
	      packedVBO.push(pointData[pointIdx++]);

	      if (normalData !== null) {
	        packedVBO.push(normalData[normalIdx++]);
	        packedVBO.push(normalData[normalIdx++]);
	        packedVBO.push(normalData[normalIdx++]);
	      }

	      if (tcoordData !== null) {
	        for (var j = 0; j < textureComponents; ++j) {
	          packedVBO.push(tcoordData[tcoordIdx++]);
	        }
	      }

	      if (colorData !== null) {
	        colorHolder[0] = colorData[colorIdx++];
	        colorHolder[1] = colorData[colorIdx++];
	        colorHolder[2] = colorData[colorIdx++];

	        if (colorComponents === 4) {
	          colorHolder[3] = colorData[colorIdx++];
	        } else {
	          // must be 3 color components then
	          colorHolder[3] = 255;
	        }

	        packedVBO.push(new Float32Array(colorHolder.buffer)[0]);
	      }
	    };

	    var cellBuilders = {
	      // easy, every input point becomes an output point

	      anythingToPoints: function anythingToPoints(numPoints, cellPts, offset) {
	        for (var i = 0; i < numPoints; ++i) {
	          addAPoint(cellPts[offset + i]);
	        }
	      },
	      linesToWireframe: function linesToWireframe(numPoints, cellPts, offset) {
	        // for lines we add a bunch of segments
	        for (var i = 0; i < numPoints - 1; ++i) {
	          addAPoint(cellPts[offset + i]);
	          addAPoint(cellPts[offset + i + 1]);
	        }
	      },
	      polysToWireframe: function polysToWireframe(numPoints, cellPts, offset) {
	        // for polys we add a bunch of segments and close it
	        for (var i = 0; i < numPoints; ++i) {
	          addAPoint(cellPts[offset + i]);
	          addAPoint(cellPts[offset + (i + 1) % numPoints]);
	        }
	      },
	      stripsToWireframe: function stripsToWireframe(numPoints, cellPts, offset) {
	        // for strips we add a bunch of segments and close it
	        for (var i = 0; i < numPoints - 1; ++i) {
	          addAPoint(cellPts[offset + i]);
	          addAPoint(cellPts[offset + i + 1]);
	        }
	        for (var _i = 0; _i < numPoints - 2; _i++) {
	          addAPoint(cellPts[offset + _i]);
	          addAPoint(cellPts[offset + _i + 2]);
	        }
	      },
	      polysToSurface: function polysToSurface(npts, cellPts, offset) {
	        if (npts < 3) {
	          // ignore degenerate triangles
	          console.log('skipping degenerate triangle');
	        } else {
	          for (var i = 0; i < npts - 2; i++) {
	            addAPoint(cellPts[offset + 0]);
	            addAPoint(cellPts[offset + i + 1]);
	            addAPoint(cellPts[offset + i + 2]);
	          }
	        }
	      },
	      stripsToSurface: function stripsToSurface(npts, cellPts, offset) {
	        for (var i = 0; i < npts - 2; i++) {
	          addAPoint(cellPts[offset + i]);
	          addAPoint(cellPts[offset + i + 1 + i % 2]);
	          addAPoint(cellPts[offset + i + 1 + (i + 1) % 2]);
	        }
	      }
	    };

	    var func = null;
	    if (outRep === _Constants2.REPRESENTATIONS.VTK_POINTS || inRep === 'Verts') {
	      func = cellBuilders.anythingToPoints;
	    } else if (outRep === _Constants2.REPRESENTATIONS.VTK_WIREFRAME || inRep === 'Lines') {
	      func = cellBuilders[inRep + 'ToWireframe'];
	    } else {
	      func = cellBuilders[inRep + 'ToSurface'];
	    }

	    var currentIndex = 0;
	    var array = cellArray.getData();
	    var size = array.length;
	    for (var index = 0; index < size; index++) {
	      if (index === currentIndex) {
	        func(array[index], array, currentIndex + 1);
	        currentIndex += array[index] + 1;
	      }
	    }
	    model.elementCount = packedVBO.getNumberOfElements() / model.blockSize;
	    var vboArray = packedVBO.getFrozenArray();
	    publicAPI.upload(vboArray, _Constants.OBJECT_TYPE.ARRAY_BUFFER);
	    packedVBO.reset();
	  };

	  publicAPI.setCoordShiftAndScaleMethod = function (shiftScaleMethod) {
	    console.log('coordinate shift and scale not yet implemented');
	  };

	  publicAPI.setCoordShift = function (shiftArray) {
	    console.log('coordinate shift and scale not yet implemented');
	  };

	  publicAPI.setCoordScale = function (scaleArray) {
	    console.log('coordinate shift and scale not yet implemented');
	  };
	}

	// ----------------------------------------------------------------------------
	// Object factory
	// ----------------------------------------------------------------------------

	var DEFAULT_VALUES = {
	  elementCount: 0,
	  stride: 0,
	  vertexOffset: 0,
	  normalOffset: 0,
	  tCoordOffset: 0,
	  tCoordComponents: 0,
	  colorOffset: 0,
	  numColorComponents: 0
	};

	// ----------------------------------------------------------------------------

	function extend(publicAPI, model) {
	  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  Object.assign(model, DEFAULT_VALUES, initialValues);

	  // Inheritance
	  _BufferObject2.default.extend(publicAPI, model);

	  macro.get(publicAPI, model, ['elementCount', 'stride', 'vertexOffset', 'normalOffset', 'tCoordOffset', 'tCoordComponents', 'colorOffset', 'numColorComponents']);

	  // Object specific methods
	  vtkOpenGLCellArrayBufferObject(publicAPI, model);
	}

	// ----------------------------------------------------------------------------

	var newInstance = exports.newInstance = macro.newInstance(extend);

	// ----------------------------------------------------------------------------

	exports.default = { newInstance: newInstance, extend: extend };

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newInstance = exports.STATIC = undefined;
	exports.extend = extend;

	var _macro = __webpack_require__(2);

	var macro = _interopRequireWildcard(_macro);

	var _Constants = __webpack_require__(23);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// ----------------------------------------------------------------------------
	// Global methods
	// ----------------------------------------------------------------------------

	// ----------------------------------------------------------------------------
	// Static API
	// ----------------------------------------------------------------------------

	var STATIC = exports.STATIC = {};

	// ----------------------------------------------------------------------------
	// vtkOpenGLBufferObject methods
	// ----------------------------------------------------------------------------

	function vtkOpenGLBufferObject(publicAPI, model) {
	  // Set our className
	  model.classHierarchy.push('vtkOpenGLBufferObject');

	  // Class-specific private functions
	  function convertType(type) {
	    switch (type) {
	      case _Constants.OBJECT_TYPE.ELEMENT_ARRAY_BUFFER:
	        return model.context.ELEMENT_ARRAY_BUFFER;
	      case _Constants.OBJECT_TYPE.TEXTURE_BUFFER:
	        if ('TEXTURE_BUFFER' in model.context) {
	          return model.context.TEXTURE_BUFFER;
	        }
	      /* eslint-disable no-fallthrough */
	      // Intentional fallthrough in case there is no TEXTURE_BUFFER in WebGL
	      default:
	      /* eslint-enable no-fallthrough */
	      case _Constants.OBJECT_TYPE.ARRAY_BUFFER:
	        return model.context.ARRAY_BUFFER;
	    }
	  }

	  var internalType = null;
	  var internalHandle = null;
	  var dirty = true;
	  var error = '';

	  // Public API methods
	  publicAPI.getType = function () {
	    return internalType;
	  };

	  publicAPI.setType = function (value) {
	    internalType = value;
	  };

	  publicAPI.getHandle = function () {
	    return internalHandle;
	  };
	  publicAPI.isReady = function () {
	    return dirty === false;
	  };

	  publicAPI.generateBuffer = function (type) {
	    var objectTypeGL = convertType(type);
	    if (internalHandle === null) {
	      internalHandle = model.context.createBuffer();
	      internalType = type;
	    }
	    return convertType(internalType) === objectTypeGL;
	  };

	  publicAPI.upload = function (data, type) {
	    // buffer, size, type
	    var alreadyGenerated = publicAPI.generateBuffer(type);
	    if (!alreadyGenerated) {
	      error = 'Trying to upload array buffer to incompatible buffer.';
	      return false;
	    }
	    model.context.bindBuffer(convertType(internalType), internalHandle);
	    model.context.bufferData(convertType(internalType), data, model.context.STATIC_DRAW);
	    dirty = false;
	    return true;
	  };

	  publicAPI.bind = function () {
	    if (!internalHandle) {
	      return false;
	    }
	    model.context.bindBuffer(convertType(internalType), internalHandle);
	    return true;
	  };

	  publicAPI.release = function () {
	    if (!internalHandle) {
	      return false;
	    }
	    model.context.bindBuffer(convertType(internalType), null);
	    return true;
	  };

	  publicAPI.releaseGraphicsResources = function () {
	    if (internalHandle !== null) {
	      model.context.bindBuffer(convertType(internalType), null);
	      model.context.deleteBuffers(internalHandle);
	      internalHandle = null;
	    }
	  };

	  publicAPI.getError = function () {
	    return error;
	  };
	}

	// ----------------------------------------------------------------------------
	// Object factory
	// ----------------------------------------------------------------------------

	var DEFAULT_VALUES = {
	  objectType: _Constants.OBJECT_TYPE.ARRAY_BUFFER,
	  context: null
	};

	// ----------------------------------------------------------------------------

	function extend(publicAPI, model) {
	  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  Object.assign(model, DEFAULT_VALUES, initialValues);

	  // Object methods
	  macro.obj(publicAPI, model);

	  macro.setGet(publicAPI, model, ['context']);

	  vtkOpenGLBufferObject(publicAPI, model);
	}

	// ----------------------------------------------------------------------------

	var newInstance = exports.newInstance = macro.newInstance(extend);

	// ----------------------------------------------------------------------------

	exports.default = Object.assign({ newInstance: newInstance, extend: extend }, STATIC);

/***/ },
/* 23 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var OBJECT_TYPE = exports.OBJECT_TYPE = {
	  ARRAY_BUFFER: 0,
	  ELEMENT_ARRAY_BUFFER: 1,
	  TEXTURE_BUFFER: 2
	};

	exports.default = { OBJECT_TYPE: OBJECT_TYPE };

/***/ },
/* 24 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var DynamicTypedArray = exports.DynamicTypedArray = function () {
	  function DynamicTypedArray() {
	    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    var _ref$chunkSize = _ref.chunkSize;
	    var chunkSize = _ref$chunkSize === undefined ? 65536 : _ref$chunkSize;
	    var _ref$arrayType = _ref.arrayType;
	    var arrayType = _ref$arrayType === undefined ? 'Int32Array' : _ref$arrayType;

	    _classCallCheck(this, DynamicTypedArray);

	    this.ArrayConstructor = window[arrayType];
	    this.chunkSize = chunkSize;
	    this.reset();
	  }

	  _createClass(DynamicTypedArray, [{
	    key: 'reset',
	    value: function reset() {
	      this.chunkContainer = [];
	      this.chunkContainer.push(new this.ArrayConstructor(this.chunkSize));
	      this.lastChunkItemCount = 0;
	    }
	  }, {
	    key: 'push',
	    value: function push(value) {
	      if (this.lastChunkItemCount === this.chunkSize) {
	        this.chunkContainer.push(new this.ArrayConstructor(this.chunkSize));
	        this.lastChunkItemCount = 0;
	      }
	      this.chunkContainer[this.chunkContainer.length - 1][this.lastChunkItemCount] = value;
	      this.lastChunkItemCount += 1;
	    }
	  }, {
	    key: 'getNumberOfElements',
	    value: function getNumberOfElements() {
	      return (this.chunkContainer.length - 1) * this.chunkSize + this.lastChunkItemCount;
	    }
	  }, {
	    key: 'getFrozenArray',
	    value: function getFrozenArray() {
	      var fullArray = new this.ArrayConstructor(this.getNumberOfElements());
	      for (var i = 0; i < this.chunkContainer.length - 1; ++i) {
	        fullArray.set(this.chunkContainer[i], i * this.chunkSize);
	      }

	      var indexOfLastChunk = this.chunkContainer.length - 1;

	      if (this.lastChunkItemCount < this.chunkSize) {
	        var buf = this.chunkContainer[indexOfLastChunk].buffer;
	        var bufLen = this.lastChunkItemCount; // mult by 4 in case it needs number of bytes
	        var partialChunkView = new this.ArrayConstructor(buf, 0, bufLen);
	        fullArray.set(partialChunkView, indexOfLastChunk * this.chunkSize);
	      } else {
	        // If the last chunk is completely full
	        fullArray.set(this.chunkContainer[indexOfLastChunk], indexOfLastChunk * this.chunkSize);
	      }

	      return fullArray;
	    }
	  }]);

	  return DynamicTypedArray;
	}();

/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var SHADING_MODEL = exports.SHADING_MODEL = ['VTK_FLAT', // 0
	'VTK_GOURAUD', // 1
	'VTK_PHONG'];

	// 2
	var SHADINGS = exports.SHADINGS = {
	  VTK_FLAT: 0,
	  VTK_GOURAUD: 1,
	  VTK_PHONG: 2
	};

	var REPRESENTATION_MODEL = exports.REPRESENTATION_MODEL = ['VTK_POINTS', // 0
	'VTK_WIREFRAME', // 1
	'VTK_SURFACE'];

	// 2
	var REPRESENTATIONS = exports.REPRESENTATIONS = {
	  VTK_POINTS: 0,
	  VTK_WIREFRAME: 1,
	  VTK_SURFACE: 2
	};

	var INTERPOLATIONS = exports.INTERPOLATIONS = {
	  VTK_FLAT: 0,
	  VTK_GOURAUD: 1,
	  VTK_PHONG: 2
	};

	exports.default = {
	  SHADINGS: SHADINGS,
	  SHADING_MODEL: SHADING_MODEL,
	  REPRESENTATIONS: REPRESENTATIONS,
	  INTERPOLATIONS: INTERPOLATIONS,
	  REPRESENTATION_MODEL: REPRESENTATION_MODEL
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newInstance = undefined;
	exports.substitute = substitute;
	exports.vtkShaderProgram = vtkShaderProgram;
	exports.extend = extend;

	var _macro = __webpack_require__(2);

	var macro = _interopRequireWildcard(_macro);

	var _Shader = __webpack_require__(27);

	var _Shader2 = _interopRequireDefault(_Shader);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// perform in place string substitutions, indicate if a substitution was done
	// this is useful for building up shader strings which typically involve
	// lots of string substitutions. Return true if a substitution was done.
	function substitute(source, search, replace) {
	  var all = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

	  var replaceStr = Array.isArray(replace) ? replace.join('\n') : replace;
	  var replaced = false;
	  if (source.search(search) !== -1) {
	    replaced = true;
	  }
	  var gflag = '';
	  if (all) {
	    gflag = 'g';
	  }
	  var regex = new RegExp(search, gflag);
	  var resultstr = source.replace(regex, replaceStr);
	  return { replace: replaced, result: resultstr };
	}

	// ----------------------------------------------------------------------------
	// vtkShaderProgram methods
	// ----------------------------------------------------------------------------

	function vtkShaderProgram(publicAPI, model) {
	  // Set our className
	  model.classHierarchy.push('vtkShaderProgram');

	  publicAPI.compileShader = function () {
	    if (!model.vertexShader.compile()) {
	      console.log(model.vertexShader.getSource().split('\n').map(function (line, index) {
	        return index + ': ' + line;
	      }).join('\n'));
	      console.log(model.vertexShader.getError());
	      return 0;
	    }
	    if (!model.fragmentShader.compile()) {
	      console.log(model.fragmentShader.getSource().split('\n').map(function (line, index) {
	        return index + ': ' + line;
	      }).join('\n'));
	      console.log(model.fragmentShader.getError());
	      return 0;
	    }
	    // skip geometry for now
	    if (!publicAPI.attachShader(model.vertexShader)) {
	      console.log(model.error);
	      return 0;
	    }
	    if (!publicAPI.attachShader(model.fragmentShader)) {
	      console.log(model.error);
	      return 0;
	    }

	    if (!publicAPI.link()) {
	      console.log('Links failed: ' + model.error);
	      return 0;
	    }

	    publicAPI.setCompiled(true);
	    return 1;
	  };

	  publicAPI.cleanup = function () {
	    if (model.shaderType === 'Unknown' || model.handle === 0) {
	      return;
	    }

	    model.context.deleteShader(model.handle);
	    model.handle = 0;
	  };

	  publicAPI.bind = function () {
	    if (!model.linked && !model.link()) {
	      return false;
	    }

	    model.context.useProgram(model.handle);
	    publicAPI.setBound(true);
	    return true;
	  };

	  publicAPI.isBound = function () {
	    return !!model.bound;
	  };

	  publicAPI.release = function () {
	    model.context.useProgram(null);
	    publicAPI.setBound(false);
	  };

	  publicAPI.setContext = function (ctx) {
	    model.vertexShader.setContext(ctx);
	    model.fragmentShader.setContext(ctx);
	    model.geometryShader.setContext(ctx);
	  };

	  publicAPI.link = function () {
	    if (model.inked) {
	      return true;
	    }

	    if (model.handle === 0) {
	      model.error = 'Program has not been initialized, and/or does not have shaders.';
	      return false;
	    }

	    // clear out the list of uniforms used
	    model.uniformLocs = {};

	    model.context.linkProgram(model.handle);
	    var isCompiled = model.context.getProgramParameter(model.handle, model.context.LINK_STATUS);
	    if (!isCompiled) {
	      var lastError = model.context.getProgramInfoLog(model.handle);
	      console.error('Error linking shader ' + lastError);
	      model.handle = 0;
	      return false;
	    }

	    publicAPI.setLinked(true);
	    model.attributeLocs = {};
	    return true;
	  };

	  publicAPI.setUniformf = function (name, v) {
	    var location = publicAPI.findUniform(name);
	    if (location === -1) {
	      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
	      return false;
	    }
	    model.context.uniform1f(location, v);
	    return true;
	  };

	  publicAPI.setUniformi = function (name, v) {
	    var location = publicAPI.findUniform(name);
	    if (location === -1) {
	      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
	      return false;
	    }
	    model.context.uniform1i(location, v);
	    return true;
	  };

	  publicAPI.setUniformMatrix = function (name, v) {
	    var location = publicAPI.findUniform(name);
	    if (location === -1) {
	      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
	      return false;
	    }
	    model.context.uniformMatrix4fv(location, false, v);
	    return true;
	  };

	  publicAPI.setUniformMatrix3x3 = function (name, v) {
	    var location = publicAPI.findUniform(name);
	    if (location === -1) {
	      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
	      return false;
	    }
	    model.context.uniformMatrix3fv(location, false, v);
	    return true;
	  };

	  publicAPI.setUniform3f = function (name, v) {
	    var location = publicAPI.findUniform(name);
	    if (location === -1) {
	      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
	      return false;
	    }
	    model.context.uniform3f(location, v[0], v[1], v[2]);
	    return true;
	  };

	  publicAPI.setUniform3fv = function (name, count, v) {
	    var location = publicAPI.findUniform(name);
	    if (location === -1) {
	      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
	      return false;
	    }
	    model.context.uniform3fv(location, count, v);
	    return true;
	  };

	  publicAPI.findUniform = function (name) {
	    if (!name || !model.linked) {
	      return -1;
	    }

	    var loc = Object.keys(model.uniformLocs).indexOf(name);

	    if (loc !== -1) {
	      return model.uniformLocs[name];
	    }

	    loc = model.context.getUniformLocation(model.handle, name);
	    if (loc === null) {
	      model.error = 'Uniform ' + name + ' not found in current shader program.';
	    }
	    model.uniformLocs[name] = loc;

	    return loc;
	  };

	  publicAPI.isUniformUsed = function (name) {
	    if (!name) {
	      return false;
	    }

	    // see if we have cached the result
	    var loc = Object.keys(model.uniformLocs).indexOf(name);
	    if (loc !== -1) {
	      return true;
	    }

	    if (!model.linked) {
	      console.log('attempt to find uniform when the shader program is not linked');
	      return false;
	    }

	    loc = model.context.getUniformLocation(model.handle, name);
	    if (loc === null) {
	      return false;
	    }
	    model.uniformLocs[name] = loc;

	    return true;
	  };

	  publicAPI.isAttributeUsed = function (name) {
	    if (!name) {
	      return false;
	    }

	    // see if we have cached the result
	    var loc = Object.keys(model.attributeLocs).indexOf(name);
	    if (loc !== -1) {
	      return true;
	    }

	    if (!model.linked) {
	      console.log('attempt to find uniform when the shader program is not linked');
	      return false;
	    }

	    loc = model.context.getAttribLocation(model.handle, name);
	    if (loc === -1) {
	      return false;
	    }
	    model.attributeLocs[name] = loc;

	    return true;
	  };

	  publicAPI.attachShader = function (shader) {
	    if (shader.getHandle() === 0) {
	      model.error = 'Shader object was not initialized, cannot attach it.';
	      return false;
	    }
	    if (shader.getShaderType() === 'Unknown') {
	      model.error = 'Shader object is of type Unknown and cannot be used.';
	      return false;
	    }

	    if (model.handle === 0) {
	      var thandle = model.context.createProgram();
	      if (thandle === 0) {
	        model.error = 'Could not create shader program.';
	        return false;
	      }
	      model.handle = thandle;
	      model.linked = false;
	    }

	    if (shader.getShaderType() === 'Vertex') {
	      if (model.vertexShaderHandle !== 0) {
	        model.comntext.detachShader(model.handle, model.vertexShaderHandle);
	      }
	      model.vertexShaderHandle = shader.getHandle();
	    }
	    if (shader.getShaderType() === 'Fragment') {
	      if (model.fragmentShaderHandle !== 0) {
	        model.context.detachShader(model.handle, model.fragmentShaderHandle);
	      }
	      model.fragmentShaderHandle = shader.getHandle();
	    }

	    model.context.attachShader(model.handle, shader.getHandle());
	    publicAPI.setLinked(false);
	    return true;
	  };

	  publicAPI.detachShader = function (shader) {
	    if (shader.getHandle() === 0) {
	      model.error = 'shader object was not initialized, cannot attach it.';
	      return false;
	    }
	    if (shader.getShaderType() === 'Unknown') {
	      model.error = 'Shader object is of type Unknown and cannot be used.';
	      return false;
	    }
	    if (model.handle === 0) {
	      model.errror = 'This shader prorgram has not been initialized yet.';
	    }

	    switch (shader.getShaderType()) {
	      case 'Vertex':
	        if (model.vertexShaderHandle !== shader.getHandle()) {
	          model.error = 'The supplied shader was not attached to this program.';
	          return false;
	        }
	        model.context.detachShader(model.handle, shader.getHandle());
	        model.vertexShaderHandle = 0;
	        model.linked = false;
	        return true;
	      case 'Fragment':
	        if (model.fragmentShaderHandle !== shader.getHandle()) {
	          model.error = 'The supplied shader was not attached to this program.';
	          return false;
	        }
	        model.context.detachShader(model.handle, shader.getHandle());
	        model.fragmentShaderHandle = 0;
	        model.linked = false;
	        return true;
	      default:
	        return false;
	    }
	  };

	  publicAPI.setContext = function (ctx) {
	    model.context = ctx;
	    model.vertexShader.setContext(ctx);
	    model.fragmentShader.setContext(ctx);
	    model.geometryShader.setContext(ctx);
	  };

	  // publicAPI.enableAttributeArray = (name) => {
	  //   const location = publicAPI.findAttributeArray(name);
	  //   if (location === -1) {
	  //     model.error = `Could not enable attribute ${name} No such attribute.`;
	  //     return false;
	  //   }
	  //   model.context.enableVertexAttribArray(location);
	  //   return true;
	  // };

	  // publicAPI.disableAttributeArray = (name) => {
	  //   const location = publicAPI.findAttributeArray(name);
	  //   if (location === -1) {
	  //     model.error = `Could not enable attribute ${name} No such attribute.`;
	  //     return false;
	  //   }
	  //   model.context.disableVertexAttribArray(location);
	  //   return true;
	  // };
	}

	// ----------------------------------------------------------------------------
	// Object factory
	// ----------------------------------------------------------------------------

	var DEFAULT_VALUES = {
	  vertexShaderHandle: 0,
	  fragmentShaderHandle: 0,
	  geometryShaderHandle: 0,
	  vertexShader: null,
	  fragmentShader: null,
	  geometryShader: null,

	  linked: false,
	  bound: false,
	  compiled: false,
	  error: '',
	  handle: 0,
	  numberOfOutputs: 0,
	  attributesLocs: null,
	  uniformLocs: null,
	  md5Hash: 0,
	  context: null
	};

	// ----------------------------------------------------------------------------

	function extend(publicAPI, model) {
	  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  Object.assign(model, DEFAULT_VALUES, initialValues);

	  // Instanciate internal objects
	  model.attributesLocs = {};
	  model.uniformLocs = {};
	  model.vertexShader = _Shader2.default.newInstance();
	  model.vertexShader.setShaderType('Vertex');
	  model.fragmentShader = _Shader2.default.newInstance();
	  model.fragmentShader.setShaderType('Fragment');
	  model.geometryShader = _Shader2.default.newInstance();
	  model.geometryShader.setShaderType('Geometry');

	  // Build VTK API
	  macro.obj(publicAPI, model);
	  macro.setGet(publicAPI, model, ['error', 'handle', 'compiled', 'bound', 'md5Hash', 'vertexShader', 'fragmentShader', 'geometryShader', 'linked']);

	  // Object methods
	  vtkShaderProgram(publicAPI, model);
	}

	// ----------------------------------------------------------------------------

	var newInstance = exports.newInstance = macro.newInstance(extend);

	// ----------------------------------------------------------------------------

	exports.default = { newInstance: newInstance, extend: extend, substitute: substitute };

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newInstance = undefined;
	exports.vtkShader = vtkShader;
	exports.extend = extend;

	var _macro = __webpack_require__(2);

	var macro = _interopRequireWildcard(_macro);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// export const SHADER_TYPES = ['Vertex', 'Fragment', 'Geometry', 'Unknown'];

	// ----------------------------------------------------------------------------
	// vtkShader methods
	// ----------------------------------------------------------------------------

	function vtkShader(publicAPI, model) {
	  // Set our className
	  model.classHierarchy.push('vtkShader');

	  publicAPI.compile = function () {
	    var stype = model.context.VERTEX_SHADER;

	    if (!model.source || !model.source.length || model.shaderType === 'Unknown') {
	      return false;
	    }

	    // Ensure we delete the previous shader if necessary.
	    if (model.handle !== 0) {
	      model.context.deleteShader(model.handle);
	      model.handle = 0;
	    }

	    switch (model.shaderType) {
	      // case vtkShader::Geometry:
	      //   type = GL_GEOMETRY_SHADER;
	      //   break;
	      case 'Fragment':
	        stype = model.context.FRAGMENT_SHADER;
	        break;
	      case 'Vertex':
	      default:
	        stype = model.context.VERTEX_SHADER;
	        break;
	    }

	    model.handle = model.context.createShader(stype);
	    model.context.shaderSource(model.handle, model.source);
	    model.context.compileShader(model.handle);
	    var isCompiled = model.context.getShaderParameter(model.handle, model.context.COMPILE_STATUS);
	    if (!isCompiled) {
	      var lastError = model.context.getShaderInfoLog(model.handle);
	      console.error('Error compiling shader \'' + model.source + '\': ' + lastError);
	      model.context.deleteShader(model.handle);
	      model.handle = 0;
	      return false;
	    }

	    // The shader compiled, store its handle and return success.
	    return true;
	  };

	  publicAPI.cleanup = function () {
	    if (model.shaderType === 'Unknown' || model.handle === 0) {
	      return;
	    }

	    model.context.deleteShader(model.handle);
	    model.handle = 0;
	    model.dirty = true;
	  };
	}

	// ----------------------------------------------------------------------------
	// Object factory
	// ----------------------------------------------------------------------------

	var DEFAULT_VALUES = {
	  shaderType: 'Unknown',
	  source: '',
	  error: '',
	  handle: 0,
	  dirty: false,
	  context: null
	};

	// ----------------------------------------------------------------------------

	function extend(publicAPI, model) {
	  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  Object.assign(model, DEFAULT_VALUES, initialValues);

	  // Build VTK API
	  macro.obj(publicAPI, model);
	  macro.setGet(publicAPI, model, ['shaderType', 'source', 'error', 'handle', 'context']);

	  // Object methods
	  vtkShader(publicAPI, model);
	}

	// ----------------------------------------------------------------------------

	var newInstance = exports.newInstance = macro.newInstance(extend);

	// ----------------------------------------------------------------------------

	exports.default = { newInstance: newInstance, extend: extend };

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newInstance = undefined;
	exports.extend = extend;

	var _macro = __webpack_require__(2);

	var macro = _interopRequireWildcard(_macro);

	var _Constants = __webpack_require__(23);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	// ----------------------------------------------------------------------------
	// vtkOpenGLVertexArrayObject methods
	// ----------------------------------------------------------------------------

	function vtkOpenGLVertexArrayObject(publicAPI, model) {
	  var _this = this;

	  // Set our className
	  model.classHierarchy.push('vtkOpenGLVertexArrayObject');

	  // Public API methods
	  publicAPI.exposedMethod = function () {
	    // This is a publicly exposed method of this object
	  };

	  publicAPI.initialize = function () {
	    // if (!model.forceEmulation && false) {
	    //   model.supported = true;
	    //   model.context.genVertexArrays(1, model.handleVAO);
	    // } else {
	    model.supported = false;
	    // }
	  };

	  publicAPI.isReady = function () {
	    return(
	      // We either probed and allocated a VAO, or are falling back as the current
	      // hardware does not support VAOs.
	      model.handleVAO !== 0 || model.supported === false
	    );
	  };

	  publicAPI.bind = function () {
	    // Either simply bind the VAO, or emulate behavior by binding all attributes.
	    if (!publicAPI.isReady()) {
	      publicAPI.initialize();
	    }
	    if (publicAPI.isReady() && model.supported) {
	      model.context.bindVertexArray(model.handleVAO);
	    } else if (publicAPI.isReady()) {
	      (function () {
	        var gl = model.context;
	        Object.keys(model.buffers).map(function (key) {
	          return model.buffers[key];
	        }).forEach(function (buff) {
	          model.context.bindBuffer(gl.ARRAY_BUFFER, buff.buffer);
	          Object.keys(buff.attributes).map(function (key) {
	            return buff.attributes[key];
	          }).forEach(function (attrIt) {
	            var matrixCount = attrIt.isMatrix ? attrIt.size : 1;
	            for (var i = 0; i < matrixCount; ++i) {
	              gl.enableVertexAttribArray(attrIt.index + i);
	              gl.vertexAttribPointer(attrIt.index + i, attrIt.size, attrIt.type, attrIt.normalize, attrIt.stride, attrIt.offset + attrIt.stride * i / attrIt.size);
	              if (attrIt.divisor > 0) {
	                gl.vertexAttribDivisor(attrIt.index + i, 1);
	              }
	            }
	          });
	          // gl.bindBuffer(gl.ARRAY_BUFFER, 0);
	        });
	      })();
	    }
	  };

	  publicAPI.release = function () {
	    // Either simply release the VAO, or emulate behavior by releasing all attributes.
	    if (publicAPI.isReady() && model.supported) {
	      model.context.bindVertexArray(0);
	    } else if (publicAPI.isReady()) {
	      (function () {
	        var gl = model.context;
	        Object.keys(model.buffers).map(function (key) {
	          return model.buffers[key];
	        }).forEach(function (buff) {
	          Object.keys(buff.attributes).map(function (key) {
	            return buff.attributes[key];
	          }).forEach(function (attrIt) {
	            var matrixCount = attrIt.isMatrix ? attrIt.size : 1;
	            for (var i = 0; i < matrixCount; ++i) {
	              gl.enableVertexAttribArray(attrIt.index + i);
	              gl.vertexAttribPointer(attrIt.index + i, attrIt.size, attrIt.type, attrIt.normalize, attrIt.stride, attrIt.offset + attrIt.stride * i / attrIt.size);
	              if (attrIt.divisor > 0) {
	                gl.vertexAttribDivisor(attrIt.index + i, 0);
	              }
	              gl.disableVertexAttribArray(attrIt.index + i);
	            }
	          });
	        });
	      })();
	    }
	  };

	  publicAPI.shaderProgramChanged = function () {
	    publicAPI.release();
	    if (model.handleVAO) {
	      model.context.deleteVertexArrays(1, _this.handleVAO);
	    }
	    model.handleVAO = 0;
	    model.handleProgram = 0;
	  };

	  publicAPI.releaseGraphicsResources = function () {
	    publicAPI.shaderProgramChanged();
	    if (model.handleVAO) {
	      model.context.deleteVertexArrays(1, model.handleVAO);
	    }
	    model.handleVAO = 0;
	    model.supported = true;
	    model.handleProgram = 0;
	  };

	  publicAPI.addAttributeArray = function (program, buffer, name, offset, stride, elementType, elementTupleSize, normalize) {
	    return publicAPI.addAttributeArrayWithDivisor(program, buffer, name, offset, stride, elementType, elementTupleSize, normalize, 0, false);
	  };

	  publicAPI.addAttributeArrayWithDivisor = function (program, buffer, name, offset, stride, elementType, elementTupleSize, normalize, divisor, isMatrix) {
	    if (!program) {
	      return false;
	    }

	    // Check the program is bound, and the buffer is valid.
	    if (!program.isBound() || buffer.getHandle() === 0 || buffer.getType() !== _Constants.OBJECT_TYPE.ARRAY_BUFFER) {
	      return false;
	    }

	    // Perform initalization if necessary, ensure program matches VAOs.
	    if (model.handleProgram === 0) {
	      model.handleProgram = program.getHandle();
	    }
	    if (!publicAPI.isReady()) {
	      publicAPI.initialize();
	    }
	    if (!publicAPI.isReady() || model.handleProgram !== program.getHandle()) {
	      return false;
	    }

	    var gl = model.context;

	    var attribs = {};
	    attribs.index = gl.getAttribLocation(model.handleProgram, name);
	    attribs.offset = offset;
	    attribs.stride = stride;
	    //    attribs.type = convertTypeToGL(elementType);
	    attribs.type = elementType;
	    attribs.size = elementTupleSize;
	    attribs.normalize = normalize;
	    attribs.isMatrix = isMatrix;
	    attribs.divisor = divisor;

	    if (attribs.Index === -1) {
	      return false;
	    }

	    // Always make the call as even the first use wants the attrib pointer setting
	    // up when we are emulating.
	    buffer.bind();
	    gl.enableVertexAttribArray(attribs.index);
	    gl.vertexAttribPointer(attribs.index, attribs.size, attribs.type, attribs.normalize, attribs.stride, attribs.offset);

	    if (divisor > 0) {
	      gl.vertexAttribDivisor(attribs.index, 1);
	    }

	    // If vertex array objects are not supported then build up our list.
	    if (!model.supported) {
	      var handleBuffer = buffer.getHandle();
	      // find the buffer
	      if (Object.keys(model.buffers).indexOf(handleBuffer) !== -1) {
	        model.buffers[handleBuffer].attributes[attribs.index] = attribs;
	        model.buffers[handleBuffer].buffer = handleBuffer;
	      } else {
	        // a single handle can have multiple attribs
	        model.buffers[handleBuffer] = { buffer: handleBuffer, attributes: _defineProperty({}, attribs.index, attribs) };
	      }
	    }
	    return true;
	  };

	  publicAPI.addAttributeMatrixWithDivisor = function (program, buffer, name, offset, stride, elementType, elementTupleSize, normalize, divisor) {
	    // bind the first row of values
	    var result = publicAPI.addAttributeArrayWithDivisor(program, buffer, name, offset, stride, elementType, elementTupleSize, normalize, divisor, true);

	    if (!result) {
	      return result;
	    }

	    var gl = model.context;

	    var index = gl.getAttribLocation(model.handleProgram, name);

	    for (var i = 1; i < elementTupleSize; i++) {
	      gl.enableVertexAttribArray(index + i);
	      //      gl.vertexAttribPointer(index + i, elementTupleSize, convertTypeToGL(elementType),
	      gl.vertexAttribPointer(index + i, elementTupleSize, elementType, normalize, stride, offset + stride * i / elementTupleSize);
	      if (divisor > 0) {
	        gl.vertexAttribDivisor(index + i, 1);
	      }
	    }

	    return true;
	  };

	  publicAPI.removeAttributeArray = function (name) {
	    if (!publicAPI.isReady() || model.handleProgram === 0) {
	      return false;
	    }

	    var gl = model.context;
	    var location = gl.getAttribLocation(model.handleProgram, name);

	    if (location === -1) {
	      return false;
	    }

	    gl.disableVertexAttribArray(location);
	    // If we don't have real VAOs find the entry and remove it too.
	    if (!model.supported) {
	      Object.keys(model.buffers).map(function (key) {
	        return model.buffers[key];
	      }).forEach(function (buff) {
	        delete buff.attributes[location];
	      });
	    }

	    return true;
	  };
	}

	// ----------------------------------------------------------------------------
	// Object factory
	// ----------------------------------------------------------------------------

	var DEFAULT_VALUES = {
	  forceEmulation: false,
	  handleVAO: 0,
	  handleProgram: 0,
	  supported: true,
	  buffers: null,
	  context: null
	};

	// ----------------------------------------------------------------------------

	function extend(publicAPI, model) {
	  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  Object.assign(model, DEFAULT_VALUES, initialValues);

	  // Internal objects initialization
	  model.buffers = {};

	  // Object methods
	  macro.obj(publicAPI, model);

	  // Create get-only macros
	  macro.get(publicAPI, model, ['supported']);

	  // Create get-set macros
	  macro.setGet(publicAPI, model, ['context', 'forceEmulation']);

	  // For more macro methods, see "Sources/macro.js"

	  // Object specific methods
	  vtkOpenGLVertexArrayObject(publicAPI, model);
	}

	// ----------------------------------------------------------------------------

	var newInstance = exports.newInstance = macro.newInstance(extend);

	// ----------------------------------------------------------------------------

	exports.default = { newInstance: newInstance, extend: extend };

/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	// ----------------------------------------------------------------------------
	/* eslint-disable camelcase                                                  */
	/* eslint-disable no-cond-assign                                             */
	// ----------------------------------------------------------------------------
	var VTK_MAX_ROTATIONS = 20;
	var VTK_SMALL_NUMBER = 1.0e-12;

	function notImplemented(method) {
	  return function () {
	    return console.log('vtkMath::${method} - NOT IMPLEMENTED');
	  };
	}

	function vtkSwapVectors3(v1, v2) {
	  for (var i = 0; i < 3; i++) {
	    var tmp = v1[i];
	    v1[i] = v2[i];
	    v2[i] = tmp;
	  }
	}

	function createArray() {
	  var size = arguments.length <= 0 || arguments[0] === undefined ? 3 : arguments[0];

	  var array = [];
	  while (array.length < size) {
	    array.push(0);
	  }
	  return array;
	}

	// ----------------------------------------------------------------------------
	// Global methods
	// ----------------------------------------------------------------------------

	var Pi = function Pi() {
	  return Math.PI;
	};
	var radiansFromDegrees = function radiansFromDegrees(deg) {
	  return deg / 180 * Math.PI;
	};
	var degreesFromRadians = function degreesFromRadians(rad) {
	  return rad * 180 / Math.PI;
	};
	var round = Math.round;
	var floor = Math.floor;
	var ceil = Math.ceil;
	var ceilLog2 = notImplemented('ceilLog2');
	var min = Math.min;
	var max = Math.max;
	var isPowerOfTwo = notImplemented('isPowerOfTwo');
	var nearestPowerOfTwo = notImplemented('nearestPowerOfTwo');
	var factorial = notImplemented('factorial');

	function binomial(m, n) {
	  var r = 1;
	  for (var i = 1; i <= n; ++i) {
	    r *= (m - i + 1) / i;
	  }
	  return Math.floor(r);
	}

	function beginCombination(m, n) {
	  if (m < n) {
	    return 0;
	  }

	  var r = createArray(n);
	  for (var i = 0; i < n; ++i) {
	    r[i] = i;
	  }
	  return r;
	}

	function nextCombination(m, n, r) {
	  var status = 0;
	  for (var i = n - 1; i >= 0; --i) {
	    if (r[i] < m - n + i) {
	      var j = r[i] + 1;
	      while (i < n) {
	        r[i++] = j++;
	      }
	      status = 1;
	      break;
	    }
	  }
	  return status;
	}

	var randomSeed = notImplemented('randomSeed');
	var getSeed = notImplemented('getSeed');

	function random() {
	  var minValue = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	  var maxValue = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

	  var delta = maxValue - minValue;
	  return minValue + delta * Math.random();
	}

	var gaussian = notImplemented('gaussian');

	// Vect3 operations
	function add(a, b, out) {
	  out[0] = a[0] + b[0];
	  out[1] = a[1] + b[1];
	  out[2] = a[2] + b[2];
	}

	function subtract(a, b, out) {
	  out[0] = a[0] - b[0];
	  out[1] = a[1] - b[1];
	  out[2] = a[2] - b[2];
	}

	function multiplyScalar(vec, scalar) {
	  vec[0] *= scalar;
	  vec[1] *= scalar;
	  vec[2] *= scalar;
	}

	function multiplyScalar2D(vec, scalar) {
	  vec[0] *= scalar;
	  vec[1] *= scalar;
	}

	function dot(x, y) {
	  return x[0] * y[0] + x[1] * y[1] + x[2] * y[2];
	}

	function outer(x, y, out_3x3) {
	  for (var i = 0; i < 3; i++) {
	    for (var j = 0; j < 3; j++) {
	      out_3x3[i][j] = x[i] * y[j];
	    }
	  }
	}

	function cross(x, y, out) {
	  var Zx = x[1] * y[2] - x[2] * y[1];
	  var Zy = x[2] * y[0] - x[0] * y[2];
	  var Zz = x[0] * y[1] - x[1] * y[0];
	  out[0] = Zx;
	  out[1] = Zy;
	  out[2] = Zz;
	}

	function norm(x) {
	  var n = arguments.length <= 1 || arguments[1] === undefined ? 3 : arguments[1];

	  switch (n) {
	    case 1:
	      return Math.abs(x);
	    case 2:
	      return Math.sqrt(x[0] * x[0] + x[1] * x[1]);
	    case 3:
	      return Math.sqrt(x[0] * x[0] + x[1] * x[1] + x[2] * x[2]);
	    default:
	      {
	        var sum = 0;
	        for (var i = 0; i < n; i++) {
	          sum += x[i] * x[i];
	        }
	        return Math.sqrt(sum);
	      }
	  }
	}

	function normalize(x) {
	  var den = norm(x);
	  if (den !== 0.0) {
	    x[0] /= den;
	    x[1] /= den;
	    x[2] /= den;
	  }
	  return den;
	}

	function perpendiculars(x, y, z, theta) {
	  var x2 = x[0] * x[0];
	  var y2 = x[1] * x[1];
	  var z2 = x[2] * x[2];
	  var r = Math.sqrt(x2 + y2 + z2);

	  var dx = void 0;
	  var dy = void 0;
	  var dz = void 0;

	  // transpose the vector to avoid divide-by-zero error
	  if (x2 > y2 && x2 > z2) {
	    dx = 0;
	    dy = 1;
	    dz = 2;
	  } else if (y2 > z2) {
	    dx = 1;
	    dy = 2;
	    dz = 0;
	  } else {
	    dx = 2;
	    dy = 0;
	    dz = 1;
	  }

	  var a = x[dx] / r;
	  var b = x[dy] / r;
	  var c = x[dz] / r;
	  var tmp = Math.sqrt(a * a + c * c);

	  if (theta !== 0) {
	    var sintheta = Math.sin(theta);
	    var costheta = Math.cos(theta);

	    if (y) {
	      y[dx] = (c * costheta - a * b * sintheta) / tmp;
	      y[dy] = sintheta * tmp;
	      y[dz] = (-a * costheta - b * c * sintheta) / tmp;
	    }

	    if (z) {
	      z[dx] = (-c * sintheta - a * b * costheta) / tmp;
	      z[dy] = costheta * tmp;
	      z[dz] = (a * sintheta - b * c * costheta) / tmp;
	    }
	  } else {
	    if (y) {
	      y[dx] = c / tmp;
	      y[dy] = 0;
	      y[dz] = -a / tmp;
	    }

	    if (z) {
	      z[dx] = -a * b / tmp;
	      z[dy] = tmp;
	      z[dz] = -b * c / tmp;
	    }
	  }
	}

	function projectVector(a, b, projection) {
	  var bSquared = dot(b, b);

	  if (bSquared === 0) {
	    projection[0] = 0;
	    projection[1] = 0;
	    projection[2] = 0;
	    return false;
	  }

	  var scale = dot(a, b) / bSquared;

	  for (var i = 0; i < 3; i++) {
	    projection[i] = b[i];
	  }
	  multiplyScalar(projection, scale);

	  return true;
	}

	function dot2D(x, y) {
	  return x[0] * y[0] + x[1] * y[1];
	}

	function projectVector2D(a, b, projection) {
	  var bSquared = dot2D(b, b);

	  if (bSquared === 0) {
	    projection[0] = 0;
	    projection[1] = 0;
	    return false;
	  }

	  var scale = dot2D(a, b) / bSquared;

	  for (var i = 0; i < 2; i++) {
	    projection[i] = b[i];
	  }
	  multiplyScalar2D(projection, scale);

	  return true;
	}

	function distance2BetweenPoints(x, y) {
	  return (x[0] - y[0]) * (x[0] - y[0]) + (x[1] - y[1]) * (x[1] - y[1]) + (x[2] - y[2]) * (x[2] - y[2]);
	}

	function angleBetweenVectors(v1, v2) {
	  var crossVect = [0, 0, 0];
	  cross(v1, v2, crossVect);
	  return Math.atan2(norm(cross), dot(v1, v2));
	}

	function gaussianAmplitude(mean, variance, position) {
	  var distanceFromMean = Math.abs(mean - position);
	  return 1 / Math.sqrt(2 * Math.PI * variance) * Math.exp(-Math.pow(distanceFromMean, 2) / (2 * variance));
	}

	function gaussianWeight(mean, variance, position) {
	  var distanceFromMean = Math.abs(mean - position);
	  return Math.exp(-Math.pow(distanceFromMean, 2) / (2 * variance));
	}

	function outer2D(x, y, out_2x2) {
	  for (var i = 0; i < 2; i++) {
	    for (var j = 0; j < 2; j++) {
	      out_2x2[i][j] = x[i] * y[j];
	    }
	  }
	}

	function norm2D(x2D) {
	  return Math.sqrt(x2D[0] * x2D[0] + x2D[1] * x2D[1]);
	}

	function normalize2D(x) {
	  var den = norm2D(x);
	  if (den !== 0.0) {
	    x[0] /= den;
	    x[1] /= den;
	  }
	  return den;
	}

	function determinant2x2(c1, c2) {
	  return c1[0] * c2[1] - c2[0] * c1[1];
	}

	function LUFactor3x3(mat_3x3, index_3) {
	  var maxI = void 0;
	  var tmp = void 0;
	  var largest = void 0;
	  var scale = [0, 0, 0];

	  // Loop over rows to get implicit scaling information
	  for (var i = 0; i < 3; i++) {
	    largest = Math.abs(mat_3x3[i][0]);
	    if ((tmp = Math.abs(mat_3x3[i][1])) > largest) {
	      largest = tmp;
	    }
	    if ((tmp = Math.abs(mat_3x3[i][2])) > largest) {
	      largest = tmp;
	    }
	    scale[i] = 1 / largest;
	  }

	  // Loop over all columns using Crout's method

	  // first column
	  largest = scale[0] * Math.abs(mat_3x3[0][0]);
	  maxI = 0;
	  if ((tmp = scale[1] * Math.abs(mat_3x3[1][0])) >= largest) {
	    largest = tmp;
	    maxI = 1;
	  }
	  if ((tmp = scale[2] * Math.abs(mat_3x3[2][0])) >= largest) {
	    maxI = 2;
	  }
	  if (maxI !== 0) {
	    vtkSwapVectors3(mat_3x3[maxI], mat_3x3[0]);
	    scale[maxI] = scale[0];
	  }
	  index_3[0] = maxI;

	  mat_3x3[1][0] /= mat_3x3[0][0];
	  mat_3x3[2][0] /= mat_3x3[0][0];

	  // second column
	  mat_3x3[1][1] -= mat_3x3[1][0] * mat_3x3[0][1];
	  mat_3x3[2][1] -= mat_3x3[2][0] * mat_3x3[0][1];
	  largest = scale[1] * Math.abs(mat_3x3[1][1]);
	  maxI = 1;
	  if ((tmp = scale[2] * Math.abs(mat_3x3[2][1])) >= largest) {
	    maxI = 2;
	    vtkSwapVectors3(mat_3x3[2], mat_3x3[1]);
	    scale[2] = scale[1];
	  }
	  index_3[1] = maxI;
	  mat_3x3[2][1] /= mat_3x3[1][1];

	  // third column
	  mat_3x3[1][2] -= mat_3x3[1][0] * mat_3x3[0][2];
	  mat_3x3[2][2] -= mat_3x3[2][0] * mat_3x3[0][2] + mat_3x3[2][1] * mat_3x3[1][2];
	  index_3[2] = 2;
	}

	function LUSolve3x3(mat_3x3, index_3, x_3) {
	  // forward substitution
	  var sum = x_3[index_3[0]];
	  x_3[index_3[0]] = x_3[0];
	  x_3[0] = sum;

	  sum = x_3[index_3[1]];
	  x_3[index_3[1]] = x_3[1];
	  x_3[1] = sum - mat_3x3[1][0] * x_3[0];

	  sum = x_3[index_3[2]];
	  x_3[index_3[2]] = x_3[2];
	  x_3[2] = sum - mat_3x3[2][0] * x_3[0] - mat_3x3[2][1] * x_3[1];

	  // back substitution
	  x_3[2] = x_3[2] / mat_3x3[2][2];
	  x_3[1] = (x_3[1] - mat_3x3[1][2] * x_3[2]) / mat_3x3[1][1];
	  x_3[0] = (x_3[0] - mat_3x3[0][1] * x_3[1] - mat_3x3[0][2] * x_3[2]) / mat_3x3[0][0];
	}

	function linearSolve3x3(mat_3x3, x_3, y_3) {
	  var a1 = mat_3x3[0][0];
	  var b1 = mat_3x3[0][1];
	  var c1 = mat_3x3[0][2];
	  var a2 = mat_3x3[1][0];
	  var b2 = mat_3x3[1][1];
	  var c2 = mat_3x3[1][2];
	  var a3 = mat_3x3[2][0];
	  var b3 = mat_3x3[2][1];
	  var c3 = mat_3x3[2][2];

	  // Compute the adjoint
	  var d1 = +determinant2x2(b2, b3, c2, c3);
	  var d2 = -determinant2x2(a2, a3, c2, c3);
	  var d3 = +determinant2x2(a2, a3, b2, b3);

	  var e1 = -determinant2x2(b1, b3, c1, c3);
	  var e2 = +determinant2x2(a1, a3, c1, c3);
	  var e3 = -determinant2x2(a1, a3, b1, b3);

	  var f1 = +determinant2x2(b1, b2, c1, c2);
	  var f2 = -determinant2x2(a1, a2, c1, c2);
	  var f3 = +determinant2x2(a1, a2, b1, b2);

	  // Compute the determinant
	  var det = a1 * d1 + b1 * d2 + c1 * d3;

	  // Multiply by the adjoint
	  var v1 = d1 * x_3[0] + e1 * x_3[1] + f1 * x_3[2];
	  var v2 = d2 * x_3[0] + e2 * x_3[1] + f2 * x_3[2];
	  var v3 = d3 * x_3[0] + e3 * x_3[1] + f3 * x_3[2];

	  // Divide by the determinant
	  y_3[0] = v1 / det;
	  y_3[1] = v2 / det;
	  y_3[2] = v3 / det;
	}

	function multiply3x3_vect3(mat_3x3, in_3, out_3) {
	  var x = mat_3x3[0][0] * in_3[0] + mat_3x3[0][1] * in_3[1] + mat_3x3[0][2] * in_3[2];
	  var y = mat_3x3[1][0] * in_3[0] + mat_3x3[1][1] * in_3[1] + mat_3x3[1][2] * in_3[2];
	  var z = mat_3x3[2][0] * in_3[0] + mat_3x3[2][1] * in_3[1] + mat_3x3[2][2] * in_3[2];

	  out_3[0] = x;
	  out_3[1] = y;
	  out_3[2] = z;
	}

	function multiply3x3_mat3(a_3x3, b_3x3, out_3x3) {
	  var tmp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

	  for (var i = 0; i < 3; i++) {
	    tmp[0][i] = a_3x3[0][0] * b_3x3[0][i] + a_3x3[0][1] * b_3x3[1][i] + a_3x3[0][2] * b_3x3[2][i];
	    tmp[1][i] = a_3x3[1][0] * b_3x3[0][i] + a_3x3[1][1] * b_3x3[1][i] + a_3x3[1][2] * b_3x3[2][i];
	    tmp[2][i] = a_3x3[2][0] * b_3x3[0][i] + a_3x3[2][1] * b_3x3[1][i] + a_3x3[2][2] * b_3x3[2][i];
	  }

	  for (var j = 0; j < 3; j++) {
	    out_3x3[j][0] = tmp[j][0];
	    out_3x3[j][1] = tmp[j][1];
	    out_3x3[j][2] = tmp[j][2];
	  }
	}

	function multiplyMatrix(a, b, rowA, colA, rowB, colB, out_rowXcol) {
	  // we need colA == rowB
	  if (colA !== rowB) {
	    console.error('Number of columns of A must match number of rows of B.');
	  }

	  // output matrix is rowA*colB
	  // output row
	  for (var i = 0; i < rowA; i++) {
	    // output col
	    for (var j = 0; j < colB; j++) {
	      out_rowXcol[i][j] = 0;
	      // sum for this point
	      for (var k = 0; k < colA; k++) {
	        out_rowXcol[i][j] += a[i][k] * b[k][j];
	      }
	    }
	  }
	}

	function transpose3x3(in_3x3, outT_3x3) {
	  var tmp = void 0;
	  tmp = in_3x3[1][0];
	  outT_3x3[1][0] = in_3x3[0][1];
	  outT_3x3[0][1] = tmp;
	  tmp = in_3x3[2][0];
	  outT_3x3[2][0] = in_3x3[0][2];
	  outT_3x3[0][2] = tmp;
	  tmp = in_3x3[2][1];
	  outT_3x3[2][1] = in_3x3[1][2];
	  outT_3x3[1][2] = tmp;

	  outT_3x3[0][0] = in_3x3[0][0];
	  outT_3x3[1][1] = in_3x3[1][1];
	  outT_3x3[2][2] = in_3x3[2][2];
	}

	function invert3x3(in_3x3, outI_3x3) {
	  var a1 = in_3x3[0][0];
	  var b1 = in_3x3[0][1];
	  var c1 = in_3x3[0][2];
	  var a2 = in_3x3[1][0];
	  var b2 = in_3x3[1][1];
	  var c2 = in_3x3[1][2];
	  var a3 = in_3x3[2][0];
	  var b3 = in_3x3[2][1];
	  var c3 = in_3x3[2][2];

	  // Compute the adjoint
	  var d1 = +determinant2x2(b2, b3, c2, c3);
	  var d2 = -determinant2x2(a2, a3, c2, c3);
	  var d3 = +determinant2x2(a2, a3, b2, b3);

	  var e1 = -determinant2x2(b1, b3, c1, c3);
	  var e2 = +determinant2x2(a1, a3, c1, c3);
	  var e3 = -determinant2x2(a1, a3, b1, b3);

	  var f1 = +determinant2x2(b1, b2, c1, c2);
	  var f2 = -determinant2x2(a1, a2, c1, c2);
	  var f3 = +determinant2x2(a1, a2, b1, b2);

	  // Divide by the determinant
	  var det = a1 * d1 + b1 * d2 + c1 * d3;

	  outI_3x3[0][0] = d1 / det;
	  outI_3x3[1][0] = d2 / det;
	  outI_3x3[2][0] = d3 / det;

	  outI_3x3[0][1] = e1 / det;
	  outI_3x3[1][1] = e2 / det;
	  outI_3x3[2][1] = e3 / det;

	  outI_3x3[0][2] = f1 / det;
	  outI_3x3[1][2] = f2 / det;
	  outI_3x3[2][2] = f3 / det;
	}

	function identity3x3(mat_3x3) {
	  for (var i = 0; i < 3; i++) {
	    mat_3x3[i][0] = mat_3x3[i][1] = mat_3x3[i][2] = 0;
	    mat_3x3[i][i] = 1;
	  }
	}

	function determinant3x3(mat_3x3) {
	  return mat_3x3[0][0] * mat_3x3[1][1] * mat_3x3[2][2] + mat_3x3[1][0] * mat_3x3[2][1] * mat_3x3[0][2] + mat_3x3[2][0] * mat_3x3[0][1] * mat_3x3[1][2] - mat_3x3[0][0] * mat_3x3[2][1] * mat_3x3[1][2] - mat_3x3[1][0] * mat_3x3[0][1] * mat_3x3[2][2] - mat_3x3[2][0] * mat_3x3[1][1] * mat_3x3[0][2];
	}

	function quaternionToMatrix3x3(quat_4, mat_3x3) {
	  var ww = quat_4[0] * quat_4[0];
	  var wx = quat_4[0] * quat_4[1];
	  var wy = quat_4[0] * quat_4[2];
	  var wz = quat_4[0] * quat_4[3];

	  var xx = quat_4[1] * quat_4[1];
	  var yy = quat_4[2] * quat_4[2];
	  var zz = quat_4[3] * quat_4[3];

	  var xy = quat_4[1] * quat_4[2];
	  var xz = quat_4[1] * quat_4[3];
	  var yz = quat_4[2] * quat_4[3];

	  var rr = xx + yy + zz;
	  // normalization factor, just in case quaternion was not normalized
	  var f = 1 / (ww + rr);
	  var s = (ww - rr) * f;
	  f *= 2;

	  mat_3x3[0][0] = xx * f + s;
	  mat_3x3[1][0] = (xy + wz) * f;
	  mat_3x3[2][0] = (xz - wy) * f;

	  mat_3x3[0][1] = (xy - wz) * f;
	  mat_3x3[1][1] = yy * f + s;
	  mat_3x3[2][1] = (yz + wx) * f;

	  mat_3x3[0][2] = (xz + wy) * f;
	  mat_3x3[1][2] = (yz - wx) * f;
	  mat_3x3[2][2] = zz * f + s;
	}

	function jacobiN(a, n, w, v) {
	  var i = void 0;
	  var j = void 0;
	  var k = void 0;
	  var iq = void 0;
	  var ip = void 0;
	  var numPos = void 0;
	  var tresh = void 0;
	  var theta = void 0;
	  var t = void 0;
	  var tau = void 0;
	  var sm = void 0;
	  var s = void 0;
	  var h = void 0;
	  var g = void 0;
	  var c = void 0;
	  var tmp = void 0;
	  var b = createArray(n);
	  var z = createArray(n);

	  var vtkROTATE = function vtkROTATE(aa, ii, jj, kk, ll) {
	    g = aa[ii][jj];
	    h = aa[kk][ll];
	    a[ii][jj] = g - s * (h + g * tau);
	    a[kk][ll] = h + s * (g - h * tau);
	  };

	  // initialize
	  for (ip = 0; ip < n; ip++) {
	    for (iq = 0; iq < n; iq++) {
	      v[ip][iq] = 0.0;
	    }
	    v[ip][ip] = 1.0;
	  }
	  for (ip = 0; ip < n; ip++) {
	    b[ip] = w[ip] = a[ip][ip];
	    z[ip] = 0.0;
	  }

	  // begin rotation sequence
	  for (i = 0; i < VTK_MAX_ROTATIONS; i++) {
	    sm = 0.0;
	    for (ip = 0; ip < n - 1; ip++) {
	      for (iq = ip + 1; iq < n; iq++) {
	        sm += Math.abs(a[ip][iq]);
	      }
	    }
	    if (sm === 0.0) {
	      break;
	    }

	    // first 3 sweeps
	    if (i < 3) {
	      tresh = 0.2 * sm / (n * n);
	    } else {
	      tresh = 0.0;
	    }

	    for (ip = 0; ip < n - 1; ip++) {
	      for (iq = ip + 1; iq < n; iq++) {
	        g = 100.0 * Math.abs(a[ip][iq]);

	        // after 4 sweeps
	        if (i > 3 && Math.abs(w[ip]) + g === Math.abs(w[ip]) && Math.abs(w[iq]) + g === Math.abs(w[iq])) {
	          a[ip][iq] = 0.0;
	        } else if (Math.abs(a[ip][iq]) > tresh) {
	          h = w[iq] - w[ip];
	          if (Math.abs(h) + g === Math.abs(h)) {
	            t = a[ip][iq] / h;
	          } else {
	            theta = 0.5 * h / a[ip][iq];
	            t = 1.0 / (Math.abs(theta) + Math.sqrt(1.0 + theta * theta));
	            if (theta < 0.0) {
	              t = -t;
	            }
	          }
	          c = 1.0 / Math.sqrt(1 + t * t);
	          s = t * c;
	          tau = s / (1.0 + c);
	          h = t * a[ip][iq];
	          z[ip] -= h;
	          z[iq] += h;
	          w[ip] -= h;
	          w[iq] += h;
	          a[ip][iq] = 0.0;

	          // ip already shifted left by 1 unit
	          for (j = 0; j <= ip - 1; j++) {
	            vtkROTATE(a, j, ip, j, iq);
	          }
	          // ip and iq already shifted left by 1 unit
	          for (j = ip + 1; j <= iq - 1; j++) {
	            vtkROTATE(a, ip, j, j, iq);
	          }
	          // iq already shifted left by 1 unit
	          for (j = iq + 1; j < n; j++) {
	            vtkROTATE(a, ip, j, iq, j);
	          }
	          for (j = 0; j < n; j++) {
	            vtkROTATE(v, j, ip, j, iq);
	          }
	        }
	      }
	    }

	    for (ip = 0; ip < n; ip++) {
	      b[ip] += z[ip];
	      w[ip] = b[ip];
	      z[ip] = 0.0;
	    }
	  }

	  // this is NEVER called
	  if (i >= VTK_MAX_ROTATIONS) {
	    console.warn('vtkMath::Jacobi: Error extracting eigenfunctions');
	    return 0;
	  }

	  // sort eigenfunctions: these changes do not affect accuracy
	  for (j = 0; j < n - 1; j++) {
	    // boundary incorrect
	    k = j;
	    tmp = w[k];
	    for (i = j + 1; i < n; i++) {
	      // boundary incorrect, shifted already
	      if (w[i] >= tmp) {
	        // why exchange if same?
	        k = i;
	        tmp = w[k];
	      }
	    }
	    if (k !== j) {
	      w[k] = w[j];
	      w[j] = tmp;
	      for (i = 0; i < n; i++) {
	        tmp = v[i][j];
	        v[i][j] = v[i][k];
	        v[i][k] = tmp;
	      }
	    }
	  }
	  // insure eigenvector consistency (i.e., Jacobi can compute vectors that
	  // are negative of one another (.707,.707,0) and (-.707,-.707,0). This can
	  // reek havoc in hyperstreamline/other stuff. We will select the most
	  // positive eigenvector.
	  var ceil_half_n = (n >> 1) + (n & 1);
	  for (j = 0; j < n; j++) {
	    for (numPos = 0, i = 0; i < n; i++) {
	      if (v[i][j] >= 0.0) {
	        numPos++;
	      }
	    }
	    //    if ( numPos < ceil(double(n)/double(2.0)) )
	    if (numPos < ceil_half_n) {
	      for (i = 0; i < n; i++) {
	        v[i][j] *= -1.0;
	      }
	    }
	  }
	  return 1;
	}

	function matrix3x3ToQuaternion(mat_3x3, quat_4) {
	  var tmp = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

	  // on-diagonal elements
	  tmp[0][0] = mat_3x3[0][0] + mat_3x3[1][1] + mat_3x3[2][2];
	  tmp[1][1] = mat_3x3[0][0] - mat_3x3[1][1] - mat_3x3[2][2];
	  tmp[2][2] = -mat_3x3[0][0] + mat_3x3[1][1] - mat_3x3[2][2];
	  tmp[3][3] = -mat_3x3[0][0] - mat_3x3[1][1] + mat_3x3[2][2];

	  // off-diagonal elements
	  tmp[0][1] = tmp[1][0] = mat_3x3[2][1] - mat_3x3[1][2];
	  tmp[0][2] = tmp[2][0] = mat_3x3[0][2] - mat_3x3[2][0];
	  tmp[0][3] = tmp[3][0] = mat_3x3[1][0] - mat_3x3[0][1];

	  tmp[1][2] = tmp[2][1] = mat_3x3[1][0] + mat_3x3[0][1];
	  tmp[1][3] = tmp[3][1] = mat_3x3[0][2] + mat_3x3[2][0];
	  tmp[2][3] = tmp[3][2] = mat_3x3[2][1] + mat_3x3[1][2];

	  var eigenvectors = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
	  var eigenvalues = [0, 0, 0, 0];

	  // convert into format that JacobiN can use,
	  // then use Jacobi to find eigenvalues and eigenvectors
	  var NTemp = [0, 0, 0, 0];
	  var eigenvectorsTemp = [0, 0, 0, 0];
	  for (var i = 0; i < 4; i++) {
	    NTemp[i] = tmp[i];
	    eigenvectorsTemp[i] = eigenvectors[i];
	  }
	  jacobiN(NTemp, 4, eigenvalues, eigenvectorsTemp);

	  // the first eigenvector is the one we want
	  quat_4[0] = eigenvectors[0][0];
	  quat_4[1] = eigenvectors[1][0];
	  quat_4[2] = eigenvectors[2][0];
	  quat_4[3] = eigenvectors[3][0];
	}

	function multiplyQuaternion(quat_1, quat_2, quat_out) {
	  var ww = quat_1[0] * quat_2[0];
	  var wx = quat_1[0] * quat_2[1];
	  var wy = quat_1[0] * quat_2[2];
	  var wz = quat_1[0] * quat_2[3];

	  var xw = quat_1[1] * quat_2[0];
	  var xx = quat_1[1] * quat_2[1];
	  var xy = quat_1[1] * quat_2[2];
	  var xz = quat_1[1] * quat_2[3];

	  var yw = quat_1[2] * quat_2[0];
	  var yx = quat_1[2] * quat_2[1];
	  var yy = quat_1[2] * quat_2[2];
	  var yz = quat_1[2] * quat_2[3];

	  var zw = quat_1[3] * quat_2[0];
	  var zx = quat_1[3] * quat_2[1];
	  var zy = quat_1[3] * quat_2[2];
	  var zz = quat_1[3] * quat_2[3];

	  quat_out[0] = ww - xx - yy - zz;
	  quat_out[1] = wx + xw + yz - zy;
	  quat_out[2] = wy - xz + yw + zx;
	  quat_out[3] = wz + xy - yx + zw;
	}

	function orthogonalize3x3(a_3x3, out_3x3) {
	  // copy the matrix
	  for (var i = 0; i < 3; i++) {
	    out_3x3[0][i] = a_3x3[0][i];
	    out_3x3[1][i] = a_3x3[1][i];
	    out_3x3[2][i] = a_3x3[2][i];
	  }

	  // Pivot the matrix to improve accuracy
	  var scale = createArray(3);
	  var index = createArray(3);
	  var largest = void 0;

	  // Loop over rows to get implicit scaling information
	  for (var _i = 0; _i < 3; _i++) {
	    var _x5 = Math.abs(out_3x3[_i][0]);
	    var _x6 = Math.abs(out_3x3[_i][1]);
	    var _x7 = Math.abs(out_3x3[_i][2]);
	    largest = _x6 > _x5 ? _x6 : _x5;
	    largest = _x7 > largest ? _x7 : largest;
	    scale[_i] = 1;
	    if (largest !== 0) {
	      scale[_i] /= largest;
	    }
	  }

	  // first column
	  var x1 = Math.abs(out_3x3[0][0]) * scale[0];
	  var x2 = Math.abs(out_3x3[1][0]) * scale[1];
	  var x3 = Math.abs(out_3x3[2][0]) * scale[2];
	  index[0] = 0;
	  largest = x1;
	  if (x2 >= largest) {
	    largest = x2;
	    index[0] = 1;
	  }
	  if (x3 >= largest) {
	    index[0] = 2;
	  }
	  if (index[0] !== 0) {
	    vtkSwapVectors3(out_3x3[index[0]], out_3x3[0]);
	    scale[index[0]] = scale[0];
	  }

	  // second column
	  var y2 = Math.abs(out_3x3[1][1]) * scale[1];
	  var y3 = Math.abs(out_3x3[2][1]) * scale[2];
	  index[1] = 1;
	  largest = y2;
	  if (y3 >= largest) {
	    index[1] = 2;
	    vtkSwapVectors3(out_3x3[2], out_3x3[1]);
	  }

	  // third column
	  index[2] = 2;

	  // A quaternion can only describe a pure rotation, not
	  // a rotation with a flip, therefore the flip must be
	  // removed before the matrix is converted to a quaternion.
	  var flip = 0;
	  if (determinant3x3(out_3x3) < 0) {
	    flip = 1;
	    for (var _i2 = 0; _i2 < 3; _i2++) {
	      out_3x3[0][_i2] = -out_3x3[0][_i2];
	      out_3x3[1][_i2] = -out_3x3[1][_i2];
	      out_3x3[2][_i2] = -out_3x3[2][_i2];
	    }
	  }

	  // Do orthogonalization using a quaternion intermediate
	  // (this, essentially, does the orthogonalization via
	  // diagonalization of an appropriately constructed symmetric
	  // 4x4 matrix rather than by doing SVD of the 3x3 matrix)
	  var quat = createArray(4);
	  matrix3x3ToQuaternion(out_3x3, quat);
	  quaternionToMatrix3x3(quat, out_3x3);

	  // Put the flip back into the orthogonalized matrix.
	  if (flip) {
	    for (var _i3 = 0; _i3 < 3; _i3++) {
	      out_3x3[0][_i3] = -out_3x3[0][_i3];
	      out_3x3[1][_i3] = -out_3x3[1][_i3];
	      out_3x3[2][_i3] = -out_3x3[2][_i3];
	    }
	  }

	  // Undo the pivoting
	  if (index[1] !== 1) {
	    vtkSwapVectors3(out_3x3[index[1]], out_3x3[1]);
	  }
	  if (index[0] !== 0) {
	    vtkSwapVectors3(out_3x3[index[0]], out_3x3[0]);
	  }
	}

	function diagonalize3x3(a_3x3, w_3, v_3x3) {
	  var i = void 0;
	  var j = void 0;
	  var k = void 0;
	  var maxI = void 0;
	  var tmp = void 0;
	  var maxVal = void 0;

	  // do the matrix[3][3] to **matrix conversion for Jacobi
	  var C = [createArray(3), createArray(3), createArray(3)];
	  var ATemp = createArray(3);
	  var VTemp = createArray(3);
	  for (i = 0; i < 3; i++) {
	    C[i][0] = a_3x3[i][0];
	    C[i][1] = a_3x3[i][1];
	    C[i][2] = a_3x3[i][2];
	    ATemp[i] = C[i];
	    VTemp[i] = v_3x3[i];
	  }

	  // diagonalize using Jacobi
	  jacobiN(ATemp, 3, w_3, VTemp);

	  // if all the eigenvalues are the same, return identity matrix
	  if (w_3[0] === w_3[1] && w_3[0] === w_3[2]) {
	    identity3x3(v_3x3);
	    return;
	  }

	  // transpose temporarily, it makes it easier to sort the eigenvectors
	  transpose3x3(v_3x3, v_3x3);

	  // if two eigenvalues are the same, re-orthogonalize to optimally line
	  // up the eigenvectors with the x, y, and z axes
	  for (i = 0; i < 3; i++) {
	    // two eigenvalues are the same
	    if (w_3[(i + 1) % 3] === w_3[(i + 2) % 3]) {
	      // find maximum element of the independent eigenvector
	      maxVal = Math.abs(v_3x3[i][0]);
	      maxI = 0;
	      for (j = 1; j < 3; j++) {
	        if (maxVal < (tmp = Math.abs(v_3x3[i][j]))) {
	          maxVal = tmp;
	          maxI = j;
	        }
	      }
	      // swap the eigenvector into its proper position
	      if (maxI !== i) {
	        tmp = w_3[maxI];
	        w_3[maxI] = w_3[i];
	        w_3[i] = tmp;
	        vtkSwapVectors3(v_3x3[i], v_3x3[maxI]);
	      }
	      // maximum element of eigenvector should be positive
	      if (v_3x3[maxI][maxI] < 0) {
	        v_3x3[maxI][0] = -v_3x3[maxI][0];
	        v_3x3[maxI][1] = -v_3x3[maxI][1];
	        v_3x3[maxI][2] = -v_3x3[maxI][2];
	      }

	      // re-orthogonalize the other two eigenvectors
	      j = (maxI + 1) % 3;
	      k = (maxI + 2) % 3;

	      v_3x3[j][0] = 0.0;
	      v_3x3[j][1] = 0.0;
	      v_3x3[j][2] = 0.0;
	      v_3x3[j][j] = 1.0;
	      cross(v_3x3[maxI], v_3x3[j], v_3x3[k]);
	      normalize(v_3x3[k]);
	      cross(v_3x3[k], v_3x3[maxI], v_3x3[j]);

	      // transpose vectors back to columns
	      transpose3x3(v_3x3, v_3x3);
	      return;
	    }
	  }

	  // the three eigenvalues are different, just sort the eigenvectors
	  // to align them with the x, y, and z axes

	  // find the vector with the largest x element, make that vector
	  // the first vector
	  maxVal = Math.abs(v_3x3[0][0]);
	  maxI = 0;
	  for (i = 1; i < 3; i++) {
	    if (maxVal < (tmp = Math.abs(v_3x3[i][0]))) {
	      maxVal = tmp;
	      maxI = i;
	    }
	  }
	  // swap eigenvalue and eigenvector
	  if (maxI !== 0) {
	    tmp = w_3[maxI];
	    w_3[maxI] = w_3[0];
	    w_3[0] = tmp;
	    vtkSwapVectors3(v_3x3[maxI], v_3x3[0]);
	  }
	  // do the same for the y element
	  if (Math.abs(v_3x3[1][1]) < Math.abs(v_3x3[2][1])) {
	    tmp = w_3[2];
	    w_3[2] = w_3[1];
	    w_3[1] = tmp;
	    vtkSwapVectors3(v_3x3[2], v_3x3[1]);
	  }

	  // ensure that the sign of the eigenvectors is correct
	  for (i = 0; i < 2; i++) {
	    if (v_3x3[i][i] < 0) {
	      v_3x3[i][0] = -v_3x3[i][0];
	      v_3x3[i][1] = -v_3x3[i][1];
	      v_3x3[i][2] = -v_3x3[i][2];
	    }
	  }
	  // set sign of final eigenvector to ensure that determinant is positive
	  if (determinant3x3(v_3x3) < 0) {
	    v_3x3[2][0] = -v_3x3[2][0];
	    v_3x3[2][1] = -v_3x3[2][1];
	    v_3x3[2][2] = -v_3x3[2][2];
	  }

	  // transpose the eigenvectors back again
	  transpose3x3(v_3x3, v_3x3);
	}

	function singularValueDecomposition3x3(a_3x3, u_3x3, w_3, vT_3x3) {
	  var i = void 0;
	  var B = [createArray(3), createArray(3), createArray(3)];

	  // copy so that A can be used for U or VT without risk
	  for (i = 0; i < 3; i++) {
	    B[0][i] = a_3x3[0][i];
	    B[1][i] = a_3x3[1][i];
	    B[2][i] = a_3x3[2][i];
	  }

	  // temporarily flip if determinant is negative
	  var d = determinant3x3(B);
	  if (d < 0) {
	    for (i = 0; i < 3; i++) {
	      B[0][i] = -B[0][i];
	      B[1][i] = -B[1][i];
	      B[2][i] = -B[2][i];
	    }
	  }

	  // orthogonalize, diagonalize, etc.
	  orthogonalize3x3(B, u_3x3);
	  transpose3x3(B, B);
	  multiply3x3_mat3(B, u_3x3, vT_3x3);
	  diagonalize3x3(vT_3x3, w_3, vT_3x3);
	  multiply3x3_mat3(u_3x3, vT_3x3, u_3x3);
	  transpose3x3(vT_3x3, vT_3x3);

	  // re-create the flip
	  if (d < 0) {
	    w_3[0] = -w_3[0];
	    w_3[1] = -w_3[1];
	    w_3[2] = -w_3[2];
	  }
	}

	function luFactorLinearSystem(A, index, size) {
	  var i = void 0;
	  var j = void 0;
	  var k = void 0;
	  var largest = void 0;
	  var maxI = 0;
	  var sum = void 0;
	  var temp1 = void 0;
	  var temp2 = void 0;
	  var scale = createArray(size);

	  //
	  // Loop over rows to get implicit scaling information
	  //
	  for (i = 0; i < size; i++) {
	    for (largest = 0.0, j = 0; j < size; j++) {
	      if ((temp2 = Math.abs(A[i][j])) > largest) {
	        largest = temp2;
	      }
	    }

	    if (largest === 0.0) {
	      console.warn('Unable to factor linear system');
	      return 0;
	    }
	    scale[i] = 1.0 / largest;
	  }
	  //
	  // Loop over all columns using Crout's method
	  //
	  for (j = 0; j < size; j++) {
	    for (i = 0; i < j; i++) {
	      sum = A[i][j];
	      for (k = 0; k < i; k++) {
	        sum -= A[i][k] * A[k][j];
	      }
	      A[i][j] = sum;
	    }
	    //
	    // Begin search for largest pivot element
	    //
	    for (largest = 0.0, i = j; i < size; i++) {
	      sum = A[i][j];
	      for (k = 0; k < j; k++) {
	        sum -= A[i][k] * A[k][j];
	      }
	      A[i][j] = sum;

	      if ((temp1 = scale[i] * Math.abs(sum)) >= largest) {
	        largest = temp1;
	        maxI = i;
	      }
	    }
	    //
	    // Check for row interchange
	    //
	    if (j !== maxI) {
	      for (k = 0; k < size; k++) {
	        temp1 = A[maxI][k];
	        A[maxI][k] = A[j][k];
	        A[j][k] = temp1;
	      }
	      scale[maxI] = scale[j];
	    }
	    //
	    // Divide by pivot element and perform elimination
	    //
	    index[j] = maxI;

	    if (Math.abs(A[j][j]) <= VTK_SMALL_NUMBER) {
	      console.warn('Unable to factor linear system');
	      return 0;
	    }

	    if (j !== size - 1) {
	      temp1 = 1.0 / A[j][j];
	      for (i = j + 1; i < size; i++) {
	        A[i][j] *= temp1;
	      }
	    }
	  }
	  return 1;
	}

	function luSolveLinearSystem(A, index, x, size) {
	  var i = void 0;
	  var j = void 0;
	  var ii = void 0;
	  var idx = void 0;
	  var sum = void 0;
	  //
	  // Proceed with forward and backsubstitution for L and U
	  // matrices.  First, forward substitution.
	  //
	  for (ii = -1, i = 0; i < size; i++) {
	    idx = index[i];
	    sum = x[idx];
	    x[idx] = x[i];

	    if (ii >= 0) {
	      for (j = ii; j <= i - 1; j++) {
	        sum -= A[i][j] * x[j];
	      }
	    } else if (sum !== 0.0) {
	      ii = i;
	    }

	    x[i] = sum;
	  }
	  //
	  // Now, back substitution
	  //
	  for (i = size - 1; i >= 0; i--) {
	    sum = x[i];
	    for (j = i + 1; j < size; j++) {
	      sum -= A[i][j] * x[j];
	    }
	    x[i] = sum / A[i][i];
	  }
	}

	function solveLinearSystem(A, x, size) {
	  // if we solving something simple, just solve it
	  if (size === 2) {
	    var y = createArray(2);
	    var det = determinant2x2(A[0][0], A[0][1], A[1][0], A[1][1]);

	    if (det === 0.0) {
	      // Unable to solve linear system
	      return 0;
	    }

	    y[0] = (A[1][1] * x[0] - A[0][1] * x[1]) / det;
	    y[1] = (-A[1][0] * x[0] + A[0][0] * x[1]) / det;

	    x[0] = y[0];
	    x[1] = y[1];
	    return 1;
	  } else if (size === 1) {
	    if (A[0][0] === 0.0) {
	      // Unable to solve linear system
	      return 0;
	    }

	    x[0] /= A[0][0];
	    return 1;
	  }

	  //
	  // System of equations is not trivial, use Crout's method
	  //

	  // Check on allocation of working vectors
	  var index = createArray(size);

	  // Factor and solve matrix
	  if (luFactorLinearSystem(A, index, size) === 0) {
	    return 0;
	  }
	  luSolveLinearSystem(A, index, x, size);

	  return 1;
	}

	function invertMatrix(A, AI, size) {
	  var index = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
	  var column = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

	  var tmp1Size = index || createArray(size);
	  var tmp2Size = column || createArray(size);

	  // Factor matrix; then begin solving for inverse one column at a time.
	  // Note: tmp1Size returned value is used later, tmp2Size is just working
	  // memory whose values are not used in LUSolveLinearSystem
	  if (luFactorLinearSystem(A, tmp1Size, size, tmp2Size) === 0) {
	    return 0;
	  }

	  for (var j = 0; j < size; j++) {
	    for (var i = 0; i < size; i++) {
	      tmp2Size[i] = 0.0;
	    }
	    tmp2Size[j] = 1.0;

	    luSolveLinearSystem(A, tmp1Size, tmp2Size, size);

	    for (var _i4 = 0; _i4 < size; _i4++) {
	      AI[_i4][j] = tmp2Size[_i4];
	    }
	  }

	  return 1;
	}

	function estimateMatrixCondition(A, size) {
	  var minValue = +Number.MAX_VALUE;
	  var maxValue = -Number.MAX_VALUE;

	  // find the maximum value
	  for (var i = 0; i < size; i++) {
	    for (var j = i; j < size; j++) {
	      if (Math.abs(A[i][j]) > max) {
	        maxValue = Math.abs(A[i][j]);
	      }
	    }
	  }

	  // find the minimum diagonal value
	  for (var _i5 = 0; _i5 < size; _i5++) {
	    if (Math.abs(A[_i5][_i5]) < min) {
	      minValue = Math.abs(A[_i5][_i5]);
	    }
	  }

	  if (minValue === 0.0) {
	    return Number.MAX_VALUE;
	  }
	  return maxValue / minValue;
	}

	function jacobi(a_3x3, w, v) {
	  return jacobiN(a_3x3, 3, w, v);
	}

	function solveHomogeneousLeastSquares(numberOfSamples, xt, xOrder, mt) {
	  // check dimensional consistency
	  if (numberOfSamples < xOrder) {
	    console.warn('Insufficient number of samples. Underdetermined.');
	    return 0;
	  }

	  var i = void 0;
	  var j = void 0;
	  var k = void 0;

	  // set up intermediate variables
	  // Allocate matrix to hold X times transpose of X
	  var XXt = createArray(xOrder); // size x by x
	  // Allocate the array of eigenvalues and eigenvectors
	  var eigenvals = createArray(xOrder);
	  var eigenvecs = createArray(xOrder);

	  // Clear the upper triangular region (and btw, allocate the eigenvecs as well)
	  for (i = 0; i < xOrder; i++) {
	    eigenvecs[i] = createArray(xOrder);
	    XXt[i] = createArray(xOrder);
	    for (j = 0; j < xOrder; j++) {
	      XXt[i][j] = 0.0;
	    }
	  }

	  // Calculate XXt upper half only, due to symmetry
	  for (k = 0; k < numberOfSamples; k++) {
	    for (i = 0; i < xOrder; i++) {
	      for (j = i; j < xOrder; j++) {
	        XXt[i][j] += xt[k][i] * xt[k][j];
	      }
	    }
	  }

	  // now fill in the lower half of the XXt matrix
	  for (i = 0; i < xOrder; i++) {
	    for (j = 0; j < i; j++) {
	      XXt[i][j] = XXt[j][i];
	    }
	  }

	  // Compute the eigenvectors and eigenvalues
	  jacobiN(XXt, xOrder, eigenvals, eigenvecs);

	  // Smallest eigenval is at the end of the list (xOrder-1), and solution is
	  // corresponding eigenvec.
	  for (i = 0; i < xOrder; i++) {
	    mt[i][0] = eigenvecs[i][xOrder - 1];
	  }

	  return 1;
	}

	function solveLeastSquares(numberOfSamples, xt, xOrder, yt, yOrder, mt) {
	  var checkHomogeneous = arguments.length <= 6 || arguments[6] === undefined ? true : arguments[6];

	  // check dimensional consistency
	  if (numberOfSamples < xOrder || numberOfSamples < yOrder) {
	    console.warn('Insufficient number of samples. Underdetermined.');
	    return 0;
	  }

	  var homogenFlags = createArray(yOrder);
	  var allHomogeneous = 1;
	  var hmt = void 0;
	  var homogRC = 0;
	  var i = void 0;
	  var j = void 0;
	  var k = void 0;
	  var someHomogeneous = 0;

	  // Ok, first init some flags check and see if all the systems are homogeneous
	  if (checkHomogeneous) {
	    // If Y' is zero, it's a homogeneous system and can't be solved via
	    // the pseudoinverse method. Detect this case, warn the user, and
	    // invoke SolveHomogeneousLeastSquares instead. Note that it doesn't
	    // really make much sense for yOrder to be greater than one in this case,
	    // since that's just yOrder occurrences of a 0 vector on the RHS, but
	    // we allow it anyway. N

	    // Initialize homogeneous flags on a per-right-hand-side basis
	    for (j = 0; j < yOrder; j++) {
	      homogenFlags[j] = 1;
	    }
	    for (i = 0; i < numberOfSamples; i++) {
	      for (j = 0; j < yOrder; j++) {
	        if (Math.abs(yt[i][j]) > VTK_SMALL_NUMBER) {
	          allHomogeneous = 0;
	          homogenFlags[j] = 0;
	        }
	      }
	    }

	    // If we've got one system, and it's homogeneous, do it and bail out quickly.
	    if (allHomogeneous && yOrder === 1) {
	      console.warn('Detected homogeneous system (Y=0), calling SolveHomogeneousLeastSquares()');
	      return solveHomogeneousLeastSquares(numberOfSamples, xt, xOrder, mt);
	    }

	    // Ok, we've got more than one system of equations.
	    // Figure out if we need to calculate the homogeneous equation solution for
	    // any of them.
	    if (allHomogeneous) {
	      someHomogeneous = 1;
	    } else {
	      for (j = 0; j < yOrder; j++) {
	        if (homogenFlags[j]) {
	          someHomogeneous = 1;
	        }
	      }
	    }
	  }

	  // If necessary, solve the homogeneous problem
	  if (someHomogeneous) {
	    // hmt is the homogeneous equation version of mt, the general solution.
	    hmt = createArray(xOrder);
	    for (j = 0; j < xOrder; j++) {
	      // Only allocate 1 here, not yOrder, because here we're going to solve
	      // just the one homogeneous equation subset of the entire problem
	      hmt[j] = [0];
	    }

	    // Ok, solve the homogeneous problem
	    homogRC = solveHomogeneousLeastSquares(numberOfSamples, xt, xOrder, hmt);
	  }

	  // set up intermediate variables
	  var XXt = createArray(xOrder); // size x by x
	  var XXtI = createArray(xOrder); // size x by x
	  var XYt = createArray(xOrder); // size x by y
	  for (i = 0; i < xOrder; i++) {
	    XXt[i] = createArray(xOrder);
	    XXtI[i] = createArray(xOrder);

	    for (j = 0; j < xOrder; j++) {
	      XXt[i][j] = 0.0;
	      XXtI[i][j] = 0.0;
	    }

	    XYt[i] = createArray(yOrder);
	    for (j = 0; j < yOrder; j++) {
	      XYt[i][j] = 0.0;
	    }
	  }

	  // first find the pseudoinverse matrix
	  for (k = 0; k < numberOfSamples; k++) {
	    for (i = 0; i < xOrder; i++) {
	      // first calculate the XXt matrix, only do the upper half (symmetrical)
	      for (j = i; j < xOrder; j++) {
	        XXt[i][j] += xt[k][i] * xt[k][j];
	      }

	      // now calculate the XYt matrix
	      for (j = 0; j < yOrder; j++) {
	        XYt[i][j] += xt[k][i] * yt[k][j];
	      }
	    }
	  }

	  // now fill in the lower half of the XXt matrix
	  for (i = 0; i < xOrder; i++) {
	    for (j = 0; j < i; j++) {
	      XXt[i][j] = XXt[j][i];
	    }
	  }

	  var successFlag = invertMatrix(XXt, XXtI, xOrder);

	  // next get the inverse of XXt
	  if (successFlag) {
	    for (i = 0; i < xOrder; i++) {
	      for (j = 0; j < yOrder; j++) {
	        mt[i][j] = 0.0;
	        for (k = 0; k < xOrder; k++) {
	          mt[i][j] += XXtI[i][k] * XYt[k][j];
	        }
	      }
	    }
	  }

	  // Fix up any of the solutions that correspond to the homogeneous equation
	  // problem.
	  if (someHomogeneous) {
	    for (j = 0; j < yOrder; j++) {
	      if (homogenFlags[j]) {
	        // Fix this one
	        for (i = 0; i < xOrder; i++) {
	          mt[i][j] = hmt[i][0];
	        }
	      }
	    }
	  }

	  if (someHomogeneous) {
	    return homogRC && successFlag;
	  }

	  return successFlag;
	}

	function rgb2hsv(rgb, hsv) {
	  var h = void 0;
	  var s = void 0;

	  var _rgb = _slicedToArray(rgb, 3);

	  var r = _rgb[0];
	  var g = _rgb[1];
	  var b = _rgb[2];

	  var onethird = 1.0 / 3.0;
	  var onesixth = 1.0 / 6.0;
	  var twothird = 2.0 / 3.0;

	  var cmax = r;
	  var cmin = r;

	  if (g > cmax) {
	    cmax = g;
	  } else if (g < cmin) {
	    cmin = g;
	  }
	  if (b > cmax) {
	    cmax = b;
	  } else if (b < cmin) {
	    cmin = b;
	  }
	  var v = cmax;

	  if (v > 0.0) {
	    s = (cmax - cmin) / cmax;
	  } else {
	    s = 0.0;
	  }
	  if (s > 0) {
	    if (r === cmax) {
	      h = onesixth * (g - b) / (cmax - cmin);
	    } else if (g === cmax) {
	      h = onethird + onesixth * (b - r) / (cmax - cmin);
	    } else {
	      h = twothird + onesixth * (r - g) / (cmax - cmin);
	    }
	    if (h < 0.0) {
	      h += 1.0;
	    }
	  } else {
	    h = 0.0;
	  }

	  // Set the values back to the array
	  hsv[0] = h;
	  hsv[1] = s;
	  hsv[2] = v;
	}

	function hsv2rgb(hsv, rgb) {
	  var _hsv = _slicedToArray(hsv, 3);

	  var h = _hsv[0];
	  var s = _hsv[1];
	  var v = _hsv[2];

	  var onethird = 1.0 / 3.0;
	  var onesixth = 1.0 / 6.0;
	  var twothird = 2.0 / 3.0;
	  var fivesixth = 5.0 / 6.0;
	  var r = void 0;
	  var g = void 0;
	  var b = void 0;

	  // compute RGB from HSV
	  if (h > onesixth && h <= onethird) {
	    // green/red
	    g = 1.0;
	    r = (onethird - h) / onesixth;
	    b = 0.0;
	  } else if (h > onethird && h <= 0.5) {
	    // green/blue
	    g = 1.0;
	    b = (h - onethird) / onesixth;
	    r = 0.0;
	  } else if (h > 0.5 && h <= twothird) {
	    // blue/green
	    b = 1.0;
	    g = (twothird - h) / onesixth;
	    r = 0.0;
	  } else if (h > twothird && h <= fivesixth) {
	    // blue/red
	    b = 1.0;
	    r = (h - twothird) / onesixth;
	    g = 0.0;
	  } else if (h > fivesixth && h <= 1.0) {
	    // red/blue
	    r = 1.0;
	    b = (1.0 - h) / onesixth;
	    g = 0.0;
	  } else {
	    // red/green
	    r = 1.0;
	    g = h / onesixth;
	    b = 0.0;
	  }

	  // add Saturation to the equation.
	  r = s * r + (1.0 - s);
	  g = s * g + (1.0 - s);
	  b = s * b + (1.0 - s);

	  r *= v;
	  g *= v;
	  b *= v;

	  // Assign back to the array
	  rgb[0] = r;
	  rgb[1] = g;
	  rgb[2] = b;
	}

	function lab2xyz(lab, xyz) {
	  // LAB to XYZ

	  var _lab = _slicedToArray(lab, 3);

	  var L = _lab[0];
	  var a = _lab[1];
	  var b = _lab[2];

	  var var_Y = (L + 16) / 116;
	  var var_X = a / 500 + var_Y;
	  var var_Z = var_Y - b / 200;

	  if (Math.pow(var_Y, 3) > 0.008856) {
	    var_Y = Math.pow(var_Y, 3);
	  } else {
	    var_Y = (var_Y - 16.0 / 116.0) / 7.787;
	  }

	  if (Math.pow(var_X, 3) > 0.008856) {
	    var_X = Math.pow(var_X, 3);
	  } else {
	    var_X = (var_X - 16.0 / 116.0) / 7.787;
	  }

	  if (Math.pow(var_Z, 3) > 0.008856) {
	    var_Z = Math.pow(var_Z, 3);
	  } else {
	    var_Z = (var_Z - 16.0 / 116.0) / 7.787;
	  }
	  var ref_X = 0.9505;
	  var ref_Y = 1.000;
	  var ref_Z = 1.089;
	  xyz[0] = ref_X * var_X; // ref_X = 0.9505  Observer= 2 deg Illuminant= D65
	  xyz[1] = ref_Y * var_Y; // ref_Y = 1.000
	  xyz[2] = ref_Z * var_Z; // ref_Z = 1.089
	}

	function xyz2lab(xyz, lab) {
	  var _xyz = _slicedToArray(xyz, 3);

	  var x = _xyz[0];
	  var y = _xyz[1];
	  var z = _xyz[2];

	  var ref_X = 0.9505;
	  var ref_Y = 1.000;
	  var ref_Z = 1.089;
	  var var_X = x / ref_X; // ref_X = 0.9505  Observer= 2 deg, Illuminant= D65
	  var var_Y = y / ref_Y; // ref_Y = 1.000
	  var var_Z = z / ref_Z; // ref_Z = 1.089

	  if (var_X > 0.008856) var_X = Math.pow(var_X, 1.0 / 3.0);else var_X = 7.787 * var_X + 16.0 / 116.0;
	  if (var_Y > 0.008856) var_Y = Math.pow(var_Y, 1.0 / 3.0);else var_Y = 7.787 * var_Y + 16.0 / 116.0;
	  if (var_Z > 0.008856) var_Z = Math.pow(var_Z, 1.0 / 3.0);else var_Z = 7.787 * var_Z + 16.0 / 116.0;

	  lab[0] = 116 * var_Y - 16;
	  lab[1] = 500 * (var_X - var_Y);
	  lab[2] = 200 * (var_Y - var_Z);
	}

	function xyz2rgb(xyz, rgb) {
	  var _xyz2 = _slicedToArray(xyz, 3);

	  var x = _xyz2[0];
	  var y = _xyz2[1];
	  var z = _xyz2[2];

	  var r = x * 3.2406 + y * -1.5372 + z * -0.4986;
	  var g = x * -0.9689 + y * 1.8758 + z * 0.0415;
	  var b = x * 0.0557 + y * -0.2040 + z * 1.0570;

	  // The following performs a "gamma correction" specified by the sRGB color
	  // space.  sRGB is defined by a canonical definition of a display monitor and
	  // has been standardized by the International Electrotechnical Commission (IEC
	  // 61966-2-1).  The nonlinearity of the correction is designed to make the
	  // colors more perceptually uniform.  This color space has been adopted by
	  // several applications including Adobe Photoshop and Microsoft Windows color
	  // management.  OpenGL is agnostic on its RGB color space, but it is reasonable
	  // to assume it is close to this one.
	  if (r > 0.0031308) r = 1.055 * Math.pow(r, 1 / 2.4) - 0.055;else r = 12.92 * r;
	  if (g > 0.0031308) g = 1.055 * Math.pow(g, 1 / 2.4) - 0.055;else g = 12.92 * g;
	  if (b > 0.0031308) b = 1.055 * Math.pow(b, 1 / 2.4) - 0.055;else b = 12.92 * b;

	  // Clip colors. ideally we would do something that is perceptually closest
	  // (since we can see colors outside of the display gamut), but this seems to
	  // work well enough.
	  var maxVal = r;
	  if (maxVal < g) maxVal = g;
	  if (maxVal < b) maxVal = b;
	  if (maxVal > 1.0) {
	    r /= maxVal;
	    g /= maxVal;
	    b /= maxVal;
	  }
	  if (r < 0) r = 0;
	  if (g < 0) g = 0;
	  if (b < 0) b = 0;

	  // Push values back to array
	  rgb[0] = r;
	  rgb[1] = g;
	  rgb[2] = b;
	}

	function rgb2xyz(rgb, xyz) {
	  var _rgb2 = _slicedToArray(rgb, 3);

	  var r = _rgb2[0];
	  var g = _rgb2[1];
	  var b = _rgb2[2];
	  // The following performs a "gamma correction" specified by the sRGB color
	  // space.  sRGB is defined by a canonical definition of a display monitor and
	  // has been standardized by the International Electrotechnical Commission (IEC
	  // 61966-2-1).  The nonlinearity of the correction is designed to make the
	  // colors more perceptually uniform.  This color space has been adopted by
	  // several applications including Adobe Photoshop and Microsoft Windows color
	  // management.  OpenGL is agnostic on its RGB color space, but it is reasonable
	  // to assume it is close to this one.

	  if (r > 0.04045) r = Math.pow((r + 0.055) / 1.055, 2.4);else r = r / 12.92;
	  if (g > 0.04045) g = Math.pow((g + 0.055) / 1.055, 2.4);else g = g / 12.92;
	  if (b > 0.04045) b = Math.pow((b + 0.055) / 1.055, 2.4);else b = b / 12.92;

	  // Observer. = 2 deg, Illuminant = D65
	  xyz[0] = r * 0.4124 + g * 0.3576 + b * 0.1805;
	  xyz[1] = r * 0.2126 + g * 0.7152 + b * 0.0722;
	  xyz[2] = r * 0.0193 + g * 0.1192 + b * 0.9505;
	}

	function rgb2lab(rgb, lab) {
	  var xyz = [0, 0, 0];
	  rgb2xyz(rgb, xyz);
	  xyz2lab(xyz, lab);
	}

	function LabToRGB(lab, rgb) {
	  var xyz = [0, 0, 0];
	  lab2xyz(lab, xyz);
	  xyz2rgb(xyz, rgb);
	}

	function uninitializeBounds(bounds) {
	  bounds[0] = 1.0;
	  bounds[1] = -1.0;
	  bounds[2] = 1.0;
	  bounds[3] = -1.0;
	  bounds[4] = 1.0;
	  bounds[5] = -1.0;
	}

	function areBoundsInitialized(bounds) {
	  return !(bounds[1] - bounds[0] < 0.0);
	}

	function clampValue(value, minValue, maxValue) {
	  if (value < minValue) {
	    return minValue;
	  }
	  if (value > maxValue) {
	    return maxValue;
	  }
	  return value;
	}

	function clampAndNormalizeValue(value, range) {
	  var result = 0;
	  if (range[0] !== range[1]) {
	    // clamp
	    if (value < range[0]) {
	      result = range[0];
	    } else {
	      if (value > range[1]) {
	        result = range[1];
	      } else {
	        result = value;
	      }
	    }
	    // normalize
	    result = (result - range[0]) / (range[1] - range[0]);
	  }

	  return result;
	}

	var getScalarTypeFittingRange = notImplemented('GetScalarTypeFittingRange');
	var getAdjustedScalarRange = notImplemented('GetAdjustedScalarRange');

	function extentIsWithinOtherExtent(extent1, extent2) {
	  if (!extent1 || !extent2) {
	    return 0;
	  }

	  for (var i = 0; i < 6; i += 2) {
	    if (extent1[i] < extent2[i] || extent1[i] > extent2[i + 1] || extent1[i + 1] < extent2[i] || extent1[i + 1] > extent2[i + 1]) {
	      return 0;
	    }
	  }

	  return 1;
	}

	function boundsIsWithinOtherBounds(bounds1_6, bounds2_6, delta_3) {
	  if (!bounds1_6 || !bounds2_6) {
	    return 0;
	  }
	  for (var i = 0; i < 6; i += 2) {
	    if (bounds1_6[i] + delta_3[i / 2] < bounds2_6[i] || bounds1_6[i] - delta_3[i / 2] > bounds2_6[i + 1] || bounds1_6[i + 1] + delta_3[i / 2] < bounds2_6[i] || bounds1_6[i + 1] - delta_3[i / 2] > bounds2_6[i + 1]) {
	      return 0;
	    }
	  }
	  return 1;
	}

	function pointIsWithinBounds(point_3, bounds_6, delta_3) {
	  if (!point_3 || !bounds_6 || !delta_3) {
	    return 0;
	  }
	  for (var i = 0; i < 3; i++) {
	    if (point_3[i] + delta_3[i] < bounds_6[2 * i] || point_3[i] - delta_3[i] > bounds_6[2 * i + 1]) {
	      return 0;
	    }
	  }
	  return 1;
	}

	function solve3PointCircle(p1, p2, p3, center) {
	  var v21 = createArray(3);
	  var v32 = createArray(3);
	  var v13 = createArray(3);
	  var v12 = createArray(3);
	  var v23 = createArray(3);
	  var v31 = createArray(3);

	  for (var i = 0; i < 3; ++i) {
	    v21[i] = p1[i] - p2[i];
	    v32[i] = p2[i] - p3[i];
	    v13[i] = p3[i] - p1[i];
	    v12[i] = -v21[i];
	    v23[i] = -v32[i];
	    v31[i] = -v13[i];
	  }

	  var norm12 = norm(v12);
	  var norm23 = norm(v23);
	  var norm13 = norm(v13);

	  var crossv21v32 = createArray(3);
	  cross(v21, v32, crossv21v32);
	  var normCross = norm(crossv21v32);

	  var radius = norm12 * norm23 * norm13 / (2 * normCross);

	  var normCross22 = 2 * normCross * normCross;
	  var alpha = norm23 * norm23 * dot(v21, v31) / normCross22;
	  var beta = norm13 * norm13 * dot(v12, v32) / normCross22;
	  var gamma = norm12 * norm12 * dot(v13, v23) / normCross22;

	  for (var _i6 = 0; _i6 < 3; ++_i6) {
	    center[_i6] = alpha * p1[_i6] + beta * p2[_i6] + gamma * p3[_i6];
	  }
	  return radius;
	}

	var inf = Infinity;
	var negInf = -Infinity;

	var isInf = function isInf(value) {
	  return !Number.isFinite(value);
	};
	var isNan = Number.isNaN;
	var isFinite = Number.isFinite;

	// JavaScript - add-on ----------------------

	function createUninitializedBouds() {
	  return [].concat([Number.MAX_VALUE, Number.MIN_VALUE, // X
	  Number.MAX_VALUE, Number.MIN_VALUE, // Y
	  Number.MAX_VALUE, Number.MIN_VALUE]);
	}

	// ----------------------------------------------------------------------------
	// Only Static API
	// ----------------------------------------------------------------------------

	// Z
	exports.default = {
	  Pi: Pi,
	  radiansFromDegrees: radiansFromDegrees,
	  degreesFromRadians: degreesFromRadians,
	  round: round,
	  floor: floor,
	  ceil: ceil,
	  ceilLog2: ceilLog2,
	  min: min,
	  max: max,
	  isPowerOfTwo: isPowerOfTwo,
	  nearestPowerOfTwo: nearestPowerOfTwo,
	  factorial: factorial,
	  binomial: binomial,
	  beginCombination: beginCombination,
	  nextCombination: nextCombination,
	  randomSeed: randomSeed,
	  getSeed: getSeed,
	  random: random,
	  gaussian: gaussian,
	  add: add,
	  subtract: subtract,
	  multiplyScalar: multiplyScalar,
	  multiplyScalar2D: multiplyScalar2D,
	  dot: dot,
	  outer: outer,
	  cross: cross,
	  norm: norm,
	  normalize: normalize,
	  perpendiculars: perpendiculars,
	  projectVector: projectVector,
	  projectVector2D: projectVector2D,
	  distance2BetweenPoints: distance2BetweenPoints,
	  angleBetweenVectors: angleBetweenVectors,
	  gaussianAmplitude: gaussianAmplitude,
	  gaussianWeight: gaussianWeight,
	  dot2D: dot2D,
	  outer2D: outer2D,
	  norm2D: norm2D,
	  normalize2D: normalize2D,
	  determinant2x2: determinant2x2,
	  LUFactor3x3: LUFactor3x3,
	  LUSolve3x3: LUSolve3x3,
	  linearSolve3x3: linearSolve3x3,
	  multiply3x3_vect3: multiply3x3_vect3,
	  multiply3x3_mat3: multiply3x3_mat3,
	  multiplyMatrix: multiplyMatrix,
	  transpose3x3: transpose3x3,
	  invert3x3: invert3x3,
	  identity3x3: identity3x3,
	  determinant3x3: determinant3x3,
	  quaternionToMatrix3x3: quaternionToMatrix3x3,
	  matrix3x3ToQuaternion: matrix3x3ToQuaternion,
	  multiplyQuaternion: multiplyQuaternion,
	  orthogonalize3x3: orthogonalize3x3,
	  diagonalize3x3: diagonalize3x3,
	  singularValueDecomposition3x3: singularValueDecomposition3x3,
	  solveLinearSystem: solveLinearSystem,
	  invertMatrix: invertMatrix,
	  luFactorLinearSystem: luFactorLinearSystem,
	  luSolveLinearSystem: luSolveLinearSystem,
	  estimateMatrixCondition: estimateMatrixCondition,
	  jacobi: jacobi,
	  jacobiN: jacobiN,
	  solveHomogeneousLeastSquares: solveHomogeneousLeastSquares,
	  solveLeastSquares: solveLeastSquares,
	  rgb2hsv: rgb2hsv,
	  hsv2rgb: hsv2rgb,
	  lab2xyz: lab2xyz,
	  xyz2lab: xyz2lab,
	  xyz2rgb: xyz2rgb,
	  rgb2xyz: rgb2xyz,
	  rgb2lab: rgb2lab,
	  LabToRGB: LabToRGB,
	  uninitializeBounds: uninitializeBounds,
	  areBoundsInitialized: areBoundsInitialized,
	  clampValue: clampValue,
	  clampAndNormalizeValue: clampAndNormalizeValue,
	  getScalarTypeFittingRange: getScalarTypeFittingRange,
	  getAdjustedScalarRange: getAdjustedScalarRange,
	  extentIsWithinOtherExtent: extentIsWithinOtherExtent,
	  boundsIsWithinOtherBounds: boundsIsWithinOtherBounds,
	  pointIsWithinBounds: pointIsWithinBounds,
	  solve3PointCircle: solve3PointCircle,
	  inf: inf,
	  negInf: negInf,
	  isInf: isInf,
	  isNan: isNan,
	  isFinite: isFinite,

	  // JS add-on
	  createUninitializedBouds: createUninitializedBouds
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = "//VTK::System::Dec\n\n/*=========================================================================\n\n  Program:   Visualization Toolkit\n  Module:    vtkPolyDataVS.glsl\n\n  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen\n  All rights reserved.\n  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.\n\n     This software is distributed WITHOUT ANY WARRANTY; without even\n     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR\n     PURPOSE.  See the above copyright notice for more information.\n\n=========================================================================*/\n\nattribute vec4 vertexMC;\n\n// frag position in VC\n//VTK::PositionVC::Dec\n\n// optional normal declaration\n//VTK::Normal::Dec\n\n// extra lighting parameters\n//VTK::Light::Dec\n\n// Texture coordinates\n//VTK::TCoord::Dec\n\n// material property values\n//VTK::Color::Dec\n\n// clipping plane vars\n//VTK::Clip::Dec\n\n// camera and actor matrix values\n//VTK::Camera::Dec\n\n// Apple Bug\n//VTK::PrimID::Dec\n\nvoid main()\n{\n  //VTK::Color::Impl\n\n  //VTK::Normal::Impl\n\n  //VTK::TCoord::Impl\n\n  //VTK::Clip::Impl\n\n  //VTK::PrimID::Impl\n\n  //VTK::PositionVC::Impl\n\n  //VTK::Light::Impl\n}\n"

/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = "//VTK::System::Dec\n\n/*=========================================================================\n\n  Program:   Visualization Toolkit\n  Module:    vtkPolyDataFS.glsl\n\n  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen\n  All rights reserved.\n  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.\n\n     This software is distributed WITHOUT ANY WARRANTY; without even\n     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR\n     PURPOSE.  See the above copyright notice for more information.\n\n=========================================================================*/\n// Template for the polydata mappers fragment shader\n\nuniform int PrimitiveIDOffset;\n\n// VC position of this fragment\n//VTK::PositionVC::Dec\n\n// optional color passed in from the vertex shader, vertexColor\n//VTK::Color::Dec\n\n// optional surface normal declaration\n//VTK::Normal::Dec\n\n// extra lighting parameters\n//VTK::Light::Dec\n\n// Texture coordinates\n//VTK::TCoord::Dec\n\n// picking support\n//VTK::Picking::Dec\n\n// Depth Peeling Support\n//VTK::DepthPeeling::Dec\n\n// clipping plane vars\n//VTK::Clip::Dec\n\n// the output of this shader\n//VTK::Output::Dec\n\n// Apple Bug\n//VTK::PrimID::Dec\n\n// handle coincident offsets\n//VTK::Coincident::Dec\n\nvoid main()\n{\n  // VC position of this fragment. This should not branch/return/discard.\n  //VTK::PositionVC::Impl\n\n  // Place any calls that require uniform flow (e.g. dFdx) here.\n  //VTK::UniformFlow::Impl\n\n  // Early depth peeling abort:\n  //VTK::DepthPeeling::PreColor\n\n  // Apple Bug\n  //VTK::PrimID::Impl\n\n  //VTK::Clip::Impl\n\n  //VTK::Color::Impl\n\n  // Generate the normal if we are not passed in one\n  //VTK::Normal::Impl\n\n  //VTK::Light::Impl\n\n  //VTK::TCoord::Impl\n\n  if (gl_FragData[0].a <= 0.0)\n    {\n    discard;\n    }\n\n  //VTK::DepthPeeling::Impl\n\n  //VTK::Picking::Impl\n\n  // handle coincident offsets\n  //VTK::Coincident::Impl\n}\n"

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newInstance = undefined;
	exports.extend = extend;

	var _macro = __webpack_require__(2);

	var macro = _interopRequireWildcard(_macro);

	var _ShaderProgram = __webpack_require__(26);

	var _ShaderProgram2 = _interopRequireDefault(_ShaderProgram);

	var _blueimpMd = __webpack_require__(33);

	var _blueimpMd2 = _interopRequireDefault(_blueimpMd);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// ----------------------------------------------------------------------------

	var SET_GET_FIELDS = ['lastShaderBound', 'context'];

	// ----------------------------------------------------------------------------
	// vtkShaderCache methods
	// ----------------------------------------------------------------------------

	function vtkShaderCache(publicAPI, model) {
	  // Set our className
	  model.classHierarchy.push('vtkShaderCache');

	  publicAPI.replaceShaderValues = function (VSSource, FSSource, GSSource) {
	    // first handle renaming any Fragment shader inputs
	    // if we have a geometry shader. By deafult fragment shaders
	    // assume their inputs come from a Vertex Shader. When we
	    // have a Geometry shader we rename the frament shader inputs
	    // to come from the geometry shader

	    model.context.getExtension('OES_standard_derivatives');
	    var nFSSource = FSSource;
	    if (GSSource.length > 0) {
	      nFSSource = _ShaderProgram2.default.substitute(nFSSource, 'VSOut', 'GSOut').result;
	    }

	    var version = '#version 100\n';

	    var nVSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::System::Dec', version).result;

	    nFSSource = _ShaderProgram2.default.substitute(nFSSource, '//VTK::System::Dec', [version + '\n#extension GL_OES_standard_derivatives : enable\n', '#ifdef GL_FRAGMENT_PRECISION_HIGH', 'precision highp float;', '#else', 'precision mediump float;', '#endif']).result;

	    // nFSSource = ShaderProgram.substitute(nFSSource, 'gl_FragData\\[0\\]',
	    //   'gl_FragColor').result;

	    var nGSSource = _ShaderProgram2.default.substitute(GSSource, '//VTK::System::Dec', version).result;

	    return { VSSource: nVSSource, FSSource: nFSSource, GSSource: nGSSource };
	  };

	  // return NULL if there is an issue
	  publicAPI.readyShaderProgramArray = function (vertexCode, fragmentCode, geometryCode) {
	    var data = publicAPI.replaceShaderValues(vertexCode, fragmentCode, geometryCode);

	    var shader = publicAPI.getShaderProgram(data.VSSource, data.FSSource, data.GSSource);

	    return publicAPI.readyShaderProgram(shader);
	  };

	  publicAPI.readyShaderProgram = function (shader) {
	    if (!shader) {
	      return null;
	    }

	    // compile if needed
	    if (!shader.getCompiled() && !shader.compileShader()) {
	      return null;
	    }

	    // bind if needed
	    if (!publicAPI.bindShader(shader)) {
	      return null;
	    }

	    return shader;
	  };

	  publicAPI.getShaderProgram = function (vertexCode, fragmentCode, geometryCode) {
	    // compute the MD5 and the check the map
	    var hashInput = '' + vertexCode + fragmentCode + geometryCode;
	    var result = (0, _blueimpMd2.default)(hashInput);

	    // does it already exist?
	    var loc = Object.keys(model.shaderPrograms).indexOf(result);

	    if (loc === -1) {
	      // create one
	      var sps = _ShaderProgram2.default.newInstance();
	      sps.setContext(model.context);
	      sps.getVertexShader().setSource(vertexCode);
	      sps.getFragmentShader().setSource(fragmentCode);
	      if (geometryCode) {
	        sps.getGeometryShader().setSource(geometryCode);
	      }
	      sps.setMd5Hash(result);
	      model.shaderPrograms[result] = sps;
	      return sps;
	    }

	    return model.shaderPrograms[result];
	  };

	  publicAPI.releaseGraphicsResources = function (win) {
	    // NOTE:
	    // In the current implementation as of October 26th, if a shader
	    // program is created by ShaderCache then it should make sure
	    // that it releases the graphics resouces used by these programs.
	    // It is not wisely for callers to do that since then they would
	    // have to loop over all the programs were in use and invoke
	    // release graphics resources individually.

	    publicAPI.releaseCurrentShader();

	    Object.keys(model.shaderPrograms).map(function (key) {
	      return model.shaderPrograms[key];
	    }).forEach(function (sp) {
	      sp.releaseGraphicsResources(win);
	    });
	  };

	  publicAPI.releaseGraphicsResources = function () {
	    // release prior shader
	    if (model.astShaderBound) {
	      model.lastShaderBound.release();
	      model.lastShaderBound = null;
	    }
	  };

	  publicAPI.bindShader = function (shader) {
	    if (model.lastShaderBound === shader) {
	      return 1;
	    }

	    // release prior shader
	    if (model.lastShaderBound) {
	      model.lastShaderBound.release();
	    }
	    shader.bind();
	    model.lastShaderBound = shader;
	    return 1;
	  };
	}

	// ----------------------------------------------------------------------------
	// Object factory
	// ----------------------------------------------------------------------------

	var DEFAULT_VALUES = {
	  lastShaderBound: null,
	  shaderPrograms: null,
	  context: null
	};

	// ----------------------------------------------------------------------------

	function extend(publicAPI, model) {
	  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  Object.assign(model, DEFAULT_VALUES, initialValues);

	  // Internal objects
	  model.shaderPrograms = {};

	  // Build VTK API
	  macro.obj(publicAPI, model);
	  macro.setGet(publicAPI, model, SET_GET_FIELDS);

	  // Object methods
	  vtkShaderCache(publicAPI, model);

	  return Object.freeze(publicAPI);
	}

	// ----------------------------------------------------------------------------

	var newInstance = exports.newInstance = macro.newInstance(extend);

	// ----------------------------------------------------------------------------

	exports.default = { newInstance: newInstance, extend: extend };

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/*
	 * JavaScript MD5
	 * https://github.com/blueimp/JavaScript-MD5
	 *
	 * Copyright 2011, Sebastian Tschan
	 * https://blueimp.net
	 *
	 * Licensed under the MIT license:
	 * http://www.opensource.org/licenses/MIT
	 *
	 * Based on
	 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
	 * Digest Algorithm, as defined in RFC 1321.
	 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for more info.
	 */

	/*global unescape, define, module */

	;(function ($) {
	  'use strict';

	  /*
	  * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	  * to work around bugs in some JS interpreters.
	  */

	  function safe_add(x, y) {
	    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	    return msw << 16 | lsw & 0xFFFF;
	  }

	  /*
	  * Bitwise rotate a 32-bit number to the left.
	  */
	  function bit_rol(num, cnt) {
	    return num << cnt | num >>> 32 - cnt;
	  }

	  /*
	  * These functions implement the four basic operations the algorithm uses.
	  */
	  function md5_cmn(q, a, b, x, s, t) {
	    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
	  }
	  function md5_ff(a, b, c, d, x, s, t) {
	    return md5_cmn(b & c | ~b & d, a, b, x, s, t);
	  }
	  function md5_gg(a, b, c, d, x, s, t) {
	    return md5_cmn(b & d | c & ~d, a, b, x, s, t);
	  }
	  function md5_hh(a, b, c, d, x, s, t) {
	    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	  }
	  function md5_ii(a, b, c, d, x, s, t) {
	    return md5_cmn(c ^ (b | ~d), a, b, x, s, t);
	  }

	  /*
	  * Calculate the MD5 of an array of little-endian words, and a bit length.
	  */
	  function binl_md5(x, len) {
	    /* append padding */
	    x[len >> 5] |= 0x80 << len % 32;
	    x[(len + 64 >>> 9 << 4) + 14] = len;

	    var i;
	    var olda;
	    var oldb;
	    var oldc;
	    var oldd;
	    var a = 1732584193;
	    var b = -271733879;
	    var c = -1732584194;
	    var d = 271733878;

	    for (i = 0; i < x.length; i += 16) {
	      olda = a;
	      oldb = b;
	      oldc = c;
	      oldd = d;

	      a = md5_ff(a, b, c, d, x[i], 7, -680876936);
	      d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
	      c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
	      b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
	      a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
	      d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
	      c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
	      b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
	      a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
	      d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
	      c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
	      b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
	      a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
	      d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
	      c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
	      b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

	      a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
	      d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
	      c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
	      b = md5_gg(b, c, d, a, x[i], 20, -373897302);
	      a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
	      d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
	      c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
	      b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
	      a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
	      d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
	      c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
	      b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
	      a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
	      d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
	      c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
	      b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

	      a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
	      d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
	      c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
	      b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
	      a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
	      d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
	      c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
	      b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
	      a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
	      d = md5_hh(d, a, b, c, x[i], 11, -358537222);
	      c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
	      b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
	      a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
	      d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
	      c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
	      b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

	      a = md5_ii(a, b, c, d, x[i], 6, -198630844);
	      d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
	      c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
	      b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
	      a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
	      d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
	      c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
	      b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
	      a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
	      d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
	      c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
	      b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
	      a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
	      d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
	      c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
	      b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

	      a = safe_add(a, olda);
	      b = safe_add(b, oldb);
	      c = safe_add(c, oldc);
	      d = safe_add(d, oldd);
	    }
	    return [a, b, c, d];
	  }

	  /*
	  * Convert an array of little-endian words to a string
	  */
	  function binl2rstr(input) {
	    var i;
	    var output = '';
	    for (i = 0; i < input.length * 32; i += 8) {
	      output += String.fromCharCode(input[i >> 5] >>> i % 32 & 0xFF);
	    }
	    return output;
	  }

	  /*
	  * Convert a raw string to an array of little-endian words
	  * Characters >255 have their high-byte silently ignored.
	  */
	  function rstr2binl(input) {
	    var i;
	    var output = [];
	    output[(input.length >> 2) - 1] = undefined;
	    for (i = 0; i < output.length; i += 1) {
	      output[i] = 0;
	    }
	    for (i = 0; i < input.length * 8; i += 8) {
	      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << i % 32;
	    }
	    return output;
	  }

	  /*
	  * Calculate the MD5 of a raw string
	  */
	  function rstr_md5(s) {
	    return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
	  }

	  /*
	  * Calculate the HMAC-MD5, of a key and some data (raw strings)
	  */
	  function rstr_hmac_md5(key, data) {
	    var i;
	    var bkey = rstr2binl(key);
	    var ipad = [];
	    var opad = [];
	    var hash;
	    ipad[15] = opad[15] = undefined;
	    if (bkey.length > 16) {
	      bkey = binl_md5(bkey, key.length * 8);
	    }
	    for (i = 0; i < 16; i += 1) {
	      ipad[i] = bkey[i] ^ 0x36363636;
	      opad[i] = bkey[i] ^ 0x5C5C5C5C;
	    }
	    hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
	    return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
	  }

	  /*
	  * Convert a raw string to a hex string
	  */
	  function rstr2hex(input) {
	    var hex_tab = '0123456789abcdef';
	    var output = '';
	    var x;
	    var i;
	    for (i = 0; i < input.length; i += 1) {
	      x = input.charCodeAt(i);
	      output += hex_tab.charAt(x >>> 4 & 0x0F) + hex_tab.charAt(x & 0x0F);
	    }
	    return output;
	  }

	  /*
	  * Encode a string as utf-8
	  */
	  function str2rstr_utf8(input) {
	    return unescape(encodeURIComponent(input));
	  }

	  /*
	  * Take string arguments and return either raw or hex encoded strings
	  */
	  function raw_md5(s) {
	    return rstr_md5(str2rstr_utf8(s));
	  }
	  function hex_md5(s) {
	    return rstr2hex(raw_md5(s));
	  }
	  function raw_hmac_md5(k, d) {
	    return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
	  }
	  function hex_hmac_md5(k, d) {
	    return rstr2hex(raw_hmac_md5(k, d));
	  }

	  function md5(string, key, raw) {
	    if (!key) {
	      if (!raw) {
	        return hex_md5(string);
	      }
	      return raw_md5(string);
	    }
	    if (!raw) {
	      return hex_hmac_md5(key, string);
	    }
	    return raw_hmac_md5(key, string);
	  }

	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return md5;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
	    module.exports = md5;
	  } else {
	    $.md5 = md5;
	  }
	})(undefined);

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newInstance = exports.DEFAULT_VALUES = undefined;
	exports.vtkRenderWindow = vtkRenderWindow;
	exports.extend = extend;

	var _macro = __webpack_require__(2);

	var macro = _interopRequireWildcard(_macro);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// ----------------------------------------------------------------------------
	// vtkRenderWindow methods
	// ----------------------------------------------------------------------------

	function vtkRenderWindow(publicAPI, model) {
	  // Set our className
	  model.classHierarchy.push('vtkRenderWindow');

	  // Add renderer
	  publicAPI.addRenderer = function (renderer) {
	    if (publicAPI.hasRenderer(renderer)) {
	      return;
	    }
	    renderer.setRenderWindow(publicAPI);
	    model.renderers.push(renderer);

	    // for (this->Renderers->InitTraversal(rsit);
	    //      (aren = this->Renderers->GetNextRenderer(rsit)); )
	    //   {
	    //   aren->SetAllocatedRenderTime
	    //     (1.0/(this->DesiredUpdateRate*this->Renderers->GetNumberOfItems()));
	    //   }

	    publicAPI.modified();
	  };

	  // Remove renderer
	  publicAPI.removeRenderer = function (renderer) {
	    model.renderers = model.renderers.filter(function (r) {
	      return r !== renderer;
	    });
	    publicAPI.modified();
	  };

	  publicAPI.hasRenderer = function (ren) {
	    return model.renderers.indexOf(ren) !== -1;
	  };

	  // Add renderer
	  publicAPI.addView = function (view) {
	    if (publicAPI.hasView(view)) {
	      return;
	    }
	    view.setRenderable(publicAPI);
	    model.views.push(view);
	    publicAPI.modified();
	  };

	  // Remove renderer
	  publicAPI.removeView = function (view) {
	    model.views = model.views.filter(function (r) {
	      return r !== view;
	    });
	    publicAPI.modified();
	  };

	  publicAPI.hasView = function (view) {
	    return model.views.indexOf(view) !== -1;
	  };

	  publicAPI.render = function () {
	    model.views.forEach(function (view) {
	      return view.traverseAllPasses();
	    });
	  };
	}

	// ----------------------------------------------------------------------------
	// Object factory
	// ----------------------------------------------------------------------------

	var DEFAULT_VALUES = exports.DEFAULT_VALUES = {
	  renderers: [],
	  views: [],
	  interactor: null,
	  neverRendered: true,
	  numberOfLayers: 1
	};

	// ----------------------------------------------------------------------------

	function extend(publicAPI, model) {
	  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  Object.assign(model, DEFAULT_VALUES, initialValues);

	  // Build VTK API
	  macro.obj(publicAPI, model);
	  macro.setGet(publicAPI, model, ['interactor', 'numberOfLayers', 'views']);
	  macro.get(publicAPI, model, ['neverRendered']);
	  macro.getArray(publicAPI, model, ['renderers']);
	  macro.event(publicAPI, model, 'completion');

	  // Object methods
	  vtkRenderWindow(publicAPI, model);
	}

	// ----------------------------------------------------------------------------

	var newInstance = exports.newInstance = macro.newInstance(extend);

	// ----------------------------------------------------------------------------

	exports.default = { newInstance: newInstance, extend: extend };

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newInstance = undefined;
	exports.extend = extend;

	var _macro = __webpack_require__(2);

	var macro = _interopRequireWildcard(_macro);

	var _Camera = __webpack_require__(36);

	var _Camera2 = _interopRequireDefault(_Camera);

	var _Light = __webpack_require__(37);

	var _Light2 = _interopRequireDefault(_Light);

	var _Math = __webpack_require__(29);

	var _Math2 = _interopRequireDefault(_Math);

	var _TimerLog = __webpack_require__(38);

	var _TimerLog2 = _interopRequireDefault(_TimerLog);

	var _Viewport = __webpack_require__(39);

	var _Viewport2 = _interopRequireDefault(_Viewport);

	var _BoundingBox = __webpack_require__(40);

	var _glMatrix = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function notImplemented(method) {
	  return function () {
	    return console.log('vtkRenderer::${method} - NOT IMPLEMENTED');
	  };
	}

	// ----------------------------------------------------------------------------
	// Global methods
	// ----------------------------------------------------------------------------

	function expandBounds(bounds, matrix) {
	  if (!bounds) {
	    console.error('ERROR: Invalid bounds');
	    return;
	  }

	  if (!matrix) {
	    console.error('ERROR: Invalid matrix');
	    return;
	  }

	  // Expand the bounding box by model view transform matrix.
	  var pt = [_glMatrix.vec4.fromValues(bounds[0], bounds[2], bounds[5], 1.0), _glMatrix.vec4.fromValues(bounds[1], bounds[2], bounds[5], 1.0), _glMatrix.vec4.fromValues(bounds[1], bounds[2], bounds[4], 1.0), _glMatrix.vec4.fromValues(bounds[0], bounds[2], bounds[4], 1.0), _glMatrix.vec4.fromValues(bounds[0], bounds[3], bounds[5], 1.0), _glMatrix.vec4.fromValues(bounds[1], bounds[3], bounds[5], 1.0), _glMatrix.vec4.fromValues(bounds[1], bounds[3], bounds[4], 1.0), _glMatrix.vec4.fromValues(bounds[0], bounds[3], bounds[4], 1.0)];

	  // \note: Assuming that matrix does not have projective component. Hence not
	  // dividing by the homogeneous coordinate after multiplication
	  for (var i = 0; i < 8; ++i) {
	    _glMatrix.vec4.transformMat4(pt[i], pt[i], matrix);
	  }

	  // min = mpx = pt[0]
	  var min = [];
	  var max = [];
	  for (var _i = 0; _i < 4; ++_i) {
	    min[_i] = pt[0][_i];
	    max[_i] = pt[0][_i];
	  }

	  for (var _i2 = 1; _i2 < 8; ++_i2) {
	    for (var j = 0; j < 3; ++j) {
	      if (min[j] > pt[_i2][j]) {
	        min[j] = pt[_i2][j];
	      }
	      if (max[j] < pt[_i2][j]) {
	        max[j] = pt[_i2][j];
	      }
	    }
	  }

	  // Copy values back to bounds.
	  bounds[0] = min[0];
	  bounds[2] = min[1];
	  bounds[4] = min[2];

	  bounds[1] = max[0];
	  bounds[3] = max[1];
	  bounds[5] = max[2];
	}

	// ----------------------------------------------------------------------------
	// vtkRenderer methods
	// ----------------------------------------------------------------------------

	function vtkRenderer(publicAPI, model) {
	  // Set our className
	  model.classHierarchy.push('vtkRenderer');

	  publicAPI.releaseGraphicsResources = function (vtkWindow) {
	    if (model.backgroundTexture) {
	      model.backgroundTexture.releaseGraphicsResources(vtkWindow);
	    }

	    model.props.forEach(function (prop) {
	      if (prop) {
	        prop.releaseGraphicsResources(vtkWindow);
	      }
	    });
	  };

	  publicAPI.render = function () {
	    if (model.delegate && model.delegate.getUsed()) {
	      model.delegate.render(publicAPI);
	      return;
	    }

	    // If Draw is not on, ignore the render.
	    if (!model.draw) {
	      console.debug('Ignoring render because Draw is off.');
	      return;
	    }

	    var t1 = _TimerLog2.default.getUniversalTime();
	    publicAPI.invokeEvent({ type: 'StartEvent' });

	    // Create the initial list of visible props
	    // This will be passed through AllocateTime(), where
	    // a time is allocated for each prop, and the list
	    // maybe re-ordered by the cullers. Also create the
	    // sublists for the props that need ray casting, and
	    // the props that need to be rendered into an image.
	    // Fill these in later (in AllocateTime) - get a
	    // count of them there too
	    if (model.props.length > 0) {
	      model.propArray = model.props.filter(function (prop) {
	        return prop.getVisibility();
	      });
	    }

	    if (model.propArray.length === 0) {
	      console.debug('There are no visible props!');
	    } else {
	      // Call all the culling methods to set allocated time
	      // for each prop and re-order the prop list if desired
	      publicAPI.allocateTime();
	    }

	    // do the render library specific stuff
	    publicAPI.deviceRender();

	    // If we aborted, restore old estimated times
	    // Setting the allocated render time to zero also sets the
	    // estimated render time to zero, so that when we add back
	    // in the old value we have set it correctly.
	    if (model.renderWindow.getAbortRender()) {
	      model.propArray.restoreEstimatedRenderTime();
	    }

	    // Clean up the space we allocated before. If the PropArray exists,
	    // they all should exist
	    model.propArray = null;

	    // If we aborted, do not record the last render time.
	    // Lets play around with determining the accuracy of the
	    // EstimatedRenderTimes.  We can try to adjust for bad
	    // estimates with the TimeFactor.
	    if (!model.renderWindow.getAbortRender()) {
	      // Measure the actual RenderTime
	      model.lastRenderTimeInSeconds = (_TimerLog2.default.getUniversalTime() - t1) / 1000;

	      if (model.lastRenderTimeInSeconds === 0.0) {
	        model.lastRenderTimeInSeconds = 0.0001;
	      }

	      model.timeFactor = model.allocatedRenderTime / model.lastRenderTimeInSeconds;
	    }

	    publicAPI.invokeEvent({ type: 'EndEvent' });
	  };

	  publicAPI.deviceRenderTranslucentPolygonalGeometry = function () {
	    model.lastRenderingUsedDepthPeeling = false;
	    publicAPI.updateTranslucentPolygonalGeometry();
	  };

	  // macro
	  // - getAllocatedRenderTime
	  // - getTimeFactor

	  publicAPI.updateCamera = function () {
	    if (!model.activeCamera) {
	      console.debug('No cameras are on, creating one.');
	      // the get method will automagically create a camera
	      // and reset it since one hasn't been specified yet.
	      // If is very unlikely that this can occur - if this
	      // renderer is part of a vtkRenderWindow, the camera
	      // will already have been created as part of the
	      // DoStereoRender() method.
	      publicAPI.getActiveCameraAndResetIfCreated();
	    }

	    // update the viewing transformation
	    model.activeCamera.render(publicAPI);

	    return true;
	  };

	  publicAPI.updateLightsGeometryToFollowCamera = function () {
	    // only update the light's geometry if this Renderer is tracking
	    // this lights.  That allows one renderer to view the lights that
	    // another renderer is setting up.
	    var camera = publicAPI.getActiveCameraAndResetIfCreated();
	    var lightMatrix = camera.getCameraLightTransformMatrix();

	    model.lights.forEach(function (light) {
	      if (light.lightTypeIsSceneLight()) {
	        // Do nothing. Don't reset the transform matrix because applications
	        // may have set a custom matrix. Only reset the transform matrix in
	        // vtkLight::SetLightTypeToSceneLight()
	      } else if (light.lightTypeIsHeadLight()) {
	          // update position and orientation of light to match camera.
	          light.setPosition(camera.getPosition());
	          light.setFocalPoint(camera.getFocalPoint());
	        } else if (light.lightTypeIsCameraLight()) {
	          light.setTransformMatrix(lightMatrix);
	        } else {
	          console.error('light has unknown light type', light);
	        }
	    });
	  };

	  publicAPI.updateLightGeometry = function () {
	    if (model.lightFollowCamera) {
	      // only update the light's geometry if this Renderer is tracking
	      // this lights.  That allows one renderer to view the lights that
	      // another renderer is setting up.
	      return publicAPI.updateLightsGeometryToFollowCamera();
	    }
	    return true;
	  };

	  publicAPI.allocateTime = notImplemented('allocateTime');
	  publicAPI.updateGeometry = notImplemented('updateGeometry');

	  publicAPI.updateTranslucentPolygonalGeometry = function () {
	    var result = 0;

	    // loop through props and give them a chance to
	    // render themselves as translucent geometry
	    model.propArray.forEach(function (prop) {
	      var rendered = prop.renderTranslucentPolygonalGeometry(publicAPI);
	      model.numberOfPropsRendered += rendered;
	      result += rendered;
	    });

	    return result;
	  };

	  publicAPI.getVTKWindow = function () {
	    return model.renderWindow;
	  };

	  publicAPI.setLayer = function (layer) {
	    console.debug(publicAPI.getClassName(), publicAPI, 'setting Layer to ', layer);
	    if (model.layer !== layer) {
	      model.layer = layer;
	      publicAPI.modified();
	    }
	    publicAPI.setPreserveColorBuffer(!!layer);
	  };

	  publicAPI.setActiveCamera = function (camera) {
	    if (model.activeCamera === camera) {
	      return false;
	    }

	    model.activeCamera = camera;
	    publicAPI.modified();
	    publicAPI.invokeEvent({ type: 'ActiveCameraEvent', camera: camera });
	    return true;
	  };

	  publicAPI.makeCamera = function () {
	    var camera = _Camera2.default.newInstance();
	    publicAPI.invokeEvent({ type: 'CreateCameraEvent', camera: camera });
	    return camera;
	  };

	  // Replace the set/get macro method
	  publicAPI.getActiveCamera = function () {
	    if (!model.activeCamera) {
	      model.activeCamera = publicAPI.makeCamera();
	    }

	    return model.activeCamera;
	  };

	  publicAPI.getActiveCameraAndResetIfCreated = function () {
	    if (!model.activeCamera) {
	      publicAPI.getActiveCamera();
	      publicAPI.resetCamera();
	    }

	    return model.activeCamera;
	  };

	  publicAPI.addActor = publicAPI.addViewProp;
	  publicAPI.addVolume = publicAPI.addViewProp;

	  publicAPI.removeActor = function (actor) {
	    model.actors = model.actors.filter(function (a) {
	      return a !== actor;
	    });
	    publicAPI.removeViewProp(actor);
	  };

	  publicAPI.removeVolume = function (volume) {
	    model.volumes = model.volumes.filter(function (v) {
	      return v !== volume;
	    });
	    publicAPI.removeViewProp(volume);
	  };

	  publicAPI.addLight = function (light) {
	    model.lights = [].concat(model.lights, light);
	    publicAPI.modified();
	  };

	  publicAPI.getActors = function () {
	    model.actors = [];
	    model.props.forEach(function (prop) {
	      model.actors = model.actors.concat(prop.getActors());
	    });
	    return model.actors;
	  };

	  publicAPI.getVolumes = function () {
	    model.volumes = [];
	    model.props.forEach(function (prop) {
	      model.volumes = model.volumes.concat(prop.getVolumes());
	    });
	    return model.volumes;
	  };

	  publicAPI.removeLight = function (light) {
	    model.lights = model.lights.filter(function (l) {
	      return l !== light;
	    });
	    publicAPI.modified();
	  };

	  publicAPI.removeAllLights = function () {
	    model.lights = [];
	  };

	  // FIXME
	  publicAPI.addCuller = notImplemented('addCuller');
	  publicAPI.removeCuller = notImplemented('removeCuller');

	  publicAPI.setLightCollection = function (lights) {
	    model.lights = lights;
	    publicAPI.modified();
	  };

	  publicAPI.makeLight = _Light2.default.newInstance;

	  publicAPI.createLight = function () {
	    if (!model.automaticLightCreation) {
	      return;
	    }

	    if (model.createdLight) {
	      publicAPI.removeLight(model.createdLight);
	      model.createdLight.delete();
	      model.createdLight = null;
	    }

	    model.createdLight = publicAPI.makeLight();
	    publicAPI.addLight(model.createdLight);

	    model.createdLight.setLightTypeToHeadLight();

	    // set these values just to have a good default should LightFollowCamera
	    // be turned off.
	    model.createdLight.setPosition(publicAPI.getActiveCamera().getPosition());
	    model.createdLight.setFocalPoint(publicAPI.getActiveCamera().getFocalPoint());
	  };

	  publicAPI.normalizedDisplayToWorld = function (x, y, z) {
	    var vpd = publicAPI.normalizedDisplayToView(x, y, z);

	    return publicAPI.viewToWorld(vpd[0], vpd[1], vpd[2]);
	  };

	  publicAPI.worldToNormalizedDisplay = function (x, y, z) {
	    var vpd = publicAPI.worldToView(x, y, z);

	    return publicAPI.viewToNormalizedDisplay(vpd[0], vpd[1], vpd[2]);
	  };

	  publicAPI.viewToWorld = function (x, y, z) {
	    if (model.activeCamera === null) {
	      console.error('ViewToWorld: no active camera, cannot compute view to world, returning 0,0,0');
	      return [0, 0, 0];
	    }

	    // get the perspective transformation from the active camera
	    var matrix = model.activeCamera.getCompositeProjectionTransformMatrix(1.0, 0, 1);
	    //                    publicAPI.getTiledAspectRatio(), 0, 1);

	    _glMatrix.mat4.invert(matrix, matrix);
	    _glMatrix.mat4.transpose(matrix, matrix);

	    // Transform point to world coordinates
	    var result = _glMatrix.vec3.fromValues(x, y, z);
	    _glMatrix.vec3.transformMat4(result, result, matrix);
	    return [result[0], result[1], result[2]];
	  };

	  // Convert world point coordinates to view coordinates.
	  publicAPI.worldToView = function (x, y, z) {
	    if (model.activeCamera === null) {
	      console.error('ViewToWorld: no active camera, cannot compute view to world, returning 0,0,0');
	      return [0, 0, 0];
	    }

	    // get the perspective transformation from the active camera
	    var matrix = model.activeCamera.getCompositeProjectionTransformMatrix(1.0, 0, 1);
	    //                    publicAPI.getTiledAspectRatio(), 0, 1);
	    _glMatrix.mat4.transpose(matrix, matrix);

	    var result = _glMatrix.vec3.fromValues(x, y, z);
	    _glMatrix.vec3.transformMat4(result, result, matrix);
	    return [result[0], result[1], result[2]];
	  };

	  publicAPI.computeVisiblePropBounds = function () {
	    var allBounds = [].concat(_BoundingBox.INIT_BOUNDS);
	    var nothingVisible = true;

	    publicAPI.invokeEvent({ type: 'ComputeVisiblePropBoundsEvent', renderer: publicAPI });

	    // loop through all props
	    model.props.filter(function (prop) {
	      return prop.getVisibility() && prop.getUseBounds();
	    }).forEach(function (prop) {
	      var bounds = prop.getBounds();
	      if (bounds && _Math2.default.areBoundsInitialized(bounds)) {
	        nothingVisible = false;

	        if (bounds[0] < allBounds[0]) {
	          allBounds[0] = bounds[0];
	        }
	        if (bounds[1] > allBounds[1]) {
	          allBounds[1] = bounds[1];
	        }
	        if (bounds[2] < allBounds[2]) {
	          allBounds[2] = bounds[2];
	        }
	        if (bounds[3] > allBounds[3]) {
	          allBounds[3] = bounds[3];
	        }
	        if (bounds[4] < allBounds[4]) {
	          allBounds[4] = bounds[4];
	        }
	        if (bounds[5] > allBounds[5]) {
	          allBounds[5] = bounds[5];
	        }
	      }
	    });

	    if (nothingVisible) {
	      _Math2.default.uninitializeBounds(allBounds);
	      console.debug('Can\'t compute bounds, no 3D props are visible');
	    }

	    return allBounds;
	  };

	  publicAPI.resetCamera = function () {
	    var bounds = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

	    var boundsToUse = bounds || publicAPI.computeVisiblePropBounds();
	    var center = [0, 0, 0];

	    if (!_Math2.default.areBoundsInitialized(boundsToUse)) {
	      console.debug('Cannot reset camera!');
	      return false;
	    }

	    var vn = null;

	    if (publicAPI.getActiveCamera()) {
	      vn = model.activeCamera.getViewPlaneNormal();
	    } else {
	      console.error('Trying to reset non-existant camera');
	      return false;
	    }

	    // Reset the perspective zoom factors, otherwise subsequent zooms will cause
	    // the view angle to become very small and cause bad depth sorting.
	    model.activeCamera.setViewAngle(30.0);

	    expandBounds(boundsToUse, model.activeCamera.getModelTransformMatrix());

	    center[0] = (boundsToUse[0] + boundsToUse[1]) / 2.0;
	    center[1] = (boundsToUse[2] + boundsToUse[3]) / 2.0;
	    center[2] = (boundsToUse[4] + boundsToUse[5]) / 2.0;

	    var w1 = boundsToUse[1] - boundsToUse[0];
	    var w2 = boundsToUse[3] - boundsToUse[2];
	    var w3 = boundsToUse[5] - boundsToUse[4];
	    w1 *= w1;
	    w2 *= w2;
	    w3 *= w3;
	    var radius = w1 + w2 + w3;

	    // If we have just a single point, pick a radius of 1.0
	    radius = radius === 0 ? 1.0 : radius;

	    // compute the radius of the enclosing sphere
	    radius = Math.sqrt(radius) * 0.5;

	    // default so that the bounding sphere fits within the view fustrum

	    // compute the distance from the intersection of the view frustum with the
	    // bounding sphere. Basically in 2D draw a circle representing the bounding
	    // sphere in 2D then draw a horizontal line going out from the center of
	    // the circle. That is the camera view. Then draw a line from the camera
	    // position to the point where it intersects the circle. (it will be tangent
	    // to the circle at this point, this is important, only go to the tangent
	    // point, do not draw all the way to the view plane). Then draw the radius
	    // from the tangent point to the center of the circle. You will note that
	    // this forms a right triangle with one side being the radius, another being
	    // the target distance for the camera, then just find the target dist using
	    // a sin.
	    var angle = _Math2.default.radiansFromDegrees(model.activeCamera.getViewAngle());
	    var parallelScale = radius;

	    publicAPI.computeAspect();
	    var aspect = publicAPI.getAspect();

	    if (aspect[0] >= 1.0) {
	      // horizontal window, deal with vertical angle|scale
	      if (model.activeCamera.getUseHorizontalViewAngle()) {
	        angle = 2.0 * Math.atan(Math.tan(angle * 0.5) / aspect[0]);
	      }
	    } else {
	      // vertical window, deal with horizontal angle|scale
	      if (!model.activeCamera.getUseHorizontalViewAngle()) {
	        angle = 2.0 * Math.atan(Math.tan(angle * 0.5) * aspect[0]);
	      }
	      parallelScale = parallelScale / aspect[0];
	    }

	    var distance = radius / Math.sin(angle * 0.5);

	    // check view-up vector against view plane normal
	    var vup = model.activeCamera.getViewUp();
	    if (Math.abs(_Math2.default.dot(vup, vn)) > 0.999) {
	      console.warn('Resetting view-up since view plane normal is parallel');
	      model.activeCamera.setViewUp(-vup[2], vup[0], vup[1]);
	    }

	    // update the camera
	    model.activeCamera.setFocalPoint(center[0], center[1], center[2]);
	    model.activeCamera.setPosition(center[0] + distance * vn[0], center[1] + distance * vn[1], center[2] + distance * vn[2]);

	    publicAPI.resetCameraClippingRange(boundsToUse);

	    // setup default parallel scale
	    model.activeCamera.setParallelScale(parallelScale);

	    // Here to let parallel/distributed compositing intercept
	    // and do the right thing.
	    publicAPI.invokeEvent({ type: 'ResetCameraEvent', renderer: publicAPI });

	    return true;
	  };

	  publicAPI.resetCameraClippingRange = function () {
	    var bounds = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

	    var boundsToUse = bounds || publicAPI.computeVisiblePropBounds();

	    if (!_Math2.default.areBoundsInitialized(boundsToUse)) {
	      console.debug('Cannot reset camera clipping range!');
	      return false;
	    }

	    // Make sure we have an active camera
	    publicAPI.getActiveCameraAndResetIfCreated();
	    if (!model.activeCamera) {
	      console.error('Trying to reset clipping range of non-existant camera');
	      return false;
	    }

	    var vn = null;var position = null;
	    if (!model.activeCamera.getUseOffAxisProjection()) {
	      vn = model.activeCamera.getViewPlaneNormal();
	      position = model.activeCamera.getPosition();
	      expandBounds(boundsToUse, model.activeCamera.getModelTransformMatrix());
	    } else {
	      position = model.activeCamera.getEyePosition();
	      vn = model.activeCamera.getEyePlaneNormal();
	      expandBounds(boundsToUse, model.activeCamera.getModelViewTransformMatrix());
	    }

	    var a = -vn[0];
	    var b = -vn[1];
	    var c = -vn[2];
	    var d = -(a * position[0] + b * position[1] + c * position[2]);

	    // Set the max near clipping plane and the min far clipping plane
	    var range = [a * boundsToUse[0] + b * boundsToUse[2] + c * boundsToUse[4] + d, 1e-18];

	    // Find the closest / farthest bounding box vertex
	    for (var k = 0; k < 2; k++) {
	      for (var j = 0; j < 2; j++) {
	        for (var i = 0; i < 2; i++) {
	          var dist = a * boundsToUse[i] + b * boundsToUse[2 + j] + c * boundsToUse[4 + k] + d;
	          range[0] = dist < range[0] ? dist : range[0];
	          range[1] = dist > range[1] ? dist : range[1];
	        }
	      }
	    }

	    // do not let far - near be less than 0.1 of the window height
	    // this is for cases such as 2D images which may have zero range
	    var minGap = 0.0;
	    if (model.activeCamera.getParallelProjection()) {
	      minGap = 0.1 * model.activeCamera.getParallelScale();
	    } else {
	      var angle = _Math2.default.radiansFromDegrees(model.activeCamera.getViewAngle());
	      minGap = 0.2 * Math.tan(angle / 2.0) * range[1];
	    }

	    if (range[1] - range[0] < minGap) {
	      minGap = minGap - range[1] + range[0];
	      range[1] += minGap / 2.0;
	      range[0] -= minGap / 2.0;
	    }

	    // Do not let the range behind the camera throw off the calculation.
	    if (range[0] < 0.0) {
	      range[0] = 0.0;
	    }

	    // Give ourselves a little breathing room
	    range[0] = 0.99 * range[0] - (range[1] - range[0]) * model.clippingRangeExpansion;
	    range[1] = 1.01 * range[1] + (range[1] - range[0]) * model.clippingRangeExpansion;

	    // Make sure near is not bigger than far
	    range[0] = range[0] >= range[1] ? 0.01 * range[1] : range[0];

	    // Make sure near is at least some fraction of far - this prevents near
	    // from being behind the camera or too close in front. How close is too
	    // close depends on the resolution of the depth buffer
	    if (!model.nearClippingPlaneTolerance) {
	      model.nearClippingPlaneTolerance = 0.01;
	      if (model.renderWindow) {
	        var ZBufferDepth = model.renderWindow.getDepthBufferSize();
	        if (ZBufferDepth > 16) {
	          model.nearClippingPlaneTolerance = 0.001;
	        }
	      }
	    }

	    // make sure the front clipping range is not too far from the far clippnig
	    // range, this is to make sure that the zbuffer resolution is effectively
	    // used
	    if (range[0] < model.nearClippingPlaneTolerance * range[1]) {
	      range[0] = model.nearClippingPlaneTolerance * range[1];
	    }
	    model.activeCamera.setClippingRange(range);

	    // Here to let parallel/distributed compositing intercept
	    // and do the right thing.
	    publicAPI.invokeEvent({ type: 'ResetCameraClippingRangeEvent', renderer: publicAPI });
	    return false;
	  };

	  publicAPI.setRenderWindow = function (renderWindow) {
	    if (renderWindow !== model.renderWindow) {
	      // This renderer is be dis-associated with its previous render window.
	      // this information needs to be passed to the renderer's actors and
	      // volumes so they can release and render window specific (or graphics
	      // context specific) information (such as display lists and texture ids)
	      model.props.forEach(function (prop) {
	        prop.releaseGraphicsResources(model.renderWindow);
	      });
	      // what about lights?
	      // what about cullers?
	      publicAPI.releaseGraphicsResources(model.renderWindow);

	      if (model.backgroundTexture && model.renderWindow) {
	        model.backgroundTexture.releaseGraphicsResources(model.renderWindow);
	      }

	      model.vtkWindow = renderWindow;
	      model.renderWindow = renderWindow;
	    }
	  };

	  publicAPI.visibleActorCount = function () {
	    return model.props.filter(function (prop) {
	      return prop.getVisibility();
	    }).length;
	  };
	  publicAPI.visibleVolumeCount = publicAPI.visibleActorCount;

	  publicAPI.getMTime = function () {
	    return Math.max(model.mtime, model.activeCamera ? model.activeCamera.getMTime() : 0, model.createdLight ? model.createdLight.getMTime() : 0);
	  };

	  // FIXME
	  publicAPI.pickProp = notImplemented('pickProp');
	  publicAPI.pickRender = notImplemented('PickRender');
	  publicAPI.pickGeometry = notImplemented('PickGeometry');

	  // ExpandBounds => global

	  publicAPI.getTransparent = function () {
	    return !!model.preserveColorBuffer;
	  };

	  // FIXME
	  publicAPI.getTiledAspectRatio = notImplemented('GetTiledAspectRatio');
	  publicAPI.captureGL2PSSpecialProp = notImplemented('CaptureGL2PSSpecialProp');

	  publicAPI.isActiveCameraCreated = function () {
	    return !!model.activeCamera;
	  };
	}

	// ----------------------------------------------------------------------------
	// Object factory
	// ----------------------------------------------------------------------------

	var DEFAULT_VALUES = {
	  pickedProp: null,
	  activeCamera: null,

	  ambient: [1, 1, 1],

	  allocatedRenderTime: 100,
	  timeFactor: 1,

	  createdLight: null,
	  automaticLightCreation: true,

	  twoSidedLighting: true,
	  lastRenderTimeInSeconds: -1,

	  renderWindow: null,
	  lights: [],
	  actors: [],
	  volumes: [],

	  lightFollowCamera: true,

	  numberOfPropsRendered: 0,

	  propArray: null,

	  pathArray: null,

	  layer: 1,
	  preserveColorBuffer: false,
	  preserveDepthBuffer: false,

	  computeVisiblePropBounds: _Math2.default.createUninitializedBouds(),

	  interactive: true,

	  nearClippingPlaneTolerance: 0,
	  clippingRangeExpansion: 0.5,

	  erase: true,
	  draw: true,

	  useShadows: false,

	  useDepthPeeling: false,
	  occlusionRatio: 0,
	  maximumNumberOfPeels: 4,

	  selector: null,
	  delegate: null,

	  texturedBackground: false,
	  backgroundTexture: null,

	  pass: 0
	};

	// ----------------------------------------------------------------------------

	function extend(publicAPI, model) {
	  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  Object.assign(model, DEFAULT_VALUES, initialValues);

	  // Inheritance
	  _Viewport2.default.extend(publicAPI, model);

	  // Build VTK API
	  macro.get(publicAPI, model, ['renderWindow', 'allocatedRenderTime', 'timeFactor', 'lastRenderTimeInSeconds', 'numberOfPropsRendered', 'lastRenderingUsedDepthPeeling', 'selector']);
	  macro.setGet(publicAPI, model, ['twoSidedLighting', 'lightFollowCamera', 'automaticLightCreation', 'erase', 'draw', 'nearClippingPlaneTolerance', 'clippingRangeExpansion', 'backingStore', 'interactive', 'layer', 'preserveColorBuffer', 'preserveDepthBuffer', 'useDepthPeeling', 'occlusionRatio', 'maximumNumberOfPeels', 'delegate', 'backgroundTexture', 'texturedBackground', 'useShadows', 'pass']);
	  macro.getArray(publicAPI, model, ['actors', 'volumes', 'lights']);
	  macro.setGetArray(publicAPI, model, ['background'], 3);

	  // Object methods
	  vtkRenderer(publicAPI, model);
	}

	// ----------------------------------------------------------------------------

	var newInstance = exports.newInstance = macro.newInstance(extend);

	// ----------------------------------------------------------------------------

	exports.default = { newInstance: newInstance, extend: extend };

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newInstance = exports.DEFAULT_VALUES = undefined;
	exports.extend = extend;

	var _macro = __webpack_require__(2);

	var macro = _interopRequireWildcard(_macro);

	var _Math = __webpack_require__(29);

	var _Math2 = _interopRequireDefault(_Math);

	var _glMatrix = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/* eslint-disable new-cap */

	/*
	 * Convenience function to access elements of a gl-matrix.  If it turns
	 * out I have rows and columns swapped everywhere, then I'll just change
	 * the order of 'row' and 'col' parameters in this function
	 */
	// function getMatrixElement(matrix, row, col) {
	//   const idx = (row * 4) + col;
	//   return matrix[idx];
	// }

	// ----------------------------------------------------------------------------
	// vtkCamera methods
	// ----------------------------------------------------------------------------

	function vtkCamera(publicAPI, model) {
	  // Set our className
	  model.classHierarchy.push('vtkCamera');

	  // Set up private variables and methods
	  var viewMatrix = _glMatrix.mat4.create();
	  var projectionMatrix = _glMatrix.mat4.create();
	  // let viewUp = new vec3.fromValues(0, 1, 0);
	  // let distance = 0.0002;

	  publicAPI.orthogonalizeViewUp = function () {
	    var vt = publicAPI.getViewTransformMatrix();
	    model.viewUp[0] = vt[4];
	    model.viewUp[1] = vt[5];
	    model.viewUp[2] = vt[6];

	    publicAPI.modified();
	  };

	  publicAPI.setPosition = function (x, y, z) {
	    if (x === model.position[0] && y === model.position[1] && z === model.position[2]) {
	      return;
	    }

	    model.position[0] = x;
	    model.position[1] = y;
	    model.position[2] = z;

	    // recompute the focal distance
	    publicAPI.computeDistance();
	    // publicAPI.computeCameraLightTransform();

	    publicAPI.modified();
	  };

	  publicAPI.setFocalPoint = function (x, y, z) {
	    if (x === model.focalPoint[0] && y === model.focalPoint[1] && z === model.focalPoint[2]) {
	      return;
	    }

	    model.focalPoint[0] = x;
	    model.focalPoint[1] = y;
	    model.focalPoint[2] = z;

	    // recompute the focal distance
	    publicAPI.computeDistance();
	    // publicAPI.computeCameraLightTransform();

	    publicAPI.modified();
	  };

	  publicAPI.setDistance = function (d) {
	    // if (distance === d) {
	    //   return;
	    // }

	    // distance = d;

	    // // Distance should be greater than .0002
	    // if (distance < 0.0002) {
	    //   distance = 0.0002;
	    // }

	    // // we want to keep the camera pointing in the same direction
	    // const vec = model.directionOfProjection;

	    // // recalculate FocalPoint
	    // model.focalPoint[0] = model.position[0] + vec[0] * distance;
	    // model.focalPoint[1] = model.position[1] + vec[1] * distance;
	    // model.focalPoint[2] = model.position[2] + vec[2] * distance;

	    // // FIXME
	    // // computeViewTransform();
	    // // computeCameraLightTransform();
	    // publicAPI.modified();
	  };

	  publicAPI.getDistance = function () {};

	  //----------------------------------------------------------------------------
	  // This method must be called when the focal point or camera position changes
	  publicAPI.computeDistance = function () {
	    var dx = model.focalPoint[0] - model.position[0];
	    var dy = model.focalPoint[1] - model.position[1];
	    var dz = model.focalPoint[2] - model.position[2];

	    model.distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

	    if (model.distance < 1e-20) {
	      model.distance = 1e-20;
	      console.debug('Distance is set to minimum.');

	      var vec = model.DirectionOfProjection;

	      // recalculate FocalPoint
	      model.focalPoint[0] = model.position[0] + vec[0] * model.distance;
	      model.focalPoint[1] = model.position[1] + vec[1] * model.distance;
	      model.focalPoint[2] = model.position[2] + vec[2] * model.distance;
	    }

	    model.directionOfProjection[0] = dx / model.distance;
	    model.directionOfProjection[1] = dy / model.distance;
	    model.directionOfProjection[2] = dz / model.distance;

	    publicAPI.computeViewPlaneNormal();
	  };

	  //----------------------------------------------------------------------------
	  publicAPI.computeViewPlaneNormal = function () {
	    // VPN is -DOP
	    model.viewPlaneNormal[0] = -model.directionOfProjection[0];
	    model.viewPlaneNormal[1] = -model.directionOfProjection[1];
	    model.viewPlaneNormal[2] = -model.directionOfProjection[2];
	  };

	  //----------------------------------------------------------------------------
	  // Move the position of the camera along the view plane normal. Moving
	  // towards the focal point (e.g., > 1) is a dolly-in, moving away
	  // from the focal point (e.g., < 1) is a dolly-out.
	  publicAPI.dolly = function (amount) {
	    if (amount <= 0.0) {
	      return;
	    }

	    // dolly moves the camera towards the focus
	    var d = model.distance / amount;

	    publicAPI.setPosition(model.focalPoint[0] - d * model.directionOfProjection[0], model.focalPoint[1] - d * model.directionOfProjection[1], model.focalPoint[2] - d * model.directionOfProjection[2]);
	  };

	  publicAPI.setRoll = function (roll) {};

	  publicAPI.getRoll = function () {};

	  publicAPI.roll = function (angle) {
	    var eye = model.position;
	    var at = model.focalPoint;
	    var up = model.viewUp;
	    var viewUpVec4 = _glMatrix.vec4.fromValues(up[0], up[1], up[2], 0.0);

	    var rotateMatrix = _glMatrix.mat4.create(); // FIXME: don't create a new one each time?
	    var viewDir = _glMatrix.vec3.fromValues(at[0] - eye[0], at[1] - eye[1], at[2] - eye[2]);
	    _glMatrix.mat4.rotate(rotateMatrix, rotateMatrix, _Math2.default.radiansFromDegrees(angle), viewDir);
	    _glMatrix.vec4.transformMat4(viewUpVec4, viewUpVec4, rotateMatrix);

	    model.viewUp[0] = viewUpVec4[0];
	    model.viewUp[1] = viewUpVec4[1];
	    model.viewUp[2] = viewUpVec4[2];

	    publicAPI.modified();
	  };

	  publicAPI.azimuth = function (angle) {
	    var newPosition = _glMatrix.vec3.create();
	    var fp = model.focalPoint;

	    var trans = _glMatrix.mat4.create();
	    _glMatrix.mat4.identity(trans);

	    // translate the focal point to the origin,
	    // rotate about view up,
	    // translate back again
	    _glMatrix.mat4.translate(trans, trans, _glMatrix.vec3.fromValues(fp[0], fp[1], fp[2]));
	    _glMatrix.mat4.rotate(trans, trans, _Math2.default.radiansFromDegrees(angle), _glMatrix.vec3.fromValues(model.viewUp[0], model.viewUp[1], model.viewUp[2]));
	    _glMatrix.mat4.translate(trans, trans, _glMatrix.vec3.fromValues(-fp[0], -fp[1], -fp[2]));

	    // apply the transform to the position
	    _glMatrix.vec3.transformMat4(newPosition, _glMatrix.vec3.fromValues(model.position[0], model.position[1], model.position[2]), trans);
	    publicAPI.setPosition(newPosition[0], newPosition[1], newPosition[2]);
	  };

	  publicAPI.yaw = function (angle) {};

	  publicAPI.elevation = function (angle) {
	    var newPosition = _glMatrix.vec3.create();
	    var fp = model.focalPoint;

	    var vt = publicAPI.getViewTransformMatrix();
	    var axis = [-vt[0], -vt[1], -vt[2]];

	    var trans = _glMatrix.mat4.create();
	    _glMatrix.mat4.identity(trans);

	    // translate the focal point to the origin,
	    // rotate about view up,
	    // translate back again
	    _glMatrix.mat4.translate(trans, trans, _glMatrix.vec3.fromValues(fp[0], fp[1], fp[2]));
	    _glMatrix.mat4.rotate(trans, trans, _Math2.default.radiansFromDegrees(angle), _glMatrix.vec3.fromValues(axis[0], axis[1], axis[2]));
	    _glMatrix.mat4.translate(trans, trans, _glMatrix.vec3.fromValues(-fp[0], -fp[1], -fp[2]));

	    // apply the transform to the position
	    _glMatrix.vec3.transformMat4(newPosition, _glMatrix.vec3.fromValues(model.position[0], model.position[1], model.position[2]), trans);
	    publicAPI.setPosition(newPosition[0], newPosition[1], newPosition[2]);
	  };

	  publicAPI.pitch = function (angle) {};

	  publicAPI.zoom = function (factor) {};

	  publicAPI.setThickness = function (thickness) {};

	  publicAPI.setWindowCenter = function (x, y) {};

	  publicAPI.setObliqueAngles = function (alpha, beta) {};

	  publicAPI.applyTransform = function (transform) {};

	  publicAPI.setEyePosition = function (eyePosition) {};

	  publicAPI.getEyePosition = function () {};

	  publicAPI.getEyePlaneNormal = function () {};

	  publicAPI.getViewTransformMatrix = function () {
	    var eye = model.position;
	    var at = model.focalPoint;
	    var up = model.viewUp;

	    var result = _glMatrix.mat4.lookAt(viewMatrix, _glMatrix.vec3.fromValues(eye[0], eye[1], eye[2]), // eye
	    _glMatrix.vec3.fromValues(at[0], at[1], at[2]), // at
	    _glMatrix.vec3.fromValues(up[0], up[1], up[2])); // up

	    _glMatrix.mat4.transpose(result, result);
	    return result;
	  };

	  publicAPI.getViewTransformObject = function () {};

	  publicAPI.getProjectionTransformMatrix = function (aspect, nearz, farz) {
	    _glMatrix.mat4.identity(projectionMatrix);

	    // FIXME: Not sure what to do about adjust z buffer here
	    // adjust Z-buffer range
	    // this->ProjectionTransform->AdjustZBuffer( -1, +1, nearz, farz );
	    var cWidth = model.clippingRange[1] - model.clippingRange[0];
	    var cRange = [model.clippingRange[0] + (nearz + 1) * cWidth / 2.0, model.clippingRange[0] + (farz + 1) * cWidth / 2.0];

	    if (model.parallelProjection) {
	      // set up a rectangular parallelipiped
	      var width = model.parallelScale * aspect;
	      var height = model.parallelScale;

	      var xmin = (model.windowCenter[0] - 1.0) * width;
	      var xmax = (model.windowCenter[0] + 1.0) * width;
	      var ymin = (model.windowCenter[1] - 1.0) * height;
	      var ymax = (model.windowCenter[1] + 1.0) * height;

	      // mat4.ortho(out, left, right, bottom, top, near, far)
	      _glMatrix.mat4.ortho(projectionMatrix, xmin, xmax, ymin, ymax, nearz, farz);
	    } else if (model.useOffAxisProjection) {
	      throw new Error('Off-Axis projection is not supported at this time');
	    } else {
	      // mat4.perspective(out, fovy, aspect, near, far)
	      var fovy = model.viewAngle;
	      if (model.useHorizontalViewAngle === true) {
	        fovy = model.viewAngle / aspect;
	      }
	      _glMatrix.mat4.perspective(projectionMatrix, _Math2.default.radiansFromDegrees(fovy), aspect, cRange[0], cRange[1]);
	    }

	    // No stereo, no view shear at the current time

	    _glMatrix.mat4.transpose(projectionMatrix, projectionMatrix);
	    return projectionMatrix;
	  };

	  publicAPI.getProjectionTransformObject = function (aspect, nearz, farz) {
	    // return vtkTransform object
	  };

	  publicAPI.getCompositeProjectionTransformMatrix = function (aspect, nearz, farz) {
	    var vMat = publicAPI.getViewTransformMatrix();
	    var pMat = publicAPI.getProjectionTransformMatrix(aspect, nearz, farz);
	    _glMatrix.mat4.multiply(pMat, vMat, pMat);
	    return pMat;
	  };

	  // publicAPI.getProjectionTransformMatrix = renderer => {
	  //   // return glmatrix object
	  // };

	  publicAPI.setUserViewTransform = function (transform) {
	    // transform is a vtkHomogeneousTransform
	  };

	  publicAPI.setUserTransform = function (transform) {
	    // transform is a vtkHomogeneousTransform
	  };

	  publicAPI.render = function (renderer) {};

	  publicAPI.getViewingRaysMTime = function () {};

	  publicAPI.viewingRaysModified = function () {};

	  publicAPI.getFrustumPlanes = function (aspect) {
	    // Return array of 24 params (4 params for each of 6 plane equations)
	  };

	  publicAPI.getOrientation = function () {};

	  publicAPI.getOrientationWXYZ = function () {};

	  publicAPI.getCameraLightTransformMatrix = function () {};

	  publicAPI.updateViewport = function () {};

	  publicAPI.shallowCopy = function (sourceCamera) {};

	  publicAPI.deepCopy = function (sourceCamera) {};

	  publicAPI.setScissorRect = function (rect) {
	    // rect is a vtkRect
	  };

	  publicAPI.getScissorRect = function () {};
	}

	// ----------------------------------------------------------------------------
	// Object factory
	// ----------------------------------------------------------------------------

	var DEFAULT_VALUES = exports.DEFAULT_VALUES = {
	  position: [0, 0, 1],
	  focalPoint: [0, 0, 0],
	  viewUp: [0, 1, 0],
	  directionOfProjection: [0, 0, -1],
	  parallelProjection: false,
	  useHorizontalViewAngle: false,
	  viewAngle: 30,
	  parallelScale: 1,
	  clippingRange: [0.01, 1000.01],
	  thickness: 1000,
	  windowCenter: [0, 0],
	  viewPlaneNormal: [0, 0, 1],
	  viewShear: [0, 0, 1],
	  eyeAngle: 2,
	  focalDisk: 1,
	  useOffAxisProjection: false,
	  screenBottomLeft: [-0.5, -0.5, -0.5],
	  screenBottomRight: [0.5, -0.5, -0.5],
	  screenTopRight: [0.5, 0.5, -0.5],
	  eyeSeparation: 0.06,
	  // eyeTransformMatrix: mat4.create(),     // can't do these here, or else
	  // modelTransformMatrix: mat4.create(),   // every instance shares same default
	  userViewTransform: null,
	  userTransform: null,
	  leftEye: 1,
	  freezeFocalPoint: false,
	  useScissor: false
	};

	// ----------------------------------------------------------------------------

	function extend(publicAPI, model) {
	  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  Object.assign(model, DEFAULT_VALUES, initialValues);

	  // Make sure we have our own objects
	  model.eyeTransformMatrix = _glMatrix.mat4.create();
	  model.modelTransformMatrix = _glMatrix.mat4.create();

	  // Build VTK API
	  macro.obj(publicAPI, model);
	  macro.get(publicAPI, model, ['thickness', 'userViewTransform', 'userTransform']);

	  macro.setGet(publicAPI, model, ['parallelProjection', 'useHorizontalViewAngle', 'viewAngle', 'parallelScale', 'eyeAngle', 'focalDisk', 'useOffAxisProjection', 'eyeSeparation', 'eyeTransformMatrix', 'modelTransformMatrix', 'leftEye', 'freezeFocalPoint', 'useScissor']);

	  macro.getArray(publicAPI, model, ['directionOfProjection', 'windowCenter', 'viewPlaneNormal', 'position', 'focalPoint']);

	  macro.setGetArray(publicAPI, model, ['clippingRange'], 2);

	  macro.setGetArray(publicAPI, model, ['viewUp', 'viewShear', 'screenBottomLeft', 'screenBottomRight', 'screenTopRight'], 3);

	  // Object methods
	  vtkCamera(publicAPI, model);
	}

	// ----------------------------------------------------------------------------

	var newInstance = exports.newInstance = macro.newInstance(extend);

	// ----------------------------------------------------------------------------

	exports.default = { newInstance: newInstance, extend: extend };

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newInstance = exports.LIGHT_TYPES = undefined;
	exports.vtkLight = vtkLight;
	exports.extend = extend;

	var _macro = __webpack_require__(2);

	var macro = _interopRequireWildcard(_macro);

	var _Math = __webpack_require__(29);

	var _Math2 = _interopRequireDefault(_Math);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// ----------------------------------------------------------------------------

	var LIGHT_TYPES = exports.LIGHT_TYPES = ['HeadLight', 'CameraLight', 'SceneLight'];

	// ----------------------------------------------------------------------------
	// vtkLight methods
	// ----------------------------------------------------------------------------

	function vtkLight(publicAPI, model) {
	  // Set our className
	  model.classHierarchy.push('vtkLight');

	  publicAPI.getTransformedPosition = function () {
	    if (model.transformMatrix) {
	      return []; // FIXME !!!!
	    }
	    return [].concat(model.position);
	  };

	  publicAPI.getTransformedFocalPoint = function () {
	    if (model.transformMatrix) {
	      return []; // FIXME !!!!
	    }
	    return [].concat(model.focalPoint);
	  };

	  publicAPI.setDirectionAngle = function (elevation, azimuth) {
	    var elevationRadians = _Math2.default.radiansFromDegrees(elevation);
	    var azimuthRadians = _Math2.default.radiansFromDegrees(azimuth);

	    publicAPI.setPosition(Math.cos(elevationRadians) * Math.sin(azimuthRadians), Math.sin(elevationRadians), Math.cos(elevationRadians) * Math.cos(azimuthRadians));

	    publicAPI.setFocalPoint(0, 0, 0);
	    publicAPI.setPositional(0);
	  };

	  publicAPI.setLightTypeToHeadLight = function () {
	    publicAPI.setLightType('HeadLight');
	  };

	  publicAPI.setLightTypeToCameraLight = function () {
	    publicAPI.setLightType('CameraLight');
	  };

	  publicAPI.setLightTypeToSceneLight = function () {
	    publicAPI.setTransformMatrix(null);
	    publicAPI.setLightType('SceneLight');
	  };

	  publicAPI.lightTypeIsHeadLight = function () {
	    return model.lightType === 'HeadLight';
	  };

	  publicAPI.lightTypeIsSceneLight = function () {
	    return model.lightType === 'SceneLight';
	  };

	  publicAPI.lightTypeIsCameraLight = function () {
	    return model.lightType === 'CameraLight';
	  };
	}

	// ----------------------------------------------------------------------------
	// Object factory
	// ----------------------------------------------------------------------------

	var DEFAULT_VALUES = {
	  switch: true,
	  intensity: 1,
	  ambientColor: [0, 0, 0],
	  diffuseColor: [1, 1, 1],
	  specularColor: [1, 1, 1],
	  position: [0, 0, 1],
	  focalPoint: [0, 0, 0],
	  positional: false,
	  exponent: 1,
	  coneAngle: 30,
	  attenuationValues: [1, 0, 0],
	  transformMatrix: null,
	  lightType: 'SceneLight',
	  shadowAttenuation: 1
	};

	// ----------------------------------------------------------------------------

	function extend(publicAPI, model) {
	  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  Object.assign(model, DEFAULT_VALUES, initialValues);

	  // Build VTK API
	  macro.obj(publicAPI, model);
	  macro.setGet(publicAPI, model, ['intensity', 'switch', 'positional', 'exponent', 'coneAngle', 'transformMatrix', 'lightType', 'shadowAttenuation']);
	  macro.setGetArray(publicAPI, model, ['ambientColor', 'diffuseColor', 'specularColor', 'position', 'focalPoint', 'attenuationValues'], 3);

	  // Object methods
	  vtkLight(publicAPI, model);
	}

	// ----------------------------------------------------------------------------

	var newInstance = exports.newInstance = macro.newInstance(extend);

	// ----------------------------------------------------------------------------

	exports.default = { newInstance: newInstance, extend: extend, LIGHT_TYPES: LIGHT_TYPES };

/***/ },
/* 38 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getUniversalTime = getUniversalTime;
	function getUniversalTime() {
	  return +new Date();
	}

	exports.default = {
	  getUniversalTime: getUniversalTime
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newInstance = undefined;
	exports.extend = extend;

	var _macro = __webpack_require__(2);

	var macro = _interopRequireWildcard(_macro);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function notImplemented(method) {
	  return function () {
	    return console.log('vtkViewport::${method} - NOT IMPLEMENTED');
	  };
	}

	// ----------------------------------------------------------------------------
	// vtkViewport methods
	// ----------------------------------------------------------------------------

	function vtkViewport(publicAPI, model) {
	  // Set our className
	  model.classHierarchy.push('vtkViewport');

	  // Public API methods
	  publicAPI.getViewProps = function () {
	    return model.props;
	  };
	  publicAPI.hasViewProp = function (prop) {
	    return !!model.props.filter(function (item) {
	      return item === prop;
	    }).length;
	  };
	  publicAPI.addViewProp = function (prop) {
	    if (prop && !publicAPI.hasViewProp(prop)) {
	      model.props = model.props.concat(prop);
	    }
	  };

	  publicAPI.removeViewProp = function (prop) {
	    var newPropList = model.props.filter(function (item) {
	      return item === prop;
	    });
	    if (model.props.length !== newPropList.length) {
	      prop.releaseGraphicsResources(model.vtkWindow);
	      model.props = newPropList;
	    }
	  };

	  publicAPI.removeAllViewProps = function () {
	    model.props.forEach(function (prop) {
	      prop.releaseGraphicsResources(model.vtkWindow);
	    });
	    model.props = [];
	  };

	  publicAPI.addActor2D = publicAPI.addViewProp;
	  publicAPI.removeActor2D = function (prop) {
	    // VTK way: model.actors2D.RemoveItem(prop);
	    publicAPI.removeViewProp(prop);
	  };

	  publicAPI.getActor2D = function () {
	    model.actors2D = [];
	    model.props.forEach(function (prop) {
	      model.actors2D = model.actors2D.concat(prop.getActor2D());
	    });
	  };

	  publicAPI.displayToView = function () {
	    return console.error('call displayToView on your view instead');
	  };
	  publicAPI.viewToDisplay = function () {
	    return console.error('callviewtodisplay on your view instead');
	  };
	  publicAPI.getSize = function () {
	    return console.error('call getSize on your View instead');
	  };

	  publicAPI.normalizedDisplayToView = function (x, y, z) {
	    // first to normalized viewport
	    var nvp = publicAPI.normalizedDisplayToNormalizedViewport(x, y, z);

	    // then to view
	    return publicAPI.normalizedViewportToView(nvp[0], nvp[1], nvp[2]);
	  };

	  publicAPI.normalizedDisplayToNormalizedViewport = function (x, y, z) {
	    var scale = [model.viewport[2] - model.viewport[0], model.viewport[3] - model.viewport[1]];
	    return [(x - model.viewport[0]) / scale[0], (y - model.viewport[1]) / scale[1], z];
	  };

	  publicAPI.normalizedViewportToView = function (x, y, z) {
	    return [x * 2.0 - 1.0, y * 2.0 - 1.0, z * 2.0 - 1.0];
	  };

	  publicAPI.viewToNormalizedDisplay = function (x, y, z) {
	    // first to nvp
	    var nvp = publicAPI.viewToNormalizedViewport(x, y, z);

	    // then to ndp
	    return publicAPI.normalizedViewportToNormalizedDisplay(nvp[0], nvp[1], nvp[2]);
	  };

	  publicAPI.normalizedViewportToNormalizedDisplay = function (x, y, z) {
	    var scale = [model.viewport[2] - model.viewport[0], model.viewport[3] - model.viewport[1]];
	    return [(x - model.viewport[0]) / scale[0], (y - model.viewport[1]) / scale[1], z];
	  };

	  publicAPI.viewToNormalizedViewport = function (x, y, z) {
	    return [(x + 1.0) * 0.5, (y + 1.0) * 0.5, (z + 1.0) * 0.5];
	  };

	  publicAPI.ComputeAspect = notImplemented('ComputeAspect');
	  publicAPI.PickPropFrom = notImplemented('PickPropFrom');
	  publicAPI.GetTiledSize = notImplemented('GetTiledSize');
	  publicAPI.GetTiledSizeAndOrigin = notImplemented('GetTiledSizeAndOrigin');
	}

	// ----------------------------------------------------------------------------
	// Object factory
	// ----------------------------------------------------------------------------

	var DEFAULT_VALUES = {
	  vtkWindow: null,
	  background: [0, 0, 0],
	  background2: [0.2, 0.2, 0.2],
	  gradientBackground: false,
	  viewport: [0, 0, 1, 1],
	  aspect: [1, 1],
	  pixelAspect: [1, 1],
	  props: [],
	  actors2D: []
	};

	// ----------------------------------------------------------------------------

	function extend(publicAPI, model) {
	  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  Object.assign(model, DEFAULT_VALUES, initialValues);

	  // Build VTK API
	  macro.obj(publicAPI, model);
	  macro.event(publicAPI, model, 'event');

	  macro.setGetArray(publicAPI, model, ['viewport'], 4);

	  macro.setGetArray(publicAPI, model, ['background', 'background2'], 3);

	  vtkViewport(publicAPI, model);
	}

	// ----------------------------------------------------------------------------

	var newInstance = exports.newInstance = macro.newInstance(extend);

	// ----------------------------------------------------------------------------

	exports.default = { newInstance: newInstance, extend: extend };

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newInstance = exports.STATIC = exports.INIT_BOUNDS = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	exports.extend = extend;

	var _macro = __webpack_require__(2);

	var macro = _interopRequireWildcard(_macro);

	var _Plane = __webpack_require__(41);

	var _Plane2 = _interopRequireDefault(_Plane);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var INIT_BOUNDS = exports.INIT_BOUNDS = [Number.MAX_VALUE, Number.MIN_VALUE, // X
	Number.MAX_VALUE, Number.MIN_VALUE, // Y
	Number.MAX_VALUE, Number.MIN_VALUE];

	// ----------------------------------------------------------------------------
	// Global methods
	// ----------------------------------------------------------------------------

	// Z
	function isValid(bounds) {
	  return bounds[0] <= bounds[1] && bounds[2] <= bounds[3] && bounds[4] <= bounds[5];
	}

	function getCenter(bounds) {
	  return [0.5 * (bounds[0] + bounds[1]), 0.5 * (bounds[2] + bounds[3]), 0.5 * (bounds[4] + bounds[5])];
	}

	function getLength(bounds, index) {
	  return bounds[index * 2 + 1] - bounds[index * 2];
	}

	function getLengths(bounds) {
	  return [getLength(bounds, 0), getLength(bounds, 1), getLength(bounds, 2)];
	}

	function getXRange(bounds) {
	  return bounds.slice(0, 2);
	}

	function getYRange(bounds) {
	  return bounds.slice(2, 4);
	}

	function getZRange(bounds) {
	  return bounds.slice(4, 6);
	}

	function getMaxLength(bounds) {
	  var l = getLengths(bounds);
	  if (l[0] > l[1]) {
	    if (l[0] > l[2]) {
	      return l[0];
	    }
	    return l[2];
	  } else if (l[1] > l[2]) {
	    return l[1];
	  }
	  return l[2];
	}

	function getDiagonalLength(bounds) {
	  if (isValid(bounds)) {
	    var l = getLengths(bounds);
	    return Math.sqrt(l[0] * l[0] + l[1] * l[1] + l[2] * l[2]);
	  }
	  return null;
	}

	function oppositeSign(a, b) {
	  return a <= 0 && b >= 0 || a >= 0 && b <= 0;
	}

	// ----------------------------------------------------------------------------
	// Static API
	// ----------------------------------------------------------------------------

	var STATIC = exports.STATIC = {
	  isValid: isValid,
	  getCenter: getCenter,
	  getLength: getLength,
	  getLengths: getLengths,
	  getMaxLength: getMaxLength,
	  getDiagonalLength: getDiagonalLength,
	  getXRange: getXRange,
	  getYRange: getYRange,
	  getZRange: getZRange
	};

	// ----------------------------------------------------------------------------
	// vtkBoundingBox methods
	// ----------------------------------------------------------------------------

	function vtkBoundingBox(publicAPI, model) {
	  // Set our className
	  model.classHierarchy.push('vtkBoundingBox');

	  publicAPI.clone = function () {
	    var bounds = [].concat(model.bounds);
	    /* eslint-disable no-use-before-define */
	    return newInstance({ bounds: bounds });
	    /* eslint-enable no-use-before-define */
	  };

	  publicAPI.equals = function (other) {
	    var a = model.bounds;
	    var b = other.getBounds();
	    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
	  };

	  publicAPI.setMinPoint = function (x, y, z) {
	    var _model$bounds = _slicedToArray(model.bounds, 6);

	    var xMin = _model$bounds[0];
	    var xMax = _model$bounds[1];
	    var yMin = _model$bounds[2];
	    var yMax = _model$bounds[3];
	    var zMin = _model$bounds[4];
	    var zMax = _model$bounds[5];

	    model.bounds = [x, x > xMax ? x : xMax, y, y > yMax ? y : yMax, z, z > zMax ? z : zMax];

	    return xMin !== x || yMin !== y || zMin !== z;
	  };

	  publicAPI.setMaxPoint = function (x, y, z) {
	    var _model$bounds2 = _slicedToArray(model.bounds, 6);

	    var xMin = _model$bounds2[0];
	    var xMax = _model$bounds2[1];
	    var yMin = _model$bounds2[2];
	    var yMax = _model$bounds2[3];
	    var zMin = _model$bounds2[4];
	    var zMax = _model$bounds2[5];

	    model.bounds = [x < xMin ? x : xMin, x, y < yMin ? y : yMin, y, z < zMin ? z : zMin, z];

	    return xMax !== x || yMax !== y || zMax !== z;
	  };

	  publicAPI.addPoint = function () {
	    for (var _len = arguments.length, xyz = Array(_len), _key = 0; _key < _len; _key++) {
	      xyz[_key] = arguments[_key];
	    }

	    model.bounds = model.bounds.map(function (value, index) {
	      if (index % 2 === 0) {
	        var _idx = index / 2;
	        return value < xyz[_idx] ? value : xyz[_idx];
	      }
	      var idx = (index - 1) / 2;
	      return value > xyz[idx] ? value : xyz[idx];
	    });
	  };

	  publicAPI.addBounds = function (xMin, xMax, yMin, yMax, zMin, zMax) {
	    var _model$bounds3 = _slicedToArray(model.bounds, 6);

	    var _xMin = _model$bounds3[0];
	    var _xMax = _model$bounds3[1];
	    var _yMin = _model$bounds3[2];
	    var _yMax = _model$bounds3[3];
	    var _zMin = _model$bounds3[4];
	    var _zMax = _model$bounds3[5];

	    model.bounds = [Math.min(xMin, _xMin), Math.max(xMax, _xMax), Math.min(yMin, _yMin), Math.max(yMax, _yMax), Math.min(zMin, _zMin), Math.max(zMax, _zMax)];
	  };

	  publicAPI.addBox = function (other) {
	    publicAPI.addBounds.apply(publicAPI, _toConsumableArray(other.getBounds()));
	  };

	  publicAPI.isValid = function () {
	    return isValid(model.bounds);
	  };

	  publicAPI.intersect = function (bbox) {
	    if (!(publicAPI.isValid() && bbox.isValid())) {
	      return false;
	    }

	    var newBounds = [0, 0, 0, 0, 0, 0];
	    var bBounds = bbox.getBounds();
	    var intersects = void 0;
	    for (var i = 0; i < 3; i++) {
	      intersects = false;
	      if (bBounds[i * 2] >= model.bounds[i * 2] && bBounds[i * 2] <= model.bounds[i * 2 + 1]) {
	        intersects = true;
	        newBounds[i * 2] = bBounds[i * 2];
	      } else if (model.bounds[i * 2] >= bBounds[i * 2] && model.bounds[i * 2] <= bBounds[i * 2 + 1]) {
	        intersects = true;
	        newBounds[i * 2] = model.bounds[i * 2];
	      }

	      if (bBounds[i * 2 + 1] >= model.bounds[i * 2] && bBounds[i * 2 + 1] <= model.bounds[i * 2 + 1]) {
	        intersects = true;
	        newBounds[i * 2 + 1] = bbox.MaxPnt[i];
	      } else if (model.bounds[i * 2 + 1] >= bbox.MinPnt[i * 2] && model.bounds[i * 2 + 1] <= bbox.MaxPnt[i * 2 + 1]) {
	        intersects = true;
	        newBounds[i * 2 + 1] = model.bounds[i * 2 + 1];
	      }

	      if (!intersects) {
	        return false;
	      }
	    }

	    // OK they did intersect - set the box to be the result
	    model.bounds = newBounds;
	    return true;
	  };

	  publicAPI.intersects = function (bbox) {
	    if (!(publicAPI.isValid() && bbox.isValid())) {
	      return false;
	    }
	    var bBounds = bbox.getBounds();
	    for (var i = 0; i < 3; i++) {
	      if (bBounds[i * 2] >= model.bounds[i * 2] && bBounds[i * 2] <= model.bounds[i * 2 + 1]) {
	        continue;
	      } else if (model.bounds[i * 2] >= bBounds[i * 2] && model.bounds[i * 2] <= bBounds[i * 2 + 1]) {
	        continue;
	      }

	      if (bBounds[i * 2 + 1] >= model.bounds[i * 2] && bBounds[i * 2 + 1] <= model.bounds[i * 2 + 1]) {
	        continue;
	      } else if (model.bounds[i * 2 + 1] >= bbox.MinPnt[i * 2] && model.bounds[i * 2 + 1] <= bbox.MaxPnt[i * 2 + 1]) {
	        continue;
	      }
	      return false;
	    }

	    return true;
	  };

	  publicAPI.intersectPlane = function (origin, normal) {
	    // Index[0..2] represents the order of traversing the corners of a cube
	    // in (x,y,z), (y,x,z) and (z,x,y) ordering, respectively
	    var index = [[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 4, 5, 2, 3, 6, 7], [0, 2, 4, 6, 1, 3, 5, 7]];

	    // stores the signed distance to a plane
	    var d = [0, 0, 0, 0, 0, 0, 0, 0];
	    var idx = 0;
	    for (var ix = 0; ix < 2; ix++) {
	      for (var iy = 2; iy < 4; iy++) {
	        for (var iz = 4; iz < 6; iz++) {
	          var x = [model.bounds[ix], model.bounds[iy], model.bounds[iz]];
	          d[idx++] = _Plane2.default.evaluate(normal, origin, x);
	        }
	      }
	    }

	    var dir = 2;
	    while (dir--) {
	      // in each direction, we test if the vertices of two orthogonal faces
	      // are on either side of the plane
	      if (oppositeSign(d[index[dir][0]], d[index[dir][4]]) && oppositeSign(d[index[dir][1]], d[index[dir][5]]) && oppositeSign(d[index[dir][2]], d[index[dir][6]]) && oppositeSign(d[index[dir][3]], d[index[dir][7]])) {
	        break;
	      }
	    }

	    if (dir < 0) {
	      return false;
	    }

	    var sign = Math.sign(normal[dir]);
	    var size = Math.abs((model.bounds[dir * 2 + 1] - model.bounds[dir * 2]) * normal[dir]);
	    var t = sign > 0 ? 1 : 0;
	    for (var i = 0; i < 4; i++) {
	      if (size === 0) {
	        continue; // shouldn't happen
	      }
	      var ti = Math.abs(d[index[dir][i]]) / size;
	      if (sign > 0 && ti < t) {
	        t = ti;
	      }

	      if (sign < 0 && ti > t) {
	        t = ti;
	      }
	    }
	    var bound = (1.0 - t) * model.bounds[dir * 2] + t * model.bounds[dir * 2 + 1];

	    if (sign > 0) {
	      model.bounds[dir * 2] = bound;
	    } else {
	      model.bounds[dir * 2 + 1] = bound;
	    }

	    return true;
	  };

	  publicAPI.containsPoint = function (x, y, z) {
	    if (x < model.bounds[0] || x > model.bounds[1]) {
	      return false;
	    }

	    if (y < model.bounds[2] || y > model.bounds[3]) {
	      return false;
	    }

	    if (z < model.bounds[4] || z > model.bounds[5]) {
	      return false;
	    }

	    return true;
	  };

	  publicAPI.getMinPoint = function () {
	    return [model.bounds[0], model.bounds[2], model.bounds[4]];
	  };
	  publicAPI.getMaxPoint = function () {
	    return [model.bounds[1], model.bounds[3], model.bounds[5]];
	  };
	  publicAPI.getBound = function (index) {
	    return model.bound[index];
	  };

	  publicAPI.contains = function (bbox) {
	    // if either box is not valid or they don't intersect
	    if (!publicAPI.intersects(bbox)) {
	      return false;
	    }

	    if (!publicAPI.containsPoint.apply(publicAPI, _toConsumableArray(bbox.getMinPoint()))) {
	      return false;
	    }

	    if (!publicAPI.containsPoint.apply(publicAPI, _toConsumableArray(bbox.getMaxPoint()))) {
	      return 0;
	    }

	    return true;
	  };

	  publicAPI.getCenter = function () {
	    return getCenter(model.bounds);
	  };
	  publicAPI.getLength = function (index) {
	    return getLength(model.bounds, index);
	  };
	  publicAPI.getLengths = function () {
	    return getLengths(model.bounds);
	  };
	  publicAPI.getMaxLength = function () {
	    return getMaxLength(model.bounds);
	  };
	  publicAPI.getDiagonalLength = function () {
	    return getDiagonalLength(model.bounds);
	  };

	  publicAPI.reset = function () {
	    return publicAPI.setBounds([].concat(INIT_BOUNDS));
	  };

	  publicAPI.inflate = function (delta) {
	    model.bounds = model.bounds.map(function (value, index) {
	      if (index % 2 === 0) {
	        return value - delta;
	      }
	      return value + delta;
	    });
	  };

	  publicAPI.scale = function (sx, sy, sz) {
	    if (publicAPI.isValid()) {
	      var newBounds = [].concat(model.bounds);
	      if (sx >= 0.0) {
	        newBounds[0] *= sx;
	        newBounds[1] *= sx;
	      } else {
	        newBounds[0] = sx * model.bounds[1];
	        newBounds[1] = sx * model.bounds[0];
	      }

	      if (sy >= 0.0) {
	        newBounds[2] *= sy;
	        newBounds[3] *= sy;
	      } else {
	        newBounds[2] = sy * model.bounds[3];
	        newBounds[3] = sy * model.bounds[2];
	      }

	      if (sz >= 0.0) {
	        newBounds[4] *= sz;
	        newBounds[5] *= sz;
	      } else {
	        newBounds[4] = sz * model.bounds[5];
	        newBounds[5] = sz * model.bounds[4];
	      }

	      model.bounds = newBounds;
	      return true;
	    }
	    return false;
	  };
	}

	// ----------------------------------------------------------------------------
	// Object factory
	// ----------------------------------------------------------------------------

	var DEFAULT_VALUES = {
	  bounds: [].concat(INIT_BOUNDS)
	};

	// ----------------------------------------------------------------------------

	function extend(publicAPI, model) {
	  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  Object.assign(model, DEFAULT_VALUES, initialValues);

	  // Object methods
	  macro.obj(publicAPI, model);
	  macro.setGet(publicAPI, model, ['bounds']);
	  vtkBoundingBox(publicAPI, model);
	}

	// ----------------------------------------------------------------------------

	var newInstance = exports.newInstance = macro.newInstance(extend);

	// ----------------------------------------------------------------------------

	exports.default = Object.assign({ newInstance: newInstance, extend: extend }, STATIC);

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newInstance = exports.STATIC = undefined;
	exports.extend = extend;

	var _macro = __webpack_require__(2);

	var macro = _interopRequireWildcard(_macro);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// ----------------------------------------------------------------------------
	// Global methods
	// ----------------------------------------------------------------------------

	function evaluate(normal, origin, x) {
	  return normal[0] * (x[0] - origin[0]) + normal[1] * (x[1] - origin[1]) + normal[2] * (x[2] - origin[2]);
	}

	// ----------------------------------------------------------------------------
	// Static API
	// ----------------------------------------------------------------------------

	var STATIC = exports.STATIC = {
	  evaluate: evaluate
	};

	// ----------------------------------------------------------------------------
	// vtkPlane methods
	// ----------------------------------------------------------------------------

	function vtkPlane(publicAPI, model) {
	  // Set our className
	  model.classHierarchy.push('vtkPlane');
	}

	// ----------------------------------------------------------------------------
	// Object factory
	// ----------------------------------------------------------------------------

	var DEFAULT_VALUES = {};

	// ----------------------------------------------------------------------------

	function extend(publicAPI, model) {
	  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  Object.assign(model, DEFAULT_VALUES, initialValues);

	  // Object methods
	  macro.obj(publicAPI, model);
	  macro.setGet(publicAPI, model, ['bounds']);
	  vtkPlane(publicAPI, model);
	}

	// ----------------------------------------------------------------------------

	var newInstance = exports.newInstance = macro.newInstance(extend);

	// ----------------------------------------------------------------------------

	exports.default = Object.assign({ newInstance: newInstance, extend: extend }, STATIC);

/***/ }
/******/ ]);