const generateTorrentFileName = (title, type) => {
    let newTitle = title.toLowerCase().replace(/ /g, '.');
    const useCapitals = Math.floor(Math.random()) === 0 ? false : true; 
    if (type === 'tv') {
        newTitle += `.s${Math.floor(Math.random() * 30)}e${Math.floor(Math.random() * 30)}.`;
    }

    const resolutions = ['480p', '720p', '1080p', '2160p', '4k', 'uhd'];
    const transcoders = ['h264', 'h265', 'x264', 'x265', 'avc', 'hevc'];

    newTitle += `.${resolutions[Math.floor(Math.random() * resolutions.length)]}.`;
    newTitle += `${transcoders[Math.floor(Math.random() * transcoders.length)]}.`;

    if (useCapitals) newTitle = newTitle.toUpperCase();
    if (newTitle[newTitle.length - 1] === '.') newTitle = newTitle.slice(0, newTitle.length - 1);

    return newTitle;
}

module.exports = {
    generateTorrentFileName
}