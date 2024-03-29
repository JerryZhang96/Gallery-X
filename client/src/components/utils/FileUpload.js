import React, { useState, Fragment } from 'react';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import ProgressBar from './ProgressBar';

function FileUpload(props) {
  const [Images, setImages] = useState([]);
  const [UploadPercentage, setUploadPercentage] = useState(0);

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        setUploadPercentage(
          parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          )
        );
        // Clear percentage
        setTimeout(() => setUploadPercentage(0), 5000);
      },
    };

    formData.append('file', files[0]);

    Axios.post('/api/product/uploadImage', formData, config).then(
      (response) => {
        if (response.data.success) {
          setImages([...Images, response.data.image]);
          props.refreshFunction([...Images, response.data.image]);
        } else {
          alert('Failed to save the image in server');
        }
      }
    );
  };

  const onDelete = (image) => {
    const currentIndex = Images.indexOf(image);

    let newImages = [...Images];
    newImages.splice(currentIndex, 1);

    setImages(newImages);
    props.refreshFunction(newImages);
  };
  return (
    <Fragment>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Dropzone onDrop={onDrop} multiple={false} maxSize={800000000}>
          {({ getRootProps, getInputProps }) => (
            <div
              style={{
                width: '300px',
                height: '240px',
                border: '1px solid lightgray',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              {...getRootProps()}
            >
              {/* {console.log('getRootProps', { ...getRootProps() })}
            {console.log('getInputProps', { ...getInputProps() })} */}
              <input {...getInputProps()} />
              {/* <Icon type='plus' style={{ fontSize: '3rem' }} /> */}
              <p style={{ textAlign: 'center' }}>
                Drag 'n' drop some files here, or click to select files
              </p>
            </div>
          )}
        </Dropzone>
        <div
          style={{
            display: 'flex',
            width: '350px',
            height: '240px',
            overflowX: 'auto',
          }}
        >
          {Images.map((image, index) => (
            <div key={index} onClick={() => onDelete(image)}>
              <img
                style={{ minWidth: '300px', width: '350px', height: '240px' }}
                src={`https://pern-stack-blog-files.s3.amazonaws.com/${image}`}
                alt={`productImg-${index}`}
              />
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          marginTop: '20px',
        }}
      >
        <ProgressBar percentage={UploadPercentage} />
      </div>
    </Fragment>
  );
}

export default FileUpload;
