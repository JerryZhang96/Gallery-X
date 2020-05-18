import React, { useState } from 'react';
import { Typography, Button, Form, message, Input } from 'antd';
import FileUpload from '../../utils/FileUpload';
import Axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;

const Categories = [
  { key: 1, value: 'Food' },
  { key: 2, value: 'Travel' },
  { key: 3, value: 'Gadget' },
  { key: 4, value: 'Animal/Pet' },
  { key: 5, value: 'Lifestyle' },
  { key: 6, value: 'Sport' },
  { key: 7, value: 'E-Sport' },
  { key: 8, value: 'Art' },
];

function UploadProductPage(props) {
  const [TitleValue, setTitleValue] = useState('');
  const [DescriptionValue, setDescriptionValue] = useState('');
  // const [PriceValue, setPriceValue] = useState(0);
  const [CategoryValue, setCategoryValue] = useState(1);

  const [Images, setImages] = useState([]);

  const onTitleChange = (e) => {
    setTitleValue(e.currentTarget.value);
  };

  const onDescriptionChange = (e) => {
    setDescriptionValue(e.currentTarget.value);
  };

  // const onPriceChange = (e) => {
  //   setPriceValue(e.currentTarget.value);
  // };

  const onCategorySelectChange = (e) => {
    setCategoryValue(e.currentTarget.value);
  };

  const updateImages = (newImages) => {
    setImages(newImages);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (
      !TitleValue ||
      !DescriptionValue ||
      // !PriceValue ||
      !CategoryValue ||
      !Images
    ) {
      return alert('Fill all the fields first!');
    }

    const variables = {
      writer: props.user.userData._id,
      title: TitleValue,
      description: DescriptionValue,
      // price: PriceValue,
      images: Images,
      categories: CategoryValue,
    };
    Axios.post('/api/product/uploadProduct', variables).then((response) => {
      if (response.data.success) {
        // console.log(response.data);
        message.success('Photos uploaded!');
        props.history.push('/');
      } else {
        message.error('Unable to upload file!Please check the file format.');
      }
    });
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2}>Upload Photo</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <FileUpload refreshFunction={updateImages} />
        <br />
        <br />
        <label htmlFor='title'>Title</label>
        <Input type='text' onChange={onTitleChange} value={TitleValue} />
        <br />
        <br />
        <label htmlFor='description'>Description</label>
        <TextArea
          onChange={onDescriptionChange}
          value={DescriptionValue}
        ></TextArea>
        {/* <br />
        <br />
        <label htmlFor='price'>Price($)</label>
        <Input
          type='number'
          min='1'
          onChange={onPriceChange}
          value={PriceValue}
        /> */}
        <br />
        <br />
        <label htmlFor='category'>Category</label>
        <br />
        <select onChange={onCategorySelectChange} value={CategoryValue}>
          {Categories.map((item) => (
            <option key={item.key} value={item.key}>
              {item.value}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button onClick={onSubmit}>Submit</Button>
      </Form>
    </div>
  );
}

export default UploadProductPage;
