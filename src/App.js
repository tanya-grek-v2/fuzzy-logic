import './App.css';
import React, { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import {
    cold,
    COLD_TEA,
    hot,
    HOT_TEA,
    NOT,
    SLIGHTLY,
    TEMPERATURES_TYPES,
    VERY,
    warm,
    WARM_TEA
} from './constants';

const series = Object.freeze([ // початкові данні
    {
        name: 'Холодний чай',
        data: Object.freeze(cold),
        id: COLD_TEA,
    },
    {
        name: 'Помірної температури чай',
        data: Object.freeze(warm),
        id: WARM_TEA,
    },
    {
        name: 'Гарячий чай',
        data: Object.freeze(hot),
        id: HOT_TEA,
    },
]);

export default function App() {
    const [userLine, setUserLine] = useState([]);
    const [value, setValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const fuzzyLine = [];

        TEMPERATURES_TYPES.forEach(t => { // в константах задано всі можливі типи температур, пройдемо циклом по всім, щоб сформувати новий масив.
            // Реалізовано таким чином, що якщо задано, наприклад, "холодний", то всі значення з "холодного" графіку будуть додані до нового масиву.
            // Також, якщо задано, наприклад, "холодний та помірної температури чай", то всі значення з "холодного" та "помірної температури" графіків будуть додані до нового масиву
            if (value.indexOf(t) > -1) {
                const currentData = series.find(({ id }) => id === t).data;
                currentData.forEach(c => {
                    const index = fuzzyLine.findIndex(f => f?.category === c.category);
                    if (index > -1) { // якщо поточне значення є, то записуємо те, що має найбільше значення
                        fuzzyLine[index].value = c.value > fuzzyLine[index].value ? c.value : fuzzyLine[index].value
                    } else { // якщо поточного значення ще немає, то додаємо його
                        fuzzyLine.push({ ...c });
                    }
                })
            }
        })

        if (value.indexOf(NOT) > -1) { // якщо задано, наприклад, "не холодний", то всі значення з "холодного" графіку будуть перераховані.
            fuzzyLine.forEach(f => {
                f.value = 1 - Number(f.value);
            })
        }
        // також, якщо задано, наприклад, "дуже холодний", то всі значення з "холодного" графіку будуть перераховані.
        if (value.indexOf(VERY) > -1) {
            fuzzyLine.forEach(f => {
                f.value = Number(Math.pow(f.value, 2).toFixed(2));
            })
        }
        if (value.indexOf(SLIGHTLY) > -1) {
            fuzzyLine.forEach(f => {
                f.value = Number(Math.pow(f.value, 0.5).toFixed(2));
            })
        }

        setUserLine(fuzzyLine); // зберегли масив у глобальну змінну для подальшої роботи
    }

    return (
        <div className="container">
            <h1>Температура чаю</h1>
            <p>Варіанти:</p>
            <ul>
                <li>"Холодний чай"</li>
                <li>"Помірної температури чай"</li>
                <li>"Гарячий чай"</li>
            </ul>
            <form>
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value.toLowerCase())}
                    className="input"
                />
                <input type="submit" onClick={handleSubmit} value="Зчитати" className="btn" />
            </form>
            <LineChart width={500} height={300}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" type="category" allowDuplicatedCategory={false} />
                <YAxis dataKey="value" />
                <Tooltip />
                <Legend />
                {[...series, {
                    name: 'Задано юзером',
                    data: userLine,
                    id: 'userLine',
                    stroke: '#00bc00',
                    strokeWidth: 3,
                }].map((s) => (
                    <Line dataKey="value" data={s.data} name={s.name} key={s.name} stroke={s.stroke}
                          strokeWidth={s.strokeWidth} dot={null} />
                ))}
            </LineChart>
        </div>
    );
}
