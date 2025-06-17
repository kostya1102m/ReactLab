import { useState } from "react";
import { useEffect } from "react";
import Chart from './Chart.js'
import TableHead from './TableHead.js';
import TableBody from './TableBody.js';
import Filter from './Filter.js';

/*
   компонент, выводящий на страницу таблицу с пагинацией
   пропсы:
      data - данные для таблицы в виде массива объектов
      amountRows - количество строк таблицы на странице
      isPaginated - признак, отображать ли пагинацию
*/

const Table = ({ data, amountRows, isPaginated = true }) => {
  const [activePage, setActivePage] = useState("1");
  const [dataTable, setDataTable] = useState(data);

  // useEffect(() => {

  //   const pages = Math.ceil(data.length / amountRows).toString();
  //   setActivePage(pages);

  // }, [data, amountRows]
  // );

  // Количество страниц разбиения таблицы на основе отфильтрованных данных
  const n = Math.ceil(dataTable.length / amountRows);
  console.log("n:", n)

  // Массив с номерами страниц
  const arr = Array.from({ length: n }, (v, i) => i + 1);

  // Если текущая страница больше, чем доступно страниц, сбрасываем на 1
  if (+activePage > n && n > 0) {
    setActivePage("1");
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

  const updateDataTable = (value) => {
    setDataTable(value);
    const last_page = Math.ceil(value.length / amountRows).toString();
    setActivePage(last_page);
  };

  return (
    <>
      <Chart data={dataTable} /> {}
      <Filter filtering={updateDataTable} data={dataTable} fullData={data} />
      <table>
        <TableHead head={Object.keys(data[0])} />
        <TableBody
          body={dataTable}
          amountRows={amountRows}
          numPage={activePage}
          isPaginated={isPaginated}
        />
      </table>
      {isPaginated && n > 1 && <div className="pagination">{pages}</div>}
      
    </>
  );
};

export default Table;