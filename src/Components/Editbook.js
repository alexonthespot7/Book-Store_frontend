import { useState, useEffect, useContext } from 'react';
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
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const initialBook = {
  title: '',
  author: '',
  isbn: '',
  bookYear: '',
  price: '',
  url: '',
  category: ''
}

const initialIsError = {
  title: false,
  author: false,
  isbn: false,
  bookYear: false,
  price: false,
  category: false
}

const inputType = {
  title: 'text',
  author: 'text',
  isbn: 'text',
  bookYear: 'number',
}

function Editbook({ book, setBook }) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isError, setIsError] = useState(initialIsError);
  const [errorText, setErrorText] = useState(initialBook);
  const [bookEdit, setBookEdit] = useState(initialBook);
  const [imageUpload, setImageUpload] = useState(null);
  const [imgUploaded, setImgUploaded] = useState(false);
  const [openChangeImg, setOpenChangeImg] = useState(false);

  const { currencyFormatter, setOpenSnackbar, setSnackbarMessage, setBgrColor, resetAuthentication, addBookToCart, fetchBook } = useContext(AuthContext);

  const navigate = useNavigate();

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
    setBookEdit({ ...book, category: `${process.env.REACT_APP_API_URL}api/categories/${book.category.categoryid}` });
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
    console.log(bookEdit);
    setBookEdit({ ...bookEdit, [event.target.name]: event.target.value });
    setIsError({ ...isError, [event.target.name]: false });
    setErrorText({ ...errorText, [event.target.name]: '' });
  }

  const handleBadResponseUpdateBook = (response) => {
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

  const updateBook = async (link) => {
    const token = sessionStorage.getItem('jwt');
    try {
      const response = await fetch(link, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(bookEdit)
      });
      if (!response.ok) {
        handleBadResponseUpdateBook(response);
        return null;
      }
      fetchBook(book.id, setBook)
      setOpenSnackbar(true);
      setSnackbarMessage('The book was updated');
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert('Something is wrong with the server');
    }
  }

  const handleSave = () => {
    for (const field of Object.keys(bookEdit)) {
      if (bookEdit[field] === '') {
        setIsError({ ...isError, [field]: true });
        setErrorText({ ...errorText, [field]: `${field} is mandatory` });
        return null;
      }
    }
    updateBook(`${process.env.REACT_APP_API_URL}api/books/${book.id}`);
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
        {!openChangeImg &&
          <DialogContent>
            {Object.keys(inputType).map((field) => (
              <TextField
                key={field}
                margin='dense'
                type={inputType[field]}
                name={field}
                value={bookEdit[field]}
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
              }}
              type="number"
              error={isError.price}
              helperText={errorText.price}
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
          </DialogContent>
        }
        {openChangeImg &&
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <OutlinedInput
              type="file"
              onChange={(event) => {
                setImageUpload(event.target.files[0]);
              }}
            />
            <Button sx={{ color: 'black' }} onClick={updateBookByImage}> Change Image </Button>
          </DialogContent>
        }
        {!openChangeImg &&
          <DialogActions sx={{ marginTop: -2, display: 'flex', justifyContent: 'space-between', paddingLeft: 2.5, paddingRight: 2.5 }}>
            <Button color='sidish' onClick={() => setOpenChangeImg(true)}>Change picture</Button>
            <div style={{ display: 'flex' }}>
              <Button color='sidish' onClick={handleClose}>Cancel</Button>
              <Button color='sidish' onClick={handleSave}>Save</Button>
            </div>
          </DialogActions>
        }
        {openChangeImg &&
          <DialogActions sx={{ marginTop: -2, display: 'flex', justifyContent: 'space-between', paddingLeft: 2.5, paddingRight: 2.5 }}>
            <Button color='sidish' onClick={() => setOpenChangeImg(false)}>Back</Button>
            <div style={{ display: 'flex' }}>
              <Button color='sidish' onClick={handleClose}>Cancel</Button>
            </div>
          </DialogActions>
        }
      </Dialog>
    </div>
  )
}

export default Editbook;