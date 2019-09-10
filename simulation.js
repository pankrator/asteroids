
let Simulation = function() {
    this.showAll = false;
    this.populationSize = 500;
    this.galaxies = [];
    for (let i = 0; i < this.populationSize; i++) {
        let ship = new Ship();
        this.galaxies.push(new Galaxy(ship));
    }
    this.geneticAlgo = new GeneticAlgorithm(this.populationSize, this.galaxies[0].ship.brain.getNumberOfWeights());
    this.geneticAlgo.generateRandomPopulation();
    for (let i = 0; i < this.populationSize; i++) {
        this.galaxies[i].ship.brain.updateWeights(this.geneticAlgo.individuals[i].weights);
    }
}

Simulation.prototype.run = function() {
    let bestGalaxyIndex = -1;
    let bestScore = Number.NEGATIVE_INFINITY;
    let aliveGalaxies = 0;
    for (let i = 0; i < this.galaxies.length; i++) {
        if (!this.galaxies[i].stopped) {
            aliveGalaxies++;
            this.galaxies[i].update();
            if (this.galaxies[i].ship.score > bestScore) {
                bestScore = this.galaxies[i].ship.score;
                bestGalaxyIndex = i;
            }
            if (this.showAll && shouldShow) {
                this.galaxies[i].show();
            }
        }
    }
    if (!this.showAll && shouldShow) {
        if (bestGalaxyIndex == -1) {
            this.galaxies[0].show();
        } else {
            if (!this.galaxies[bestGalaxyIndex].stopped) {
                this.galaxies[bestGalaxyIndex].show();
            }
        }
    }
    document.getElementById("generation").innerHTML = this.geneticAlgo.generationCounter;
    document.getElementById("aliveGalaxies").innerHTML = aliveGalaxies;
    document.getElementById("weights").innerHTML = "";
    if (bestGalaxyIndex != -1) {
        let weights = this.galaxies[bestGalaxyIndex].ship.brain.getWeights();
        for (let i = 0; i < weights.length; i++) {
            document.getElementById("weights").innerHTML += weights[i] + ",";
            if (i % 7 == 0) {
                document.getElementById("weights").innerHTML += "</br>";
            }
        }
    }
    if (aliveGalaxies == 0) {
        this.geneticAlgo.updateFitness(this.galaxies.map((galaxy) => { return galaxy.ship.score; }));
        this.geneticAlgo.nextGeneration();
        for (let i = 0; i < this.populationSize; i++) {
            let ship = new Ship();
            ship.brain.updateWeights(this.geneticAlgo.individuals[i].weights);
            delete(this.galaxies[i]);
            this.galaxies[i] = new Galaxy(ship);
        }
    }

}