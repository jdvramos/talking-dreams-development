const shortenText = function (textLimit, inputString) {
    if (inputString.length <= textLimit) {
        return inputString;
    }

    const trimmedString = inputString.trim();
    const shortenedString = trimmedString.substring(0, textLimit);
    const lastCharacter = shortenedString.charAt(shortenedString.length - 1);

    // Remove trailing space if present
    if (lastCharacter === " ") {
        return shortenedString.trim() + "...";
    }

    return shortenedString + "...";
};

export default shortenText;
