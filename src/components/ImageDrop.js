import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import emptyguide from './imgs/image--guide-empty.png'
import PropTypes from 'prop-types';
import fire from '../firebaseConfig';
import 'firebase/storage';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { GridListTileBar } from '@material-ui/core';

//import loadImage from 'blueimp-load-image';


const handleDropRejected = (...args) => console.log('reject', args);
const storageRef = fire.storage().ref();
//const storageRef = storage.storage().ref();
export default class ImageDrop extends Component {


   constructor(props){
      super(props);

      console.log(this.props.file);
      this.myRef = React.createRef();
      this.canvasRef = React.createRef();
      
      let preview = null
      if(this.props.file !== undefined){
         if((typeof this.props.file) === "string"){
            preview = this.props.file
         }
         else preview = this.props.file.preview
      }

      
      this.state = {
        image:null,
        coverImages:[],
        canvasWidth:0,
        canvasHeight:0,
        preview
      }
   }

   componentDidMount(){

   }

   handleDrop = (files) => {
        console.log(files.length)

        files.forEach(file => new Promise((resolve, reject) => {
            let task = storageRef.child('images/'+file.name).put(file);

            task.on('state_canged', (snapshot)=>{
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                console.log('Upload is ' + snapshot.state);                
            }, (error)=>{
                console.log(error);
            }, ()=>{
                console.log('Upload is Completed.');
                task.snapshot.ref.getDownloadURL().then((downloadURL)=>{
                    //storageRef.child('test/auto_' + file.name).getDownloadURL().then((downloadURL)=>{
                        console.log('File available at', downloadURL);
                        this.setState(prevState => ({ coverImages: [...prevState.coverImages, downloadURL]}))
                });
        
            });

        }));


    }  
    
	previewLoad = (event) => {

        console.log(window.Image);
        const image = this.myRef.current;

        //console.log(EXIF.getData(event.target, ()=>{
        //    return EXIF.getTag(event.target, 'Orientation');
        //}));
        
        this.setState({canvasWidth:event.target.width, canvasHeight:event.target.height}, ()=>{
            this.props.handleFile(this.props.name, 0, this.state.file, this.state.canvasWidth, this.state.canvasHeight);
        })
        //console.log(this.ref)
    }

    testMeta = (options) => {
        console.log('meta options : ', options);
    }
    showResult = (result) => {
        console.log("Show Result : ", result);
        let ymin = result[0];
        let xmin = result[1];
        let ymax = result[2];
        let xmax = result[3];
        const canavas = this.canvasRef.current;
        canavas.width = this.state.canvasWidth;
        canavas.height = this.state.canvasHeight;        
        let ctx = canavas.getContext("2d");
        let backgroundImage = new Image();

        backgroundImage.onload = () => {
            console.log(backgroundImage.width)
            console.log(backgroundImage.height)
            ctx.drawImage(backgroundImage, 0, 0, backgroundImage.width, backgroundImage.height, 0, 0, this.state.canvasWidth, this.state.canvasHeight);

            //ctx.fillRect(0, 0, this.state.canvasWidth,this.state.canvasHeight);
            //ctx.font = "40px Courier";
            //ctx.fillText('test', 210, 75);
            ctx.beginPath();
            ctx.lineWidth="3";
            ctx.strokeStyle="red";
            //ctx.rect(xmin * this.state.canvasWidth,10.5645,150.234234,80.234234);
            ctx.rect(xmin*this.state.canvasWidth, ymin*this.state.canvasHeight, xmax * this.state.canvasWidth-xmin*this.state.canvasWidth, ymax*this.state.canvasHeight-ymin*this.state.canvasHeight);
            ctx.stroke();
        }
        backgroundImage.src = this.state.preview;

        

        
    }
	handleDeleteClick = () => {
        //event.preventDefault();
        //event.stopPropagation();
        this.setState({preview:null, file:null})
        const file = this.state.file;
        let deleteRef =  storageRef.child('test/' + file.name);
        deleteRef.delete().then(()=>{
            
            console.log('Successfully deleted');
            console.log(this.state.file);
        })
        .catch((err)=>{
            console.log(err);
        })
		//this.setState({preview:null})
		//this.props.handleFile(this.props.name, this.props.index, null);
	}

   render(){

		const {coverImages} = this.state;
        
		const imgStyle ={ minHight:'356px',
                        maxHeight:'496px',
                        maxWidth:'100%',
                        //transform: 'rotate(90deg) translateY(-100%)',
                        //-webkit-transform: 'rotate(90deg) translateY(-100%)',
                        //-ms-transform: rotate(90deg) translateY(-100%);
                        
                    }
        const divLoading = {
            backgroundColor: '#eee',
            opacity: .4,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        }
        const override = {
            display: 'block',
            zIndex: 999,
            position: 'absolute',
            overflow: 'show',
            margin: 'auto',
            top: '-10px',
            left: 0,
            bottom: 0,
            right: 0,
            width: '100px',
            height: '100px'
        }
		//var btnStyle ={zIndex:300}
        let dropInner =<div>
                        <div className={this.props.displayErrors?"image-uploader form-control is-invalid":"image-uploader"} >
                            <div className="explain">
                                <b>표지 이미지 추가</b>
                                <p>여기에 이미지를 드래그 하거나, 클릭하고 이미지를 선택하세요.</p>
                            </div>
                        </div>
                     </div>
                     
        
        if (coverImages.length > 0) {
        
            
            
        
            dropInner = <div>
                        <div className="explain">
                            <GridList cols={5}>
                            {coverImages.map((url, index)=> (
                                <GridListTile key={index}>
                                    <img src={url} />
                                </GridListTile>
                            ))}
                            </GridList>
                        </div>
                        </div>
        }

        /*
		if(preview!=null){
         dropInner = <div>
                    <div style={divLoading} hidden={!this.props.loading}></div>
                    <svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 100 100" enableBackground="new 0 0 0 0" style={override} hidden={!this.props.loading}>
                        <path fill="#4286f4" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                        <animateTransform 
                            attributeName="transform" 
                            attributeType="XML" 
                            type="rotate"
                            dur="1s" 
                            from="0 50 50"
                            to="360 50 50" 
                            repeatCount="indefinite" />
                        </path>
                    </svg>
                    <img style={imgStyle}  src={preview} alt="preview" ref={this.myRef} onLoad={this.previewLoad} />
                    </div>	
		}
        */
      
      return(
         <Dropzone className={this.props.className} onDrop={ this.handleDrop } accept="image/jpeg,image/jpg,image/tiff,image/gif,image/png" multiple={ true } onDropRejected={ handleDropRejected }  >
         
            {({getRootProps, getInputProps}) => (
                <section>
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>{dropInner}</p>
                </div>
                </section>
            )}         
         </Dropzone>	  
                
      );
   }
}

ImageDrop.propTypes = {
  index : PropTypes.number,
  handleFile : PropTypes.func,
  displayErrors : PropTypes.bool,
  loading : PropTypes.bool
};