import { useState, useEffect, useInsertionEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';

import { storage } from '../firebase/firebase';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';


function Addbook({ addBook }) {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [titleErr, setTitleErr] = useState(false);
    const [titleHelper, setTitleHelper] = useState('');
    const [authorErr, setAuthorErr] = useState(false);
    const [authorHelper, setAuthorHelper] = useState('');
    const [isbnErr, setIsbnErr] = useState(false);
    const [isbnHelper, setIsbnHelper] = useState('');
    const [yearErr, setYearErr] = useState(false);
    const [yearHelper, setYearHelper] = useState('');
    const [priceErr, setPriceErr] = useState(false);
    const [priceHelper, setPriceHelper] = useState('');
    const [categoryErr, setCategoryErr] = useState(false);
    const [categoryHelper, setCategoryHelper] = useState('');

    const [book, setBook] = useState({
        title: '',
        author: '',
        isbn: '',
        bookYear: '',
        price: '',
        category: '',
        url: ''
    });
    const [imageUpload, setImageUpload] = useState(null);
    const [imgUploaded, setImageUploaded] = useState(false);

    const uploadImage = () => {
        if (imageUpload === null) {
            alert('Nothing to be uploaded');
        }
        const imageRef = ref(storage, `covers/${imageUpload.name + v4()}`);
        uploadBytes(imageRef, imageUpload)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref)
                    .then((urlNow) => {
                        setBook({ ...book, url: urlNow });
                        setImageUploaded(true);
                        setImageUpload(null);
                    });
                alert("Image was uploaded successfully");
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        fetch(process.env.REACT_APP_API_URL + 'categories')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err))
    }

    const handleClickOpen = () => {
        setOpen(true);
        setBook({
            title: '',
            author: '',
            isbn: '',
            bookYear: '',
            price: '',
            category: '',
            url: ''
        });
        setImageUploaded(false);
        setTitleErr(false);
        setTitleHelper('');
        setAuthorErr(false);
        setAuthorHelper('');
        setIsbnErr(false);
        setIsbnHelper('');
        setYearErr(false);
        setYearHelper('');
        setPriceErr(false);
        setPriceHelper('');
        setCategoryErr(false);
        setCategoryHelper('');
    }

    const handleClose = () => {
        if (imgUploaded) {
            let pictureRef = ref(storage, book.url);
            deleteObject(pictureRef)
                .then(() => {
                    setBook({ ...book, url: '' });
                    alert("Picture is deleted successfully!");
                    setImageUploaded(false);
                    setOpen(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setOpen(false);
        }
    }

    const inputChanged = (event) => {
        setBook({ ...book, [event.target.name]: event.target.value });
        if (event.target.name === 'title') {
            setTitleErr(false);
            setTitleHelper('');
        } else if (event.target.name === 'author') {
            setAuthorErr(false);
            setAuthorHelper('');
        } else if (event.target.name === 'isbn') {
            setIsbnErr(false);
            setIsbnHelper('');
        } else if (event.target.name === 'bookYear') {
            setYearErr(false);
            setYearHelper('');
        } else if (event.target.name === 'price') {
            setPriceErr(false);
            setPriceHelper('');
        } else {
            setCategoryErr(false);
            setCategoryHelper('');
        }
    }

    const handleSave = () => {
        let check = true;
        if (book.title == '') {
            check = false;
            setTitleErr(true);
            setTitleHelper('Title cannot be empty');
        }
        if (book.author == '') {
            check = false;
            setAuthorErr(true);
            setAuthorHelper('Author cannot be empty');
        }
        if (book.isbn == '') {
            check = false;
            setIsbnErr(true);
            setIsbnHelper('ISBN cannot be empty');
        }
        if (book.bookYear == '') {
            check = false;
            setYearErr(true);
            setYearHelper('Year cannot be empty');
        }
        if (isNaN(Number(book.bookYear))) {
            check = false;
            setYearErr(true);
            setYearHelper('Please type valid year value');
        }
        if (isNaN(Number(book.bookYear))) {
            check = false;
            setPriceErr(true);
            setPriceHelper('Please type valid price value');
        }
        if (book.category == '') {
            check = false;
            setCategoryErr(true);
            setCategoryHelper('Select a category');
        }
        if (check) {
            addBook(book);
            setBook({
                title: '',
                author: '',
                isbn: '',
                bookYear: '',
                price: '',
                category: '',
                url: ''
            });
            setOpen(false);
        }
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
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>New book</DialogTitle>
                {imgUploaded && <DialogContent>
                    <TextField
                        color='sidish'
                        error={titleErr}
                        helperText={titleHelper}
                        margin="dense"
                        name="title"
                        value={book.title}
                        onChange={inputChanged}
                        label="Title"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        color='sidish'
                        error={authorErr}
                        helperText={authorHelper}
                        margin="dense"
                        name="author"
                        value={book.author}
                        onChange={inputChanged}
                        label="Author"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        color='sidish'
                        error={isbnErr}
                        helperText={isbnHelper}
                        margin="dense"
                        name="isbn"
                        value={book.isbn}
                        onChange={inputChanged}
                        label="ISBN"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        color='sidish'
                        type='number'
                        error={yearErr}
                        helperText={yearHelper}
                        margin="dense"
                        name="bookYear"
                        value={book.bookYear}
                        onChange={inputChanged}
                        label="Year"
                        fullWidth
                        variant="outlined"
                    />
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
                        error={priceErr}
                        helperText={priceHelper}
                        margin="dense"
                        name="price"
                        value={book.price}
                        onChange={inputChanged}
                        label="Price"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        color='sidish'
                        sx={{ color: 'black' }}
                        variant="outlined"
                        error={categoryErr}
                        helperText={categoryHelper}
                        name="category"
                        select
                        fullWidth
                        label="Category"
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
                </DialogContent>}
                {!imgUploaded &&
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
                    {imgUploaded && < Button sx={{ color: 'black' }} onClick={handleSave}>Save</Button>}
                </DialogActions>
            </Dialog>
        </div >
    )
}

export default Addbook;