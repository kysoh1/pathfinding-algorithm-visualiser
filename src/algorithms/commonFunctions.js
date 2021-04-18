export function get4NeighbourNodes(currNode, grid) {
    const neighbourNodes = [];
    const { row, column } = currNode;
    row > 0 && neighbourNodes.push(grid[row - 1][column]);
    column < grid[0].length - 1 && neighbourNodes.push(grid[row][column + 1]);
    row < grid.length - 1 && neighbourNodes.push(grid[row + 1][column]);
    column > 0 && neighbourNodes.push(grid[row][column - 1]);

    return neighbourNodes;
}

export function get8NeighbourNodes(currNode, grid) {
    const neighbourNodes = [];
    const { row, column } = currNode;
    row > 0 && neighbourNodes.push(grid[row - 1][column]);
    (row > 0 && column < grid[0].length - 1) && neighbourNodes.push(grid[row - 1][column + 1]);
    column < grid[0].length - 1 && neighbourNodes.push(grid[row][column + 1]);
    (row < grid.length - 1 && column < grid[0].length - 1) && neighbourNodes.push(grid[row + 1][column + 1]);
    row < grid.length - 1 && neighbourNodes.push(grid[row + 1][column]);
    (row < grid.length - 1 && column > 0) && neighbourNodes.push(grid[row + 1][column - 1]);
    column > 0 && neighbourNodes.push(grid[row][column - 1]);
    (row > 0 && column > 0) && neighbourNodes.push(grid[row - 1][column - 1]);

    return neighbourNodes;
}

export function getFinalPathNodes(finishNode) {
    const finalPathNodes = [];
    let node = finishNode;
    while (node !== null) {
        finalPathNodes.unshift(node);
        node = node.trackPrevNode;
    }

    return finalPathNodes;
}