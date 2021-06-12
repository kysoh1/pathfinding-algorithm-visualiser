/* This file handles most animations and visual components
 * including navigation side bars. */

import React from 'react';
import { get4NeighbourNodes, get8NeighbourNodes, getFinalPathNodes } from '../algorithms/commonFunctions';
import { dijkstra } from '../algorithms/dijkstra';
import { aStarSearch, calcManhattanDistance, calcEuclideanDistance } from '../algorithms/aStarSearch';
import { breadthFirstSearch } from '../algorithms/breadthFirstSearch';
import { depthFirstSearch } from '../algorithms/depthFirstSearch';
import './features.css';
import './navigation.css'

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

    handleAlgorithm(event, algorithm) {
        this.setState({ algorithm: algorithm });
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
            const { algorithm, connectivity, weightValue } = this.state;
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
                case 'astar-euclidean':
                    visitedNodes = aStarSearch(grid, startNode, finishNode, weightValue, calcEuclideanDistance, getNeighbourNodes);
                    finalPathNodes = getFinalPathNodes(finishNode);
                    break;
                case 'astar-manhattan':
                    visitedNodes = aStarSearch(grid, startNode, finishNode, weightValue, calcManhattanDistance, getNeighbourNodes);
                    finalPathNodes = getFinalPathNodes(finishNode);
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
        //Create options for getting 4 or 8 neighbour nodes
        const neighbourNodeItems = ['4-connected', '8-connected'];
        const neighbourNodeCheckboxes = neighbourNodeItems.map((item, i) => {
            return <>
                <div className='nodeInfo'>
                    <input type='checkbox' className='nodeCheckbox' defaultChecked={this.state.connectivity === item ? true : false} id={`node-checkbox-${i}`} onChange={(event) => { 
                        this.handleNodeCheckboxes(`node-checkbox-${i}`); 
                        this.setState({ connectivity: item }); }}/>
                    <a href='#checkbox'>{item.charAt(0).toUpperCase() + item.slice(1)}</a>
                </div>
            </>
        })

        return (
            <div>
                <div className='navBar'>
                    <a href='#title'>Visualise Pathfinding</a>
                    <a href='#help'>Help</a>
                    <div className='dropDown'>
                        <button className='dropBtn'>Algorithm
                            <i className='down arrow'></i>
                        </button>
                        <div className='dropDownContent'>
                            <a href='#dijkstra' onClick={(event) => { this.handleAlgorithm(event, 'dijkstra'); }}>Dijkstra</a>
                            <a href='#aStarE' onClick={(event) => { this.handleAlgorithm(event, 'astar-euclidean'); }}>A* (Euclidean)</a>
                            <a href='#aStarM' onClick={(event) => { this.handleAlgorithm(event, 'astar-manhattan'); }}>A* (Manhattan)</a>
                            <a href='#bfs' onClick={(event) => { this.handleAlgorithm(event, 'bfs');}}>Breadth First Search</a>
                            <a href='#dfs' onClick={(event) => { this.handleAlgorithm(event, 'dfs'); }}>Depth First Search</a>
                        </div>
                    </div>
                    <a href='#visualion' onClick={() => { 
                        this.props.disableNodePlacement(true); 
                        this.executePathfinder(); }}>
                        Begin Search
                    </a>
                    <a href='#clear' onClick={() => { this.state.clickClearBoard && this.props.resetGrid(false); }}>
                        Clear Board
                    </a>
                    <div className='dropDown'>
                        <a href='#speed'>
                            Speed
                            <i className='right arrow'></i>
                        </a>
                        <input className='rangeBar' type='range' min='1' max='100' 
                            value={this.state.animationSpeedFactor} 
                            onChange={this.handleSpeedChange} /> 
                    </div>
                    <div className='dropDown'>
                        <a href='#weight'>
                            Weight
                            <i className='right arrow'></i>
                        </a>
                        <input className='rangeBar' type='range' min='1' max='100' 
                            value={this.state.weightValue} 
                            onChange={this.handleWeightChange} />
                    </div>
                </div>
                <div className='features'>
                    <a href='#features'>Features</a>
                    <div className='divider'></div>    
                    <div className='infoSegment'>
                        <div className='nodeInfo'>
                            <i className='icon startIcon'></i>
                            <a href='start'>Start node</a>
                        </div>
                        <div className='nodeInfo'>
                            <i className='icon finishIcon'></i>
                            <a href='finish'>Finish node</a>
                        </div>
                    </div>
                    <div className='infoSegment'>
                        <div className='nodeInfo'>
                            <i className='wallIcon'></i>
                            <a href='wall'>Wall node</a>
                        </div>
                        <div className='nodeInfo'>
                            <i className='icon weightIcon'></i>
                            <a href='weight'>Weight node</a>
                        </div>
                    </div>
                    <div className='infoSegment'>
                        <div className='nodeInfo'>
                            <i className='visitedIcon'></i>
                            <a href='wall'>Visited node</a>
                        </div>
                        <div className='nodeInfo'>
                            <i className='finalPathIcon'></i>
                            <a href='weight'>Shortest path node</a>
                        </div>
                    </div>
                    <div className='infoDivider'></div>
                    <div className='infoSegment'>
                        {neighbourNodeCheckboxes}
                    </div>
                </div>
            </div>
        );
    }
}