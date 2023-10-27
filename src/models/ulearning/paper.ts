//  {
//         "score": 100.00,
//         "part": [
//             {
//                 "paperpartid": 4945788,
//                 "partname": "单选题",
//                 "score": 40.0,
//                 "orderindex": 0,
//                 "children": [
//                     {
//                         "score": 2.0,
//                         "correctreply": "",
//                         "item": [
//                             {
//                                 "choiceId": 38419241,
//                                 "title": "<p>2027年确保实现建军一百年奋斗目标，到2035年基本实现国防和军队现代化，到本世纪中叶把人民军队全面建成世界一流军队</p>"
//                             },
//                             {
//                                 "choiceId": 38419242,
//                                 "title": "2020年基本实现机械化，2030年基本实现强军目标，2050年全面建成世界一流军队"
//                             },
//                             {
//                                 "choiceId": 38419243,
//                                 "title": "2027年基本实现信息化，2030年基本实现国防和军队现代化，本世纪中叶实现强军目标"
//                             },
//                             {
//                                 "choiceId": 38419244,
//                                 "title": "2027年基本实现信息化，2035年基本实现强军目标，2050年全面建成世界一流军队"
//                             }
//                         ],
//                         "questionid": 15646831,
//                         "blackOrder": 0,
//                         "lisCount": -1,
//                         "title": "<p>二十大指出，在新时代，国防和军队现代化新&ldquo;三步走&rdquo;战略安排是( )。</p>",
//                         "type": 1
//                     },

// 生成实体类

export interface UlearningPaper {
    score: number;
    part: PaperPart[];
}

export interface PaperPart {
    paperpartid: number;
    partname: string;
    score: number;
    orderindex: number;
    children: Question[];
}

export interface Question {
    score: number;
    correctreply: string;
    item: ChooseItem[];
    questionid: number;
    blackOrder: number;
    lisCount: number;
    title: string;
    type: number;
}

export interface ChooseItem {
    choiceId: number;
    title: string;
}

    