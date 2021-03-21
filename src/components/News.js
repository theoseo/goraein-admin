import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';

import { CKEditor } from '@ckeditor/ckeditor5-react';
//import Editor from 'ckeditor5-custom-build/build/ckeditor';
import Editor from 'ckeditor5-build-osslab/build/ckeditor';
import { FormatListNumberedRtlOutlined } from '@material-ui/icons';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';

import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { RMIUploader } from "react-multiple-image-uploader";
import PostList from './PostList.js';

import fire from '../firebaseConfig';
import QuillEditor from './QuillEditor';
import ImageDrop from './ImageDrop';
//import ReactQuill from 'react-quill';
//import 'react-quill/dist/quill.snow.css';
import moment from 'moment';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({

  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  formControl: {
    margin: theme.spacing(1),
    width: '200px',
  },  
  ckEditor: {
    color: '#000',
    backgroundColor: '#fff',
  },
  boxStyle: {
    borderStyle: 'dotted',
  }

  
}));

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then( 
      file => {
        console.log(file);
        return {
          default: 'http://test.com/' + file.name
        }
      }
      
    );
    
  }
}

export default function News() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(10);
  const [author, setAuthor] = useState('');
  const [publishDate, setPublishDate] = useState(moment(new Date()).format('YYYY-MM-DD').toString());
  const [notification, setNotification] = useState('');

  const [visible, setVisible] = useState(false);
  const handleSetVisible = () => {
    setVisible(true);
  };
  const hideModal = () => {
    setVisible(false);
  };
  const onUpload = (data) => {
    console.log("Upload files", data);
  };
  const onSelect = (data) => {
    console.log("Select files", data);
  };
  const onRemove = (id) => {
    console.log("Remove image id", id);
  };  

  const quillColors = ["rgb(0, 0, 0)", 
                  "rgb(230, 0, 0)",
                  "rgb(255, 153, 0)",
                  "rgb(255, 255, 0)",
                  "rgb(0, 138, 0)",
                  "rgb(0, 102, 204)",
                  "rgb(153, 51, 255)",
                  "rgb(255, 255, 255)",
                  "rgb(250, 204, 204)",
                  "rgb(255, 235, 204)",
                  "rgb(204, 224, 245)",
                  "rgb(235, 214, 255)",
                  "rgb(187, 187, 187)",
                  "rgb(102, 185, 102)" ];

  console.log(moment(new Date()).format('YYYY-MM-DD').toString())
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{ 'color': quillColors }, { 'background': quillColors }],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
    handlers: {
      'color': function (value) {
        this.quill.format('color', value);
      }
    }    
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'colors', 'background',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(slug)
    console.log(title.length)
    console.log(content)
    /*
    if (title.length > 0){
      fire.firestore()
      .collection('book-test')
      .doc(slug)
      .set({
      title: title,
      content: content,
      });

      //setTitle('');
      //setContent('');

      setNotification('Blogpost created');

      setTimeout(() => {
        setNotification('')
      }, 2000)

    }
    else {
      //setTitleError(true)
    }*/
    
  }
  const newsList = [
    { id: 1, category: '1', title: 'Snow', publishDate: '2019/03/04', age: 35 },
  ]

  return (
    <div className={classes.root}>

        <Container maxWidth="lg" className={classes.container}>

        <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>

        <Grid item xs={12}>
        <TextField required id="outlined-basic" label="Title"  value={title} fullWidth={true}
           onChange={({target}) => setTitle(target.value)} 
        />
        </Grid>
        <Grid item xs={12}>
        <div className={classes.ckEditor}>        
          <QuillEditor theme="snow" 
              value={content}      
              onChange={setContent}/>
        </div>
        </Grid>
        <Grid item xs={12}>
          <ImageDrop className={classes.boxStyle} />
        </Grid>

        <Grid item xs={12} sm={4} >
        <TextField required id="outlined-basic" label="Author"  value={author} 
           onChange={({target}) => setAuthor(target.value)} 
        />

        </Grid>
        <Grid item xs={12} sm={4} >
        <TextField id="date" type="date" label="Publish Date" value={publishDate} 
            
            InputLabelProps={{
              shrink: true,
            }}        
           onChange={({target}) => setPublishDate(target.value)} 
           />

        </Grid>
        <Grid item  xs={12} sm={4} >
          <Select  value={category} onChange={({target}) => setCategory(target.value)} >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>            
          </Select>
        </Grid>
        <Grid item xs={12}>
        <Button variant="contained" color="primary" type="submit" >
        저장 
        </Button>           
        </Grid>
        </Grid>
        </form>
        <Grid container spacing={3}>
        <Grid item xs={12}>
        <PostList rows={newsList}/>
        </Grid>
        </Grid>          

        </Container>
        

    </div>
  );
}