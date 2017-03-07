import React, { Component } from 'react'
import enquire from 'enquire.js'
import * as yaml from 'js-yaml'

import './App.css'
import config from './config'
import i18Data from '../i18data.json'

import { FormattedMessage } from 'react-intl'
import { Layout, Row, Col, Button, Card, Timeline} from 'antd'

const { Content, Footer, Header} = Layout

import Nav_Mobile from './Nav'



export default class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      isMobile: false,
      stats: {signups: null, online: null },
      latest: {win32: {},drawin: {}},
      platform: navigator.platform.match(/Mac/i) ? 'drawin' : 'win32'
    }
  }

  async componentDidMount(){
    enquire.register('only screen and (max-width: 767px)', {
      match: () => {
        this.setState({isMobile: true})
      },
      unmatch: () => {
        this.setState({isMobile: false})
      }
    })

    const initState = {
      stats: {
        signups: await this.get_stats_signups(),
        online: await this.get_stats_online()
      }
    }
    const initLatest = {
      latest: {
        win32: await this.get_latest_win32(),
        drawin: await this.get_latest_drawin()
      }
    }

    this.setState(initState)
    this.setState(initLatest)
  }

  async get_latest_win32() {
    let rawData = await fetch(config.win32_url).then(res => res.text())
    let data = yaml.safeLoad(rawData)

    data.url = 'https://r.my-card.in/downloads/' + data.path
    return data
  }

  async get_stats_signups() {
    let params = new URLSearchParams();
    params.set('api_key', config.ygobbs.api_key);
    params.set('api_username', config.ygobbs.api_username);
    let data = await fetch(`${config.ygobbs.dashboard}?${params.toString()}`).then(res => res.json())

    return data.global_reports.find((item: any) => item.type === 'signups').total
  }

  async get_stats_online() {
    let rawText = await fetch('https://chat.mycard.moe/stats/online').then(res => res.text())
    let document = new DOMParser().parseFromString(rawText, 'text/xml')
    let node = document.querySelector('#content > table > tbody > tr:nth-child(2) > td:nth-child(2)') || {}
    // eslint-disable-next-line
    return parseInt(node.textContent)
  }

  async get_latest_drawin() {
    let data = await fetch(config.drawin_url).then(res => res.json())
    data.url = data.url.replace('-mac.zip', '.dmg').replace('https://wudizhanche.mycard.moe/downloads/', 'https://r.my-card.in/downloads/')

    return data
  }

  handleClick = (e) => {
    console.log('click ', e);
  }

  render() {
    const {latest, isMobile, stats} = this.state
    const {language} = this.props
    const realData = i18Data[language] ? i18Data[language] : i18Data['zh-CN']


    return (
      <Layout>

      {!isMobile ? 
        (<Header style={{width:'100%'}}>
          <Nav_Mobile isMobile={isMobile} />
        </Header>):
        (<Header style={{width:'100%', padding:0}}>
          <Nav_Mobile isMobile={isMobile} />
        </Header>
      )}
      
        <Content className="App-Content1">
          {!isMobile ? 
            (<Row type="flex" justify="space-around" align="middle">
              <Col span={12} push={1}>
              <div className="App-Poster-Content">
                <div className="title">
                  <FormattedMessage id="MoeCube"/>
                  <span className="sub">
                    Beta
                  </span>
                </div>
                <div className="font-C-Gray">
                  <FormattedMessage id="MoeCubeDoujinGamePlatform"/>
                </div>
                <div className="font-C-Gray">
                  <FormattedMessage id="SupportBoth"/>
                  <DownLoadLink text='Windows' data={latest.win32} />
                  <FormattedMessage id="And"/> 
                  <DownLoadLink text='Mac' data={latest.drawin} /> 
                  <FormattedMessage id="OperationSystem"/>
                </div>

                <a href={latest[this.state.platform].url}>
                  <Button type="primary" icon="download" size='large'>
                    <FormattedMessage id={"Download"}/>            
                  </Button>
                </a>
                
              </div>
              </Col>
              <Col span={12} pull={1}>
                <img alt="img" src={require('../public/MoeCubeProduct.png')} className="App-Poster"/>
              </Col>
            </Row>
            ) : (
            <div>
              <Row>
                <Col span={24}>
                  <div className="App-Poster-Content">
                  <div className="title">
                    <FormattedMessage id="MoeCube"/>
                    <span className="sub">
                      Beta
                    </span>
                  </div>
                  <div className="font-C-Gray">
                    <FormattedMessage id="MoeCubeDoujinGamePlatform"/>
                  </div>
                  <div className="font-C-Gray">
                    <FormattedMessage id="SupportBoth"/>
                    <DownLoadLink text='Windows' data={latest.win32} />
                    <FormattedMessage id="And"/>
                    <DownLoadLink text='Mac' data={latest.drawin} /> 
                    <FormattedMessage id="OperationSystem"/>
                  </div>

                  <a href={latest[this.state.platform].url}>
                    <Button type="primary" icon="download" size='large'>
                      <FormattedMessage id={"Download"}/>            
                    </Button>
                  </a>
                  
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <img alt="img" src={require('../public/MoeCubeProduct.png')} className="App-Poster"/>
                </Col>
              </Row>
            </div>
          )}
        </Content>

        <Content>
          <div className="App-CardList">
          {!isMobile ?
            (<div>
              <Row>
                <Col span="12">
                  <Card title={<FormattedMessage id={"CardTitle1"}/>} >
                  <p className="App-Card-content">
                    <FormattedMessage id={"CardContent1"} />                                  
                  </p>
                  <a href=""><Button size="large"><FormattedMessage id={"CardAction1"} /></Button></a>
                </Card>
                </Col>

              <Col span="12">
                <Card title={<FormattedMessage id={"CardTitle2"}/>} >
                  <p className="App-Card-content">
                    <FormattedMessage id={"CardContent2"} />                                                  
                  </p>

                  <Timeline pending={<a href="#"><FormattedMessage id={"CardAction2"}/></a>}>

                    {realData.CardTimeLine2.map((item, i) => {
                      return <Timeline.Item key={i}>{item}</Timeline.Item>
                    })}
                  </Timeline>
                </Card>
              </Col>
              </Row>

              <Row>
                <Col span="12">
                  <Card title={<FormattedMessage id={"CardTitle3"}/>} >
                    <p className="App-Card-content">
                      <FormattedMessage id={"CardContent3"} />                                                  
                    </p>

                  <Timeline pending={<a href="#"><FormattedMessage id={"CardAction3"}/></a>}>
                    <Timeline.Item>{stats.signups || 'loading..'} <FormattedMessage id="IsRegisted"/> </Timeline.Item>  
                    <Timeline.Item>{stats.online || 'loading..'} <FormattedMessage id="IsPlaying"/> </Timeline.Item>  

                    {realData.CardTimeLine3.map((item, i) => {
                      return <Timeline.Item key={i}>{item}</Timeline.Item>
                    })}
                  </Timeline>

                  </Card>
                </Col>

                <Col span="12">
                  <Card title={<FormattedMessage id={"CardTitle4"}/>} >
                    <p className="App-Card-content">
                      <FormattedMessage id={"CardContent4"} />                                                  
                    </p>

                    <Timeline pending={<a href="#"><FormattedMessage id={"CardAction4"} /></a>}>
                      {realData.CardTimeLine4.map((item, i) => {
                        return <Timeline.Item key={i}>{item}</Timeline.Item>
                      })}
                    </Timeline>
                  </Card>
                </Col>
              </Row>
            </div>):(<div>
            <Row>
                <Col span="24">
                  <Card title={<FormattedMessage id={"CardTitle1"}/>} >
                    <p className="App-Card-content">
                      <FormattedMessage id={"CardContent1"} />                                  
                    </p>
                    <Timeline pending={<a href="#"><FormattedMessage id={"CardAction1"}/></a>}>

                      {realData.CardTimeLine1.map((item, i) => {
                        return <Timeline.Item key={i}>{item}</Timeline.Item>
                      })}
                    </Timeline>
                  </Card>
                </Col>
            </Row>
            <Row>
              <Col span="24">
                <Card title={<FormattedMessage id={"CardTitle2"}/>} >
                  <p className="App-Card-content">
                    <FormattedMessage id={"CardContent2"} />                                                  
                  </p>

                  <Timeline pending={<a href="#"><FormattedMessage id={"CardAction2"}/></a>}>

                    {realData.CardTimeLine2.map((item, i) => {
                      return <Timeline.Item key={i}>{item}</Timeline.Item>
                    })}
                  </Timeline>
                </Card>
              </Col>
            </Row>
              <Row>
                <Col span="24">
                  <Card title={<FormattedMessage id={"CardTitle3"}/>} >
                    <p className="App-Card-content">
                      <FormattedMessage id={"CardContent3"} />                                                  
                    </p>

                  <Timeline pending={<a href="#"><FormattedMessage id={"CardAction3"}/></a>}>
                    <Timeline.Item>{stats.signups || 'loading..'} 只萌新已加入萌卡</Timeline.Item>  
                    <Timeline.Item>{stats.online || 'loading..'} 位爱的战士正在线游戏</Timeline.Item>  

                    {realData.CardTimeLine3.map((item, i) => {
                      return <Timeline.Item key={i}>{item}</Timeline.Item>
                    })}
                  </Timeline>

                  </Card>
                </Col>
              </Row>
              <Row>
                <Col span="24">
                  <Card title={<FormattedMessage id={"CardTitle4"}/>} >
                    <p className="App-Card-content">
                      <FormattedMessage id={"CardContent4"} />                                                  
                    </p>

                    <Timeline pending={<a href="#"><FormattedMessage id={"CardAction4"} /></a>}>
                      {realData.CardTimeLine4.map((item, i) => {
                        return <Timeline.Item key={i}>{item}</Timeline.Item>
                      })}
                    </Timeline>
                  </Card>
                </Col>
              </Row>
            </div>)}
          </div>
        </Content>

        <Content className="App-Content2">
          <p><FormattedMessage id={"Welcome"} /></p>

           <Button type="primary" icon="download" size='large' onClick={() => window.open(latest[this.state.platform].url)}>
            <FormattedMessage id={"Download"}/>                                
          </Button>
        </Content>


        <Footer>
          © MoeCube 2017 all right reserved.
        </Footer>
      </Layout>
    )
  }
}

const DownLoadLink = ({text, data = {}}) => {

  return (
    <a href={data.url} >{text}</a>
  )
}
