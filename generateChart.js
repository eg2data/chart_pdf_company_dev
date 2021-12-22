import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import ChartJS from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'
import fs from "fs";

// labelmake-template.json > "fontName":"NanumGothic"

// 여기 사실 필요없는데 음.
const width = 500; //px
const height = 500; //px
const backgroundColour = 'white';
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour});

// 총 5가지 종류의 charts 활용
    // hexagon(mental illness) / heptagon(occupational stress)
    // vertical-bar(5 years mean) / horizontal-bar(risk priority in cat-overall)
    // polar-area(points in cat-overall)

// 전체 폰트를 NanumGothic로 통일하고자 함. generatePdf.js에서 export하고 여기서 import? 그리고 ChartJS.defaults에서 적용? 근데 일단 안됨
// legend 또한 template 처리 + 색상 pick 하여 적용
ChartJS.defaults.plugins.legend.display = false;
ChartJS.defaults.font.size = 15; // radar의 label에는 왜 안먹지// 1. <defaults>
    // labels for hexagon, heptagon
const mentalIllnessLabels = [
    '우울감',
    '불안감',
    '적응 스트레스',
    '외상 스트레스',
    '불면증',
    '극단적 선택\n가능성',
]
const occuStressLabels = [
    '직무 요구',
    '직무 자율',
    '관계 갈등',
    '직무 불안정',
    '조직 체계',
    '보상 부적절',
    '직장 문화',
]
const mean5yrsLabels = [ // 해당년 기준 5개년 자동화
    '2017',
    '2018',
    '2019',
    '2020',
    '2021'
]
    // hexagon, heptagon default options
const overallOptions = {
    scales: {
        r: {
            angleLines: {
                display: false
            },
            grid: {
                color: ['red', 'blue', 'black', 'yellow']
            },
            pointLabels: {
                color: 'black',
                font: {
                    size: 15
                }
            },
            ticks: {
                display: false,
                stepSize: 25
            }
        },
    }
}
    // mean 5years vertical bar default scales - change plugins only.
const mean5yrsScales =  {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: ['black', 'black', 'black', 'black', 'gray'], // white로 하면 글자가 아예 안보이네 음..
                    autoskip: false,
                    maxRotation: 90,
                    minRotation: 90,
                    padding: -70,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    drawBorder: false,
                    color: ['black', 'red', 'blue', 'black', 'yellow'] // black 안넣고 표현 안되나.. 시작이 0이 아니도록.
                },
                ticks: {
                    display: false,
                    stepSize: 20,
                }
            }
        }

// 2. <input data>
    // 1) General Page - Mental Illness
const generalMentalIllnessOverallData = [
    {
        data: [70, 42, 76, 15, 36, 20], // get from DB
        fill: false,
        backgroundColor: 'rgba(0, 0, 0, 0.0)',
        pointStyle: 'dash', // 그나마 dash가 가장..
        borderWidth: 0.7,
        borderColor: 'black',
    },
    {
        data: [35, 54, 51, 47, 51, 20],
        fill: true,
        backgroundColor: 'rgba(135, 135, 135, 0.4)',
        pointStyle: 'dash',
        borderWidth: 0.5,
        borderColor: 'black',
    }]
const generalMentalIllnessMean5yrsData = [
    {
        data: [45, 62, 71, 59, 48],
        barPercentage: 0.5,
        backgroundColor: [
            'rgba(135, 135, 135, 0.4)',
            'rgba(135, 135, 135, 0.4)',
            'rgba(135, 135, 135, 0.4)',
            'rgba(135, 135, 135, 0.4)',
            'rgba(33, 33, 33, 0.8)',
        ],
    }
]
const generalMentalIllnessEachPHQ9Data = []
    // 2) General Page - Occupational Stress
const generalOccuStressMean5yrsMaleData = [
    {
        type: 'bar',
        data: [45, 55, 65, 50, 65],
        barPercentage: 0.5,
        backgroundColor: [
            'rgba(135, 135, 135, 0.4)',
            'rgba(135, 135, 135, 0.4)',
            'rgba(135, 135, 135, 0.4)',
            'rgba(135, 135, 135, 0.4)',
            'rgba(33, 33, 33, 0.8)',
        ],
    },
    { // 검은색으로, 좀 더 두껍게 / 점 만들기 / 마지막 점 옆에는 이 데이터셋의 이름을 넣기. label 살려보면 될까?
        type: 'line',
        label: occuStressLabels[2], // 요인별 결과값 중 가장 높은 것. 지금은 임의의 값
        data: [50, 40, 80, 70, 90], // 가장 높은 그것의 5개년 추이
        pointStyle: 'circle',
        pointBackgroundColor: 'black',
        backgroundColor: 'black',
        borderColor: 'black',
        borderWidth: 5
    }
]
const generalOccuStressMean5yrsFemaleData = [
    {
        type: 'bar',
        data: [45, 55, 65, 50, 65],
        barPercentage: 0.5,
        backgroundColor: [
            'rgba(135, 135, 135, 0.4)',
            'rgba(135, 135, 135, 0.4)',
            'rgba(135, 135, 135, 0.4)',
            'rgba(135, 135, 135, 0.4)',
            'rgba(33, 33, 33, 0.8)',
        ],
    },
    {
        type: 'line',
        data: [50, 40, 70, 60, 30],
    }
    ]


async function generateChart() {
    // 3. <configurations>
        // 1) General Page - Mental Illness
    const generalMentalIllnessOverallConfig = {
        type: 'radar',
        data: {
            labels: mentalIllnessLabels,
            datasets: generalMentalIllnessOverallData,
        },
        options: overallOptions,
    };
    const generalMentalIllnessMean5yrsConfig = {
        type: 'bar',
        data: {
            labels: mean5yrsLabels,
            datasets: generalMentalIllnessMean5yrsData
        },
        options: {
            scales: mean5yrsScales,
            plugins: {
                datalabels: { // '점' text를 추가하는 것은.. + 경계/위험 등의 추가 이미지.. 가능?
                    color: 'black',
                    anchor: 'end',
                    align: 'top',
                },
            }
        },
        plugins: [ChartDataLabels] // 이러면 y값이 차트 안으로 들어오긴 한다
    };
    const generalMentalIllnessEachPHQ9Config = {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
        },

    };
        // 2) General Page - Occupational Stress
    const generalOccuStressMean5yrsMaleConfig = {
        data: {
            labels: mean5yrsLabels,
            datasets: generalOccuStressMean5yrsMaleData
        },
        options: {
            scales: mean5yrsScales,
        },
    };

    // 4. <generate base64 types img through renderToDataURL>
        // 1) General Page - Mental Illness
    const generalMentalIllnessOverallChart = await chartJSNodeCanvas.renderToDataURL(generalMentalIllnessOverallConfig);
    const generalMentalIllnessMean5yrsChart  = await chartJSNodeCanvas.renderToDataURL(generalMentalIllnessMean5yrsConfig);
    const generalMentalIllnessEachPHQ9Chart = await chartJSNodeCanvas.renderToDataURL(generalMentalIllnessEachPHQ9Config);
        // 2) General Page - Occupational Stress
    const generalOccuStressMean5yrsMaleChart = await chartJSNodeCanvas.renderToDataURL(generalOccuStressMean5yrsMaleConfig);

    // 5. <add to charts and return>
    const charts = {
        // 1) General Page - Mental Illness
        "general-mentalIllness-overall": generalMentalIllnessOverallChart,
        "general-mentalIllness-mean5yrs": generalMentalIllnessMean5yrsChart,
        "general-mentalIllness-each-PHQ9": generalMentalIllnessEachPHQ9Chart,
        // 2) General Page - Occupational Stress
        "general-occuStress-mean5yrs-male": generalOccuStressMean5yrsMaleChart,

    }
    return charts
};

export { generateChart };



