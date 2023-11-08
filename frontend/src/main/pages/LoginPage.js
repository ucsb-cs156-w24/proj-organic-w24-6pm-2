import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

const LoginCard = () => {
  return (
    <Card style={
      // Stryker disable next-line all : no need to unit test CSS
      { width: '18rem' }
    }>
      <Card.Body>
        <Card.Title data-testid="loginPage-cardTitle">Welcome to Organic!</Card.Title>
        <Card.Text>
          To access features, please login with your Github account.
        </Card.Text>
        <Button href="/oauth2/authorization/github" variant="primary">Log In</Button>
      </Card.Body>
    </Card>
  )
}

export default function LoginPage() {
  
  return (
    <div> 
      <BasicLayout>
        <Container style={
          // Stryker disable next-line all : no need to unit test CSS
          { marginTop: "8%" }}>
          <Row style={
            // Stryker disable next-line all : no need to unit test CSS
            { alignItems: "center", justifyContent: "center" }}>
            <Col sm="auto"><LoginCard /></Col>
          </Row>
        </Container>
      </BasicLayout>
    </div>
  )
}
