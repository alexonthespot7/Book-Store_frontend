import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';

function Editbook ({ params, updateBook }) {
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

    const [book, setBook] = useState({
        title: '',
        author: '',
        isbn: '',
        bookYear: '',
        price: '',
        category: ''
    });

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
        setBook({
            title: params.data.title,
            author: params.data.author,
            isbn: params.data.isbn,
            bookYear: params.data.bookYear,
            price: params.data.price,
            category: `${process.env.REACT_APP_API_URL}api/categories/${params.data.category.categoryid}`
        });
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const inputChanged = (event) => {
        setBook({...book, [event.target.name]: event.target.value});
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
        if (isNaN(Number (book.bookYear))) {
            check = false;
            setYearErr(true);
            setYearHelper('Please type valid year value');
        }
        if (isNaN(Number (book.bookYear))) {
            check = false;
            setPriceErr(true);
            setPriceHelper('Please type valid price value');
        }
        if (check) {
            updateBook(book, params.value);
            setOpen(false);
        }
        
    }

    return (
        <div>
          <IconButton onClick={handleClickOpen}>
            <EditIcon />
          </IconButton>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit book</DialogTitle>
            <DialogContent>
              <TextField
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
                type="number"
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      €
                    </InputAdornment>
                  ),
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
                variant='outlined'
                name="category"
                select
                fullWidth
                label="Category"
                value={book.category}
                onChange={inputChanged}
                style={{marginTop: 10}}
              >
                {categories.map((category, index) => (
                  <MenuItem key={index} value={`${process.env.REACT_APP_API_URL}api/categories/${category.categoryid}`}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogActions>
          </Dialog>
        </div>
    )
}

export default Editbook;