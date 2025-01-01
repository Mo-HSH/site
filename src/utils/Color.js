function getStatusColor(status) {
    switch (status) {
        case "حاضر":
            return "green";
        case "فرار":
            return "orange";
        case "فرار بالای 6 ماه":
            return "red";
        case "یادآوری":
            return "red";
        default:
            return "rgb(28,131,231)"
    }
}

function getTagColor(tag) {
    switch (tag) {
        case "معاف از رزم":
            return "red";
        case "مامور":
            return "blue";
        case "دوره کد":
            return "gold";
        case "انتقالی":
            return "geekblue";
        default:
            return "rgb(110,110,110)"
    }
}

export {getStatusColor, getTagColor};