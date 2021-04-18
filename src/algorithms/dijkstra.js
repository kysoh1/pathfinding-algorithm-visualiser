/* Implementation of Dijkstra's pathfinding algorithm using a priority queue */
import MinHeap from '../dataStructures/minHeap';

export function dijkstra(grid, startNode, finishNode, weightValue, getNeighbourNodes) {
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

            updateNeighbourNodes(unvisitedNodes, nextNode, grid, weightValue, getNeighbourNodes);
        }
    }

    return visitedNodes;
}

function updateNeighbourNodes(unvisitedNodes, currNode, grid, weightValue, getNeighbourNodes) {
    const neighbourNodes = getNeighbourNodes(currNode, grid, getNeighbourNodes);
    //Exclude visited nodes
    const filteredNeighbourNodes = neighbourNodes.filter(node => !node.visitedNode);
    
    filteredNeighbourNodes.forEach(node => {
        if (Math.abs(node.row - currNode.row) === 1 && Math.abs(node.column - currNode.column) === 1) {
            node.distance = currNode.distance + Math.sqrt(2);
        } else {
            node.distance = currNode.distance + 1;
        }
        
        node.trackPrevNode = currNode;
        node.visitedNode = true;

        if (node.weightNode) {
            unvisitedNodes.enqueue(node, node.distance + weightValue);
        } else {
            unvisitedNodes.enqueue(node, node.distance);
        }
    });
}