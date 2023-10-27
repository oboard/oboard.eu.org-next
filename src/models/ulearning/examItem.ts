// {
//     "isAvailable": null,
//     "operater": 965749,
//     "examFinish": [
//         "1"
//     ],
//     "examType": 2,
//     "title": "2023秋形势与政策期末考试（2022级）",
//     "type": "3",
//     "showExamRecodAfterDate": 888,
//     "parentID": null,
//     "deprecatedPaper": "",
//     "limitTimes": 1,
//     "isLate": "0",
//     "examID": 102352,
//     "startTime": "",
//     "isLimitTimes": "1",
//     "extractPaperId": 18547,
//     "leaveLimit": 2,
//     "paperType": 2,
//     "kind": null,
//     "passScore": 60.0,
//     "orgID": 3755,
//     "examRelationList": [
//         {
//             "examRelationId": 1727137,
//             "examId": 102352,
//             "relationId": 684989,
//             "relationType": 1,
//             "startTime": 1698412500000,
//             "endTime": 1698413100000,
//             "addTime": 0,
//             "examAddTime": 0
//         }
//     ],
//     "createTime": 1697863779000,
//     "lateTime": 0,
//     "remark5": "0",
//     "endTime": "2023-10-27",
//     "showExamRecord": 1,
//     "examTime": 10,
//     "remark1": "notStart",
//     "currentState": 1,
//     "paperID": ";2207500;2207501;2207502;2207503;2207504;2207505;2207506;2207507;2207508;2207509;2207510;2207511;2207512;2207513;2207514;2207515;2207516;2207517;2207518;2207519;2207520;2207521;2207522;2207523;2207524;2207525;2207526;2207527;2207528;2207529;2207530;2207531;2207532;2207533;2207534;2207535;2207536;2207537;2207538;2207539;2207540;2207541;2207542;2207543;2207544;2207545;2207546;2207547;2207548;2207549;2207550;2207551;2207552;2207553;2207554;2207555;2207556;2207557;2207558;2207559;2207560;2207561;2207562;2207563;2207564;2207565;2207566;2207567;2207568;2207569;2207570;2207571;2207572;2207573;2207574;2207575;2207576;2207577;2207578;2207579;2207580;2207581;2207582;2207583;2207584;2207585;2207586;2207587;2207588;2207589;2207590;2207591;2207592;2207593;2207594;2207595;2207596;2207597;2207598;2207599;",
//     "remark3": "1",
//     "remark2": "true"
// },


// 生成实体类

export interface ExamItem {
    isAvailable: null;
    operater: number;
    examFinish: string[];
    examType: number;
    title: string;
    type: string;
    showExamRecodAfterDate: number;
    parentID: null;
    deprecatedPaper: string;
    limitTimes: number;
    isLate: string;
    examID: number;
    startTime: string;
    isLimitTimes: string;
    extractPaperId: number;
    leaveLimit: number;
    paperType: number;
    kind: null;
    passScore: number;
    orgID: number;
    examRelationList: ExamRelationList[];
    createTime: number;
    lateTime: number;
    remark5: string;
    endTime: string;
    showExamRecord: number;
    examTime: number;
    remark1: string;
    currentState: number;
    paperID: string;
    remark3: string;
    remark2: string;
}

export interface ExamRelationList {
    examRelationId: number;
    examId: number;
    relationId: number;
    relationType: number;
    startTime: number;
    endTime: number;
    addTime: number;
    examAddTime: number;
}