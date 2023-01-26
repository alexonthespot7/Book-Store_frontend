import React from 'react';

export default function TodoTable(props) {
    return (
        <div>
            <table id="todotable">
                <tbody>
                    {
                        props.todos.map((todo, index) => 
                        <tr key={index}>
                            <td>{todo.date}</td>
                            <td>{todo.description}</td>
                        </tr>)
                    }
                </tbody>
            </table>
        </div>
    )
}