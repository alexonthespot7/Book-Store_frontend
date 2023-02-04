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
import { OutlinedInput } from '@mui/material';
import { storage } from '../firebase/firebase';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';

function Editbook({ book, updateBook }) {
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

  const [bookEdit, setBookEdit] = useState({
    title: '',
    author: '',
    isbn: '',
    bookYear: '',
    price: '',
    url: '',
    category: ''
  });

  const [imageUpload, setImageUpload] = useState(null);
  const [imgUploaded, setImgUploaded] = useState(false);
  const [openChangeImg, setOpenChangeImg] = useState(false);

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
    setBookEdit({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      bookYear: book.bookYear,
      price: book.price,
      url: book.url,
      category: `${process.env.REACT_APP_API_URL}api/categories/${book.category.categoryid}`
    });
    setOpen(true);
    setOpenChangeImg(false);
    setImageUpload(null);
    setImgUploaded(false);
  }

  const handleClose = () => {
    setOpen(false);
    setOpenChangeImg(false);
    setImageUpload(null);
  }

  const inputChanged = (event) => {
    setBookEdit({ ...bookEdit, [event.target.name]: event.target.value });
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
    if (bookEdit.title == '') {
      check = false;
      setTitleErr(true);
      setTitleHelper('Title cannot be empty');
    }
    if (bookEdit.author == '') {
      check = false;
      setAuthorErr(true);
      setAuthorHelper('Author cannot be empty');
    }
    if (bookEdit.isbn == '') {
      check = false;
      setIsbnErr(true);
      setIsbnHelper('ISBN cannot be empty');
    }
    if (bookEdit.bookYear == '') {
      check = false;
      setYearErr(true);
      setYearHelper('Year cannot be empty');
    }
    if (isNaN(Number(bookEdit.bookYear))) {
      check = false;
      setYearErr(true);
      setYearHelper('Please type valid year value');
    }
    if (isNaN(Number(bookEdit.bookYear))) {
      check = false;
      setPriceErr(true);
      setPriceHelper('Please type valid price value');
    }
    if (check) {
      updateBook(bookEdit, `${process.env.REACT_APP_API_URL}api/books/${book.id}`);
      setOpen(false);
    }

  }

  const changeImage = () => {
    if (imageUpload === null) {
      alert('choose a picture first');
    } else {
      let previousPictureRef = ref(storage, book.url);
      deleteObject(previousPictureRef)
        .then(() => {
          const newImageRef = ref(storage, `covers/${imageUpload.name + v4()}`);
          uploadBytes(newImageRef, imageUpload)
            .then((snapshot) => {
              getDownloadURL(snapshot.ref)
                .then((urlNow) => {
                  setBookEdit({ ...bookEdit, url: urlNow });
                });
              alert('Image was changed successfully');
            })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
    }
  }

  const updateBookByImage = () => {
    changeImage();
  }

  useEffect(() => {
    if (bookEdit.url !== book.url && !imgUploaded && bookEdit.url !== '') {
      updateBook(bookEdit, `${process.env.REACT_APP_API_URL}api/books/${book.id}`);
      setImgUploaded(true);
      handleClose();
    }
  }, [bookEdit]);

  return (
    <div>
      <IconButton color='thirdary' onClick={handleClickOpen}>
        <EditIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit book</DialogTitle>
        {!openChangeImg && <DialogContent>
          <TextField
            color='sidish'
            error={titleErr}
            helperText={titleHelper}
            margin="dense"
            name="title"
            value={bookEdit.title}
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
            value={bookEdit.author}
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
            value={bookEdit.isbn}
            onChange={inputChanged}
            label="ISBN"
            fullWidth
            variant="outlined"
          />
          <TextField
            color='sidish'
            type="number"
            error={yearErr}
            helperText={yearHelper}
            margin="dense"
            name="bookYear"
            value={bookEdit.bookYear}
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
            }}
            type="number"
            error={priceErr}
            helperText={priceHelper}
            margin="dense"
            name="price"
            value={bookEdit.price}
            onChange={inputChanged}
            label="Price"
            fullWidth
            variant="outlined"
          />
          <TextField
            color='sidish'
            variant='outlined'
            name="category"
            select
            fullWidth
            label="Category"
            value={bookEdit.category}
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
        {openChangeImg &&
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <OutlinedInput
              type="file"
              onChange={(event) => {
                setImageUpload(event.target.files[0]);
              }}
            />
            <Button sx={{ color: 'black' }} onClick={updateBookByImage}> Change Image </Button>
          </DialogContent>}
        {!openChangeImg && <DialogActions sx={{ marginTop: -2, display: 'flex', justifyContent: 'space-between', paddingLeft: 2.5, paddingRight: 2.5 }}>
          <Button color='sidish' onClick={() => setOpenChangeImg(true)}>Change picture</Button>
          <div style={{ display: 'flex' }}>
            <Button color='sidish' onClick={handleClose}>Cancel</Button>
            <Button color='sidish' onClick={handleSave}>Save</Button>
          </div>
        </DialogActions>}
        {openChangeImg && <DialogActions sx={{ marginTop: -2, display: 'flex', justifyContent: 'space-between', paddingLeft: 2.5, paddingRight: 2.5 }}>
          <Button color='sidish' onClick={() => setOpenChangeImg(false)}>Back</Button>
          <div style={{ display: 'flex' }}>
            <Button color='sidish' onClick={handleClose}>Cancel</Button>
          </div>
        </DialogActions>}
      </Dialog>
    </div>
  )
}

export default Editbook;