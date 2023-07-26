import moment from 'moment';

export const hourMonth = ( date: Date ) => {
    const todayMonth = moment(date).format("HH:mm a | MMMM Do");
    return todayMonth;
}