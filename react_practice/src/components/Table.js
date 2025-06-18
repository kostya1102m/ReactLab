import { useEffect, useState } from 'react';
import { useRef } from 'react';
import TableHead from './TableHead.js';
import TableBody from './TableBody.js';
import Filter from './Filter.js';
import Sort from './Sort.js';
import Chart from './Chart.js'


/*
   компонент, выводящий на страницу таблицу с пагинацией
   пропсы:
      data - данные для таблицы в виде массива объектов
      amountRows - количество строк таблицы на странице
      isPaginated - признак, отображать ли пагинацию (true/false, по умолчанию true)
*/

const Table = ({ data, amountRows, isPaginated = true }) => {
  const [activePage, setActivePage] = useState('1');
  const [filteredData, setFilteredData] = useState(data);
  const [sortedData, setSortedData] = useState(null);

  const resetRef = useRef(false);

  const currentData = sortedData || filteredData;

  // Количество страниц разбиения таблицы на основе отфильтрованных данных
  const n = Math.ceil(currentData.length / amountRows);

  // Массив с номерами страниц
  const arr = Array.from({ length: n }, (v, i) => i + 1);

  // Если текущая страница больше, чем доступно страниц, сбрасываем на 1
  if (+activePage > n && n > 0) {
    setActivePage('1');
  }

  const changeActive = (event) => {
    setActivePage(event.target.innerHTML); // Меняем activePage
  };

  // Формируем span с номерами страниц
  const pages = arr.map((item, index) => (
    <span
      key={index}
      className={item === +activePage ? 'active' : ''}
      onClick={changeActive}
    >
      {item}
    </span>
  ));

  // Обработчик фильтрации
  const handleFiltering = (value) => {
    setFilteredData(value);
    setSortedData(null);
    setActivePage('1');
    resetRef.current = false; 
  };

  // Обработчик сортировки
  const handleSorting = (value) => {
    setSortedData(value);
    setActivePage(n.toString());
  };


  const handleFullReset = () => {
    resetRef.current = true; 
    setFilteredData(data);
    setSortedData(null);
    setActivePage('1');
  };

  
  useEffect(() => {
    if (resetRef.current) {
      resetRef.current = false;
    }
  }, [filteredData]);


  return (
    <>
      <details>
        <summary>Фильтр</summary>
        <Filter 
          filtering={handleFiltering} 
          data={currentData} 
          fullData={data}
          onFullReset={handleFullReset}
          resetRef={resetRef} 
        />
      </details>
      <details>
        <summary>Сортировка</summary>
        <Sort 
          sorting={handleSorting} 
          data={filteredData} 
          fullData={data}
          resetRef={resetRef} 
        />
      </details>
      <details>
        <summary>График</summary>
        <Chart
         data={filteredData}
        />
      </details>
      <table>
        <TableHead head={Object.keys(data[0])} />
        <TableBody
          body={currentData}
          amountRows={amountRows}
          numPage={activePage}
          isPaginated={isPaginated}
        />
      </table>
      {isPaginated && n>1 && <div className="pagination">{pages}</div>}
    </>
  );
};

export default Table;