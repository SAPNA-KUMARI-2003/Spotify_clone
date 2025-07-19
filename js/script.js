let currentsong = new Audio();
let songs;
let currfolder;

function convertSecondsToTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Ensure minutes and seconds are two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return ${formattedMinutes}:${formattedSeconds};
}

async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(/${folder}/);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(/${folder}/)[1])
        }
    }

    //Show all the song in a playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + <li>
                             <img class="invert" src="img/music.svg" alt="">
                             <div class="info">
                                 <div class="song-name">${song.replaceAll("%20", " ")}</div>
                                 <div>Sapna</div>
                             </div>
                             <div class="playnow">
                                 <img  class="invert " src="img/play.svg" alt="">
                             </div> </li>;
    }
    // Attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playmusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })

    return songs
}

const playmusic = (track, pause = false) => {
    currentsong.src = /${currfolder}/ + track
    if (!pause) {
        currentsong.play()
        play.src = "img/pause.svg"

    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}

async function displayAlbums() {
    let a = await fetch(/songs/)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(/songs/${folder}/info.json);
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + <div data-folder="${folder}" class="card">
                        <div class="play-button ">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"
                                fill="#1ed760">
                                <circle cx="12" cy="12" r="10" stroke="#1ed760" stroke-width="3.5" fill="#1ed760" />
                                <path d="M8.5 8L16.5 12L8.5 16.5Z" fill="black" />
                            </svg>
                        </div>

                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h3 class="artist-name">${response.title}</h3>
                        <p class="artist-name">${response.description}</p>
                    </div>
        }
        // Load the playlist whenever the card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                songs = await getSongs(songs/${item.currentTarget.dataset.folder})
                playmusic(songs[0])
            })
        })
    }



}

async function main() {
    //Get the list of all songs
    songs = await getSongs("songs/cs");
    playmusic(songs[0], true);

    // Display all tha albums on the page
    displayAlbums();

    //Attach an eventlistener to play next and previous
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg"
        }

        else {
            currentsong.pause()
            play.src = "img/play.svg"
        }
    })

    // Listen for time update event 
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = ${convertSecondsToTime(currentsong.currentTime)}/${convertSecondsToTime(currentsong.duration)}
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    // Add a eventlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    })

    // Add an eventlistner for hameburger
    document.querySelector(".hameburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an eventlistner to fo close butten
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
    })

    // Add eventlistner to previous and next song buttons

    previous.addEventListener("click", () => {
        console.log("previous clicked")
        currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])

        if ((index - 1) >= 0) {

            playmusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        currentsong.pause()
        console.log("Next clicked")


        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])

        if ((index + 1) < songs.length) {

            playmusic(songs[index + 1])
        }
    })

    // Add an eventlistener to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to ", e.target.value, "/ 100");
        currentsong.volume = parseInt(e.target.value) / 100;

        const volumeImg = document.querySelector(".volume img");

        if (e.target.value == 0) {
            volumeImg.src = "img/mute.svg";  // Change to the new SVG image when volume is 0
        } else {
            volumeImg.src = "img/volume.svg";  // Change back to the original SVG image when volume is not 0
        }
    })

    // Add an event listener to mute teh track
    document.querySelector(".volume > img").addEventListener("click" , e=>{
        if(e.target.src.includes("img/volume.svg")){
        e.target.src = e.target.src.replace("img/volume.svg" , "mute.svg");
        currentsong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }

        else{
            e.target.sr = e.target.src.replace("img/mute.svg" ,"volume.svg" );
            currentsong.volume = .1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;

        }
    })

}

main()


