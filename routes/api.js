const ytScrape = require('scrape-youtube').default
const ytdl = require('ytdl-core')


async function getResult(search, resultType = 0) {
    let type = resultType == 0 ? "video" : "channel"

    let result = await ytScrape.search(search, { type })
    return result


}


module.exports = function (app) {

    app.get("/api/search", async (req, res) => {
        let keyword = req.query.keyword
        let type = req.query.type;
 console.log("yes");
        if (!keyword) {
            res.status(404).send("no keyword supplied")
            return;
        }
        type = !type || type > 1 ? 0 : type;

        let result = await ytScrape.search(keyword, { type })
        res.json(result)



    })

    app.get('/api/getAudio',  (req, res) => {

        let url = req.query.url;
        const range = req.headers.range || "bytes=0-";
        if (!url) {
            res.status(404)
            res.end("no url found")
            return;
        }
        console.log(range);

        if (!range) {
            res.status(400).send("Requires Range header");

        }
        let videoSize = 100000000

        const CHUNK_SIZE = 100 ** 6; // 1MB
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        };
        res.writeHead(206, headers);




        ytdl(url, { quality: 'highestaudio', range: { start: start, end: end } }).pipe(res)


    })








}