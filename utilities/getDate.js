function addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
  }

const getDate = (day) => {
    let t =  new Date(day);
    return addZero(t.getDate()) + "/" + addZero(t.getMonth())
}

export default getDate;