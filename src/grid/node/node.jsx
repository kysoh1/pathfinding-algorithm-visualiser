/* Node component, each node is represented as a grid cell */

import React from 'react';
import './node.css';

export default class Node extends React.Component {
    render() {
        const { row, column, startNode, finishNode, wallNode, weightNode, onMouseDown, onMouseEnter, onMouseOut, onMouseUp } = this.props;
        const nodeId = `node${row}-${column}`;
        const nodeType = startNode ? 'startNode' : finishNode ? 'finishNode' : wallNode ? 'wallNode' : weightNode ? 'weightNode' : '';

        return (
            <div 
                id={nodeId} 
                className={`Node ${nodeType}`} 
                onMouseDown={(event) => onMouseDown(event, row, column)}
                onMouseEnter={() => onMouseEnter(row, column)} 
                onMouseOut={() => onMouseOut(row, column)} 
                onMouseUp={(event) => onMouseUp(event)}
                onContextMenu={(event) => onMouseDown(event, row, column)}>
            </div>
        );
    }
}