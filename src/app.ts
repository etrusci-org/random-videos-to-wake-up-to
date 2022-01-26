import { AppType } from './types'
import { MEDIA } from './data.js'


export const APP: AppType = {
    debug: true,
    queue: [],

    ui: {
        loadRandomMedia: document.querySelector('.loadRandomMedia'),
        mediaEmbed: document.querySelector('.mediaEmbed'),
        mediaSelect: document.querySelector('.mediaSelect'),
    },

    main() {
        this.ui.loadRandomMedia?.addEventListener('click', () => this.loadMedia())
        this.ui.mediaSelect?.addEventListener('change', () => this.loadMedia(true))

        for (const k in MEDIA) {
            if (MEDIA[k]) {
                let opt = document.createElement('option')
                opt.value = k
                opt.innerHTML = `${MEDIA[k]?.title.substring(0, 50)}`
                this.ui.mediaSelect?.append(opt)
            }
        }

        this.loadMedia()
    },

    loadMedia(selected = false) {
        if (!this.ui.mediaEmbed || !this.ui.mediaSelect || !this.ui.loadRandomMedia) {
            return
        }

        if (this.queue.length == 0) {
            this.queue = [ ...MEDIA ]
        }

        let m = null

        if (!selected) {
            this.ui.mediaSelect.selectedIndex = 0
            m = this.getRandomMedia()
        }
        else {
            m = MEDIA[parseInt(this.ui.mediaSelect?.value)]
        }

        let embedCode = this.getEmbedCode(m)

        if (embedCode) {
            let queuePos = `${MEDIA.length - this.queue.length}`.padStart(`${MEDIA.length}`.length, '0')
            this.ui.loadRandomMedia.innerHTML = `random [${queuePos}/${MEDIA.length}]`
            this.ui.mediaEmbed.innerHTML = embedCode
        }
    },

    getRandomMedia() {
        let k = Math.floor(Math.random() * this.queue.length)
        let item = this.queue[k]

        if (!item) {
            return null
        }

        this.queue.splice(k, 1)

        return item
    },

    getEmbedCode(media) {
        if (!media) {
            return null
        }

        let embedCode = null

        if (this.debug) {
            return `<code>${JSON.stringify(media)}</code>`
        }

        switch (media.platform) {
            case 'bandcamp':
                embedCode = `<iframe class="bandcamp" src="https://bandcamp.com/EmbeddedPlayer/track=${media.slug}/size=large"></iframe>`
                break

            case 'soundcloud':
                embedCode = `<iframe class="soundcloud" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${media.slug}"></iframe>`
            break

            case 'youtube':
                embedCode = `<iframe class="youtube" src="https://www.youtube-nocookie.com/embed/${media.slug}" allow="encrypted-media;"></iframe>`
            break

            // TODO: Add more platforms which don't require the user to login to consume the media.
        }

        return embedCode
    },
}
