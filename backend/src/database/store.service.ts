import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Store } from './entities/store.entity';
import { Model } from 'mongoose';

@Injectable()
export class StoreService {
    constructor(
        @InjectModel(Store.name) private storeModal: Model<Store>
    ) {
        const p = this.storeModal.count({}).then((v) => {
            if (v === 0) {
                return import('./data/store.data').then((data) => {
                    console.log((data.StoreData as unknown as Store[]).length);
                    let promises = [];
                    for (let iterator of data.StoreData) {
                        let it = { ...iterator } as unknown as Store;
                        it.Date = new Date(it.Date);
                        // console.log(it.Date);

                        promises.push(this.storeModal.insertMany([it]).catch((e) => {
                            console.log(e);
                        }));
                    }
                    return Promise.all(promises);
                })

            }
        })

        p.then((v) => {
            console.log('promises resolved', v);
        }).catch(e => {
            console.log(e);
        })
    }

    getDate(from: number, to: number) {



        const dateDiff = Math.round(((to) - (from)) / (60 * 60 * 24)) + 1;
        console.log(dateDiff);
        
        const dateRanges = Array.from(Array(dateDiff), (_, i) => (i * 1000 * 60 * 60 * 24) + (from * 1000));


        let reportType: IReportType = dateDiff <= 7 ? IReportType.DAILY : dateDiff < 90 ? IReportType.WEEKLY : IReportType.MONTHLY
        console.log(reportType);

        const customDateProjection = [IReportType.DAILY.valueOf(), IReportType.WEEKLY.valueOf()].includes(reportType.valueOf()) ? { $concat: [{ $toString: { $dayOfMonth: "$date" } }, ',', '$monthStr', ' ', { $toString: { $year: "$date" } }] } : { $concat: ['$monthStr', ' ', { $toString: { $year: "$date" } }] }
        // const customDateProjectionAlt =
        //     [IReportType.DAILY.valueOf(), IReportType.WEEKLY.valueOf()].includes(reportType.valueOf())
        //         ? {
        //             $concat: [{ $toString: { $dayOfMonth: { $toDate: "$$currentDate" } } }, ',',
        //             {
        //                 $let: {
        //                     vars: {
        //                         monthsInString: [, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
        //                     },
        //                     in: {
        //                         $arrayElemAt: ['$$monthsInString', { $month: "$Date" }]
        //                     }
        //                 }
        //             },
        //                 ' ', { $toString: { $year: { $toDate: "$$currentDate" } } }]
        //         } : {
        //             $concat: [{
        //                 $let: {
        //                     vars: {
        //                         monthsInString: [, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
        //                     },
        //                     in: {
        //                         $arrayElemAt: ['$$monthsInString', { $month: "$Date" }]
        //                     }
        //                 }
        //             }, ' ', { $toString: { $year: { $toDate: "$$currentDate" } } }]
        //         }

        const pipeLine: any[] = [
            {
                $match: {
                    Date: { $gte: new Date(from * 1000), $lte: new Date(to * 1000) }
                }
            },
            {
                $addFields: {
                    monthStr: {
                        $let: {
                            vars: {
                                monthsInString: [, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
                            },
                            in: {
                                $arrayElemAt: ['$$monthsInString', { $month: "$Date" }]
                            }
                        }
                    }
                }
            },
            {
                $project:
                {
                    _id: 0,
                    year: { $year: "$Date" },
                    month: { $month: "$Date" },
                    day: { $dayOfMonth: "$Date" },
                    hour: { $hour: "$Date" },
                    minutes: { $minute: "$Date" },
                    seconds: { $second: "$Date" },
                    milliseconds: { $millisecond: "$Date" },
                    dayOfYear: { $dayOfYear: "$Date" },
                    dayOfWeek: { $dayOfWeek: "$Date" },
                    week: { $week: "$Date" },
                    date: '$Date',
                    amount: '$Amount',
                    education: '$Education',
                    decision: '$Decision',
                    dateInMillis: { $subtract: ["$Date", new Date("1-1-1970")] },
                    // formattedDate: { ...customDateProjection },
                    monthStr: 1
                }
            },


        ];

        const groupBy = {
            accepted: {
                $sum: {
                    $cond: [
                        { $eq: ['$decision', 'ACCEPT'] }, '$amount', 0
                    ]
                }
            },
            rejected: {
                $sum: {
                    $cond: [
                        { $eq: ['$decision', 'REJECT'] }, '$amount', 0
                    ]
                }
            },
            error: {
                $sum: {
                    $cond: [
                        { $eq: ['$decision', 'ERR'] }, '$amount', 0
                    ]
                }
            },
            total: {
                $sum: '$amount'
            },
            year: { $first: '$year' },
            month: { $first: '$month' },
            day: { $first: '$day' },
            date: { $first: '$date' },
            monthStr: { $first: '$monthStr' }
        };

        const fillMissingDates = [
            {
                $group: {
                    _id: null,
                    data: { $push: '$$ROOT' }
                }
            },
            {
                $project: {
                    missingDates: {
                        $map: {
                            input: dateRanges,
                            as: "currentDate",
                            in: {
                                $let: {
                                    vars: {
                                        dayIndex: {
                                            "$indexOfArray": ["$data.dateInMillis", "$$currentDate"]
                                        }
                                    },
                                    in: {
                                        $cond: {
                                            if: { $ne: ["$$dayIndex", -1] },
                                            then: {
                                                $arrayElemAt: ["$data", "$$dayIndex"]
                                            },
                                            else: {
                                                dateInMillies: '$$currentDate',
                                                accepted: 0,
                                                rejected: 0,
                                                error: 0,
                                                total: 0,
                                                year: { $year: { $toDate: "$$currentDate" } },
                                                month: { $month: { $toDate: "$$currentDate" } },
                                                day: { $dayOfMonth: { $toDate: "$$currentDate" } },
                                                hour: { $hour: { $toDate: "$$currentDate" } },
                                                minutes: { $minute: { $toDate: "$$currentDate" } },
                                                seconds: { $second: { $toDate: "$$currentDate" } },
                                                milliseconds: { $millisecond: { $toDate: "$$currentDate" } },
                                                dayOfYear: { $dayOfYear: { $toDate: "$$currentDate" } },
                                                dayOfWeek: { $dayOfWeek: { $toDate: "$$currentDate" } },
                                                week: { $week: { $toDate: "$$currentDate" } },
                                                date: { $toDate: "$$currentDate" },
                                                // formattedDate: { ...customDateProjectionAlt },
                                                monthStr: {
                                                    $let: {
                                                        vars: {
                                                            monthsInString: [, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
                                                        },
                                                        in: {
                                                            $arrayElemAt: ['$$monthsInString', { $month: { $toDate: "$$currentDate" } }]
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    dates: '$data'
                }
            },
            {
                $project: {
                    dates: {
                        $concatArrays: ['$dates', '$missingDates']
                    }
                }
            },
            { $unwind: '$dates' },
            { $replaceRoot: { newRoot: "$dates" } },
            { $sort: { _id: 1 } },
        ]

        pipeLine.push(...fillMissingDates)

        if (reportType.valueOf() === IReportType.DAILY.valueOf()) {
            console.log('Daily condition');

            const query = [
                {
                    $group: {
                        _id: { month: '$month', year: '$year', day: '$day' },
                        ...groupBy
                    }
                },
            ]
            pipeLine.push(...query);
        }

        if (reportType.valueOf() === IReportType.WEEKLY.valueOf()) {
            console.log('weekly condition');
            const query = [
                {
                    $group: {
                        _id: '$week',
                        ...groupBy
                    }
                },

            ]
            pipeLine.push(...query);
        }

        if (reportType.valueOf() === IReportType.MONTHLY.valueOf()) {
            console.log('monthly condition');
            const query = [
                {
                    $group: {
                        _id: { month: '$month', year: '$year' },
                        ...groupBy
                    }
                }
            ]
            pipeLine.push(...query);
        }

       

        pipeLine.push(
             {
                $project: {
                    _id: 1,
                    accepted: 1,
                    rejected: 1,
                    error: 1,
                    total: 1,
                    formattedDate: { ...customDateProjection }
                }
            },
            {
                $group: {
                    _id: '$formattedDate',
                    accepted: { $sum: '$accepted' },
                    rejected: { $sum: '$rejected' },
                    error: { $sum: '$error' },
                    total: { $sum: '$total' },
                    formattedDate: { $first: '$formattedDate' }
                }
            },
            { $sort: { _id: 1 } })

        console.log(pipeLine);
        // return pipeLine;
        return this.storeModal.aggregate(pipeLine)
    }


}

enum IReportType {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY'
}