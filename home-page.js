const activityCardData = [
    {
        imgPath: './imgs/restaurant-color-icon.jpg',
        description: 'Restaurant',
        route: 'restaurant-page.html'
    },
    {
        imgPath: './imgs/hiking-color-icon.png',
        description: 'Hiking',
        route: 'hiking-page.html'
    },
    {
        imgPath: './imgs/movies-color-icon.png',
        description: 'Movies',
        route: 'movies-page.html'
    },
    {
        imgPath: './imgs/dancing-color-icon.png',
        description: 'Dancing',
        route: 'dancing-page.html'
    },
    {
        imgPath: './imgs/mini-golf-color-icon.png',
        description: 'Bowling/Minigolf/Gaming',
        route: 'gaming-page.html'
    },
    {
        imgPath: './imgs/museum-color-icon.jpg',
        description: 'Museums',
        route: 'museums-page.html'
    }
];
var x = "";
var i;

for (i = 0; i < activityCardData.length; i++) {
    x = x + `
    <a href=${activityCardData[i].route} class="text-secondary" style="text-decoration: none">
        <div class="d-flex flex-column justify-content-center align-items-center m-4 card">
            <div>
                <img src=${activityCardData[i].imgPath} class="mt-3 card-icon">
            </div>
            <div class="card-body card-description">
                ${activityCardData[i].description}
            </div>
        </div>
    </a>`
}

document.getElementById("activity-cards").innerHTML = x;
