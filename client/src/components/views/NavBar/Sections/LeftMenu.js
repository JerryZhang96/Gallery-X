import React from 'react';
import { Menu } from 'antd';

function LeftMenu(props) {
  return (
    <Menu mode={props.mode}>
      <Menu.Item key='home'>
        <a href='/'>Home</a>
      </Menu.Item>
      <Menu.Item key='info'>
        <a href='/info'>Info</a>
      </Menu.Item>
      <Menu.Item key='favorite'>
        <a href='/favorite'>Favorite</a>
      </Menu.Item>
    </Menu>
  );
}

export default LeftMenu;
