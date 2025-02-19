import moment from "moment";

export const convertDate = (date) => {
    if (!date) return [];

    const formatDate = (eventdate) => {
        if (typeof eventdate === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(eventdate)) {
            return moment(eventdate).format("DD MMM YYYY");
        }
        const timestamp = parseInt(eventdate);
        if (!isNaN(timestamp)) {
            return moment(timestamp).format("DD MMM YYYY");
        }
        const parsedDate = moment(eventdate);
        if (parsedDate.isValid()) {
            return parsedDate.format("DD MMM YYYY");
        }
        return null;
    };

    if (date.eventdate) {
        return [{
            ...date,
            eventdate: formatDate(date.eventdate),
        }];
    }
    
    if (Array.isArray(date)) {
        return date.map((event) => ({
            ...event,
            eventdate: event.eventdate
                ? formatDate(event.eventdate)
                : null,
        }));
    }
    
    if (typeof date === "object") {
        const arrayProperty = Object.values(date).find(Array.isArray);
        if (arrayProperty) {
            return arrayProperty.map((event) => ({
                ...event,
                eventdate: event.eventdate
                    ? formatDate(event.eventdate)
                    : null,
            }));
        }
    }
    
    return [];
};