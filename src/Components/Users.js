import { useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';

import { Button, CircularProgress, InputAdornment, TextField, Typography } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';

import AuthContext from '../context/AuthContext';
import EditRoleAndVerification from './EditRoleAndVerification';


function Users() {
    const [users, setUsers] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);

    const navigate = useNavigate();

    const { setOpenSnackbar, setSnackbarMessage, setBgrColor, getCurrentDateFormatted } = useContext(AuthContext);

    const gridRef = useRef();

    const fetchUsers = async () => {
        const token = sessionStorage.getItem('jwt');
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'users',
                {
                    method: 'GET',
                    headers: { 'Authorization': token }
                });
            if (!response.ok) {
                navigate('/');
                return null;
            }
            await response.json()
                .then(data => {
                    if (!data) {
                        setOpenSnackbar(true);
                        setSnackbarMessage('Something went wrong. Please try again');
                        return null;
                    }
                    setUsers(data);
                    setDataLoaded(true);
                })
                .catch(err => console.error(err));
        } catch (error) {
            console.error(error);
            navigate('/');
        }
    }

    useEffect(() => {
        fetchUsers();
        setBgrColor('#FFFAFA');
    }, []);

    const updateRole = (updatedRoleAndVerification, link) => {
        console.log(updatedRoleAndVerification);
        const token = sessionStorage.getItem('jwt');
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(updatedRoleAndVerification)
        })
            .then(response => {
                if (response.ok) {
                    fetchUsers()
                    setOpenSnackbar(true);
                    setSnackbarMessage('User info was updated successfully');
                } else {
                    alert('Something went wrong during the user role update');
                }
            })
            .catch(err => console.error(err))
    }

    const linkGetter = (params) => {
        return `${process.env.REACT_APP_API_URL}verifyandchangerole/${params.data.id}`;
    }

    const columns = [
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
            headerName: '',
            valueGetter: linkGetter,
            cellRenderer: params => {
                if (sessionStorage.getItem('authorizedId') != params.data.id) {
                    return (
                        <EditRoleAndVerification params={params} updateRole={updateRole} />
                    )
                }
            },
        }
    ];

    const defaultColDef = useMemo(() => {
        return {
            width: 140,
            filter: 'agTextColumnFilter',
            resizable: true,
            sortable: true,
            cellStyle: { 'textAlign': 'left' }
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

    const exportParams = {
        columnKeys: ['firstname', 'lastname', 'username', 'email', 'country', 'city', 'street', 'postcode'],
        fileName: `users_${getCurrentDateFormatted()}`
    }

    const onBtnExport = useCallback(() => {
        gridRef.current.api.exportDataAsCsv(exportParams);
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
                width: '90%',
                margin: 'auto',
                marginTop: 10,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Typography color='#424242' variant="h5">Users</Typography>
            <div style={{ display: 'flex', gap: 10 }}>
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
                <Button onClick={onBtnExport} variant="text" color="sidish">Export</Button>
            </div>
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
            {!dataLoaded && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20vh' }}><CircularProgress color="inherit" /></div>}
        </motion.div>
    )
}

export default Users;