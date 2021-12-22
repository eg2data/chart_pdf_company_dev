import fs from "fs";

const NanumGothic = fs.readFileSync("./NanumGothic-Regular.ttf")
export const font = {
    NanumGothic : {
        data: NanumGothic,
        subset: false
    }
};