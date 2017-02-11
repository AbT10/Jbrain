/* JBrain : The Brain of Jason , your SEO agent.
 * A neural network implementation in Javascript.
 *
 *
 * Project Name : JBrain
 * Project Code Name : JSimpl
 * Version : 0.0.1
 * Author : Anubhav Tiwari <atworkstudios@gmail.com>
 *
 */

import Vector from '../helper/Ndime';

/* define a network with net_config representing each layer with the number of 
 * neurons in them : net_config is an array, the length of the array determines the 
 * number of layers and each ith element of net_config defines the number of neurons
 * in the ith layer.
 */
class Network{
	constructor(net_config){
		this.net_config = net_config;
		this.lyrs_count = this.net_config.length;
		this.weights = [];
		this.biases = [];
		this.Z = [];
		for(var i=1; i<this.lyrs_count; i++){
			this.weights.push(new lyr(this.net_config[i],this.net_config[i-1]));
			this.biases.push(new lyr(this.net_config[i]));
		}
	}
	
	/* fit : method to optimise weights and biases by passing in the training_Data */

	fit(train_features, train_labels, neta=0.5, epoch=400, m=10, cost=cross_entropy){
		this.input = train_features;
		this.labels = train_labels;
		this.activations = [];
		/* for each input we find the activations and store them in an array */
		this.input.forEach((i)=>{this.activations.push(this.feed_forward(i));});
		this.SGD(neta,epoch,m,cost);
	}

	/* feed_forward : method to calculate the activations for each neuron of each layer
	 * by the sigmoid activation function and returning the activation for each layer for 
	 * each neuron for a given input data.
	 */

	feed_forward(input){
		var activation = [],z=[];
		activation.push(input);
		for(var i=this.net_config.length-1; i>=1; i--){
			var part_act = [],z_min = [];
			for(var j=0; j<this.net_config[i]; j++){
				part_act.push(sigmoid_function(z_min[j] = weighted_input(this.weights[i],activation[i-1],this.biases[i],j)));
			}
			activation.push(part_act);
			z.push(z_min);
		}
		this.Z.push(z);
		return activation;
	}

	/* SGD (Stochastic Gradient Descent): performs optimisation of weights by calculating the delta w and delta b
	 * by the backpropagation method.
	 */

	SGD(neta,epoch,m,cost){   
		while(epoch > 0){
			var i = Math.round(Math.random()*(this.input.length-1));
			var j = 0 ;
			while(j<m){
				var delW_B = this.backprop(i++);
				if(i>=this.input.length){
					i =0;
				}
				var delw = delW_B[0], delb = delW_B[1];


			}
		}
		
	}

	backprop(ip_num){
		var nw = [],nb = []; 
        for(var i=1; i<this.lyrs_count; i++){
			nw.push(Vector.zeroes(this.weights[i].shape));
			nb.push(Vector.zeroes(this.biases[i].shape));
		}	

		/* calculating the error in the output layer */
		var del = [];
		var opdel = cost_grad(this.activations[ip_num][this.lyrs_count-1],this.labels[ip_num]).prod(sigma_dash(this.Z[ip_num][this.lyrs_count-1]));
		del.push(opdel);

		/* backpropagating */
		for(var i = this.lyrs_count.length-2; i>=1; i--){
			var err = product(this.weights[i].prod(del[i+1]),sigma_dash(this.Z[ip_num][i]));
			del.unshift(err);
		}

		/* getting the grad w wrt c i.e., del w/del c */
		var ndelw = [],ndelb=[]; /* tis confusion */
		for(var i=1; i<this.lyrs_count; i++){
			/* -----------------------------------------------------------------------------------  */
		}

		

	}

}

/* defines each layer's weight and biases, if two parameters are provided weights are
 * returned else biases.
 */
function lyr(neuron_count,ip_wts,fill_style=1){
	var v;
	if(!ip_wts){
		if(fill_style = 1){
			v = new Vector([neuron_count]);
			v.array = Vector.fill(neuron_count);
		}
		else{
			v = Vector.zeroes([neuron_count]);
		}
	}
	else{
		if(fill_style = 1){
			v = new Vector([neuron_count,ip_wts]);
			v.arrange();
		}
		else{
			v = Vector.zeroes([neuron_count,ip_wts]);
		}
	}
	return v;
}
	

/* sigmoid_function : performs the sigmoid activation function */

function sigmoid_function(z){
	return (1/1+(Math.exp(-z)));
}

/* weighted_input : calculates sigma(w*x) + b */

function weighted_input(w,x,b,j){
	return (sum(product(w.array[j],x))+b.array[j]);
}

/* cost_grad : returns gradC wrt activ */

function cost_grad(a,y){
	var gradC = new Vector([this.net_config[this.lyrs_count-1]]);
	for(var i=0; i<y.length; i++){
		y[i] = -y[i];
	}
	gradC.array = sum(a.array,y);
	return gradC;
}

/* sigma_dash : returns the sigma' for calculating the errors. */

function sigma_dash(z){
	return (sigmoid_function(z)*(1-(sigmoid_function(z))));
}