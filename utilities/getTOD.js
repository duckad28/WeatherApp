const phase = ["AM", "PM"]
const getTimeOfDay = (day) => {
    let t = new Date(day);
    let temp = t.getHours();

    return (Math.floor(parseInt(temp) % 12)) + phase[Math.floor(parseInt(temp) / 12)];
}

export default getTimeOfDay;