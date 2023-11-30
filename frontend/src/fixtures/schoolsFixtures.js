const schoolsFixtures = {
    oneSchool: {
        "abbrev": "ucsb",
        "name": "UC Santa Barbara",
        "termRegex": "[WSMF]\\d\\d",
        "termDescription": "Enter quarter, e.g. F23, W24, S24, M24",
        "termError": "Quarter must be entered in the correct format"
    },
    threeSchools: [
        { 
            "abbrev": "ucsb",
            "name": "UC Santa Barbara",
            "termRegex": "[WSMF]\\d\\d",
            "termDescription": "Enter quarter, e.g. F23, W24, S24, M24",
            "termError": "Quarter must be entered in the correct format"
        },
        {
            "abbrev": "umn",
            "name": "University of Minnesota",
            "termRegex": "[WSMF]\\d\\d",
            "termDescription": "Enter quarter, e.g. F23, W24, S24, M24",
            "termError": "Quarter must be entered in the correct format"
        },
        {
            "abbrev": "ucsd",
            "name": "UC San Diego",
            "termRegex": "[WSMF]\\d\\d",
            "termDescription": "Enter quarter, e.g. F23, W24, S24, M24",
            "termError": "Quarter must be entered in the correct format"
        }
    ]
};


export { schoolsFixtures };