import React from "react"
import { Container, Navbar, Nav } from "react-bootstrap"

export default function Header() {
  return (
    <div className={"header"}>
      <Navbar bf={"light"} expand="md">
        <Container>
          <Navbar.Brand href="/">NEEDED ACTION<br /><small>Coordinating Committee</small></Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="m-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="#services">Services</Nav.Link>
              <Nav.Link href="#about-us">Gallery</Nav.Link>
              <Nav.Link href="#about-us">About</Nav.Link>
              <Nav.Link href="#about-us">Contacts</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>


    </div>
  )
}
