import fs from "fs";
import labelmake from "labelmake";
import template from "./labelmake-template.json"
// labelmake-template.json > "fontName":"NanumGothic" ---- 직접 추가 말고 다른 방법이 있을까.
import { getStringData } from "./DB"
import {
    generateChart,
    getIntData,
    generalMentalIllnessEachPHQ9Data,
    generalMentalIllnessEachGAD7Data,
    generalMentalIllnessEachADNM4Data,
    generalMentalIllnessEachPCPTSD5Data,
    generalMentalIllnessEachKOSSSFData,
    generalMentalIllnessEachP4Data,
} from "./generateChart"

const NanumGothic = fs.readFileSync("./NanumGothic-Regular.ttf")
const font = {
    NanumGothic : {
        data: NanumGothic,
        subset: false
    }
};

// rabbitMQ를 가정한 곳에서 text를 가져온 것도 여기서 그냥 바로 받아버렸다. 더 나은 방법은?
generateChart()
    .then(( charts ) => {
        const inputs = [
            {
// 1. cover: 고유검체번호 / 회사이름 / 연도자동
// 2. 목차: 페이지자동
// 3. overall page
    // getData로 가져오는 key값은 rabbitMQ에서의 key. 따라서 내가 설정한 변수명과 일치 하지 않겠지. 이 상황 구현하기.
                "general-reportDesc": getStringData("mainpage-description"),
                "general-corpInfo-num": getStringData("mainpage-company")["distinct-number"],
                "general-corpInfo-name": getStringData("mainpage-company")["company-name"],
                "general-corpInfo-cat": getStringData("mainpage-company")["company-catagory"],
                "general-corpInfo-sorts": getStringData("mainpage-company")["sort-of-check"],
                "general-corpInfo-reqDate": getStringData("mainpage-company")["request-date"],
                "general-corpInfo-resDate": getStringData("mainpage-company")["response-date"],
                "general-mentalIllness-measure": getStringData("mainpage-solution"),
                "general-mentalIllness-overall-desc": getStringData("mainpage-result1"),
                "general-mentalIllness-each-desc": getStringData("mainpage-result2"),
                "general-occuStress-reportDesc": getStringData("mainpage-result3"),
                "general-occuStress-measure": getStringData("mainpage-result4"),
                "general-occuStress-desc-male": getStringData("mainpage-result5"),
                "general-occuStress-desc-female": getStringData("mainpage-result6"),
                "largeScaleCatOverall-reportDesc": getStringData("level1page-result1"),
                "largeScaleCatOverall-measure": getStringData("level1page-result2"),
                "general-mentalIllness-overall": charts['general-mentalIllness-overall'],
                "general-mentalIllness-mean5yrs": charts["general-mentalIllness-mean5yrs"],
//                "general-mentalIllness-each-phq9-level": charts["general-mentalIllness-each-PHQ9-level"]
                "general-mentalIllness-each-phq9-current": getIntData(generalMentalIllnessEachPHQ9Data, 0),
                "general-mentalIllness-each-phq9-mean": getIntData(generalMentalIllnessEachPHQ9Data, 1),
                "general-mentalIllness-each-phq9-compare": getIntData(generalMentalIllnessEachPHQ9Data, 2),
                "general-mentalIllness-each-phq9-chart": charts["general-mentalIllness-each-PHQ9-chart"],
//                "general-mentalIllness-each-gad7-level": charts["general-mentalIllness-each-GAD7-level"]
                "general-mentalIllness-each-gad7-current": getIntData(generalMentalIllnessEachGAD7Data, 0),
                "general-mentalIllness-each-gad7-mean": getIntData(generalMentalIllnessEachGAD7Data, 1),
                "general-mentalIllness-each-gad7-compare": getIntData(generalMentalIllnessEachGAD7Data, 2),
                "general-mentalIllness-each-gad7-chart": charts["general-mentalIllness-each-GAD7-chart"],
//                "general-mentalIllness-each-adnm4-level": charts["general-mentalIllness-each-GAD7-level"]
                "general-mentalIllness-each-adnm4-current": getIntData(generalMentalIllnessEachADNM4Data, 0),
                "general-mentalIllness-each-adnm4-mean": getIntData(generalMentalIllnessEachADNM4Data, 1),
                "general-mentalIllness-each-adnm4-compare": getIntData(generalMentalIllnessEachADNM4Data, 2),
                "general-mentalIllness-each-adnm4-chart": charts["general-mentalIllness-each-ADNM4-chart"],
//                "general-mentalIllness-each-pcptsd5-level": charts["general-mentalIllness-each-PCPTSD5-level"]
                "general-mentalIllness-each-pcptsd5-current": getIntData(generalMentalIllnessEachPCPTSD5Data, 0),
                "general-mentalIllness-each-pcptsd5-mean": getIntData(generalMentalIllnessEachPCPTSD5Data, 1),
                "general-mentalIllness-each-pcptsd5-compare": getIntData(generalMentalIllnessEachPCPTSD5Data, 2),
                "general-mentalIllness-each-pcptsd5-chart": charts["general-mentalIllness-each-PCPTSD5-chart"],
//                "general-mentalIllness-each-kosssf-level": charts["general-mentalIllness-each-KOSSSF-level"]
                "general-mentalIllness-each-kosssf-current": getIntData(generalMentalIllnessEachKOSSSFData, 0),
                "general-mentalIllness-each-kosssf-mean": getIntData(generalMentalIllnessEachKOSSSFData, 1),
                "general-mentalIllness-each-kosssf-compare": getIntData(generalMentalIllnessEachKOSSSFData, 2),
                "general-mentalIllness-each-kosssf-chart": charts["general-mentalIllness-each-KOSSSF-chart"],
//                "general-mentalIllness-each-p4-level": charts["general-mentalIllness-each-KOSSSF-level"]
                "general-mentalIllness-each-p4-current": getIntData(generalMentalIllnessEachP4Data, 0),
                "general-mentalIllness-each-p4-mean": getIntData(generalMentalIllnessEachP4Data, 1),
                "general-mentalIllness-each-p4-compare": getIntData(generalMentalIllnessEachP4Data, 2),
                "general-mentalIllness-each-p4-chart": charts["general-mentalIllness-each-P4-chart"],


                "general-occuStress-overall-male": charts["general-occuStress-overall-male"],
                "general-occuStress-overall-female": charts["general-occuStress-overall-female"],
                // 직무스트레스 요인별 결과 추가해야(+template도 아직 추가하지 않음)
                "general-occuStress-mean5yrs-male": charts["general-occuStress-mean5yrs-male"],
                "general-occuStress-mean5yrs-female": charts["general-occuStress-mean5yrs-female"],

                // "largeScaleCatOverall-riskPriority-level-1"
                // "largeScaleCatOverall-riskPriority-point-1"
                // "largeScaleCatOverall-riskPriority-mean5yrs-1"


                // 증상별 위험 소분류: NOT YET

                // 대분류 세부
                    //"largeScaleCatDetail-"

                // 중분류 전체
                // 중분류 세부
                // 소분류 전체
                // 소분류 세부

            }
        ];
        labelmake({ inputs, template, font })
            .then((pdf) => {
                fs.writeFileSync(__dirname + "/index22.pdf", pdf, "utf-8"); // 파일이름 등 자동으로 변경하는 방법은?
            });
    })
