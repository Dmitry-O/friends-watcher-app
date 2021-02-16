export default getOnlineStatus = (timestamp) => {
    if ((new Date().getTime() - new Date(timestamp).getTime())/(1000*60) >= 5)
        return 'Was online ' + Math.floor((new Date().getTime() - new Date(timestamp).getTime())/(1000*60))
            + ' minutes ago';
    //else return (new Date().getTime() - new Date(timestamp).getTime())/(1000*60);
    else return 'Online';
}