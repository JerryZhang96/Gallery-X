import React, { useState } from 'react';
import { Checkbox, Col, Row, Collapse } from 'antd';

const { Panel } = Collapse;

function CheckBox(props) {
  const [Checked, setChecked] = useState([]);

  const handleToggle = (value) => {
    const currentIndex = Checked.indexOf(value);
    const newChecked = [...Checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    props.handleFilters(newChecked);
    //update this checked information into Parent Component
  };

  const renderCheckboxLists = () =>
    props.list &&
    props.list.map((value, index) => (
      <React.Fragment key={index}>
        <Checkbox.Group
          style={{ width: '100%' }}
          type='checkbox'
          checked={Checked.indexOf(value._id) === -1 ? false : true}
          onChange={() => handleToggle(value._id)}
        >
          <Row>
            <Col span={8}>
              <Checkbox>{value.name}</Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
        {/* <Checkbox
          onChange={() => handleToggle(value._id)}
          type='checkbox'
          checked={Checked.indexOf(value._id) === -1 ? false : true}
        />
        &nbsp;
        <span>{value.name}</span>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
      </React.Fragment>
    ));

  return (
    <div>
      <Collapse defaultActiveKey={['0']}>
        <Panel header='Categories' key='1'>
          {renderCheckboxLists()}
        </Panel>
      </Collapse>
    </div>
  );
}

export default CheckBox;
