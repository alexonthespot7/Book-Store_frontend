import { useState, useEffect, useContext } from 'react';

import { CircularProgress, Typography } from '@mui/material';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';

import '../App.css'

import AuthContext from "../context/AuthContext";
import EditCategory from './EditCategory';
import AddCategory from './AddCategory';

function CategoriesAdmin() {
    const [categories, setCategories] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);

    const { setOpenSnackbar, setSnackbarMessage, dialogueWidth, setBgrColor, resetAuthentication, fetchCategories } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleData = (data) => {
        setCategories(data);
        setDataLoaded(true);
    }

    useEffect(() => {
        fetchCategories(handleData);
        setBgrColor('#FFFAFA');
    }, []);

    const updateCategory = async (updatedCategory, link) => {
        const token = sessionStorage.getItem('jwt');
        try {
            const response = await fetch(link, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(updatedCategory)
            });
            if (!response.ok) {
                if (response.status === 500) {
                    resetAuthentication();
                    navigate('/');
                } else {
                    alert('Something is wrong with the server');
                }
            }
            fetchCategories(handleData);
            setOpenSnackbar(true);
            setSnackbarMessage('The category was updated');
        } catch (error) {
            alert('Something is wrong with the server');
        }
    }

    const linkGetter = (params) => {
        return `${process.env.REACT_APP_API_URL}api/categories/${params.data.categoryid}`;
    }

    const columns = [
        { field: 'name', sortable: true, filter: true, cellStyle: { 'text-align': 'left' } },
        {
            headerName: '',
            width: '100%',
            valueGetter: linkGetter,
            cellRenderer: params => <EditCategory params={params} updateCategory={updateCategory} />
        }
    ];

    return (
        <motion.div
            className="ag-theme-alpine"
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 15,
                height: 617,
                width: dialogueWidth,
                margin: 'auto',
                marginTop: 10,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Typography color='#424242' variant="h5">Genres</Typography>
            {dataLoaded &&
                <AgGridReact
                    columnDefs={columns}
                    rowData={categories}
                    pagination={true}
                    paginationPageSize={10}
                    suppressCellFocus={true}
                    animateRows="true"
                />
            }
            {!dataLoaded && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '25vh' }}><CircularProgress color="inherit" /></div>}
            <div style={{ display: 'flex', justifyContent: 'end', marginRight: 15 }}>
                <AddCategory handleData={handleData} />
            </div>
        </motion.div>
    );
}

export default CategoriesAdmin;