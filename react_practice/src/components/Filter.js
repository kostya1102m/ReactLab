/*
   компонент, для фильтрации таблицы
   пропсы:
      fullData - полные данные, по которым формировалась таблица при загрузке страницы
      data - данные для фильтрации
      filtering - функция обновления данных для фильтрации
*/

const Filter = (props) => {
  const handleSubmit = (event) => {
    event.preventDefault();

     // Создаем словарь со значениями полей формы
    const filterField = {
      Страна: event.target['country'].value.toLowerCase(),
      Индустрия: event.target['industry'].value.toLowerCase(),
      Источник_доходов: event.target['incomeSource'].value.toLowerCase(),
      'Возраст': [
        event.target['age_min'].value ? Number(event.target['age_min'].value) : -Infinity,
        event.target['age_max'].value ? Number(event.target['age_max'].value) : Infinity,
      ],
      'Позиция в Forbes': [
        event.target['position_min'].value ? Number(event.target['position_min'].value) : -Infinity,
        event.target['position_max'].value ? Number(event.target['position_max'].value) : Infinity,
      ],
      
      'Стоимость чистых активов (млрд USD)': [
        event.target['assets_min'].value ? Number(event.target['assets_min'].value) : -Infinity,
        event.target['assets_max'].value ? Number(event.target['assets_max'].value) : Infinity,
      ],
    };

    // Фильтруем данные по значениям всех полей формы
    let arr = props.fullData;
    for (const key in filterField) {
      if (key === 'Возраст' || key === 'Позиция в Forbes' || key === 'Стоимость чистых активов (млрд USD)') {
        // Фильтрация по числовому интервалу
        arr = arr.filter((item) => {
          const value = Number(item[key]);
          return value >= filterField[key][0] && value <= filterField[key][1];
        });
      } else {
        // Фильтрация по текстовому вхождению (если поле не пустое)
        if (filterField[key]) {
          arr = arr.filter((item) =>
            item[key].toLowerCase().includes(filterField[key])
          );
        }
      }
    }

    // Передаем родительскому компоненту новое состояние - отфильтрованный массив
    props.filtering(arr);
  };

  const handleReset = () => {
    props.filtering(props.fullData);
  };

  return (
    <form class="filter" onSubmit={handleSubmit} onReset={handleReset}>
      <p>
        <label>Страна:</label>
        <input name="country" type="text" />
      </p>
      <p>
        <label>Индустрия:</label>
        <input name="industry" type="text" />
      </p>
      <p>
        <label>Источник доходов:</label>
        <input name="incomeSource" type="text" />
      </p>
      <p>
        <label>Возраст (мин):</label>
        <input name="age_min" type="number" />
      </p>
      <p>
        <label>Возраст (макс):</label>
        <input name="age_max" type="number" />
      </p>
      <p>
        <label>Позиция в Forbes (мин):</label>
        <input name="position_min" type="number" />
      </p>
      <p>
        <label>Позиция в Forbes (макс):</label>
        <input name="position_max" type="number" />
      </p>
      <p>
        <label>Стоимость чистых активов (мин):</label>
        <input name="assets_min" type="number" />
      </p>
      <p>
        <label>Стоимость чистых активов (макс):</label>
        <input name="assets_max" type="number" />
      </p>
      <p>
        <button type="submit">Фильтровать</button>
        <button type="reset">Очистить фильтр</button>
      </p>
    </form>
  );
};

export default Filter;