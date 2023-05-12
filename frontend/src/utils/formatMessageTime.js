const formatMessageTime = function (messageTime) {
    const currentTime = new Date();
    messageTime = new Date(messageTime);

    const distanceInSeconds = Math.floor(
        (currentTime.getTime() - messageTime.getTime()) / 1000
    );

    if (distanceInSeconds < 60) {
        return `${distanceInSeconds}s`;
    } else if (distanceInSeconds < 60 * 60) {
        const distanceInMinutes = Math.floor(distanceInSeconds / 60);
        return `${distanceInMinutes}m`;
    } else if (distanceInSeconds < 24 * 60 * 60) {
        const distanceInHours = Math.floor(distanceInSeconds / (60 * 60));
        return `${distanceInHours}h`;
    } else if (distanceInSeconds < 7 * 24 * 60 * 60) {
        const distanceInDays = Math.floor(distanceInSeconds / (24 * 60 * 60));
        return `${distanceInDays}d`;
    } else if (distanceInSeconds < 52 * 7 * 24 * 60 * 60) {
        const distanceInWeeks = Math.floor(
            distanceInSeconds / (7 * 24 * 60 * 60)
        );
        return `${distanceInWeeks}w`;
    } else if (distanceInSeconds < Infinity) {
        const distanceInYears = Math.floor(
            distanceInSeconds / (52 * 7 * 24 * 60 * 60)
        );
        return `${distanceInYears}y`;
    } else {
        return "";
    }
};

export default formatMessageTime;
