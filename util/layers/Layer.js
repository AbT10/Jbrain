/* Defining The Layers Of The Network
 * 
 * Provides An Interface For Creating Every Type Of Neural Network
 * Like (Fully Connected, Convolutional, Convolutional With Pooling,
 *       Reccurent, LSTM etc.)
 * And Also Provides An Easy And Fast Way To Perform ML Tasks
 * 
 */

const { Ndarray, math, core } = require('vecto'),
    activ = require('../activ'), { weighted_input } = require('../net_util');

class Layer {
    constructor(config, activationFunction, input) {
        if (config.constructor.name === 'Object') constructLayer(this, config);
        else connectedProps(this, { shape: config, activationFunction: activationFunction, input: input });
    }

    // Calculates activation for this layer
    fire() {
        let z = weighted_input(this.weights.array, this.input.array, this.biases.array),
            a = this.activationFunction(z);
        this.activation.resize(core.calc_shape(a));
        this.activation.arrange(a);
        this.z = z;
        this.activ_ = this.activationFunction.dash(z);
    }
}

function set_activation(afunc) {
    switch (afunc) {
        case 'sigmoid':
            return activ.sigmoid;

        case 'softmax':
            return activ.softmax;

        case 'relu':
            return activ.relu;

        case 'tanh':
            return activ.tanh;

        default:
            return null;
    }
}

function initialize(layer) {
    if (layer.initializer === 'xavier') {
        if (layer.actvation === 'relu') factor = 2;
        else factor = 1;
        layer.weights.fill('custom', () => (Math.random() * Math.pow((factor / layer.weights.shape[1]), 0.5)));
    } else layer.weights.fill('linear');
}

function convProps(layer, config) {
    // layer.message = 'Not Yet Implemented';
    layer.type = 'convLayer';
    layer.name = config.name || 'convLayer';
    layer.activationFunction = set_activation(config.activationFunction) || set_activation('tanh');
    layer.input = config.input.activation;
    layer.kernel = config.kernel;
    layer.filters = config.filters || 1;
    layer.inputLayer = config.input;
    layer.padding = config.padding || 0;
    layer.stride = config.stride || 1;
}

function poolProps(layer, config) {
    layer.message = 'Not Yet Implemented';
}

function convPoolProps(layer, config) {
    layer.message = 'Not Yet Implemented';
}

function connectedProps(layer, config) {
    layer.type = 'connected';
    layer.name = config.name || 'connectedLayer';
    layer.activationFunction = set_activation(config.activationFunction) || set_activation('tanh');
    config.shape = calc_layer_shape(config);
    layer.weights = new Ndarray(config.shape, 'float32');
    layer.biases = Ndarray.zeroes([config.shape[0], 1], 'float32');
    layer.input = config.input.activation;
    layer.inputLayer = config.input;
    layer.batch_norm = config.batch_norm;
    layer.dropout = config.dropout;
    layer.activation = new Ndarray([config.shape[0], null], 'float32', 'zeros');
    initialize(layer);
}

function calc_layer_shape(config) {
    if (config.shape[config.shape.length - 1] === config.input.activation.shape[0]) return config.shape;
    config.shape[config.shape.length - 1] = config.input.activation.shape[0];
    return config.shape;
}

function inputLayer(layer, config) {
    layer.type = 'input';
    layer.shape = config.shape;
    layer.feature_scaling = config.feature_scaling;
    layer.mean_norm = config.mean_norm;
    layer.activation = new Ndarray(config.shape, 'float32', 'zeros');
}


function constructLayer(layer, config) {
    if (config.type === 'input') inputLayer(layer, config);
    else if (config.type === 'conv') convProps(layer, config);
    else if (config.type === 'pool') poolProps(layer, config);
    else if (config.type === 'conv2pool') convPoolProps(layer, config);
    else if (config.type === 'connected') connectedProps(layer, config);
}

module.exports = Layer;