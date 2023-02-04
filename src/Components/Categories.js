import React, { useState, useEffect, useContext } from 'react';
import { AgGridReact } from 'ag-grid-react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import AuthContext from "../context/AuthContext";

import { AnimatePresence, motion } from 'framer-motion';

import '../App.css'

import Editcategory from './Editcategory';
import Addcategory from './Addcategory';
import { CircularProgress } from '@mui/material';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Categories() {
    const [categories, setCategories] = useState([]);
    const [categoryDeleted, setCategoryDeleted] = useState(false);
    const [categoryAdded, setCategoryAdded] = useState(false);
    const [categoryEdited, setCategoryEdited] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);

    const { dialogueWidth, setBgrColor } = useContext(AuthContext);

    useEffect(() => {
        fetchCategories();
        setBgrColor('#FFFAFA');
    }, []);

    const fetchCategories = () => {
        fetch(process.env.REACT_APP_API_URL + 'categories')
            .then(response => response.json())
            .then(data => {
                setCategories(data);
                setDataLoaded(true);
            })
            .catch(err => console.error(err))
    }

    /**const deleteCategory = (link) => {
        if (window.confirm('Do you want to delete this category?')) {
            const token = sessionStorage.getItem('jwt');
            fetch(link,
                {
                    method: 'DELETE',
                    headers: { 'Authorization': token }
                }
            )
                .then(response => {
                    if (!response.ok) {
                        alert('Something went wrong in deletion');
                    }
                    else {
                        fetchCategories();
                        setCategoryDeleted(true);
                    }
                })
                .catch(err => console.error(err))
        }
    }*/

    const addCategory = (newCategory) => {
        const token = sessionStorage.getItem('jwt');
        fetch(process.env.REACT_APP_API_URL + 'api/categories', {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(newCategory)
        })
            .then(response => {
                if (response.ok) {
                    fetchCategories();
                    setCategoryAdded(true);
                } else {
                    alert('Something went wrong during adding new category');
                }
            })
            .catch(err => console.error(err));
    }

    const updateCategory = (updatedCategory, link) => {
        const token = sessionStorage.getItem('jwt');
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(updatedCategory)
        })
            .then(response => {
                if (response.ok) {
                    fetchCategories();
                    setCategoryEdited(true);
                } else {
                    alert('Something went wrong during the category update');
                }
            })
            .catch(err => console.error(err))
    }

    const linkGetter = (params) => {
        return `${process.env.REACT_APP_API_URL}api/categories/${params.data.categoryid}`;
    }

    const [columns, setColumns] = useState([
        { field: 'name', sortable: true, filter: true, cellStyle: { 'text-align': 'left' } },
        {
            headerName: '',
            width: '100%',
            valueGetter: linkGetter,
            cellRenderer: params => <Editcategory params={params} updateCategory={updateCategory} />
        },
        /**{
            headerName: '',
            valueGetter: linkGetter,
            width: '100%',
            cellRenderer: params =>
                <IconButton onClick={() => deleteCategory(params.value)}>
                    <DeleteIcon color='sidish' />
                </IconButton>
        }*/
    ]);

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
            {!dataLoaded && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 77, marginBottom: 77 }}><CircularProgress color="inherit" /></div>}
            <div style={{ display: 'flex', justifyContent: 'end', marginRight: 15 }}>
                <Addcategory addCategory={addCategory} />
            </div>
            <Snackbar
                open={categoryDeleted}
                autoHideDuration={3000}
                onClose={() => setCategoryDeleted(false)}
                message='Category was deleted successfully'
            />
            <Snackbar open={categoryAdded} autoHideDuration={3000} onClose={() => setCategoryAdded(false)}>
                <Alert onClose={() => setCategoryAdded(false)} severity="sidish" sx={{ width: '100%' }}>
                    New category was added successfully!
                </Alert>
            </Snackbar>
            <Snackbar open={categoryEdited} autoHideDuration={3000} onClose={() => setCategoryEdited(false)}>
                <Alert onClose={() => setCategoryEdited(false)} severity="sidish" sx={{ width: '100%' }}>
                    Category info was updated successfully!
                </Alert>
            </Snackbar>
        </motion.div>
    )
}

export default Categories;