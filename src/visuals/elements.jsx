/* This file handles most animations and visual components
 * including navigation side bars. */

import React from 'react';
import { get4NeighbourNodes, get8NeighbourNodes, getFinalPathNodes } from '../algorithms/commonFunctions';
import { dijkstra } from '../algorithms/dijkstra';
import { aStarSearch, calcManhattanDistance, calcEuclideanDistance } from '../algorithms/aStarSearch';
import { breadthFirstSearch } from '../algorithms/breadthFirstSearch';
import { depthFirstSearch } from '../algorithms/depthFirstSearch';
import './navbar.css';
import './features.css';

export class Elements extends React.Component {
    constructor() {
        super();
        this.state = {
            algorithm: 'dijkstra',
            heuristicFunc: 'manhattan',
            connectivity: '4-connected',
            animationSpeedFactor: 50,
            weightValue: 10,
            clickVisualise: true,
            clickClearBoard: true
        };

        this.handleSpeedChange = this.handleSpeedChange.bind(this);
        this.handleWeightChange = this.handleWeightChange.bind(this);
    }

    handleAlgorithm(event, algorithm, id, heuristicFunc) {
        if (event.target.id !== 'dropMenuButton' && !(event.target.id).includes('astar-checkbox')) {
            if (document.getElementById('heuristicsList').classList.contains('show')) {
                document.getElementById('heuristicsList').classList.remove('show');
            }
        }

        this.setState({ algorithm: algorithm });
        if (id && heuristicFunc) {
            this.setState({ heuristicFunc: heuristicFunc });
            for(let i = 0; i < 2; i++) {
                document.getElementById(`astar-checkbox-${i}`).checked = false;
            }
    
            document.getElementById(id).checked = true;
        }

    }

    /* Node checkbox toggle */
    handleNodeCheckboxes(id) {
        for(let i = 0; i < 2; i++) {
            document.getElementById(`node-checkbox-${i}`).checked = false;
        }

        document.getElementById(id).checked = true;
    }
    /* Animation speed */
    handleSpeedChange(event) {
        this.setState({ animationSpeedFactor: event.target.value });
    }
    /* Weight value */
    handleWeightChange(event) {
        this.setState({ weightValue: event.target.value });
    }

    /* Animates nodes that have been visited
     * Animates shortest route after animating all visited nodes in order */
    visualiseAlgorithm(visitedNodes, finalPathNodes) {
        const { animationSpeedFactor } = this.state;
        for (let i = 0; i < visitedNodes.length; i++) {
            if (i < visitedNodes.length - 1) {
                setTimeout(() => {
                    const currNode = visitedNodes[i];
                    const newClassName = document.getElementById(`node${currNode.row}-${currNode.column}`).className + ' visitedNode';
                    document.getElementById(`node${currNode.row}-${currNode.column}`).className = newClassName;
                }, 500 * i / animationSpeedFactor);
            } else if (i === visitedNodes.length - 1) {
                setTimeout(() => {
                    const currNode = visitedNodes[i];
                    document.getElementById(`node${currNode.row}-${currNode.column}`).className =
                    'Node finishNode visitedNode';
                }, 500 * i / animationSpeedFactor);

                setTimeout(() => {
                    for (let i = 0; i < finalPathNodes.length; i++) {
                        setTimeout(() => {
                            const currNode = finalPathNodes[i];
                            if (i > 0 && i < finalPathNodes.length - 1) {
                                const newClassName = document.getElementById(`node${currNode.row}-${currNode.column}`).className + ' finalPathNode';
                                document.getElementById(`node${currNode.row}-${currNode.column}`).className = newClassName;
                            }
                        }, 50 * i);
                    }
                    
                    this.props.disableNodePlacement(false);
                    this.setState({ clickVisualise: true });
                    this.setState({ clickClearBoard: true });
                }, 500 * i / animationSpeedFactor);
            }
        }
    } 

    /* Series of function calls to execute the path finding algorithm then animating it */
    executePathfinder() {
        //Can't visualise during an already occurring visualisation
        if (this.state.clickVisualise) {
            const { grid, startXY, finishXY } = this.props;
            const { algorithm, heuristicFunc, connectivity, weightValue } = this.state;
            this.setState({ clickVisualise: false })
            this.setState({ clickClearBoard: false })
            //Clear grid
            this.props.resetGrid(true);
            const startNode = grid[startXY[0]][startXY[1]];
            const finishNode = grid[finishXY[0]][finishXY[1]];
            let visitedNodes, finalPathNodes;
            let getNeighbourNodes = get4NeighbourNodes;
            connectivity === '8-connected' && (getNeighbourNodes = get8NeighbourNodes);

            switch(algorithm) {
                case 'dijkstra':
                    visitedNodes = dijkstra(grid, startNode, finishNode, weightValue, getNeighbourNodes);
                    finalPathNodes = getFinalPathNodes(finishNode);
                    break;
                case `astar`:
                    if (heuristicFunc === 'manhattan') {
                        visitedNodes = aStarSearch(grid, startNode, finishNode, weightValue, calcManhattanDistance, getNeighbourNodes);
                        finalPathNodes = getFinalPathNodes(finishNode);
                    } else if (heuristicFunc === 'euclidean') {
                        visitedNodes = aStarSearch(grid, startNode, finishNode, weightValue, calcEuclideanDistance, getNeighbourNodes);
                        finalPathNodes = getFinalPathNodes(finishNode);
                    }

                    break;    
                case 'bfs':
                    visitedNodes = breadthFirstSearch(grid, startNode, finishNode, getNeighbourNodes);
                    finalPathNodes = getFinalPathNodes(finishNode);
                    break;
                case 'dfs':
                    visitedNodes = depthFirstSearch(grid, startNode, finishNode, getNeighbourNodes);
                    finalPathNodes = getFinalPathNodes(finishNode);
                    break;
                default:
                    //Never reaches default case
            }

            this.visualiseAlgorithm(visitedNodes, finalPathNodes);
        }
    } 

    render() {
        //Create options for different heuristic functions
        const aStarCheckboxItems = ['manhattan', 'euclidean'];
        const aStarCheckboxes = aStarCheckboxItems.map((item, i) => {
            return <>
                <div className='dropMenuDivider'></div>
                <label>
                    <input type='checkbox' className='aStarCheckbox' defaultChecked={this.state.heuristicFunc === item ? true : false} id={`astar-checkbox-${i}`} onChange={(event) => { this.handleAlgorithm(event, 'astar', `astar-checkbox-${i}`, item); }}/>
                    <span>{item.charAt(0).toUpperCase() + item.slice(1)}</span>
                </label>
            </>
        })

        //Create options for getting 4 or 8 neighbour nodes
        const neighbourNodeItems = ['4-connected', '8-connected'];
        const neighbourNodeCheckboxes = neighbourNodeItems.map((item, i) => {
            return <>
                <li className='info'>
                    <input type='checkbox' className='nodeCheckbox' defaultChecked={this.state.connectivity === item ? true : false} id={`node-checkbox-${i}`} onChange={(event) => { 
                        this.handleNodeCheckboxes(`node-checkbox-${i}`); 
                        this.setState({ connectivity: item }); }}/>
                    <span>{item.charAt(0).toUpperCase() + item.slice(1)}</span>
                </li>
            </>
        })

        return (
            <>
                <div className='topBar'>
                    <h1 className='topTitle'>Visualisation Tool for Pathfinding Algorithms</h1>
                    <div className='topDivider'></div>
                    <div>
                        <button className='button topButton'>Help</button>
                        <div className='dropIcon'></div>
                    </div>
                    <div className='topDivider'></div>
                    <button className='button topButton' onClick={() => { 
                        this.props.disableNodePlacement(true); 
                        this.executePathfinder(); }}>
                        Visualise!
                    </button>
                    <div className='topDivider'></div>
                    <button className='button topButton' onClick={() => { this.state.clickClearBoard && this.props.resetGrid(false); }}>
                        Clear Board
                    </button>
                    <div className='topDivider'></div>
                    <h2 className='button rangeLabel'>Speed</h2>
                    <input className='rangeBar' type='range' min='1' max='100' 
                        value={this.state.animationSpeedFactor} 
                        onChange={this.handleSpeedChange} />
                    <div className='topDivider'></div>
                    <h2 className='button rangeLabel'>Weight</h2>
                    <input className='rangeBar' type='range' min='1' max='100' 
                        value={this.state.weightValue} 
                        onChange={this.handleWeightChange} />
                    <div className='topDivider'></div>    
                </div>
                <div className='sideBar'>
                    <h1 className='sideTitle'>Select an algorithm</h1>
                    <div className='sideDivider'></div>
                    <button className='button sideButton' onClick={(event) => { this.handleAlgorithm(event, 'dijkstra'); }}>Dijkstra</button>
                    <div className='sideDivider'></div>
                    <div className='dropMenu'>
                        <button className='button sideButton' id='dropMenuButton' onClick={(event) => { 
                            this.handleAlgorithm(event, 'astar');
                            document.getElementById('heuristicsList').classList.toggle('show'); }}>
                            A * Search
                        </button>
                        <div className='dropMenuContent' id='heuristicsList'>
                            {aStarCheckboxes}
                        </div>
                    </div>
                    <div className='sideDivider'></div>
                    <button className='button sideButton' onClick={(event) => { this.handleAlgorithm(event, 'bfs');}}>Breadth First Search</button>
                    <div className='sideDivider'></div>
                    <button className='button sideButton' onClick={(event) => { this.handleAlgorithm(event, 'dfs'); }}>Depth First Search</button>
                </div>
                <div className='infoBar'>
                    <h1 className='infoHeader'>Features</h1>
                    <div className='infoDivider'></div>    
                    <ul>
                        <li className='info'>
                            <div className='icon startIcon'></div>
                            Start node
                        </li>
                        <li className='info'>
                            <div className='icon finishIcon'></div>
                            Finish node
                        </li>
                    </ul>
                    <ul>
                        <li className='info'>
                            <div className='wallIcon'></div>
                            Wall node
                        </li>
                        <li className='info'>
                            <div className='icon weightIcon'></div>
                            Weight node
                        </li>
                    </ul>
                    <ul>
                        <li className='info'>
                            <div className='visitedIcon'></div>
                            Visited node
                        </li>
                        <li className='info'>
                            <div className='finalPathIcon'></div>
                            Shortest path node
                        </li>
                    </ul>
                    <div className='infoDivider'></div>
                    <ul>
                        {neighbourNodeCheckboxes}
                    </ul>
                    <div className='infoDivider'></div>
                </div>
            </>
        );
    }
}