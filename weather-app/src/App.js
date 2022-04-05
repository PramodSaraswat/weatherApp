import React, { useState, useEffect } from 'react';
import axios from 'axios';

import logo from './logo.svg';
import { Navbar, Container, Button, Row, Col, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {

  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)
  const [currentCity, setCurrentCity] = useState()
  const [forecast, setForecast] = useState()
  const [loadingWeather, setLoadingWeather] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const headers = { userId: localStorage.getItem("user_id") } || {}
      const api_data = await axios.get('http://localhost:8000/api/locations', {
        headers: headers,
      })
      if (!localStorage.getItem("user_id") || localStorage.getItem('user_id') == 'null') {
        localStorage.setItem("user_id", api_data?.data?.user_id)
      }
      setData(api_data?.data)
      setLoading(false)
    }
    fetchData()
  }, [])


  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const getWeather = async (city) => {
    setCurrentCity(city)
    setLoadingWeather(true)
    const weather_data = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=1d59c638a35d4ac1a34152707220404&q=${city}&days=4&aqi=no&alerts=no`)
    setForecast(weather_data.data)
    setLoadingWeather(false)
  }

  const dropDownHandler = async (e) => {
    const api_data = await axios.post('http://localhost:8000/api/locations', {
      name: e?.target?.value,
      user_id: localStorage.getItem("user_id")
    })
    if (api_data?.data?.success) {
      setData({ ...data, locations: [...data.locations, api_data?.data?.location] })
    }
  }

  const getDay = (d = new Date()) => {
    const day = new Date(d).getDay()
    return weekday[day]
  }

  const getDate = (d = new Date()) => {
    const dateString = new Date(d).toDateString()
    return dateString.slice(4)
  }

  const comp = (name) => {
    const temp = []
    data.locations.map(data => temp.push(data.name))
    return temp.indexOf(name)
  }


  return ( 
    <> 
      { /*--------Navbar--------*/ }
      <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand>
            <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="Weather logo"
            />{' '}
              Weather Forcast
            </Navbar.Brand>
          </Container>
        </Navbar>

      { /*---------------Top Selected locations-------------*/ }

      {loading ? 'Loading...' :

        <Container className="mt-3">

          <Row md={4} lg={6}>

            {data.locations.map((city,index) => 
              <Col className="mt-2" key={index}> 
                <button onClick={()=>getWeather(city.name)} style={{backgroundColor: currentCity == city.name ? "#08a1bd" : "#A8A8A8" }} className="locName px-5 py-2">{city.name}</button>
              </Col>
            )}
            { data.locations.length < data.dropdown_data.length && 
              <Col className="mt-2">
                <Form.Select onChange={dropDownHandler} className="locName drop px-5 py-2 shadow-none" style={{backgroundColor: '#A8A8A8'}} value=''  name="addMore">
                  <option key='blankChoice' hidden value="">Add More +</option>
                  {data.dropdown_data.filter(item=> comp(item) == -1 ).map((item, index) => <option key={index} value={item}>{item}</option>)}
                </Form.Select>
              </Col>}

          </Row>

          {/*------------4 Days Forecast----------*/}
          {!loadingWeather && forecast &&
            <><h2 className="text-center my-5">4 Days Forecast</h2>

            <Row sm={1} md={4} className="g-4 m-4 mt-0">

              <Col>
                <Card className="foreContainer">
                  <Card.Body>
                    <h1>Current</h1>
                    <Card.Subtitle className="mb-2 text-muted">Current Weather <br /> Last Updated: {forecast?.current?.last_updated.slice(11)}</Card.Subtitle>
                    <h3>{forecast?.current.temp_c}° C</h3>  
                    <Card.Text>
                      {forecast?.current?.condition?.text}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              {forecast?.forecast?.forecastday?.map((data,index)=><Col key={index}>
                <Card className="foreContainer">
                  <Card.Body>
                    <h1>{getDay(data.date)}</h1>
                    <Card.Subtitle className="mb-2 text-muted"> { index == 0 && "Today"} <br /> {getDate(data.date)}</Card.Subtitle>
                    <h3>{data?.day.avgtemp_c}° C</h3>  
                    <Card.Text>
                      {data?.day?.condition?.text}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>)}
          </Row></>}


        </Container>
      }

    </>
  );
}

export default App;