// components/ChartDraw.js
import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";

const ChartDraw = (props) => {
    const chartRef = useRef(null);
    
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    // Заносим в состояния ширину и высоту SVG-элемента
    useEffect(() => {
        const svg = d3.select(chartRef.current);      
        setWidth(parseFloat(svg.style('width')) || 600); // Устанавливаем начальное значение
        setHeight(parseFloat(svg.style('height')) || 400);
    }, []);

    // Задаем отступы в SVG-элементе
    const margin = {
        top: 10, 
        bottom: 60, 
        left: 40, 
        right: 10
    };
        
    // Вычисляем ширину и высоту области для вывода графиков
    const boundsWidth = width - margin.left - margin.right;
    const boundsHeight = height - margin.top - margin.bottom;

    // Очистка SVG при активации clearChart
    useEffect(() => {
        if (props.clearChart) {
            const svg = d3.select(chartRef.current);
            svg.selectAll("*").remove();
        }
    }, [props.clearChart]);

    // Выводим прямоугольник
    useEffect(() => {
        const svg = d3.select(chartRef.current);
        svg
        .append("rect")
        .attr("x", margin.left)
        .attr("y", margin.top)
        .attr("width", boundsWidth)
        .attr("height", boundsHeight)
        .style("fill", "lightgrey");
    }, [boundsWidth, boundsHeight]);

    const allValues = props.data.flatMap(d => [d.values[0], d.values[1]]);
    let [min, max] = d3.extent(allValues);
        
    // Формируем шкалы для осей
    const scaleX = useMemo(() => {
        return d3
            .scaleBand()
            .domain(props.data.map(d => d.labelX))
            .range([0, boundsWidth])
    }, [props.data, boundsWidth]);

    const scaleY = useMemo(() => {
        return d3
            .scaleLinear()
            .domain([min * 0.85, max * 1.1])
            .range([boundsHeight, 0])
    }, [boundsHeight, min, max]);

    useEffect(() => {
        if (!props.showMax && !props.showMin) return;

        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove();
        
        // Рисуем оси
        const xAxis = d3.axisBottom(scaleX);     
        svg.append("g")
            .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
            .call(xAxis)
            .selectAll("text") 
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", d => "rotate(-30)");

        const yAxis = d3.axisLeft(scaleY);
        svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .call(yAxis);
        
        const shift = 5;

        // Рисуем график
        if (props.chartType === "scatter") {
            if (props.showMax) {
                svg.selectAll(".max-dot")
                    .data(props.data)
                    .enter()
                    .append("circle")
                    .attr("r", 5)
                    .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2 + shift)
                    .attr("cy", d => scaleY(d.values[1]))
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)
                    .style("fill", "red");
            }
            
            if (props.showMin) {
                svg.selectAll(".min-dot")
                    .data(props.data)
                    .enter()
                    .append("circle")
                    .attr("r", 5)
                    .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2 + shift - 3)
                    .attr("cy", d => scaleY(d.values[0]))
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)
                    .style("fill", "blue");
            }
        } else {
            const barWidth = 10;
            
            if (props.showMax) {
                svg.selectAll(".max-bar")
                    .data(props.data)
                    .enter()
                    .append("rect")
                    .attr("x", d => scaleX(d.labelX) + scaleX.bandwidth() / 2 - barWidth/2 + 5)
                    .attr("y", d => scaleY(d.values[1]))
                    .attr("width", barWidth)
                    .attr("height", d => boundsHeight - scaleY(d.values[1]))
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)
                    .style("fill", "red");
            }
            
            if (props.showMin) {
                svg.selectAll(".min-bar")
                    .data(props.data)
                    .enter()
                    .append("rect")
                    .attr("x", d => scaleX(d.labelX) + scaleX.bandwidth() / 2 - barWidth/2 - 5)
                    .attr("y", d => scaleY(d.values[0]))
                    .attr("width", barWidth)
                    .attr("height", d => boundsHeight - scaleY(d.values[0]))
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)
                    .style("fill", "blue");
            }
        }

    }, [scaleX, scaleY, props.data, props.showMax, props.showMin, props.chartType, height]);

    return (
        <svg ref={chartRef} width="600" height="400"></svg>
    )
}

export default ChartDraw;