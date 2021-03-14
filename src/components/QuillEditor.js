import React, { useState } from "react";
import ReactQuill from 'react-quill';
import Dropzone, { ImageFile } from "react-dropzone";
import 'react-quill/dist/quill.snow.css';
import './temp.css';
import fire from '../firebaseConfig';

const storageRef = fire.storage().ref();

class QuillEditor extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        text: "",
        uploadImages: []
      }
      this.quillRef = React.createRef();
      this.dropzone = React.createRef();;    

    
      //https://codesandbox.io/s/qv5m74l80w?file=/src/index.tsx:1856-2080
        
                
    }

    imageHandler = () => {
        
        if (this.dropzone){
            console.log(this.dropzone.current);
            this.dropzone.current.open();
        } 
    };      


    handleDrop = (files) => {
        const file = files[0];
        console.log(file);

        let task = storageRef.child('/images/' + file.name).put(file)

        task.on('state_changed',(snapshot)=>{
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            console.log('Upload is ' + snapshot.state);
                
        },(error)=>{

        },()=>{
            console.log('Upload is Completed.');
            console.log(this.state.canvasWidth);

            // 업로드한 파일 url 가져 오기
            task.snapshot.ref.getDownloadURL().then((downloadURL)=>{
            //storageRef.child('test/auto_' + file.name).getDownloadURL().then((downloadURL)=>{
                console.log('File available at', downloadURL);
            
                const quill = this.quillRef.current.getEditor();
                const range = quill.getSelection();
                quill.insertEmbed(range.index, "image", downloadURL);
                quill.setSelection(range.index + 1);
                quill.focus();      
                
                this.setState(prevState => ({ uploadImages: [...prevState.uploadImages, downloadURL]}))
        });        

        
      })
    };
    

    handleChange = (value)=> {
        console.log(value)
        //const val = event.target.value;
        this.props.onChange(value);
    }

    modules = {
      toolbar: {
        container: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline','strike', 'blockquote'],
            [{ color: [] }, { background: [] }],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
            ['link', 'image', 'video'],
            ['clean']
          ],
        handlers: { image: this.imageHandler }
      },
      clipboard: { matchVisual: false }
    }
  
    formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'color', 'background',
      'list', 'bullet', 'indent',
      'align',
      'link', 'image', 'video'
    ]
  
    render() {
    
      return (
        <div className="text-editor">
          <ReactQuill theme="snow"
                      ref={this.quillRef}
                      onChange={this.handleChange}
                      modules={this.modules}
                      formats={this.formats} />
          <Dropzone
            ref={this.dropzone}
            style={{ width: 0, height: 0 }}
            onDrop={this.handleDrop}
            accept="image/*"
          >          
            {({getRootProps, getInputProps}) => (
                <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
                <p>{this.state.uploadImages}</p>
                </div>
            )}          
          </Dropzone>
        </div>
      );
    }
  }
  
  export default QuillEditor;