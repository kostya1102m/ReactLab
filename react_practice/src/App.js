import './CSS/App.css';
import billioners from './data.js';
import Table from './components/Table.js';
function App() {
  return (
    <div className="App">
      <Table data={billioners} amountRows="15" isPaginated={true} />
    </div>
  );
}

export default App;