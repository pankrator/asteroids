let n = new Neat({
    inputNodesCount: 3,
    outputNodesCount: 3,
    size: 5,
});

function mutateNetwork() {
    n.genome[0].linkMutate();
}

console.log(n);