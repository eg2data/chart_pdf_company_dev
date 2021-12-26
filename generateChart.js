import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import ChartJS from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'
import fs from "fs";
// labelmake-template.json > "fontName":"NanumGothic"

// type: 'svg' 이거 주면 생성이 안됨 pdf가.
// const chartJSNodeCanvas = new ChartJSNodeCanvas({ type: 'svg', width: 340, height: 136});

// global font를 NanumGothic로 통일하고자 함
// generatePdf.js에서 export하고 여기서 import? 그리고 ChartJS.defaults에서 적용? 안됨.
// const NanumGothic = fs.readFileSync("./NanumGothic-Regular.ttf")
// const font = {
//     NanumGothic : {
//         data: NanumGothic,
//         subset: false
//     }
// };
// ChartJS.defaults.font.family = NanumGothic;
// ChartJS.defaults.font.family = "Arial";
// ChartJS.defaults.font.family = "NanumGothic";


// 0. 7 types of canvascanvas
const radarLargeCanvas = new ChartJSNodeCanvas({ width: 540, height: 450 });
const radarSmallCanvas = new ChartJSNodeCanvas({ width: 540, height: 300 });
const barVerLargeCanvas = new ChartJSNodeCanvas({ width: 540, height: 324 });
const barVerSmallCanvas = new ChartJSNodeCanvas({ width: 540, height: 96 });
const barHorLargeCanvas = new ChartJSNodeCanvas({ width: 480, height: 36 });
const barHorSmallCanvas = new ChartJSNodeCanvas({ width: 240, height: 36 });
const polarAreaCanvas = new ChartJSNodeCanvas({ width: 216, height: 68 });

// 기존 변수명
// const generalMentalIllnessOverallCanvas = new ChartJSNodeCanvas({ width: 540, height: 450 });
// const generalMentalIllnessMean5yrsCanvas = new ChartJSNodeCanvas({ width: 540, height: 216 });
// const generalOccuStressOverallCanvas = new ChartJSNodeCanvas({ width: 540, height: 324 });
// const generalOccuStressMean5yrsCanvas = new ChartJSNodeCanvas({ width: 540, height: 96 });
// // 증상별 비교수치/증상별위험소분류top3 비교수치/대분류 수치 canvas
// const generalMentalIllnessEachCanvas = new ChartJSNodeCanvas({ width: 480, height: 36 });
// // 직무스트레스별 비교수치 canvas - template에 1개는 생성해두기
// const generalOccuStressEachCanvas = new ChartJSNodeCanvas({ width: 240, height: 36 });
// // 분류별점수, 분류별 5개년평균결과 canvas - template에 1개는 생성해두기
// const everyScaleCatOverallPointMean5yrsCanvas = new ChartJSNodeCanvas({ width: 216, height: 68 });



// 총 5가지 종류의 charts 활용
    // hexagon(mental illness) / heptagon(occupational stress)
    // vertical-bar(5 years mean) / horizontal-bar(risk priority in cat-overall)
    // polar-area(points in cat-overall)

// 1. <defaults>
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
                color: [
                   'rgb(239, 239, 239)',
                    'rgb(251, 240, 220)',
                    'rgb(244, 209, 212)',
                    'rgb(223, 207, 209)'
                ]
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
    },
    plugins: {
        legend: {
            display: false
        }
    }
}
    // mean 5years vertical bar default scales - change plugins only.
const mean5yrsScales =  {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: [
                        'rgb(0, 0, 0)',
                        'rgb(0, 0, 0)',
                        'rgb(0, 0, 0)',
                        'rgb(0, 0, 0)',
                        'rgba(255, 255, 255, 0.5)'
                    ], // white로 하면 글자가 아예 안보이네 음..
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
                    color: [
                        'black',
                        'rgb(239, 239, 239)',
                        'rgb(251, 240, 220)',
                        'rgb(244, 209, 212)',
                        'rgb(223, 207, 209)'
                    ] // black 안넣고 표현 안되나.. 시작이 0이 아니도록.
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
        pointStyle: 'dash', // 그나마 dash가 가장..
        borderWidth: 3,
        borderColor: 'rgb(0, 0, 0)',
    },
    {
        data: [35, 54, 51, 47, 51, 20],
        fill: true,
        backgroundColor: 'rgba(201, 201, 201, 0.4)',
        pointStyle: 'dash',
        borderWidth: 1,
        borderColor: 'rgb(137, 137, 137)',
    }]
const generalMentalIllnessMean5yrsData = [
    {
        data: [45, 62, 71, 59, 48],
        barPercentage: 0.5,
        backgroundColor: [
            'rgba(139, 139, 139, 0.7)',
            'rgba(139, 139, 139, 0.7)',
            'rgba(139, 139, 139, 0.7)',
            'rgba(139, 139, 139, 0.7)',
            'rgba(0, 0, 0, 0.7)',
        ],
    }
]
// const generalMentalIllnessEachPHQ9Data = []
// const generalMentalIllnessEachGAD7Data = []
// const generalMentalIllnessEachADNM4Data = []
// const generalMentalIllnessEachPCPTSD5Data = []
// const generalMentalIllnessEachKOSSSFData = []
// const generalMentalIllnessEachP4Data = []

    // 2) General Page - Occupational Stress
const generalOccuStressOverallMaleData = [
    {
        data: [89, 47, 35, 31, 39, 26, 45], // get from DB
        fill: false,
        pointStyle: 'dash', // 그나마 dash가 가장..
        borderWidth: 3,
        borderColor: 'rgb(0, 0, 0)',
    },
    {
        data: [70, 50, 35, 35, 35, 40, 40],
        fill: false,
        pointStyle: 'dash',
        borderWidth: 1,
        borderColor: 'rgb(137, 137, 137)',
    }]
const generalOccuStressOverallFemaleData = [
    {
        data: [36, 47, 35, 31, 39, 67, 45], // get from DB
        fill: false,
        pointStyle: 'dash', // 그나마 dash가 가장..
        borderWidth: 3,
        borderColor: 'rgb(0, 0, 0)',
    },
    {
        data: [35, 45, 40, 30, 40, 55, 40],
        fill: false,
        pointStyle: 'dash',
        borderWidth: 1,
        borderColor: 'rgb(137, 137, 137)',
    }]
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
    { // 마지막 점 옆에는 이 데이터셋의 이름을 넣기. label 살려보면 될까?
        type: 'line',
        // label: occuStressLabels[2], // 요인별 결과값 중 가장 높은 것. 지금은 임의의 값
        data: [50, 40, 80, 70, 90], // 가장 높은 그것의 5개년 추이
        pointStyle: 'circle',
        pointBackgroundColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgb(0, 0, 0)',
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 1
    }
]
const generalOccuStressMean5yrsFemaleData = [
    {
        type: 'bar',
        data: [30, 80, 75, 65, 20],
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
        pointStyle: 'circle',
        pointBackgroundColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgb(0, 0, 0)',
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 1
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
                legend: {
                    display: false
                }
            }
        },
        plugins: [ChartDataLabels] // 이러면 y값이 차트 안으로 들어오긴 한다
    };
    // const generalMentalIllnessEachPHQ9Config = {
    //     type: 'bar',
    //     data: {
    //         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    //         datasets: [{
    //             label: '# of Votes',
    //             data: [12, 19, 3, 5, 2, 3],
    //             backgroundColor: [
    //                 'rgba(255, 99, 132, 0.2)',
    //                 'rgba(54, 162, 235, 0.2)',
    //                 'rgba(255, 206, 86, 0.2)',
    //                 'rgba(75, 192, 192, 0.2)',
    //                 'rgba(153, 102, 255, 0.2)',
    //                 'rgba(255, 159, 64, 0.2)'
    //             ],
    //             borderColor: [
    //                 'rgba(255,99,132,1)',
    //                 'rgba(54, 162, 235, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(75, 192, 192, 1)',
    //                 'rgba(153, 102, 255, 1)',
    //                 'rgba(255, 159, 64, 1)'
    //             ],
    //             borderWidth: 1
    //         }]
    //     },
    //     options: {
    //     },
    //
    // };

    // const generalMentalIllnessEachGAD7Config = {}
    // const generalMentalIllnessEachADNM4Config = {}
    // const generalMentalIllnessEachPCPTSD5Config = {}
    // const generalMentalIllnessEachKOSSSFConfig = {}
    // const generalMentalIllnessEachP4Config = {}


        // 2) General Page - Occupational Stress
    const generalOccuStressOverallMaleConfig = {
        type: 'radar',
        data: {
            labels: occuStressLabels,
            datasets: generalOccuStressOverallMaleData,
        },
        options: overallOptions,
    };
    const generalOccuStressOverallFemaleConfig = {
        type: 'radar',
        data: {
            labels: occuStressLabels,
            datasets: generalOccuStressOverallFemaleData,
        },
        options: overallOptions,
    };
    // 직무스트레스 요인별 결과 추가해야(+template도 아직 추가하지 않음)
    const generalOccuStressMean5yrsMaleConfig = {
        data: {
            labels: mean5yrsLabels,
            datasets: generalOccuStressMean5yrsMaleData
        },
        options: {
            scales: mean5yrsScales,
            plugins: {
                legend: {
                    display: false
                }
            },
        },
    };
    const generalOccuStressMean5yrsFemaleConfig = {
        data: {
            labels: mean5yrsLabels,
            datasets: generalOccuStressMean5yrsFemaleData
        },
        options: {
            scales: mean5yrsScales,
            plugins: {
                legend: {
                    display: false
                }
            },
        },
    };



    // 4. <generate base64 types img through renderToDataURL>
        // 1) General Page - Mental Illness
    const generalMentalIllnessOverallChart = await radarLargeCanvas.renderToDataURL(generalMentalIllnessOverallConfig);
    const generalMentalIllnessMean5yrsChart  = await barVerLargeCanvas.renderToDataURL(generalMentalIllnessMean5yrsConfig);
    // const generalMentalIllnessEachPHQ9Chart = await barHorLargeCanvas.renderToDataURL(generalMentalIllnessEachPHQ9Config);
    // const generalMentalIllnessEachGAD7Chart = await barHorLargeCanvas.renderToDataURL(generalMentalIllnessEachGAD7Config);
    // const generalMentalIllnessEachADNM4Chart = await barHorLargeCanvas.renderToDataURL(generalMentalIllnessEachADNM4Config);
    // const generalMentalIllnessEachPCPTSD5Chart = await barHorLargeCanvas.renderToDataURL(generalMentalIllnessEachPCPTSD5Config);
    // const generalMentalIllnessEachKOSSSFChart = await barHorLargeCanvas.renderToDataURL(generalMentalIllnessEachKOSSSFConfig);
    // const generalMentalIllnessEachP4Chart = await barHorLargeCanvas.renderToDataURL(generalMentalIllnessEachP4Config);

    // 2) General Page - Occupational Stress
    const generalOccuStressOverallMaleChart = await radarSmallCanvas.renderToDataURL(generalOccuStressOverallMaleConfig);
    const generalOccuStressOverallFemaleChart = await radarSmallCanvas.renderToDataURL(generalOccuStressOverallFemaleConfig);
    // 직무스트레스 요인별 결과 추가해야(+template도 아직 추가하지 않음) - barHorSmallCanvas
    const generalOccuStressMean5yrsMaleChart = await barVerSmallCanvas.renderToDataURL(generalOccuStressMean5yrsMaleConfig);
    const generalOccuStressMean5yrsFemaleChart = await barVerSmallCanvas.renderToDataURL(generalOccuStressMean5yrsFemaleConfig);
    //


    // 5. <add to charts and return>
    const charts = {
        // 1) General Page - Mental Illness
        "general-mentalIllness-overall": generalMentalIllnessOverallChart,
        "general-mentalIllness-mean5yrs": generalMentalIllnessMean5yrsChart,
        // "general-mentalIllness-each-PHQ9": generalMentalIllnessEachPHQ9Chart,
        // "general-mentalIllness-each-GAD7": generalMentalIllnessEachGAD7Chart,
        // "general-mentalIllness-each-ADNM4": generalMentalIllnessEachADNM4Chart,
        // "general-mentalIllness-each-PCPTSD5": generalMentalIllnessEachPCPTSD5Chart,
        // "general-mentalIllness-each-KOSSSF": generalMentalIllnessEachKOSSSFChart,
        // "general-mentalIllness-each-P4": generalMentalIllnessEachP4Chart,

        // 2) General Page - Occupational Stress
        "general-occuStress-overall-male": generalOccuStressOverallMaleChart,
        "general-occuStress-overall-female": generalOccuStressOverallFemaleChart,
        // 직무스트레스 요인별 결과 추가해야(+template도 아직 추가하지 않음)
        "general-occuStress-mean5yrs-male": generalOccuStressMean5yrsMaleChart,
        "general-occuStress-mean5yrs-female": generalOccuStressMean5yrsFemaleChart,
    }
    return charts
};

export { generateChart };



