// components/Chart.js
import * as d3 from "d3";
import { useState } from "react";
import ChartDraw from './ChartDraw.js';

const Chart = (props) => {
    const [ox, setOx] = useState("Индустрия");
    const [oy, setOy] = useState([true, false]);
    const [chartType, setChartType] = useState("scatter");
    const [error, setError] = useState("");
    const [highlightError, setHighlightError] = useState(false);
    const [clearChart, setClearChart] = useState(false);
    const [showChart, setShowChart] = useState(false); // Контроль отображения графика

    const handleSubmit = (event) => {
        event.preventDefault();
        const submitter = event.nativeEvent.submitter;

        if (submitter && submitter.textContent === "Очистить") {
            setOx("Индустрия");
            setOy([true, false]);
            setChartType("scatter");
            setError("");
            setHighlightError(false);
            setShowChart(false); // Скрываем график
            setClearChart(true);
            setTimeout(() => setClearChart(false), 0);
            return;
        }

        setOx(event.target["ox"].value);
        setOy([event.target["oy"][0].checked, event.target["oy"][1].checked]);
        setChartType(event.target["chartType"].value);

        if (!event.target["oy"][0].checked && !event.target["oy"][1].checked) {
            setError(" ");
            setHighlightError(true);
        } else {
            setError("");
            setHighlightError(false);
            setShowChart(true); // Показываем график только после "Построить"
        }
    }

    const createArrGraph = (data, key) => {
        const groupObj = d3.group(data, d => d[key]);
        let arrGraph = [];
        for (let entry of groupObj) {
            let minMax = d3.extent(entry[1].map(d => d['Стоимость чистых активов (млрд USD)']));
            arrGraph.push({ labelX: entry[0], values: minMax });
        }
        return arrGraph;
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <p> Значение по оси OX: </p>
                <div>
                    <input type="radio" name="ox" value="Индустрия" defaultChecked={ox === "Индустрия"} />
                    Индустрия
                    <br />
                    <input type="radio" name="ox" value="Страна" />
                    Страна
                </div>

                <p> Значение по оси OY </p>
                <div style={highlightError ? { color: "red", padding: "5px" } : {}}>
                    <input type="checkbox" name="oy" defaultChecked={oy[0]} onChange={() => setHighlightError(false)} />
                    Максимальная стоимость активов <br />
                    <input type="checkbox" name="oy" defaultChecked={oy[1]} onChange={() => setHighlightError(false)} />
                    Минимальная стоимость активов
                </div>

                <p>Тип диаграммы:</p>
                <select name="chartType" defaultValue={chartType}>
                    <option value="scatter">Точечная диаграмма</option>
                    <option value="bar">Гистограмма</option>
                </select>

                <div class="buttons">
                    <p>
                        <button type="submit" value="build">Построить</button>
                    </p>
                    <p>
                        <button type="submit" value="clear">Очистить</button>
                    </p>
                </div>
                {error && <div style={{ color: "red" }}>{error}</div>}
                {showChart && !error && (
                    <ChartDraw
                        data={createArrGraph(props.data, ox)}
                        showMax={oy[0]}
                        showMin={oy[1]}
                        chartType={chartType}
                        clearChart={clearChart}
                    />
                )}
            </form>
        </>
    )
}

export default Chart;