import { Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/Main';
import Home from './views/Home';
import ScoviDoos from './views/ScoviDoos';
import ScoviDoo from './views/ScoviDoo';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="scovi-doos">
          <Route index element={<ScoviDoos />} />
          <Route path=":tokenId" element={<ScoviDoo />} />
        </Route>
      </Routes>
    </MainLayout>
  );
}

export default App;
