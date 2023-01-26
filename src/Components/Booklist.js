import React, { useState, useEffect, useCallback, useRef, useMemo, useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

import useMediaQuery from '../Hooks/useMediaQuery';

import AuthContext from '../context/AuthContext';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import Addbook from './Addbook';
import Editbook from './Editbook';
import '../App.css';
import { useSearchParams } from 'react-router-dom';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Booklist() {
    const [books, setBooks] = useState([]);
    const [bookDeleted, setBookDeleted] = useState(false);
    const [bookAdded, setBookAdded] = useState(false);
    const [bookEdited, setBookEdited] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams({});

    const { setSignupMessage, setSignupSuccess, setActionReset, actionReset, typeReset, msgReset } = useContext(AuthContext);

    const gridRef = useRef();

    const fetchBooks = () => {
        fetch(process.env.REACT_APP_API_URL + 'books')
            .then(response => response.json())
            .then(data => setBooks(data))
            .catch(err => console.error(err));
    }

    const checkToken = (token) => {
        const tokenInfo = { 'token': token };
        fetch(process.env.REACT_APP_API_URL + 'verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tokenInfo)
        })
            .then(response => {
                if (response.ok) {
                    setSignupSuccess(true);
                    setSignupMessage('Your account was successfully verified. You can login now!')
                } else {
                    setSignupSuccess(true);
                    setSignupMessage('Verification code is incorrect or you are already verified');
                }
            })
            .catch(err => console.error(err))
    }

    useEffect(() => {
        fetchBooks();
        if (searchParams.get('token')) {
            checkToken(searchParams.get('token'));
        }
    }, []);

    const matchesAdmin = useMediaQuery("(min-width: 1199px)");

    const gridWidthAdmin = matchesAdmin ? '1079px' : '94%';

    const matches = useMediaQuery("(min-width: 966px)");

    const gridWidth = matches ? '869px' : '94%';

    const currentWidth = sessionStorage.getItem('role') === 'ADMIN' ? gridWidthAdmin : gridWidth;

    const deleteBook = (link) => {
        if (window.confirm('Do you want to delete this book?')) {
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
                        fetchBooks();
                        setBookDeleted(true);
                    }
                })
                .catch(err => console.error(err))
        }
    }

    const addBook = (newBook) => {
        const token = sessionStorage.getItem('jwt');
        fetch(process.env.REACT_APP_API_URL + 'api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(newBook)
        })
            .then(response => {
                if (response.ok) {
                    fetchBooks();
                    setBookAdded(true);
                } else {
                    alert('Something went wrong during adding the book');
                }
            })
            .catch(err => console.error(err));
    }

    const updateBook = (updatedBook, link) => {
        const token = sessionStorage.getItem('jwt');
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(updatedBook)
        })
            .then(response => {
                if (response.ok) {
                    fetchBooks();
                    setBookEdited(true);
                } else {
                    alert('Something went wrong during the book update');
                }
            })
            .catch(err => console.error(err))
    }

    const linkGetter = (params) => {
        return `${process.env.REACT_APP_API_URL}api/books/${params.data.id}`;
    }

    const onBtnExport = useCallback(() => {
        gridRef.current.api.exportDataAsCsv();
    }, []);

    const currencyFormatter = (currency, sign) => {
        let sansDec = currency.toFixed(2);
        let formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return sign + `${formatted}`;
    }

    const [columns, setColumns] = useState([
        { field: 'title' },
        { field: 'author' },
        { headerName: 'ISBN', field: 'isbn' },
        { headerName: 'Year', field: 'bookYear', type: 'numberColumn' },
        {
            headerName: "Price",
            type: 'numberColumn',
            field: "price",
            valueFormatter: params => currencyFormatter(params.data.price, "€"),
            filterParams: {
                suppressAndOrCondition: true,
            },
            cellStyle: { fontWeight: 'bold', color: 'green', fontSize: 'medium' }
        },
        { headerName: 'Category', field: 'category.name' },
        {
            hide: sessionStorage.getItem('role') !== "ADMIN",
            type: 'special',
            headerName: '',
            width: '100%',
            valueGetter: linkGetter,
            cellRenderer: params => <Editbook params={params} updateBook={updateBook} />
        },
        {
            hide: sessionStorage.getItem('role') !== "ADMIN",
            type: 'special',
            headerName: '',
            valueGetter: linkGetter,
            width: '100%',
            cellRenderer: params =>
                <IconButton onClick={() => deleteBook(params.value)}>
                    <DeleteIcon style={{ color: 'red' }} />
                </IconButton>
        }
    ]);

    const defaultColDef = useMemo(() => {
        return {
            width: 150,
            filter: 'agTextColumnFilter',
            resizable: true,
            sortable: true,
            cellStyle: { 'text-align': 'left' }
        };
    }, []);

    const columnTypes = useMemo(() => {
        return {
            numberColumn: { width: 130, filter: 'agNumberColumnFilter' },
            special: { width: '100%', floatingFilter: false, resizable: false, filter: false }
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
            height: 447,
            width: currentWidth, //make media query later
            margin: 'auto',
            marginTop: 10,
        }}>
            <div style={{ display: 'flex', flexDirection: 'row', marginBottom: -10 }}>
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
                <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 15, marginLeft: 15, marginRight: 15 }}>
                    {sessionStorage.getItem('role') === 'ADMIN' && <Addbook addBook={addBook} />}
                    <Button variant="text" onClick={onBtnExport}>Export</Button>
                </div>

            </div>


            <AgGridReact
                ref={gridRef}
                columnDefs={columns}
                rowData={books}
                defaultColDef={defaultColDef}
                columnTypes={columnTypes}
                pagination={true}
                paginationPageSize={7}
                suppressCellFocus={true}
                animateRows={true}
                cacheQuickFilter={true}
            />
            <Snackbar
                open={bookDeleted}
                autoHideDuration={3000}
                onClose={() => setBookDeleted(false)}
                message='Book was deleted successfully'
            />
            <Snackbar open={bookAdded} autoHideDuration={3000} onClose={() => setBookAdded(false)}>
                <Alert onClose={() => setBookAdded(false)} severity="success" sx={{ width: '100%' }}>
                    New book was added successfully!
                </Alert>
            </Snackbar>
            <Snackbar open={bookEdited} autoHideDuration={3000} onClose={() => setBookEdited(false)}>
                <Alert onClose={() => setBookEdited(false)} severity="success" sx={{ width: '100%' }}>
                    Book info was updated successfully!
                </Alert>
            </Snackbar>
            <Snackbar open={actionReset} autoHideDuration={3000} onClose={() => setActionReset(false)}>
                <Alert onClose={() => setActionReset(false)} severity={typeReset} sx={{ width: '100%' }}>
                    {msgReset}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Booklist;