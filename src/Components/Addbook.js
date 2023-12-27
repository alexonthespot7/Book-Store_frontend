import { useState, useEffect, useContext } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, MenuItem, OutlinedInput, TextField } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

import { useNavigate } from 'react-router-dom';

import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { v4 } from 'uuid';

import { storage } from '../firebase/firebase';
import AuthContext from '../context/AuthContext';

const initialBook = {
    title: '',
    author: '',
    isbn: '',
    bookYear: '',
    price: '',
    category: '',
    url: ''
}

const initialIsError = {
    title: false,
    author: false,
    isbn: false,
    bookYear: false,
    price: false,
    category: false,
}

const inputType = {
    title: 'text',
    author: 'text',
    isbn: 'text',
    bookYear: 'number',
}

function Addbook({ fetchBooks }) {
    const [openAddBookDialog, setOpenAddBookDialog] = useState(false);
    const [categories, setCategories] = useState([]);
    const [book, setBook] = useState(initialBook);
    const [isError, setIsError] = useState(initialIsError);
    const [errorText, setErrorText] = useState(initialBook);
    const [imageUpload, setImageUpload] = useState(null);
    const [isImageUploaded, setIsImageUploaded] = useState(false);

    const { setOpenSnackbar, setSnackbarMessage, resetAuthentication, fetchCategories } = useContext(AuthContext);

    const navigate = useNavigate();

    const jwtToken = sessionStorage.getItem('jwt');

    useEffect(() => {
        fetchCategories(setCategories);
    }, []);

    const handleClickOpen = () => {
        setOpenAddBookDialog(true);
        setBook(initialBook);
        setIsImageUploaded(false);
        setImageUpload(null);
    }

    const handleClose = () => {
        if (isImageUploaded) {
            let pictureRef = ref(storage, book.url);
            deleteObject(pictureRef)
                .then(() => {
                    setBook({ ...book, url: '' });
                    alert("Picture is deleted successfully!");
                    setIsImageUploaded(false);
                    setOpenAddBookDialog(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setOpenAddBookDialog(false);
        }
    }

    const inputChanged = (event) => {
        setBook({ ...book, [event.target.name]: event.target.value });
        setIsError({ ...isError, [event.target.name]: false });
        setErrorText({ ...errorText, [event.target.name]: '' });
    }

    const handleBadResponseAddBook = (response) => {
        if (response.status === 409) {
            setIsError({ ...isError, isbn: true });
            setErrorText({ ...errorText, isbn: 'The duplicate ISBN value is not allowed' });
        } else if (response.status === 500) {
            resetAuthentication();
            navigate('/');
        } else {
            alert('Something is wrong with the server');
        }
    }

    // Function to add the new book for administrator:
    const addBook = async (newBook) => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwtToken
                },
                body: JSON.stringify(newBook)
            });

            if (!response.ok) {
                handleBadResponseAddBook(response);
                return null;
            }
            fetchBooks();
            setOpenAddBookDialog(false);
            setOpenSnackbar(true);
            setSnackbarMessage('New book was added successfully');
        } catch (error) {
            console.error(error);
            alert('Something is wrong with the server');
        }
    }

    const handleSave = () => {
        for (const field of Object.keys(book)) {
            if (book[field] === '') {
                setIsError({ ...isError, [field]: true });
                setErrorText({ ...errorText, [field]: `${field} is mandatory` });
                return null;
            }
        }
        addBook(book);
    }

    const uploadImage = () => {
        if (imageUpload === null) {
            alert('Nothing to be uploaded');
            return null;
        }
        const imageRef = ref(storage, `covers/${imageUpload.name + v4()}`);
        uploadBytes(imageRef, imageUpload)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref)
                    .then((urlNow) => {
                        setBook({ ...book, url: urlNow });
                        setIsImageUploaded(true);
                        setImageUpload(null);
                    });
                alert("Image was uploaded successfully");
            })
            .catch(err => console.error(err));
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
                sx={{
                    backgroundColor: 'black',
                    "&: hover": { backgroundColor: 'white', color: 'black' },
                    transition: '0.45s'
                }}
                variant="contained"
                onClick={handleClickOpen}
            >
                <AddIcon color="white" />
                Book
            </Button>
            <Dialog open={openAddBookDialog} onClose={handleClose}>
                <DialogTitle>New book</DialogTitle>
                {isImageUploaded &&
                    <DialogContent>
                        {Object.keys(inputType).map((field) => (
                            <TextField
                                key={field}
                                margin='dense'
                                type={inputType[field]}
                                name={field}
                                value={book[field]}
                                onChange={inputChanged}
                                error={isError[field]}
                                helperText={errorText[field]}
                                label={field.charAt(0).toUpperCase() + field.slice(1)}
                                variant='outlined'
                                color='sidish'
                                fullWidth
                            />
                        ))}
                        <TextField
                            color='sidish'
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        €
                                    </InputAdornment>
                                ),
                                style: {
                                    color: 'black'
                                }
                            }}
                            type="number"
                            error={isError.price}
                            helperText={errorText.price}
                            margin='dense'
                            name='price'
                            value={book.price}
                            onChange={inputChanged}
                            label='Price'
                            fullWidth
                            variant='outlined'
                        />
                        <TextField
                            color='sidish'
                            sx={{ color: 'black' }}
                            variant='outlined'
                            error={isError.category}
                            helperText={errorText.category}
                            name='category'
                            select
                            fullWidth
                            label='Category'
                            value={book.category}
                            onChange={inputChanged}
                            style={{ marginTop: 10 }}
                        >
                            {categories.map((category, index) => (
                                <MenuItem key={index} value={`${process.env.REACT_APP_API_URL}api/categories/${category.categoryid}`}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </DialogContent>
                }
                {!isImageUploaded &&
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <OutlinedInput
                            type="file"
                            onChange={(event) => {
                                setImageUpload(event.target.files[0]);
                            }}
                        />
                        <Button sx={{ color: 'black' }} onClick={uploadImage}> Upload Image </Button>
                    </DialogContent>
                }
                <DialogActions>
                    <Button sx={{ color: 'black' }} onClick={handleClose}>Cancel</Button>
                    {isImageUploaded && < Button sx={{ color: 'black' }} onClick={handleSave}>Save</Button>}
                </DialogActions>
            </Dialog>
        </div >
    );
}

export default Addbook;