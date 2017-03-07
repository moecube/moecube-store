import React from 'react'
import { Menu } from 'antd'
import { FormattedMessage } from 'react-intl'

export default class MyComponent extends React.Component {
  render() {
    
    return (
      <div>
        <div className="App-Logo">
          <img alt="img" src={require("../public/logo.png")} style={{width: '45px', margin: '10px'}}/>
          <span>MoeCube</span>           
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ lineHeight: '64px' }}>

          <Menu.Item key="1">
            <FormattedMessage id={"Home"}/>            
          </Menu.Item>
          <Menu.Item key="2">
            <a href="https://ygobbs.com/">
              <FormattedMessage id={"BBS"}/>
            </a>
          </Menu.Item>
        </Menu>
      </div>
    )
  }
}
