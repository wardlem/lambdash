// Modules for Built-in Types
var Bool = require('./Bool');
var Num = require('./Num');
var Int = require('./Int');
var Str = require('./Str');
var Arr = require('./Arr');
var Obj = require('./Obj');
var Fun = require('./Fun');

// Type Classes
var Eq = require('./Eq');
var Bounded = require('./Bounded');
var Enum = require('./Enum');
var Ord = require('./Ord');
var Numeric = require('./Numeric');
var Functor = require('./Functor');
var Monad = require('./Monad');
var Show = require('./Show');

// Auxiliary types
var Ordering = require('./Ordering');

var Type = {
    product: require('./productType'),
    sum: require('./sumType'),
    enumerated: require('./enumeratedType'),
    module: require('./internal/_module'),
    subModule: require('./internal/_subModule'),
    moduleFor: require('./internal/_moduleFor')
};

var funkit = module.exports;

funkit.Bool = Bool;
funkit.Num = Num;
funkit.Int = Int;
funkit.Str = Str;
funkit.Arr = Arr;
funkit.Obj = Obj;
funkit.Fun = Fun;

funkit.Eq = Eq;
funkit.Bounded = Bounded;
funkit.Enum = Enum;
funkit.Ord = Ord;
funkit.Numeric = Numeric;
funkit.Functor = Functor;
funkit.Monad = Monad;
funkit.Show = Show;

