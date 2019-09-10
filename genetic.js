const ELITISM = 5;
const MUTATION_RATE = 0.1;
const MUTATION_AMOUNT = 0.1;
const BEST_BREED_PERCENT = 0.02;
let GeneticAlgorithm = function (populationSize, numberOfWeights) {
    this.generationCounter = 0;
    this.populationSize = populationSize;
    this.individuals = [];
    this.numberOfWeights = numberOfWeights;
}

GeneticAlgorithm.prototype.generateRandomPopulation = function () {
    for (let i = 0; i < this.populationSize; i++) {
        this.individuals.push(new Genome());
        for (let j = 0; j < this.numberOfWeights; j++) {
            this.individuals[i].weights.push(MathHelpers.randomClamped());
        }
    }
}

GeneticAlgorithm.prototype.updateFitness = function (scores) {
    for (let i = 0; i < this.populationSize; i++) {
        this.individuals[i].fitness = scores[i];
    }
}

GeneticAlgorithm.prototype.getIndividuals = function () {
    return this.individuals;
}

GeneticAlgorithm.prototype.getRandomIndividual = function () {
    const halfPopulation = Math.floor(this.populationSize / 2);
    const which = Math.floor(Math.random() * halfPopulation);
    return this.individuals[which];
}

GeneticAlgorithm.prototype.getRandomBest = function () {
    const breedPopulation = Math.floor(BEST_BREED_PERCENT * this.populationSize);
    const which = Math.floor(Math.random() * breedPopulation);
    return this.individuals[which];
}

GeneticAlgorithm.prototype.mutate = function (genome) {
    genome.weights.forEach((weight, index) => {
        if (Math.random() < MUTATION_RATE) {
            genome.weights[index] += (MathHelpers.randomClamped() * MUTATION_AMOUNT);
        }
    });
}

GeneticAlgorithm.prototype.crossover = function (mum, dad) {
    if (mum == dad) {
        return [mum, dad];
    }

    let baby1 = new Genome();
    let baby2 = new Genome();
    let cp = Math.floor(Math.random() * this.numberOfWeights - 1);
    for (let i = 0; i < cp; i++) {
        baby1.weights.push(mum.weights[i]);
        baby2.weights.push(dad.weights[i]);
    }
    for (let i = cp; i < mum.weights.length; i++) {
        baby1.weights.push(dad.weights[i]);
        baby2.weights.push(mum.weights[i]);
    }

    return [baby1, baby2];
}

GeneticAlgorithm.prototype.nextGeneration = function () {
    this.generationCounter++;

    let newIndividuals = [];
    this.individuals.sort((a, b) => {
        if (a.fitness > b.fitness) {
            return -1;
        }
        if (a.fitness < b.fitness) {
            return 1;
        }
        return 0;
    });

    for (let i = 0; i < ELITISM; i++) {
        newIndividuals.push(this.individuals[i]);
    }
    while (newIndividuals.length < this.populationSize) {
        let [mum, dad] = [this.getRandomBest(), this.getRandomBest()];

        let babies = [mum.clone(), dad.clone()];
        this.mutate[babies[0]];
        this.mutate[babies[1]];
        newIndividuals.push(babies[0]);
        newIndividuals.push(babies[1]);
    }
    this.individuals = newIndividuals;
    for (let i = 0; i < this.populationSize; i++) {
        this.individuals[i].fitness = 0;
    }
}

let Genome = function () {
    this.weights = [];
    this.fitness = 0;
}

Genome.prototype.clone = function() {
    let newGenome = new Genome();
    newGenome.fitness = this.fitness;
    for (let i = 0; i < this.weights.length; i++) {
        newGenome.weights.push(this.weights[i]);
    }
    return newGenome;
}