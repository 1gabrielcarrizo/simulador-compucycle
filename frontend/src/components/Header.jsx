import { Navbar, Container } from 'react-bootstrap';
import '../styles/header.css';

function Header() {
  return (
    <Navbar variant="dark" className="header-bg">
      <Container className="d-flex flex-column justify-content-center text-center">
        <Navbar.Brand className="mx-auto">
          <h1 className="header-title">CompuCycle — Simulador RAEE</h1>
          <p className="header-subtitle mb-0">
            Houston, TX · Trituración HDD/SSD · Separadora Eddy Current · WIP
          </p>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Header;
