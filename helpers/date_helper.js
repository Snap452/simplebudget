exports.FormatDate = (date) => {
    if (date instanceof Date)
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    else
        return '';
};

exports.FormatFormDate = (date) => {
    if (date instanceof Date) {
        // Get in the right format w/ leading zeros
        return (date.getFullYear() + '-' +
               ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
               ('0' + date.getDate()).slice(-2));
    } else {
        return '';
    }
};