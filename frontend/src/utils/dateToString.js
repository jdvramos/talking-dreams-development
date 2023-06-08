import moment from "moment";

function dateToString(dateString) {
    return moment(dateString).format("MMMM D, YYYY");
}

export default dateToString;
