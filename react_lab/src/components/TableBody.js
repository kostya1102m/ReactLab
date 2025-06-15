import TableRow from './TableRow.js';

/*
   компонент, для вывода tbody таблицы
   пропсы:
      body - данные для таблицы в виде массива объектов
      numPage - номер текущей страницы
      amountRows - количество строк таблицы на странице
      isPaginated - признак, выполнять ли пагинацию (true/false)
*/
let currentData;
const TableBody = ({ body, numPage, amountRows, isPaginated }) => {
  // Номера строк, отображаемых на странице (если пагинация включена)
  const begRange = (numPage - 1) * amountRows;
  const endRange = begRange + Number(amountRows);

  // Формируем строки на основе переданных данных
  const tbody = body.map((item, index) => (
    <tr
      key={index}
      className={
        isPaginated
          ? index >= begRange && index < endRange
            ? "show"
            : "hide"
          : "show" // Если пагинация отключена, все строки видны
      }
    >
      <TableRow row={Object.values(item)} isHead="0" />
    </tr>
  ));
  currentData = tbody

  return <tbody>{tbody}</tbody>;
};

export default TableBody;