let currentsong = new Audio();
let songs = [];
let currfolder = "";

// Convert seconds to mm:ss
function convertSecondsToTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Get songs from hardcoded folders
async function getSongs(folder) {
    currfolder = folder;

    const allSongs = {
        "cs": [
            "My Way - NEFFEX.mp3",
            "Skating On the Uppers - National Sweetheart.mp3"
        ],
        "sad_songs": [
             "My Way - NEFFEX.mp3"
        ]
    };

    songs = allSongs[folder] || [];

    const songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML += `
        <li>
            <img class="invert" src="img/music.svg" alt="">
            <div class="info">
                <div class="song-name">${song.replaceAll("%20", " ")}</div>
                <div>Sapna</div>
            </div>
            <div class="playnow">
                <img class="invert" src="img/play.svg" alt="">
            </div>
        </li>`;
    }

    // Add click listeners to songs
    Array.from(songUL.getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            const track = e.querySelector(".song-name").innerText;
            playmusic(track);
        });
    });

    return songs;
}

// Play a song
const playmusic = (track, pause = false) => {
    currentsong.src = `/${currfolder}/${track}`;
    if (!pause) {
        currentsong.play();
        document.getElementById("play").src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerText = decodeURI(track);
    document.querySelector(".songtime").innerText = "00:00 / 00:00";
};

// Display available albums
function displayAlbums() {
    const albums = [
        {
            folder: "cs",
            title: "Coding Songs",
            description: "Best tracks to code with"
        },
        {
            folder: "sad_songs",
            title: "Sad Songs",
            description: "Emotional hits"
        }
    ];

    const cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";

    for (const album of albums) {
        cardContainer.innerHTML += `
        <div data-folder="${album.folder}" class="card">
            <div class="play-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="#1ed760">
                    <circle cx="12" cy="12" r="10" stroke="#1ed760" stroke-width="3.5" fill="#1ed760" />
                    <path d="M8.5 8L16.5 12L8.5 16.5Z" fill="black" />
                </svg>
            </div>
            <img src="/cover.jpg" alt="">
            <h3 class="artist-name">${album.title}</h3>
            <p class="artist-name">${album.description}</p>
        </div>`;
    }

    // Click listener on each album card
    document.querySelectorAll(".card").forEach(e => {
        e.addEventListener("click", async () => {
            songs = await getSongs(e.dataset.folder);
            if (songs.length > 0) playmusic(songs[0]);
        });
    });
}

// Initialize player
async function main() {
    await getSongs("cs");
    if (songs.length > 0) playmusic(songs[0], true);

    displayAlbums();

    const playBtn = document.getElementById("play");
    if (playBtn) {
        playBtn.addEventListener("click", () => {
            if (currentsong.paused) {
                currentsong.play();
                playBtn.src = "img/pause.svg";
            } else {
                currentsong.pause();
                playBtn.src = "img/play.svg";
            }
        });
    }

    // Progress bar update
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerText = `${convertSecondsToTime(currentsong.currentTime)} / ${convertSecondsToTime(currentsong.duration)}`;
        document.querySelector(".circle").style.left = `${(currentsong.currentTime / currentsong.duration) * 100}%`;
    });

    // Seekbar click handler
    document.querySelector(".seekbar").addEventListener("click", e => {
        const percent = e.offsetX / e.target.getBoundingClientRect().width;
        currentsong.currentTime = currentsong.duration * percent;
        document.querySelector(".circle").style.left = `${percent * 100}%`;
    });

    // Sidebar toggle
    document.querySelector(".hameburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%";
    });

    // Previous & Next
    document.getElementById("previous").addEventListener("click", () => {
        const index = songs.indexOf(currentsong.src.split("/").pop());
        if (index > 0) playmusic(songs[index - 1]);
    });

    document.getElementById("next").addEventListener("click", () => {
        const index = songs.indexOf(currentsong.src.split("/").pop());
        if (index < songs.length - 1) playmusic(songs[index + 1]);
    });

    // Volume slider
    document.querySelector(".range input").addEventListener("input", (e) => {
        const value = parseInt(e.target.value);
        currentsong.volume = value / 100;
        const volumeImg = document.querySelector(".volume img");
        volumeImg.src = value === 0 ? "img/mute.svg" : "img/volume.svg";
    });

    // Volume toggle
    document.querySelector(".volume img").addEventListener("click", (e) => {
        const img = e.target;
        const volumeBar = document.querySelector(".range input");
        if (img.src.includes("volume.svg")) {
            img.src = "img/mute.svg";
            currentsong.volume = 0;
            volumeBar.value = 0;
        } else {
            img.src = "img/volume.svg";
            currentsong.volume = 0.5;
            volumeBar.value = 50;
        }
    });
}

main();
