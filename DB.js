const dataList = [ // db에서 가져온 data(뿌릴 데이터)라고 가정
    {
        "mainpage-description" : "왜 흰색글씨가 나오지? english is possible?",
        "mainpage-company":
            {
                "distinct-number": "9876BA54321DC"
            },
    }
]

function getData(key) {
    return dataList[0][key] // object 내의 object의 value를 뽑아내는 것을 간편히 하기 위한 code 필요
};

export { getData };


// 아니면, font 정보를 담은 json을 하나 만들고, 그걸 import해서 쓸까