export function depthFirstSearch(grid, startNode, finishNode, getNeighbourNodes) {
    const visitedNodes = [];
    const unvisitedNodes = [];
    //Set distance of start node
    startNode.distance = 0;
    //Search from start node
    unvisitedNodes.push(startNode);
    //Loop until the whole grid is searched or 
    //trapped inside a wall
    while (unvisitedNodes.length) {
        let nextNode = unvisitedNodes.pop();
        nextNode.visitedNode = true;
        //Move around wall objects
        if (!nextNode.wallNode) {
            visitedNodes.push(nextNode);
            //Reached target node
            if (nextNode.row === finishNode.row && nextNode.column === finishNode.column) {
                return visitedNodes;
            }

            updateNeighbourNodes(unvisitedNodes, nextNode, grid, getNeighbourNodes);
        }
    }

    return visitedNodes;
}

function updateNeighbourNodes(unvisitedNodes, currNode, grid, getNeighbourNodes) {
    const neighbourNodes = getNeighbourNodes(currNode, grid, getNeighbourNodes);
    //Exclude visited nodes
    const filteredNeighbourNodes = neighbourNodes.filter(node => !node.visitedNode);
    filteredNeighbourNodes.forEach(node => {
        //Remove and re-add duplicate nodes to upper positions of the stack
        if (unvisitedNodes.includes(node)) {
            const index = unvisitedNodes.indexOf(node);
            unvisitedNodes.splice(index, 1);
        }

        if (Math.abs(node.row - currNode.row) === 1 && Math.abs(node.column - currNode.column) === 1) {
            node.distance = currNode.distance + Math.sqrt(2);
        } else {
            node.distance = currNode.distance + 1;
        }
        
        node.trackPrevNode = currNode;
        unvisitedNodes.push(node);
    });
}