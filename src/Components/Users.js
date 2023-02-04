import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';

import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import MuiAlert from '@mui/material/Alert';

import SearchIcon from '@mui/icons-material/Search';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import useMediaQuery from '../Hooks/useMediaQuery';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import Editrole from './Editrole';
import { CircularProgress, Snackbar } from '@mui/material';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Users() {
    const [users, setUsers] = useState([]);
    const [userEdited, setUserEdited] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);

    const { setBgrColor } = useContext(AuthContext);

    const gridRef = useRef();

    const matches = useMediaQuery("(min-width: 908px)");

    const gridWidth = matches ? '818px' : '90%';


    useEffect(() => {
        fetchUsers();
        setBgrColor('#FFFAFA');
    }, []);

    const fetchUsers = () => {
        const token = sessionStorage.getItem('jwt');

        fetch(process.env.REACT_APP_API_URL + 'users',
            {
                method: 'GET',
                headers: { 'Authorization': token }
            })
            .then(response => response.json())
            .then(data => {
                setUsers(data);
                setDataLoaded(true);
            })
            .catch(err => console.error(err));
    }

    const updateRole = (updatedRole, link) => {
        const token = sessionStorage.getItem('jwt');
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(updatedRole)
        })
            .then(response => {
                if (response.ok) {
                    fetchUsers()
                    setUserEdited(true);
                } else {
                    alert('Something went wrong during the user role update');
                }
            })
            .catch(err => console.error(err))
    }

    const linkGetter = (params) => {
        return `${process.env.REACT_APP_API_URL}changerole/${params.data.id}`;
    }

    const [columns, setColumns] = useState([
        { field: 'firstname' },
        { field: 'lastname' },
        { field: 'username' },
        { field: 'role', type: 'narrow' },
        { field: 'email' },
        { headerName: 'Verified?', field: 'accountVerified', type: 'narrow' },
        { field: 'country' },
        { field: 'city' },
        { field: 'street' },
        { field: 'postcode' },
        {
            headerName: 'Change Role',
            valueGetter: linkGetter,
            cellRenderer: params => {
                if (sessionStorage.getItem('authorizedId') != params.data.id) {
                    return (
                        <Editrole params={params} updateRole={updateRole} />
                    )
                }
            },
        }
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
            narrow: { width: 120 }
        }
    }, []);

    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setQuickFilter(
            document.getElementById('filter-text-box').value
        );
    }, []);

    return (
        <motion.div
            className="ag-theme-alpine"
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 15,
                height: 617,
                width: gridWidth,
                margin: 'auto',
                marginTop: 10,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
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
            {dataLoaded &&
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
            }
            {!dataLoaded && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 77, marginBottom: 77 }}><CircularProgress color="inherit" /></div>}
            <Snackbar open={userEdited} autoHideDuration={3000} onClose={() => setUserEdited(false)}>
                <Alert onClose={() => setUserEdited(false)} severity="sidish" sx={{ width: '100%' }}>
                    User info was updated successfully!
                </Alert>
            </Snackbar>
        </motion.div>
    )
}

export default Users;