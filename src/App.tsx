import React from 'react';
import Table from './components/Table';
import { Container } from 'react-bootstrap';
import Toolbar from './components/Toolbar';

const App: React.FC = () => {
  return (
    <Container className="d-flex flex-column p-0" data-bs-theme="dark" style={{minWidth: '90vw'}}>
      <Toolbar/>
      <Table/>
    </Container>
  );
};

export default App;
