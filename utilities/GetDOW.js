const dayOfWeeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getDayOfWeek = (day) => {
    let t = new Date(day);
    return dayOfWeeks[t.getDay()];
}

export default getDayOfWeek;