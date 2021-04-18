/* Implementation of A * Search pathfinding algorithm using a priority queue */
import MinHeap from '../dataStructures/minHeap';

export function aStarSearch(grid, startNode, finishNode, weightValue, heuristicFunc, getNeighbourNodes) {
    const visitedNodes = [];
    const unvisitedNodes = new MinHeap();
    //Set distance of start node
    startNode.distance = 0;
    startNode.visitedNode = true;
    
    //Search from start node
    unvisitedNodes.enqueue(startNode, startNode.distance);
    //Loop until the whole grid is searched or 
    //trapped inside a wall
    while (!unvisitedNodes.isEmpty()) {
        let nextNode = unvisitedNodes.dequeue();

        //Move around wall objects
        if (!nextNode.wallNode) {
            visitedNodes.push(nextNode);
            //Reached target node
            if (nextNode.row === finishNode.row && nextNode.column === finishNode.column) {
                return visitedNodes;
            }

            updateNeighbourNodes(unvisitedNodes, nextNode, startNode, finishNode, grid, weightValue, heuristicFunc, getNeighbourNodes);
        }
    }

    return visitedNodes;
}


function updateNeighbourNodes(unvisitedNodes, currNode, startNode, finishNode, grid, weightValue, heuristicFunc, getNeighbourNodes) {
    const neighbourNodes = getNeighbourNodes(currNode, grid);
    let duplicatesSet = {};
    //Exclude visited nodes
    const filteredNeighbourNodes = neighbourNodes.filter(node => !node.visitedNode);
    filteredNeighbourNodes.forEach(node => {
        if (Math.abs(node.row - currNode.row) === 1 && Math.abs(node.column - currNode.column) === 1) {
            node.distance = currNode.distance + Math.sqrt(2);
        } else {
            node.distance = currNode.distance + 1;
        }

        node.trackPrevNode = currNode;
        node.visitedNode = true
        //Count duplicate heuristic values for tiebreaker
        let hValue = node.distance + heuristicFunc(node, finishNode);
        if (duplicatesSet.hasOwnProperty(hValue))
            duplicatesSet[hValue] = duplicatesSet[hValue] + 1;
        else {
            duplicatesSet[hValue] = 1;
        }
    }); 

    filteredNeighbourNodes.forEach(node => {
        let hValue = node.distance + heuristicFunc(node, finishNode);
        //Apply tiebreaker to duplicate nodes with same heuristic values
        if (node.weightNode && duplicatesSet[hValue] > 1) {
            unvisitedNodes.enqueue(node, node.distance + heuristicFunc(node, finishNode) + calcTiebreaker(currNode, startNode, finishNode) + weightValue);
        } else if (node.weightNode) {
            unvisitedNodes.enqueue(node, node.distance + heuristicFunc(node, finishNode) + weightValue);
        } else if (duplicatesSet[hValue] > 1) {
            unvisitedNodes.enqueue(node, node.distance + heuristicFunc(node, finishNode) + calcTiebreaker(currNode, startNode, finishNode));
        } else {
            unvisitedNodes.enqueue(node, node.distance + heuristicFunc(node, finishNode));
        }
    }); 
}

function calcTiebreaker(currNode, startNode, finishNode) {
    //Calculate cross product
    const dx1 = currNode.row - finishNode.row;
    const dy1 = currNode.column - finishNode.column;
    const dx2 = startNode.row - currNode.row;
    const dy2 = startNode.column - currNode.column;
    
    return Math.abs(dx1 * dy2 - dx2 * dy1) * 0.0001;
}

export function calcManhattanDistance(currNode, finishNode) {
    const deltaX = Math.abs(currNode.row - finishNode.row);
    const deltaY = Math.abs(currNode.column - finishNode.column);

    return  2 * (deltaX + deltaY);
}

export function calcEuclideanDistance(currNode, finishNode) {
    const deltaX = Math.abs(currNode.row - finishNode.row);
    const deltaY = Math.abs(currNode.column - finishNode.column);

    return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
}