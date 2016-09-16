namespace BubbleDots {
    export let Constants = {
        ENTITY_DEFAULT_RADIUS: 17,
        BULLET_DEFAULT_RADIUS: 5,
        GAME_WIDTH: 1024,
        GAME_HEIGHT: 768,
        MAX_CIRCLES: 200,
        GAME_DURATION: 1000 * 300,

        ENTITY_TYPES: {
            CANDY_ENTITY: 1 << 0,
            PLAYER_ENTITY: 1 << 1,
            BULLET_ENTITY: 1 << 2
        },

        IMAGE_ASSETS: [
            {id: "particle" + 1, url: "assets/bubbledots/blueParticle.png"},
            {id: "particle" + 2, url: "assets/bubbledots/redParticle.png"},
            {id: "particle" + 3, url: "assets/bubbledots/greenParticle.png"},
            {id: "particle" + 4, url: "assets/bubbledots/yellowParticle.png"},
            {id: "ground", url: "assets/bubbledots/ground.png"}
        ]
    }
}

