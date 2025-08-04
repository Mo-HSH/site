import moment from "jalali-moment";

export function calculateDate(t, d) {
    console.log({t,d})
    let difference = t - (d * 24 * 60 * 60 * 1000);
    return moment.unix(difference / 1000).format('YYYY/MM/DD');
}


