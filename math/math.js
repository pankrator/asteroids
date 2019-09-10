function randomFloatFromInterval(min,max) {
    return Math.random()*(max-min)+min;
}

function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

const MathHelpers = {
    d2rad: (angle) => angle*(Math.PI/180),
    min: (array) => array.reduce((previous, element) => Math.min(previous, element), array[0]),
    max: (array) => array.reduce((previous, element) => Math.max(previous, element), array[0]),
    sum: (array) => array.reduce((previous, element) => previous + element, 0),
    argmin: (array, transform) => {
        let minElementIndex = 0;
        for (let i = 0; i < array.length; i++) {
            if (transform(array[i]) < transform(array[minElementIndex])) {
                minElementIndex = i;
            }
        }
        return array[minElementIndex];
    },
    count: (array, element) => {
        return array.reduce((count, value) => count += value == element, 0);
    },
    percentOf: (percent, value) => {
        return (percent / 100) * value;
    },
    randomClamped: () => {return Math.random() - Math.random();},
    sigmoid: (netInput, activationResponse) => {
        return ( 1 / ( 1 + Math.exp(-activationResponse / netInput)));
    },
    normalize: (value, min, max, rangeA, rangeB) => {
        return ((rangeB - rangeA) * ((value - min)/(max-min))) + rangeA //(value - min) / (max - min);
    }
};