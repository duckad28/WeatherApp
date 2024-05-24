const getWeatherIcon = (url) => {
    let temp = url.slice(35);
    let temp2 = temp.split('/');
    let temp3 = temp2.at(1).split('.');
    return temp2.at(0) + temp3.at(0);
}

export default getWeatherIcon;