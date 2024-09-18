export const numberTh = [
    { label: "اول", value: 1 },
    { label: "دوم", value: 2 },
    { label: "سوم", value: 3 },
    { label: "چهارم", value: 4 },
    { label: "پنجم", value: 5 },
    { label: "ششم", value: 6 },
    { label: "هفتم", value: 7 },
    { label: "هشتم", value: 8 },
    { label: "نهم", value: 9 },
    { label: "دهم", value: 10 },
    { label: "یازدهم", value: 11 },
    { label: "دوازدهم", value: 12 },
    { label: "سیزدهم", value: 13 },
    { label: "چهاردهم", value: 14 },
    { label: "پانزدهم", value: 15 },
    { label: "شانزدهم", value: 16 },
    { label: "هفدهم", value: 17 },
    { label: "هجدهم", value: 18 },
    { label: "نوزدهم", value: 19 },
    { label: "بیستم", value: 20 }
];

export const GetNumberLabel = (value) => {
    const ls = [
        "اول",
        "دوم",
        "سوم",
        "چهارم",
        "پنجم",
        "ششم",
        "هفتم",
        "هشتم",
        "نهم",
        "دهم",
        "یازدهم",
        "دوازدهم",
        "سیزدهم",
        "چهاردهم",
        "پانزدهم",
        "شانزدهم",
        "هفدهم",
        "هجدهم",
        "نوزدهم",
        "بیستم"
    ]
    try {
        return ls[value-1];
    } catch (e) {
        return "";
    }
};