import React from 'react';
import './info.css';

function InfoPage() {
  return (
    <div className='container mt-4'>
      <div class='media-body'>
        <h3 class='mt-4'>What is Gallery-X?</h3>
        <p>
          Gallery-X is a free website to upload and download photos. Any
          creators can just upload photos with just a click of mouse. Easy to
          use. Sign up to start uploading the photos now!
        </p>
      </div>
      <div class='media-body'>
        <h3 class='mt-4'>How to use it?</h3>
        <p>1. Sign up for an account.</p>
        <p>2. Login into the registered account.</p>
      </div>
      <div class='media-body'>
        <h3 class='mt-4'>How to upload the photos?</h3>
        <p>1. Click the upload icon on the top right of the navigation bar.</p>
        <p>2. Drag and drop the files at the upload page!</p>
        <p>3. Upload one file at one time.</p>
        <p>
          4. You should have seen the images pop up just right beside the upload
          box.
        </p>
        <p>3. Fill in the fields and click the submit button.</p>
      </div>
      <div class='media-body'>
        <h3 class='mt-4'>In case you selected the wrong photos.</h3>
        <p>
          1. Hover your mouse to the image and click on the image to remove it.
        </p>
      </div>
    </div>
  );
}

export default InfoPage;
