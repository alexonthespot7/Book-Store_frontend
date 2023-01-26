import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';

import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';


import SearchIcon from '@mui/icons-material/Search';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import useMediaQuery from '../Hooks/useMediaQuery';


function Users() {
    const [users, setUsers] = useState([]);

    const gridRef = useRef();

    const matches = useMediaQuery("(min-width: 908px)");

    const gridWidth = matches ? '818px' : '90%';

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        const token = sessionStorage.getItem('jwt');

        fetch(process.env.REACT_APP_API_URL + 'users',
            {
                method: 'GET',
                headers: { 'Authorization': token }
            })
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(err => console.error(err))
    }

    const [columns, setColumns] = useState([
        { field: 'firstname' },
        { field: 'lastname' },
        { field: 'username' },
        { field: 'role', type: 'narrow' },
        { field: 'email' },
        { headerName: 'Verified?', field: 'accountVerified', type: 'narrow' }
    ]);

    const defaultColDef = useMemo(() => {
        return {
            width: 140,
            filter: 'agTextColumnFilter',
            resizable: true,
            sortable: true,
            cellStyle: { 'text-align': 'left' }
        };
    }, []);

    const columnTypes = useMemo(() => {
        return {
            narrow: { width: 120, filter: 'agNumberColumnFilter' }
        }
    }, []);

    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setQuickFilter(
            document.getElementById('filter-text-box').value
        );
    }, []);

    return (
        <div className="ag-theme-alpine" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 15,
            height: 617,
            width: gridWidth,
            margin: 'auto',
            marginTop: 10,
        }}>
            <Typography color='#424242' variant="h5">Users</Typography>
            <TextField
                type='search'
                fullWidth={false}
                size='small'
                id="filter-text-box"
                placeholder="Search..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                variant="standard"
                onChange={onFilterTextBoxChanged}
            />
            <AgGridReact
                ref={gridRef}

                defaultColDef={defaultColDef}
                columnTypes={columnTypes}
                columnDefs={columns}
                rowData={users}
                pagination={true}
                paginationPageSize={10}
                suppressCellFocus={true}
                animateRows="true"
            />
        </div>
    )
}

export default Users;