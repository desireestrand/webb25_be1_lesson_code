import { describe, beforeEach, test, expect } from "vitest";
import Artist from "../models/Artist.js";

describe("Song: Model", function () {
    let artistId;
    beforeEach(async function () {
        const artist = new Artist({
            name: "Ariana Grande",
        })
        await artist.save()
        artistId = artist.id
    })

    test("should create a Song", async function() {
        console.log(artistId)
    })
})