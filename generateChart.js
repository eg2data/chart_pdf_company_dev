import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import ChartJS from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'
import fs from "fs";

// 1. <input data> - rabbitMQ로부터 받아와야 할 것.
// 1) General Page - Mental Illness
const generalMentalIllnessOverallData = [
        [70, 42, 76, 15, 36, 20],
        [35, 54, 51, 47, 51, 20], // 업계평균
]
const generalMentalIllnessMean5yrsData = [24, 49, 74, 76, 80]
const generalMentalIllnessEachPHQ9Data = [24, 15]
const generalMentalIllnessEachGAD7Data = [75, 33]
const generalMentalIllnessEachADNM4Data = [23, 79]
const generalMentalIllnessEachPCPTSD5Data = [77, 77]
const generalMentalIllnessEachKOSSSFData = [99, 9] // 값이 10 이하면 점이 좀 찌그러지는.. why?
const generalMentalIllnessEachP4Data = [90, 10]

// each 부등호 추가
function generateCompareSignal(dataName) {
    if (dataName[0] > dataName[1]) {
        dataName.push(">")
    } else if (dataName[0] < dataName[1]) {
        dataName.push("<")
    } else {
        dataName.push("=")
    }
}
generateCompareSignal(generalMentalIllnessEachPHQ9Data);
generateCompareSignal(generalMentalIllnessEachGAD7Data);
generateCompareSignal(generalMentalIllnessEachADNM4Data);
generateCompareSignal(generalMentalIllnessEachPCPTSD5Data);
generateCompareSignal(generalMentalIllnessEachKOSSSFData);
generateCompareSignal(generalMentalIllnessEachP4Data);
// each PDF 해당 영역에 뿌리기
function getIntData(dataName, index) {
    return dataName[index].toString()
}

// 2) General Page - Occupational Stress
const generalOccuStressOverallMaleData = [
    [89, 47, 35, 31, 39, 26, 45],
    [70, 50, 35, 35, 35, 40, 40],
]
const generalOccuStressOverallFemaleData = [
    [36, 47, 35, 31, 39, 67, 45],
    [35, 45, 40, 30, 40, 55, 40]
]
const generalOccuStressEachMaleDemandsData = [75, 75] // 마찬가지로 9 이하에서는 찌그러지는구나.
const generalOccuStressEachMaleAutonomyData = [50, 25]
const generalOccuStressEachMaleConflictData = [40, 75]
const generalOccuStressEachMaleInstabilityData = [20, 85]
const generalOccuStressEachMaleSystemData = [33, 11]
const generalOccuStressEachMaleRewardData = [11, 55]
const generalOccuStressEachMaleCultureData = [50, 75]
const generalOccuStressEachFemaleDemandsData = [22, 80] // 마찬가지로 9 이하에서는 찌그러지는구나.
const generalOccuStressEachFemaleAutonomyData = [25, 50]
const generalOccuStressEachFemaleConflictData = [75, 75]
const generalOccuStressEachFemaleInstabilityData = [50, 55]
const generalOccuStressEachFemaleSystemData = [15, 81]
const generalOccuStressEachFemaleRewardData = [60, 75]
const generalOccuStressEachFemaleCultureData = [36, 70]
generateCompareSignal(generalOccuStressEachMaleDemandsData);
generateCompareSignal(generalOccuStressEachMaleAutonomyData);
generateCompareSignal(generalOccuStressEachMaleConflictData);
generateCompareSignal(generalOccuStressEachMaleInstabilityData);
generateCompareSignal(generalOccuStressEachMaleSystemData);
generateCompareSignal(generalOccuStressEachMaleRewardData);
generateCompareSignal(generalOccuStressEachMaleCultureData);
generateCompareSignal(generalOccuStressEachFemaleDemandsData);
generateCompareSignal(generalOccuStressEachFemaleAutonomyData);
generateCompareSignal(generalOccuStressEachFemaleConflictData);
generateCompareSignal(generalOccuStressEachFemaleInstabilityData);
generateCompareSignal(generalOccuStressEachFemaleSystemData);
generateCompareSignal(generalOccuStressEachFemaleRewardData);
generateCompareSignal(generalOccuStressEachFemaleCultureData);

const generalOccuStressMean5yrsMaleData = [
    [85, 55, 65, 50, 65],
    [50, 40, 80, 70, 90], // 마지막 점 옆에는 이 데이터셋의 이름을 넣기. label 살려보면 될까? 가장 높은 그것의 5개년 추이, label
]
const generalOccuStressMean5yrsFemaleData = [
    [30, 80, 75, 65, 20],
    [50, 40, 70, 60, 30]
]

// 2. 7 types of canvascanvas
const radarLargeCanvas = new ChartJSNodeCanvas({ width: 540, height: 450 });
const radarSmallCanvas = new ChartJSNodeCanvas({ width: 540, height: 300 });
const barVerLargeCanvas = new ChartJSNodeCanvas({ width: 540, height: 324 });
const barVerSmallCanvas = new ChartJSNodeCanvas({ width: 540, height: 96 });
const barHorLargeCanvas = new ChartJSNodeCanvas({ width: 480, height: 36 });
const barHorSmallCanvas = new ChartJSNodeCanvas({ width: 240, height: 36 });
const polarAreaCanvas = new ChartJSNodeCanvas({ width: 216, height: 68 });
// level을 위한 canvas 생성하고

// 3. <defaults>
    // labels for hexagon, heptagon
const now = new Date();
const year = now.getFullYear();
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
const mean5yrsLabels = [
    year-4,
    year-3,
    year-2,
    year-1,
    year,
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
                color: 'rgb(0, 0, 0)',
                font: {
                    family: 'asdf', // 이 font-family를.. 어디선가 등록해야 여기서 불러올 수 있다는게 나의 생각. 그 등록을 어디서 하느냐..가 나의 의문
                    size: 15, // 이게 우울감 등의 크기에 적용되는거보니, font family도 여기서 지정하는게 맞는거 같은데.. how?
                    weight: 700
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
const mean5yrsScales = {
    x: {
        grid: {
            display: false
        },
        ticks: {
            font: {
                size: 18,
                weight: 'bold',
                lineHeight: 0
            },
            color: [
                'rgb(0, 0, 0)',
                'rgb(0, 0, 0)',
                'rgb(0, 0, 0)',
                'rgb(0, 0, 0)',
                'rgb(0, 0, 0)', // white로 하면 글자 아예 안보이네
            ],
            // 연도를 세로로 넣어준 효과는 여기서 -> 가운데로 정렬하는 방법을 연구할 필요가 있음. 아니면 걍 없는게 나은 듯.
            //autoskip: false,
            maxRotation: 90,
            minRotation: 90,
            padding: -55, // 세로 기준 잡은 padding
            // padding: -28, // 가로 기준 잡은 padding.

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
            ], // black 안넣고 표현 안되나.. 시작이 0이 아니도록.
        },
        ticks: {
            display: false,
            beginAtZero: true,
            stepSize: 25,
        },
        min: 0,
        max: 100,
    }
}
    // each horizontal bar default scalesv
const eachScales =  {
    x: {
        grid: {
            drawBorder: false,
            display: false
        },
        ticks: {
            display: false,
        },
        min: 0,
        max: 100,
    },
    y: {
        grid: {
            drawBorder: false,
            display: false,
        },
        ticks: {
            display: false,
        }
    }
}

async function generateChart() {
    // 4. <configurations>
        // 1) General Page - Mental Illness
    const generalMentalIllnessOverallConfig = {
        type: 'radar',
        data: {
            labels: mentalIllnessLabels,
            datasets: [
                {
                    data: generalMentalIllnessOverallData[0],
                    fill: false,
                    pointStyle: 'dash', // 그나마 dash가 가장.. but 교체 필요
                    borderWidth: 3,
                    borderColor: 'rgb(0, 0, 0)',
                },
                {
                    data: generalMentalIllnessOverallData[1],
                    fill: true,
                    backgroundColor: 'rgba(201, 201, 201, 0.4)',
                    pointStyle: 'dash',
                    borderWidth: 1,
                    borderColor: 'rgb(137, 137, 137)',
                }]
        },
        options: overallOptions,
    };
    const generalMentalIllnessMean5yrsConfig = {
        type: 'bar',
        data: {
            labels: mean5yrsLabels,
            datasets: [
                    {
                        data: generalMentalIllnessMean5yrsData, // 95까지 datalabels 표현 가능, 만약 마지막해에 작년대비를 넣는다면..  필요한가 근데? 불필요하다고 생각함.
                        barPercentage: 0.7,
                        backgroundColor: [],
                    }
                ]
        },
        plugins: [ChartDataLabels], // 이러면 y값이 차트 안으로 들어오긴 한다
        options: {
            scales: mean5yrsScales,
            plugins: {
                datalabels: { // '점' text를 추가하는 것은.. + 경계/위험 등의 추가 이미지.. 불가
                    color: 'gray',
                    anchor: 'end',
                    align: 'top', // end였다.. 해결!
                    // offset: 5,
                    backgroundColor: [],
                    borderWidth: 10,
                    borderRadius: 5,
                    // font: {
                    //     weight: 'bold'
                    // },
                },
                legend: {
                    display: false
                }
            }
        },
    };
    // input data의 value에 따라 bar+value의 배경색으로 정상/경계/위험/심각 표현 + '점' 추가.. 왜 안돼? console에는 잡히는데 음.
        for( let i = 0; i < generalMentalIllnessMean5yrsData.length; i++) {
        if (generalMentalIllnessMean5yrsData[i] < 25) {
            generalMentalIllnessMean5yrsConfig.data.datasets[0].backgroundColor[i] = 'rgba(239, 239, 239, 0.5)'
            // generalMentalIllnessMean5yrsData[0].data[i] = generalMentalIllnessMean5yrsData[0].data[i].toString().concat('                    ') // 이건 잡히는거 보니, 알파벳 문제인가본데.
            // generalMentalIllnessMean5yrsData[0].data[i] = "한글" // 이거 안잡히네. 한글처리 문제다. 음........
            // generalMentalIllnessMean5yrsData[0].data[i] = "abc" // 이거 안잡히네. 그냥 문자열 처리 문제구나.
            generalMentalIllnessMean5yrsConfig.options.plugins.datalabels.backgroundColor[i] = 'rgba(239, 239, 239, 0.5)'
        } else if (generalMentalIllnessMean5yrsData[i] < 50) {
            generalMentalIllnessMean5yrsConfig.data.datasets[0].backgroundColor[i] = 'rgba(251, 240, 220, 0.5)'
            generalMentalIllnessMean5yrsConfig.options.plugins.datalabels.backgroundColor[i] = 'rgba(251, 240, 220, 0.5)'
        } else if (generalMentalIllnessMean5yrsData[i] < 75) {
            generalMentalIllnessMean5yrsConfig.data.datasets[0].backgroundColor[i] = 'rgba(244, 209, 212, 0.5)'
            generalMentalIllnessMean5yrsConfig.options.plugins.datalabels.backgroundColor[i] = 'rgba(244, 209, 212, 0.5)'
        } else {
            generalMentalIllnessMean5yrsConfig.data.datasets[0].backgroundColor[i] = 'rgba(223, 207, 209, 0.5)'
            generalMentalIllnessMean5yrsConfig.options.plugins.datalabels.backgroundColor[i] = 'rgba(223, 207, 209, 0.5)'
        }
    }
    const generalMentalIllnessEachPHQ9Config = { // 함수 만들기 시도한게 왜 안됐는지 의문. missing semicolon?
        type: 'bar',
        data: {
            labels: ['a','b'],
            datasets: [
                {
                    data: generalMentalIllnessEachPHQ9Data.slice(0,2),
                    barPercentage: 0.0,
                }
            ]
        },
        plugins: [ChartDataLabels], // 이러면 y값이 차트 안으로 들어오긴 한다
        options: {
            indexAxis: 'y',
            scales: eachScales,
            plugins: {
                datalabels: {
                    color: ['black', 'gray'],
                    anchor: 'end',
                    align: 'center',
                    // offset:
                    backgroundColor: ['black', 'gray'],
                    borderWidth: 5,
                    borderRadius: 5,
                    font: {
                        size: 5,
                        weight: 'bold'
                    },
                },
                legend: {
                    display: false
                }
            }
        },
    };
    const generalMentalIllnessEachGAD7Config = { // 함수 만들기 시도한게 왜 안됐는지 의문. missing semicolon?
        type: 'bar',
        data: {
            labels: ['a','b'],
            datasets: [
                {
                    data: generalMentalIllnessEachGAD7Data.slice(0,2),
                    barPercentage: 0.0,
                }
            ]
        },
        plugins: [ChartDataLabels], // 이러면 y값이 차트 안으로 들어오긴 한다
        options: {
            indexAxis: 'y',
            scales: eachScales,
            plugins: {
                datalabels: { // 적당한 표현방식만 찾아주면 될 듯. 꼭 수치가 없어도 되지 않을까?
                    color: ['black', 'gray'],
                    anchor: 'end',
                    align: 'center',
                    // offset:
                    backgroundColor: ['black', 'gray'],
                    borderWidth: 5,
                    borderRadius: 5,
                    font: {
                        size: 5,
                        weight: 'bold'
                    },
                },
                legend: {
                    display: false
                }
            }
        },
    };
    const generalMentalIllnessEachADNM4Config = { // 함수 만들기 시도한게 왜 안됐는지 의문. missing semicolon?
        type: 'bar',
        data: {
            labels: ['a','b'],
            datasets: [
                {
                    data: generalMentalIllnessEachADNM4Data.slice(0,2),
                    barPercentage: 0.0,
                }
            ]
        },
        plugins: [ChartDataLabels], // 이러면 y값이 차트 안으로 들어오긴 한다
        options: {
            indexAxis: 'y',
            scales: eachScales,
            plugins: {
                datalabels: { // 적당한 표현방식만 찾아주면 될 듯. 꼭 수치가 없어도 되지 않을까?
                    color: ['black', 'gray'],
                    anchor: 'end',
                    align: 'center',
                    // offset:
                    backgroundColor: ['black', 'gray'],
                    borderWidth: 5,
                    borderRadius: 5,
                    font: {
                        size: 5,
                        weight: 'bold'
                    },
                },
                legend: {
                    display: false
                }
            }
        },
    };
    const generalMentalIllnessEachPCPTSD5Config = { // 함수 만들기 시도한게 왜 안됐는지 의문. missing semicolon?
        type: 'bar',
        data: {
            labels: ['a','b'],
            datasets: [
                {
                    data: generalMentalIllnessEachPCPTSD5Data.slice(0,2),
                    barPercentage: 0.0,
                }
            ]
        },
        plugins: [ChartDataLabels], // 이러면 y값이 차트 안으로 들어오긴 한다
        options: {
            indexAxis: 'y',
            scales: eachScales,
            plugins: {
                datalabels: { // 적당한 표현방식만 찾아주면 될 듯. 꼭 수치가 없어도 되지 않을까?
                    color: ['black', 'gray'],
                    anchor: 'end',
                    align: 'center',
                    // offset:
                    backgroundColor: ['black', 'gray'],
                    borderWidth: 5,
                    borderRadius: 5,
                    font: {
                        size: 5,
                        weight: 'bold'
                    },
                },
                legend: {
                    display: false
                }
            }
        },
    };
    const generalMentalIllnessEachKOSSSFConfig = { // 함수 만들기 시도한게 왜 안됐는지 의문. missing semicolon?
        type: 'bar',
        data: {
            labels: ['a','b'],
            datasets: [
                {
                    data: generalMentalIllnessEachKOSSSFData.slice(0,2),
                    barPercentage: 0.0,
                }
            ]
        },
        plugins: [ChartDataLabels], // 이러면 y값이 차트 안으로 들어오긴 한다
        options: {
            indexAxis: 'y',
            scales: eachScales,
            plugins: {
                datalabels: { // 적당한 표현방식만 찾아주면 될 듯. 꼭 수치가 없어도 되지 않을까?
                    color: ['black', 'gray'],
                    anchor: 'end',
                    align: 'center',
                    // offset:
                    backgroundColor: ['black', 'gray'],
                    borderWidth: 5,
                    borderRadius: 5,
                    font: {
                        size: 5,
                        weight: 'bold'
                    },
                },
                legend: {
                    display: false
                }
            }
        },
    };
    const generalMentalIllnessEachP4Config = { // 함수 만들기 시도한게 왜 안됐는지 의문. missing semicolon?
        type: 'bar',
        data: {
            labels: ['a','b'],
            datasets: [
                {
                    data: generalMentalIllnessEachP4Data.slice(0,2),
                    barPercentage: 0.0,
                }
            ]
        },
        plugins: [ChartDataLabels], // 이러면 y값이 차트 안으로 들어오긴 한다
        options: {
            indexAxis: 'y',
            scales: eachScales,
            plugins: {
                datalabels: { // 적당한 표현방식만 찾아주면 될 듯. 꼭 수치가 없어도 되지 않을까?
                    color: ['black', 'gray'],
                    anchor: 'end',
                    align: 'center',
                    // offset:
                    backgroundColor: ['black', 'gray'],
                    borderWidth: 5,
                    borderRadius: 5,
                    font: {
                        size: 5,
                        weight: 'bold'
                    },
                },
                legend: {
                    display: false
                }
            }
        },
    };
        // 차트 위 point를 정상/경계/위험/심각 색상으로 표현하려 한 시도. 근데 색이 너무 연해서..
        // if (generalMentalIllnessEachPHQ9Data[0] < 25) {
        //     generalMentalIllnessEachPHQ9Config.options.plugins.datalabels.color[0] = 'rgba(239, 239, 239)'
        //     generalMentalIllnessEachPHQ9Config.options.plugins.datalabels.backgroundColor[0] = 'rgba(239, 239, 239)'
        //
        // } else if (generalMentalIllnessEachPHQ9Data[0] < 50) {
        //     generalMentalIllnessEachPHQ9Config.options.plugins.datalabels.backgroundColor[0] = 'rgba(251, 240, 220)'
        // } else if (generalMentalIllnessEachPHQ9Data[0] < 75) {
        //     generalMentalIllnessEachPHQ9Config.options.plugins.datalabels.backgroundColor[0] = 'rgba(244, 209, 212)'
        // } else {
        //     generalMentalIllnessEachPHQ9Config.options.plugins.datalabels.backgroundColor[0] = 'rgba(223, 207, 209)'
        // }


        // 2) General Page - Occupational Stress
    const generalOccuStressOverallMaleConfig = {
        type: 'radar',
        data: {
            labels: occuStressLabels,
            datasets: [
                {
                    data: generalOccuStressOverallMaleData[0],
                    fill: false,
                    pointStyle: 'dash', // 그나마 dash가 가장..
                    borderWidth: 3,
                    borderColor: 'rgb(0, 0, 0)',
                },
                {
                    data: generalOccuStressOverallMaleData[1],
                    fill: false,
                    pointStyle: 'dash',
                    borderWidth: 1,
                    borderColor: 'rgb(137, 137, 137)',
                }],
        },
        options: overallOptions,
    };
    const generalOccuStressOverallFemaleConfig = {
        type: 'radar',
        data: {
            labels: occuStressLabels,
            datasets: [
                {
                    data: generalOccuStressOverallFemaleData[0],
                    fill: false,
                    pointStyle: 'dash', // 그나마 dash가 가장..
                    borderWidth: 3,
                    borderColor: 'rgb(0, 0, 0)',
                },
                {
                    data: generalOccuStressOverallFemaleData[1],
                    fill: false,
                    pointStyle: 'dash',
                    borderWidth: 1,
                    borderColor: 'rgb(137, 137, 137)',
                }]
        },
        options: overallOptions,
    };


    // 직무스트레스 요인별 결과 추가해야(+template도 아직 추가하지 않음)
    const generalOccuStressEachMaleDemandsConfig = { // 함수 만들기 시도한게 왜 안됐는지 의문. missing semicolon?
        type: 'bar',
        data: {
            labels: ['a','b'],
            datasets: [
                {
                    data: generalOccuStressEachMaleDemandsData.slice(0,2),
                    barPercentage: 0.0,
                }
            ]
        },
        plugins: [ChartDataLabels], // 이러면 y값이 차트 안으로 들어오긴 한다
        options: {
            indexAxis: 'y',
            scales: eachScales,
            plugins: {
                datalabels: { // 적당한 표현방식만 찾아주면 될 듯. 꼭 수치가 없어도 되지 않을까?
                    color: ['black', 'gray'],
                    anchor: 'end',
                    align: 'center',
                    // offset:
                    backgroundColor: ['black', 'gray'],
                    borderWidth: 5,
                    borderRadius: 5,
                    font: {
                        size: 5,
                        weight: 'bold'
                    },
                },
                legend: {
                    display: false
                }
            }
        },
    };
    const generalOccuStressEachMaleAutonomyConfig = { // 함수 만들기 시도한게 왜 안됐는지 의문. missing semicolon?
        type: 'bar',
        data: {
            labels: ['a','b'],
            datasets: [
                {
                    data: generalOccuStressEachMaleAutonomyData.slice(0,2),
                    barPercentage: 0.0,
                }
            ]
        },
        plugins: [ChartDataLabels], // 이러면 y값이 차트 안으로 들어오긴 한다
        options: {
            indexAxis: 'y',
            scales: eachScales,
            plugins: {
                datalabels: { // 적당한 표현방식만 찾아주면 될 듯. 꼭 수치가 없어도 되지 않을까?
                    color: ['black', 'gray'],
                    anchor: 'end',
                    align: 'center',
                    // offset:
                    backgroundColor: ['black', 'gray'],
                    borderWidth: 5,
                    borderRadius: 5,
                    font: {
                        size: 5,
                        weight: 'bold'
                    },
                },
                legend: {
                    display: false
                }
            }
        },
    };
    const generalOccuStressEachMaleConflictConfig = { // 함수 만들기 시도한게 왜 안됐는지 의문. missing semicolon?
        type: 'bar',
        data: {
            labels: ['a','b'],
            datasets: [
                {
                    data: generalOccuStressEachMaleConflictData.slice(0,2),
                    barPercentage: 0.0,
                }
            ]
        },
        plugins: [ChartDataLabels], // 이러면 y값이 차트 안으로 들어오긴 한다
        options: {
            indexAxis: 'y',
            scales: eachScales,
            plugins: {
                datalabels: { // 적당한 표현방식만 찾아주면 될 듯. 꼭 수치가 없어도 되지 않을까?
                    color: ['black', 'gray'],
                    anchor: 'end',
                    align: 'center',
                    // offset:
                    backgroundColor: ['black', 'gray'],
                    borderWidth: 5,
                    borderRadius: 5,
                    font: {
                        size: 5,
                        weight: 'bold'
                    },
                },
                legend: {
                    display: false
                }
            }
        },
    };
    const generalOccuStressEachMaleInstabilityConfig = { // 함수 만들기 시도한게 왜 안됐는지 의문. missing semicolon?
        type: 'bar',
        data: {
            labels: ['a','b'],
            datasets: [
                {
                    data: generalOccuStressEachMaleInstabilityData.slice(0,2),
                    barPercentage: 0.0,
                }
            ]
        },
        plugins: [ChartDataLabels], // 이러면 y값이 차트 안으로 들어오긴 한다
        options: {
            indexAxis: 'y',
            scales: eachScales,
            plugins: {
                datalabels: { // 적당한 표현방식만 찾아주면 될 듯. 꼭 수치가 없어도 되지 않을까?
                    color: ['black', 'gray'],
                    anchor: 'end',
                    align: 'center',
                    // offset:
                    backgroundColor: ['black', 'gray'],
                    borderWidth: 5,
                    borderRadius: 5,
                    font: {
                        size: 5,
                        weight: 'bold'
                    },
                },
                legend: {
                    display: false
                }
            }
        },
    };
    const generalOccuStressEachMaleSystemConfig = { // 함수 만들기 시도한게 왜 안됐는지 의문. missing semicolon?
        type: 'bar',
        data: {
            labels: ['a','b'],
            datasets: [
                {
                    data: generalOccuStressEachMaleSystemData.slice(0,2),
                    barPercentage: 0.0,
                }
            ]
        },
        plugins: [ChartDataLabels], // 이러면 y값이 차트 안으로 들어오긴 한다
        options: {
            indexAxis: 'y',
            scales: eachScales,
            plugins: {
                datalabels: { // 적당한 표현방식만 찾아주면 될 듯. 꼭 수치가 없어도 되지 않을까?
                    color: ['black', 'gray'],
                    anchor: 'end',
                    align: 'center',
                    // offset:
                    backgroundColor: ['black', 'gray'],
                    borderWidth: 5,
                    borderRadius: 5,
                    font: {
                        size: 5,
                        weight: 'bold'
                    },
                },
                legend: {
                    display: false
                }
            }
        },
    };
    const generalOccuStressEachMaleRewardConfig = { // 함수 만들기 시도한게 왜 안됐는지 의문. missing semicolon?
        type: 'bar',
        data: {
            labels: ['a','b'],
            datasets: [
                {
                    data: generalOccuStressEachMaleRewardData.slice(0,2),
                    barPercentage: 0.0,
                }
            ]
        },
        plugins: [ChartDataLabels], // 이러면 y값이 차트 안으로 들어오긴 한다
        options: {
            indexAxis: 'y',
            scales: eachScales,
            plugins: {
                datalabels: { // 적당한 표현방식만 찾아주면 될 듯. 꼭 수치가 없어도 되지 않을까?
                    color: ['black', 'gray'],
                    anchor: 'end',
                    align: 'center',
                    // offset:
                    backgroundColor: ['black', 'gray'],
                    borderWidth: 5,
                    borderRadius: 5,
                    font: {
                        size: 5,
                        weight: 'bold'
                    },
                },
                legend: {
                    display: false
                }
            }
        },
    };
    const generalOccuStressEachMaleCultureConfig = { // 함수 만들기 시도한게 왜 안됐는지 의문. missing semicolon?
        type: 'bar',
        data: {
            labels: ['a','b'],
            datasets: [
                {
                    data: generalOccuStressEachMaleCultureData.slice(0,2),
                    barPercentage: 0.0,
                }
            ]
        },
        plugins: [ChartDataLabels], // 이러면 y값이 차트 안으로 들어오긴 한다
        options: {
            indexAxis: 'y',
            scales: eachScales,
            plugins: {
                datalabels: { // 적당한 표현방식만 찾아주면 될 듯. 꼭 수치가 없어도 되지 않을까?
                    color: ['black', 'gray'],
                    anchor: 'end',
                    align: 'center',
                    // offset:
                    backgroundColor: ['black', 'gray'],
                    borderWidth: 5,
                    borderRadius: 5,
                    font: {
                        size: 5,
                        weight: 'bold'
                    },
                },
                legend: {
                    display: false
                }
            }
        },
    };
    const generalOccuStressEachFemaleDemandsConfig = { // 함수 만들기 시도한게 왜 안됐는지 의문. missing semicolon?
        type: 'bar',
        data: {
            labels: ['a','b'],
            datasets: [
                {
                    data: generalOccuStressEachFemaleDemandsData.slice(0,2),
                    barPercentage: 0.0,
                }
            ]
        },
        plugins: [ChartDataLabels], // 이러면 y값이 차트 안으로 들어오긴 한다
        options: {
            indexAxis: 'y',
            scales: eachScales,
            plugins: {
                datalabels: { // 적당한 표현방식만 찾아주면 될 듯. 꼭 수치가 없어도 되지 않을까?
                    color: ['black', 'gray'],
                    anchor: 'end',
                    align: 'center',
                    // offset:
                    backgroundColor: ['black', 'gray'],
                    borderWidth: 5,
                    borderRadius: 5,
                    font: {
                        size: 5,
                        weight: 'bold'
                    },
                },
                legend: {
                    display: false
                }
            }
        },
    };
    const generalOccuStressEachFemaleAutonomyConfig = { // 함수 만들기 시도한게 왜 안됐는지 의문. missing semicolon?
        type: 'bar',
        data: {
            labels: ['a','b'],
            datasets: [
                {
                    data: generalOccuStressEachFemaleAutonomyData.slice(0,2),
                    barPercentage: 0.0,
                }
            ]
        },
        plugins: [ChartDataLabels], // 이러면 y값이 차트 안으로 들어오긴 한다
        options: {
            indexAxis: 'y',
            scales: eachScales,
            plugins: {
                datalabels: { // 적당한 표현방식만 찾아주면 될 듯. 꼭 수치가 없어도 되지 않을까?
                    color: ['black', 'gray'],
                    anchor: 'end',
                    align: 'center',
                    // offset:
                    backgroundColor: ['black', 'gray'],
                    borderWidth: 5,
                    borderRadius: 5,
                    font: {
                        size: 5,
                        weight: 'bold'
                    },
                },
                legend: {
                    display: false
                }
            }
        },
    };
    const generalOccuStressEachFemaleConflictConfig = { // 함수 만들기 시도한게 왜 안됐는지 의문. missing semicolon?
        type: 'bar',
        data: {
            labels: ['a','b'],
            datasets: [
                {
                    data: generalOccuStressEachFemaleConflictData.slice(0,2),
                    barPercentage: 0.0,
                }
            ]
        },
        plugins: [ChartDataLabels], // 이러면 y값이 차트 안으로 들어오긴 한다
        options: {
            indexAxis: 'y',
            scales: eachScales,
            plugins: {
                datalabels: { // 적당한 표현방식만 찾아주면 될 듯. 꼭 수치가 없어도 되지 않을까?
                    color: ['black', 'gray'],
                    anchor: 'end',
                    align: 'center',
                    // offset:
                    backgroundColor: ['black', 'gray'],
                    borderWidth: 5,
                    borderRadius: 5,
                    font: {
                        size: 5,
                        weight: 'bold'
                    },
                },
                legend: {
                    display: false
                }
            }
        },
    };
    const generalOccuStressEachFemaleInstabilityConfig = { // 함수 만들기 시도한게 왜 안됐는지 의문. missing semicolon?
        type: 'bar',
        data: {
            labels: ['a','b'],
            datasets: [
                {
                    data: generalOccuStressEachFemaleInstabilityData.slice(0,2),
                    barPercentage: 0.0,
                }
            ]
        },
        plugins: [ChartDataLabels], // 이러면 y값이 차트 안으로 들어오긴 한다
        options: {
            indexAxis: 'y',
            scales: eachScales,
            plugins: {
                datalabels: { // 적당한 표현방식만 찾아주면 될 듯. 꼭 수치가 없어도 되지 않을까?
                    color: ['black', 'gray'],
                    anchor: 'end',
                    align: 'center',
                    // offset:
                    backgroundColor: ['black', 'gray'],
                    borderWidth: 5,
                    borderRadius: 5,
                    font: {
                        size: 5,
                        weight: 'bold'
                    },
                },
                legend: {
                    display: false
                }
            }
        },
    };
    const generalOccuStressEachFemaleSystemConfig = { // 함수 만들기 시도한게 왜 안됐는지 의문. missing semicolon?
        type: 'bar',
        data: {
            labels: ['a','b'],
            datasets: [
                {
                    data: generalOccuStressEachFemaleSystemData.slice(0,2),
                    barPercentage: 0.0,
                }
            ]
        },
        plugins: [ChartDataLabels], // 이러면 y값이 차트 안으로 들어오긴 한다
        options: {
            indexAxis: 'y',
            scales: eachScales,
            plugins: {
                datalabels: { // 적당한 표현방식만 찾아주면 될 듯. 꼭 수치가 없어도 되지 않을까?
                    color: ['black', 'gray'],
                    anchor: 'end',
                    align: 'center',
                    // offset:
                    backgroundColor: ['black', 'gray'],
                    borderWidth: 5,
                    borderRadius: 5,
                    font: {
                        size: 5,
                        weight: 'bold'
                    },
                },
                legend: {
                    display: false
                }
            }
        },
    };
    const generalOccuStressEachFemaleRewardConfig = { // 함수 만들기 시도한게 왜 안됐는지 의문. missing semicolon?
        type: 'bar',
        data: {
            labels: ['a','b'],
            datasets: [
                {
                    data: generalOccuStressEachFemaleRewardData.slice(0,2),
                    barPercentage: 0.0,
                }
            ]
        },
        plugins: [ChartDataLabels], // 이러면 y값이 차트 안으로 들어오긴 한다
        options: {
            indexAxis: 'y',
            scales: eachScales,
            plugins: {
                datalabels: { // 적당한 표현방식만 찾아주면 될 듯. 꼭 수치가 없어도 되지 않을까?
                    color: ['black', 'gray'],
                    anchor: 'end',
                    align: 'center',
                    // offset:
                    backgroundColor: ['black', 'gray'],
                    borderWidth: 5,
                    borderRadius: 5,
                    font: {
                        size: 5,
                        weight: 'bold'
                    },
                },
                legend: {
                    display: false
                }
            }
        },
    };
    const generalOccuStressEachFemaleCultureConfig = { // 함수 만들기 시도한게 왜 안됐는지 의문. missing semicolon?
        type: 'bar',
        data: {
            labels: ['a','b'],
            datasets: [
                {
                    data: generalOccuStressEachFemaleCultureData.slice(0,2),
                    barPercentage: 0.0,
                }
            ]
        },
        plugins: [ChartDataLabels], // 이러면 y값이 차트 안으로 들어오긴 한다
        options: {
            indexAxis: 'y',
            scales: eachScales,
            plugins: {
                datalabels: { // 적당한 표현방식만 찾아주면 될 듯. 꼭 수치가 없어도 되지 않을까?
                    color: ['black', 'gray'],
                    anchor: 'end',
                    align: 'center',
                    // offset:
                    backgroundColor: ['black', 'gray'],
                    borderWidth: 5,
                    borderRadius: 5,
                    font: {
                        size: 5,
                        weight: 'bold'
                    },
                },
                legend: {
                    display: false
                }
            }
        },
    };

    const generalOccuStressMean5yrsMaleConfig = {
        data: {
            labels: mean5yrsLabels,
            datasets: [
                {
                    type: 'bar',
                    data: generalOccuStressMean5yrsMaleData[0],
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
                    data: generalOccuStressMean5yrsMaleData[1], // 가장 높은 그것의 5개년 추이
                    pointStyle: 'circle',
                    pointBackgroundColor: 'rgb(0, 0, 0)',
                    backgroundColor: 'rgb(0, 0, 0)',
                    borderColor: 'rgb(0, 0, 0)',
                    borderWidth: 1
                }
            ]
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
            datasets: [
                {
                    type: 'bar',
                    data: generalOccuStressMean5yrsFemaleData[0],
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
                    data: generalOccuStressMean5yrsFemaleData[1],
                    pointStyle: 'circle',
                    pointBackgroundColor: 'rgb(0, 0, 0)',
                    backgroundColor: 'rgb(0, 0, 0)',
                    borderColor: 'rgb(0, 0, 0)',
                    borderWidth: 1
                }
            ]
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

    // 5. <generate base64 types img through renderToDataURL>
        // 1) General Page - Mental Illness
    const generalMentalIllnessOverallChart = await radarLargeCanvas.renderToDataURL(generalMentalIllnessOverallConfig);
    const generalMentalIllnessMean5yrsChart  = await barVerLargeCanvas.renderToDataURL(generalMentalIllnessMean5yrsConfig);
    // const generalMentalIllnessEachPHQ9Level = await 캔버스하나만들고.renderToDataURL(generalMentalIllnessEachPHQ9Level)
    const generalMentalIllnessEachPHQ9Chart = await barHorLargeCanvas.renderToDataURL(generalMentalIllnessEachPHQ9Config);
    const generalMentalIllnessEachGAD7Chart = await barHorLargeCanvas.renderToDataURL(generalMentalIllnessEachGAD7Config);
    const generalMentalIllnessEachADNM4Chart = await barHorLargeCanvas.renderToDataURL(generalMentalIllnessEachADNM4Config);
    const generalMentalIllnessEachPCPTSD5Chart = await barHorLargeCanvas.renderToDataURL(generalMentalIllnessEachPCPTSD5Config);
    const generalMentalIllnessEachKOSSSFChart = await barHorLargeCanvas.renderToDataURL(generalMentalIllnessEachKOSSSFConfig);
    const generalMentalIllnessEachP4Chart = await barHorLargeCanvas.renderToDataURL(generalMentalIllnessEachP4Config);

    // 2) General Page - Occupational Stress
    const generalOccuStressOverallMaleChart = await radarSmallCanvas.renderToDataURL(generalOccuStressOverallMaleConfig);
    const generalOccuStressOverallFemaleChart = await radarSmallCanvas.renderToDataURL(generalOccuStressOverallFemaleConfig);
    // 직무스트레스 요인별 결과 - barHorSmallCanvas
    const generalOccuStressEachMaleDemandsChart = await barHorSmallCanvas.renderToDataURL(generalOccuStressEachMaleDemandsConfig);
    const generalOccuStressEachMaleAutonomyChart = await barHorSmallCanvas.renderToDataURL(generalOccuStressEachMaleAutonomyConfig);
    const generalOccuStressEachMaleConflictChart = await barHorSmallCanvas.renderToDataURL(generalOccuStressEachMaleConflictConfig);
    const generalOccuStressEachMaleInstabilityChart = await barHorSmallCanvas.renderToDataURL(generalOccuStressEachMaleInstabilityConfig);
    const generalOccuStressEachMaleSystemChart = await barHorSmallCanvas.renderToDataURL(generalOccuStressEachMaleSystemConfig);
    const generalOccuStressEachMaleRewardChart = await barHorSmallCanvas.renderToDataURL(generalOccuStressEachMaleRewardConfig);
    const generalOccuStressEachMaleCultureChart = await barHorSmallCanvas.renderToDataURL(generalOccuStressEachMaleCultureConfig);
    const generalOccuStressEachFemaleDemandsChart = await barHorSmallCanvas.renderToDataURL(generalOccuStressEachFemaleDemandsConfig);
    const generalOccuStressEachFemaleAutonomyChart = await barHorSmallCanvas.renderToDataURL(generalOccuStressEachFemaleAutonomyConfig);
    const generalOccuStressEachFemaleConflictChart = await barHorSmallCanvas.renderToDataURL(generalOccuStressEachFemaleConflictConfig);
    const generalOccuStressEachFemaleInstabilityChart = await barHorSmallCanvas.renderToDataURL(generalOccuStressEachFemaleInstabilityConfig);
    const generalOccuStressEachFemaleSystemChart = await barHorSmallCanvas.renderToDataURL(generalOccuStressEachFemaleSystemConfig);
    const generalOccuStressEachFemaleRewardChart = await barHorSmallCanvas.renderToDataURL(generalOccuStressEachFemaleRewardConfig);
    const generalOccuStressEachFemaleCultureChart = await barHorSmallCanvas.renderToDataURL(generalOccuStressEachFemaleCultureConfig);

    const generalOccuStressMean5yrsMaleChart = await barVerSmallCanvas.renderToDataURL(generalOccuStressMean5yrsMaleConfig);
    const generalOccuStressMean5yrsFemaleChart = await barVerSmallCanvas.renderToDataURL(generalOccuStressMean5yrsFemaleConfig);

    // 6. <add to charts and return>
    const charts = {
        // 1) General Page - Mental Illness
        "general-mentalIllness-overall": generalMentalIllnessOverallChart,
        "general-mentalIllness-mean5yrs": generalMentalIllnessMean5yrsChart,
        // "general-mentalIllness-each-PHQ9-level": generalMentalIllnessEachPHQ9Level,
        "general-mentalIllness-each-PHQ9-chart": generalMentalIllnessEachPHQ9Chart,
        // "general-mentalIllness-each-PHQ9-level": generalMentalIllnessEachGAD7Level,
        "general-mentalIllness-each-GAD7-chart": generalMentalIllnessEachGAD7Chart,
        // "general-mentalIllness-each-ADNM4-level": generalMentalIllnessEachADNM4Level,
        "general-mentalIllness-each-ADNM4-chart": generalMentalIllnessEachADNM4Chart,
        // "general-mentalIllness-each-PCPTSD5-level": generalMentalIllnessEachPCPTSD5Level,
        "general-mentalIllness-each-PCPTSD5-chart": generalMentalIllnessEachPCPTSD5Chart,
        // "general-mentalIllness-each-KOSSSF-level": generalMentalIllnessEachKOSSSFLevel,
        "general-mentalIllness-each-KOSSSF-chart": generalMentalIllnessEachKOSSSFChart,
        // "general-mentalIllness-each-P4-level": generalMentalIllnessEachP4Level,
        "general-mentalIllness-each-P4-chart": generalMentalIllnessEachP4Chart,

        // 2) General Page - Occupational Stress
        "general-occuStress-overall-male": generalOccuStressOverallMaleChart,
        "general-occuStress-overall-female": generalOccuStressOverallFemaleChart,

        // 직무스트레스 요인별 결과
        // "general-occuStress-each-male-demands-level": generalOccuStressEachMaleDemandsLevel,
        "general-occuStress-each-male-demands-chart": generalOccuStressEachMaleDemandsChart,
        // "general-occuStress-each-male-autonomy-level": generalOccuStressEachMaleAutonomyLevel,
        "general-occuStress-each-male-autonomy-chart": generalOccuStressEachMaleAutonomyChart,
        // "general-occuStress-each-male-conflict-level": generalOccuStressEachMaleConflictLevel,
        "general-occuStress-each-male-conflict-chart": generalOccuStressEachMaleConflictChart,
        // "general-occuStress-each-male-instability-level": generalOccuStressEachMaleInstabilityLevel,
        "general-occuStress-each-male-instability-chart": generalOccuStressEachMaleInstabilityChart,
        // "general-occuStress-each-male-system-level": generalOccuStressEachMaleSystemLevel,
        "general-occuStress-each-male-system-chart": generalOccuStressEachMaleSystemChart,
        // "general-occuStress-each-male-reward-level": generalOccuStressEachMaleRewardLevel,
        "general-occuStress-each-male-reward-chart": generalOccuStressEachMaleRewardChart,
        // "general-occuStress-each-male-culture-level": generalOccuStressEachMaleCultureLevel,
        "general-occuStress-each-male-culture-chart": generalOccuStressEachMaleCultureChart,

        // "general-occuStress-each-female-demands-level": generalOccuStressEachFemaleDemandsLevel,
        "general-occuStress-each-female-demands-chart": generalOccuStressEachFemaleDemandsChart,
        // "general-occuStress-each-female-autonomy-level": generalOccuStressEachFemaleAutonomyLevel,
        "general-occuStress-each-female-autonomy-chart": generalOccuStressEachFemaleAutonomyChart,
        // "general-occuStress-each-female-conflict-level": generalOccuStressEachFemaleConflictLevel,
        "general-occuStress-each-female-conflict-chart": generalOccuStressEachFemaleConflictChart,
        // "general-occuStress-each-female-instability-level": generalOccuStressEachFemaleInstabilityLevel,
        "general-occuStress-each-female-instability-chart": generalOccuStressEachFemaleInstabilityChart,
        // "general-occuStress-each-female-system-level": generalOccuStressEachFemaleSystemLevel,
        "general-occuStress-each-female-system-chart": generalOccuStressEachFemaleSystemChart,
        // "general-occuStress-each-female-reward-level": generalOccuStressEachFemaleRewardLevel,
        "general-occuStress-each-female-reward-chart": generalOccuStressEachFemaleRewardChart,
        // "general-occuStress-each-female-culture-level": generalOccuStressEachFemaleCultureLevel,
        "general-occuStress-each-female-culture-chart": generalOccuStressEachFemaleCultureChart,

        "general-occuStress-mean5yrs-male": generalOccuStressMean5yrsMaleChart,
        "general-occuStress-mean5yrs-female": generalOccuStressMean5yrsFemaleChart,
    }
    return charts
};

// 함수를 사용하는 대신 data이름을 다 export, import하는 불편함이.. 한번에 할 수 있는 방법은?
export {
    generateChart,
    getIntData,
    generalMentalIllnessEachPHQ9Data,
    generalMentalIllnessEachGAD7Data,
    generalMentalIllnessEachADNM4Data,
    generalMentalIllnessEachPCPTSD5Data,
    generalMentalIllnessEachKOSSSFData,
    generalMentalIllnessEachP4Data,
    generalOccuStressEachMaleDemandsData,
    generalOccuStressEachMaleAutonomyData,
    generalOccuStressEachMaleConflictData,
    generalOccuStressEachMaleInstabilityData,
    generalOccuStressEachMaleSystemData,
    generalOccuStressEachMaleRewardData,
    generalOccuStressEachMaleCultureData,
    generalOccuStressEachFemaleDemandsData,
    generalOccuStressEachFemaleAutonomyData,
    generalOccuStressEachFemaleConflictData,
    generalOccuStressEachFemaleInstabilityData,
    generalOccuStressEachFemaleSystemData,
    generalOccuStressEachFemaleRewardData,
    generalOccuStressEachFemaleCultureData
};