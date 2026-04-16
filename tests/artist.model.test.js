import { describe, test, expect } from "vitest";
import Artist from "../models/Artist.js";

describe("Artist: Model", function () {
    
    test("should create an Artist", async function () {
        const artist = new Artist({
            name: "Ariana Grande",
            image: "https://picsum.photos/200/300"
        })
        await artist.save()

        expect(artist.name).toBe("Ariana Grande")
    })

    test("should not create a Artist with same name", async function () {
        const artist = new Artist({
            name: "Ariana Grande",
            image: "https://picsum.photos/200/300"
        })
        await artist.save()

        const artist2 = new Artist({
            name: "Ariana Grande",
            image: "https://picsum.photos/200/300"
        })
        expect(artist2.save()).rejects.toThrow()
    })

    test("artist slug should be sluggified name", async function () {
        const artist = new Artist({
            name: "Ariana Grande",
            image: "https://picsum.photos/200/300"
        })
        await artist.save()

        console.log(artist)

        expect(artist.slug).toBe("ariana-grande")
    })

})