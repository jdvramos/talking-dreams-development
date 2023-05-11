const shortenText = function (textLimit, inputString) {
    if (inputString.length <= textLimit) {
        return inputString;
    }
    return inputString.substring(0, textLimit) + "...";
};

export default shortenText;
