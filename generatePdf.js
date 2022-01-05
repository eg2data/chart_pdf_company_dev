import fs from "fs";
import labelmake from "labelmake";
import template from "./labelmake-template.json" // template 새로 load하면 "fontName":"NanumGothic" 직접 추가해야함. 자동화 방법은~?
import { generateChart } from "./generateChart"
import { getData } from "./DB"

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
                "general-reportDesc": getData("mainpage-description"),
                "general-corpInfo-num": getData("mainpage-company")["distinct-number"],
                "general-corpInfo-name": getData("mainpage-company")["company-name"],
                "general-corpInfo-cat": getData("mainpage-company")["company-catagory"],
                "general-corpInfo-sorts": getData("mainpage-company")["sort-of-check"],
                "general-corpInfo-reqDate": getData("mainpage-company")["request-date"],
                "general-corpInfo-resDate": getData("mainpage-company")["response-date"],
                "general-mentalIllness-measure": getData("mainpage-solution"),
                "general-mentalIllness-overall-desc": getData("mainpage-result1"),
                "general-mentalIllness-each-desc": getData("mainpage-result2"),
                "general-occuStress-reportDesc": getData("mainpage-result3"),
                "general-occuStress-measure": getData("mainpage-result4"),
                "general-occuStress-desc-male": getData("mainpage-result5"),
                "general-occuStress-desc-female": getData("mainpage-result6"),
                "largeScaleCatOverall-reportDesc": getData("level1page-result1"),
                "largeScaleCatOverall-measure": getData("level1page-result2"),
                "general-mentalIllness-overall": charts['general-mentalIllness-overall'],
                "general-mentalIllness-mean5yrs": charts["general-mentalIllness-mean5yrs"],
                "general-mentalIllness-each-phq9": charts["general-mentalIllness-each-PHQ9"],
                // "general-mentalIllness-each-gad7": charts["general-mentalIllness-each-GAD7"],
                // "general-mentalIllness-each-adnm4": charts["general-mentalIllness-each-ADNM4"],
                // "general-mentalIllness-each-pcptsd5": charts["general-mentalIllness-each-PCPTSD5"],
                // "general-mentalIllness-each-kosssf": charts["general-mentalIllness-each-KOSSSF"],
                // "general-mentalIllness-each-p4": charts["general-mentalIllness-each-P4"],

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
                fs.writeFileSync(__dirname + "/index19.pdf", pdf, "utf-8"); // 파일이름 등 자동으로 변경하는 방법은?
            });
    })
