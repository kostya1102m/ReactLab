import * as d3 from "d3";
import { useState } from "react";
import ChartDraw from './ChartDraw.js';

const Chart = (props) => {
    const [ox, setOx] = useState("Страна");
    const [oy, setOy] = useState([true, false]);
    const [chartType, setChartType] = useState("scatter");
    const [error, setError] = useState("");
    const [highlightError, setHighlightError] = useState(false);


    const handleSubmit = (event) => {
        event.preventDefault();

        setOx(event.target["ox"].value);
        setOy([event.target["oy"][0].checked, event.target["oy"][1].checked]);
        setChartType(event.target["chartType"].value);



        // Проверка что выбрана хотя бы одна ось OY
        if (!event.target["oy"][0].checked && !event.target["oy"][1].checked) {
            setError(" ");
            setHighlightError(true);
        } else {
            setError("");
            setHighlightError(false);
        }
    }

    const createArrGraph = (data, key) => {
        const groupObj = d3.group(data, d => d[key]);
        let arrGraph = [];
        for (let entry of groupObj) {
            let minMax = d3.extent(entry[1].map(d => d['Высота']));
            arrGraph.push({ labelX: entry[0], values: minMax });
        }

        if (key === "Год") {
            arrGraph.sort((a, b) => a.labelX - b.labelX);
        }
        return arrGraph;
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <p> Значение по оси OX: </p>
                <div>
                    <input type="radio" name="ox" value="Страна" defaultChecked={ox === "Страна"} />
                    Страна
                    <br />
                    <input type="radio" name="ox" value="Год" />
                    Год
                </div>

                <p> Значение по оси OY </p>
                <div style={highlightError ? { color: "red", padding: "5px" } : {}}>
                    <input type="checkbox" name="oy" defaultChecked={oy[0]} onChange={() => setHighlightError(false)} />
                    Максимальная высота <br />
                    <input type="checkbox" name="oy" defaultChecked={oy[1]} onChange={() => setHighlightError(false)} />
                    Минимальная высота
                </div>

                <p>Тип диаграммы:</p>
                <select name="chartType" defaultValue={chartType}>
                    <option value="scatter">Точечная диаграмма</option>
                    <option value="bar">Гистограмма</option>
                </select>

                <p>
                    <button type="submit">Построить</button>
                </p>
                {error && <div style={{ color: "red" }}>{error}</div>}
                {!error && (
                    <ChartDraw
                        data={createArrGraph(props.data, ox)}
                        showMax={oy[0]}
                        showMin={oy[1]}
                        chartType={chartType}
                    />
                )}
            </form>


        </>
    )
}

export default Chart;