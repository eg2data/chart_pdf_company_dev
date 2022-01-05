const dataList = [ // rabbitMQ에서 가져오는 것을 어떻게 표현할지?
    {
        "mainpage-description" : "TESS의 직장 마음 건강 보고서는 챗봇을 통한 자가보고형식 설문과 HRV 측정값을 기반으로 통계적인 분석을 통해 결과를 제공합니다. TESS 보고서에서 제공하는 결과값은 직무별로 대분류, 중분류, 소분류로 나누어 통계를 제공하는 형식입니다.",
        "mainpage-company":
            {
                "distinct-number": "9876BA54321DC",
                "company-name": "주식회사 하이",
                "company-catagory": "(ICT업)", // ( ) 자동생성 how?
                "sort-of-check": "직무 스트레스 외 6종",
                "request-date": "2021-10-30",
                "response-date": "2021-11-30",
            },
        "mainpage-solution": "직무스트레스, 우울감, 적응스트레스 의심. \n\n우울감, 적응스트레스에 위험 수준의 위험이 도출되어 주의가 필요한 상황임. 직무 스트레스와 외상 스트레스는 중간 수준의 위험이 도출되어 지속적인 관리가 필요함.",
        "mainpage-result1": "전체 결과표는 방사형 그래프로 6가지 정신질환에 대한 전체 결과를 보여줍니다.",
        "mainpage-result2": "6가지 정신질환에 대한 증상별 전체 결과를 보여줍니다. 비교 수치를 안내해 위험 정도를 안내합니다.",
        "mainpage-result3": "남녀 직원의 직무 스트레스를 나타낸 보고서입니다.",
        "mainpage-result4": "남성의 경우 직무 스트레스 요소 중 직무 요구도가 89점으로 상위 25%에 해당합니다. 여성의 경우 직무 스트레스 요소 중 보상 부적절이 67점으로 상위 50%에 해당합니다.",
        "mainpage-result5": "직무 스트레스의 경우 남성과 여성의 직무 스트레스 요인이 다르게 나타납니다.",
        "mainpage-result6": "이에 따라 남성과 여성으로 구분하여 전체 결과, 요인별 결과, 5개년 직무 스트레스 평균을 보여줍니다.",
        "level1page-result1": "본 회사의 직무 대분류는 6가지로 사업관리, 경영/회계/사무, 법률/경찰/소방/교도/국방, 문화/예술/디자인/방송, 영업판매, 정보통신으로 나뉩니다.",
        "level1page-result2": "정보통신 분야 소속 직원들의 전반적인 마음 건강이 위험합니다. 그 다음으로는 영업판매 분야 소속 직원들이 마음 건강이 좋지 않은 것으로 보입니다.",
    }
]

function getData(key) {
    return dataList[0][key] // object 내의 object의 value를 뽑아내는 것을 간편히 하기 위한 code 필요
};

export { getData };

