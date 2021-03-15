export default getOnlineStatus = (timestamp) => {
    var time = (new Date().getTime() - new Date(timestamp).getTime());
    if (time/(1000*60) >= 5 && time/(1000*60) < 60)
        return 'Was online ' + Math.floor(time/(1000*60))
                + ' minutes ago';
    if (time/(1000*60*60) >= 1 && time/(1000*60*60) < 24) {
        if (time/(1000*60*60) === 1)
            return 'Was online ' + Math.floor(time/(1000*60*60))
                    + ' hour ago';
        else return 'Was online ' + Math.floor(time/(1000*60*60))
                    + ' hours ago';
    }
    if (time/(1000*60*60*24) >= 1 && time/(1000*60*60*24) <= 365) {
        if (time/(1000*60*60) === 1)
            return 'Was online ' + Math.floor(time/(1000*60*60*24))
                    + ' day ago';
        else return 'Was online ' + Math.floor(time/(1000*60*60*24))
                    + ' days ago';
    }
    if (time/(1000*60*60*24) > 365)
        return 'Wasn\'t online for a long time';
    //else return (new Date().getTime() - new Date(timestamp).getTime())/(1000*60);
    else return 'Online';
}