import fs from "fs";
import labelmake from "labelmake";
import template from "./labelmake-template.json" // template 새로 load하면 "fontName":"SourceHanSans" 직접 추가해야함. 자동화 방법은~?
import { generateChart } from "./generateChart"
import { getData } from "./DB"

// import jscardet from "jschardet";
// import iconv from "iconv-lite"

// const Nanum = fs.readFileSync("./NanumGothic-Regular.ttf")
// const font = { Nanum };
// import SourceHanSans from "./SourceHanSans/OTF/Korean/SourceHanSansK-Regular.otf"; // otf는 오류나네 + 여러 글꼴 쓰려면 how?
// const font = { SourceHanSans };
const MaruBuri = fs.readFileSync("./MaruBuri-Regular.ttf")
const font = { MaruBuri };


// 그래프 데이터를 받아서, 여기서 바로 mapping 후 pdf에 출력한다.
// 가공이 필요하지 않은 나머지 text도, 여기서 그냥 바로 받아버렸다. 더 나은 방법은?
generateChart()
    .then(( charts ) => {
        const inputs = [
            {
                "main-desc": getData("mainpage-description"),
                "com-distinct-number": getData("mainpage-company")['distinct-number'],
                "chart-bar": charts['chart-bar'],
                "chart-heptagon" : charts['chart-heptagon']
            }
        ];
        labelmake({ inputs, template, font })
            .then((pdf) => {
                fs.writeFileSync(__dirname + "/index10.pdf", pdf, "utf-8"); // 파일이름 등 자동으로 변경하는 것은~?
            });
    })
