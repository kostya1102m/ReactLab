import './CSS/App.css';
import iphones from './data.js';
import Table from './components/Table.js';
import Navbar from './components/Navbar.js';
function App() {
  return (
    <div className="App">
      <Table data={iphones} amountRows="15" isPaginated={true} />
    </div>
  );
}

export default App;