const API = "/api";

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsAll(selector, root = document) {
  return root.querySelectorAll(selector);
}

// Navigation
function initNav() {
  qsAll("nav button").forEach((btn) => {
    btn.addEventListener("click", () => {
      qsAll("nav button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      qsAll(".panel").forEach((p) => p.classList.remove("active"));
      qs(`#${btn.dataset.section}`).classList.add("active");
      loadSection(btn.dataset.section);
    });
  });
}

// Artists
async function loadArtists(q = "") {
  const url = q ? `${API}/artists?q=${encodeURIComponent(q)}` : `${API}/artists`;
  const data = await fetchJson(url);
  const list = qs("#artists-list");
  list.innerHTML = data.length
    ? data
        .map(
          (a) => `
    <div class="item" data-id="${a._id}">
      <div class="item-info">
        <p class="item-title">${escapeHtml(a.name)}</p>
      </div>
      <div class="item-actions">
        <button class="edit" data-id="${a._id}">Edit</button>
        <button class="delete" data-id="${a._id}">Delete</button>
      </div>
    </div>`
        )
        .join("")
    : '<p class="item-meta">No artists</p>';

  list.querySelectorAll(".edit").forEach((b) =>
    b.addEventListener("click", () => openArtistModal(b.dataset.id))
  );
  list.querySelectorAll(".delete").forEach((b) =>
    b.addEventListener("click", () => deleteArtist(b.dataset.id))
  );
}

async function deleteArtist(id) {
  if (!confirm("Delete this artist?")) return;
  await fetchJson(`${API}/artists/${id}`, { method: "DELETE" });
  loadArtists(qs("#artists-search").value);
}

function openArtistModal(id = null) {
  qs("#modal-title").textContent = id ? "Edit artist" : "Add artist";
  qs("#modal-form").innerHTML = `
    <label>Name</label>
    <input name="name" required placeholder="Artist name" />
  `;
  const form = qs("#modal-form");
  form.onsubmit = async (e) => {
    e.preventDefault();
    const name = new FormData(form).get("name");
    if (id) {
      await fetchJson(`${API}/artists/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
      });
    } else {
      await fetchJson(`${API}/artists`, {
        method: "POST",
        body: JSON.stringify({ name }),
      });
    }
    closeModal();
    loadArtists(qs("#artists-search").value);
  };
  if (id) {
    fetchJson(`${API}/artists/${id}`).then((a) => {
      qs("input[name=name]", form).value = a.name;
    });
  }
  qs("#modal").classList.remove("hidden");
}

// Songs
function songArtistName(s) {
  return s.artist?.name ?? (typeof s.artist === "string" ? s.artist : "") ?? "";
}
function songAlbumTitle(s) {
  return s.album?.title ?? (typeof s.album === "string" ? s.album : "") ?? "";
}

async function loadSongs(q = "") {
  const url = q ? `${API}/songs?q=${encodeURIComponent(q)}` : `${API}/songs`;
  const data = await fetchJson(url);
  const list = qs("#songs-list");
  list.innerHTML = data.length
    ? data
        .map(
          (s) => {
            const artist = songArtistName(s);
            const album = songAlbumTitle(s);
            const meta = album ? `${artist} · ${album}` : artist;
            return `
    <div class="item" data-id="${s._id}">
      <div class="item-info">
        <p class="item-title">${escapeHtml(s.title)}</p>
        <p class="item-meta">${escapeHtml(meta)}</p>
      </div>
      <div class="item-actions">
        <button class="edit" data-id="${s._id}">Edit</button>
        <button class="delete" data-id="${s._id}">Delete</button>
      </div>
    </div>`;
          }
        )
        .join("")
    : '<p class="item-meta">No songs</p>';

  list.querySelectorAll(".edit").forEach((b) =>
    b.addEventListener("click", () => openSongModal(b.dataset.id))
  );
  list.querySelectorAll(".delete").forEach((b) =>
    b.addEventListener("click", () => deleteSong(b.dataset.id))
  );
}

async function deleteSong(id) {
  if (!confirm("Delete this song?")) return;
  await fetchJson(`${API}/songs/${id}`, { method: "DELETE" });
  loadSongs(qs("#songs-search").value);
}

async function openSongModal(id = null) {
  const [artists, albums] = await Promise.all([
    fetchJson(`${API}/artists`),
    fetchJson(`${API}/albums`),
  ]);
  const artistOpts = artists.map((a) => `<option value="${a._id}">${escapeHtml(a.name)}</option>`).join("");
  const albumOpts = albums.map((a) => `<option value="${a._id}">${escapeHtml(a.title)}</option>`).join("");
  qs("#modal-title").textContent = id ? "Edit song" : "Add song";
  qs("#modal-form").innerHTML = `
    <label>Title</label>
    <input name="title" required placeholder="Song title" />
    <label>Artist</label>
    <select name="artist" required><option value="">Select artist</option>${artistOpts}</select>
    <label>Album (optional)</label>
    <select name="album"><option value="">None</option>${albumOpts}</select>
  `;
  const form = qs("#modal-form");
  form.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const body = { title: fd.get("title"), artist: fd.get("artist") };
    const albumVal = fd.get("album");
    body.album = albumVal || null;
    if (id) {
      await fetchJson(`${API}/songs/${id}`, { method: "PUT", body: JSON.stringify(body) });
    } else {
      await fetchJson(`${API}/songs`, { method: "POST", body: JSON.stringify(body) });
    }
    closeModal();
    loadSongs(qs("#songs-search").value);
  };
  if (id) {
    const s = await fetchJson(`${API}/songs/${id}`);
    qs("input[name=title]", form).value = s.title;
    qs("select[name=artist]", form).value = s.artist?._id ?? s.artist ?? "";
    qs("select[name=album]", form).value = s.album?._id ?? s.album ?? "";
  }
  qs("#modal").classList.remove("hidden");
}

// Albums
async function loadAlbums(q = "") {
  const url = q ? `${API}/albums?q=${encodeURIComponent(q)}` : `${API}/albums`;
  const data = await fetchJson(url);
  const list = qs("#albums-list");
  const artistName = (a) => (a?.artist?.name ?? a?.artist ?? "");
  list.innerHTML = data.length
    ? data
        .map(
          (a) => `
    <div class="item" data-id="${a._id}">
      <div class="item-info">
        <p class="item-title">${escapeHtml(a.title)}</p>
        <p class="item-meta">${escapeHtml(artistName(a))} · ${formatDate(a.releaseDate)}</p>
      </div>
      <div class="item-actions">
        <button class="edit" data-id="${a._id}">Edit</button>
        <button class="delete" data-id="${a._id}">Delete</button>
      </div>
    </div>`
        )
        .join("")
    : '<p class="item-meta">No albums</p>';

  list.querySelectorAll(".edit").forEach((b) =>
    b.addEventListener("click", () => openAlbumModal(b.dataset.id))
  );
  list.querySelectorAll(".delete").forEach((b) =>
    b.addEventListener("click", () => deleteAlbum(b.dataset.id))
  );
}

async function deleteAlbum(id) {
  if (!confirm("Delete this album?")) return;
  await fetchJson(`${API}/albums/${id}`, { method: "DELETE" });
  loadAlbums(qs("#albums-search").value);
}

async function openAlbumModal(id = null) {
  const artists = await fetchJson(`${API}/artists`);
  const options = artists
    .map((a) => `<option value="${a._id}">${escapeHtml(a.name)}</option>`)
    .join("");
  qs("#modal-title").textContent = id ? "Edit album" : "Add album";
  qs("#modal-form").innerHTML = `
    <label>Title</label>
    <input name="title" required placeholder="Album title" />
    <label>Artist</label>
    <select name="artist" required><option value="">Select artist</option>${options}</select>
    <label>Release date</label>
    <input name="releaseDate" type="date" required />
  `;
  const form = qs("#modal-form");
  form.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const body = {
      title: fd.get("title"),
      artist: fd.get("artist"),
      releaseDate: fd.get("releaseDate"),
    };
    if (id) {
      await fetchJson(`${API}/albums/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
    } else {
      await fetchJson(`${API}/albums`, {
        method: "POST",
        body: JSON.stringify(body),
      });
    }
    closeModal();
    loadAlbums(qs("#albums-search").value);
  };
  if (id) {
    fetchJson(`${API}/albums/${id}`).then((a) => {
      qs("input[name=title]", form).value = a.title;
      qs("select[name=artist]", form).value =
        a.artist?._id ?? a.artist ?? "";
      const d = a.releaseDate ? new Date(a.releaseDate) : null;
      qs("input[name=releaseDate]", form).value = d
        ? d.toISOString().slice(0, 10)
        : "";
    });
  }
  qs("#modal").classList.remove("hidden");
}

// Playlists
async function loadPlaylists(q = "") {
  const url = q ? `${API}/playlists?q=${encodeURIComponent(q)}` : `${API}/playlists`;
  const data = await fetchJson(url);
  const list = qs("#playlists-list");
  list.innerHTML = data.length
    ? data
        .map(
          (p) => {
            const count = p.songs?.length ?? 0;
            const meta = p.description ? `${count} songs · ${escapeHtml(p.description)}` : `${count} songs`;
            return `
    <div class="item playlist-item" data-id="${p._id}">
      <div class="playlist-header" data-id="${p._id}">
        <div class="item-info" data-id="${p._id}">
          <span class="expand-icon">▸</span>
          <div>
            <p class="item-title">${escapeHtml(p.name)}</p>
            <p class="item-meta">${meta}</p>
          </div>
        </div>
        <div class="item-actions">
          <button class="add-song" data-id="${p._id}">Add song</button>
          <button class="delete" data-id="${p._id}">Delete</button>
        </div>
      </div>
      <div class="playlist-songs" data-id="${p._id}" hidden></div>
    </div>`;
          }
        )
        .join("")
    : '<p class="item-meta">No playlists</p>';

  list.querySelectorAll(".playlist-header").forEach((el) => {
    const id = el.closest(".playlist-item")?.dataset.id;
    if (id) {
      el.addEventListener("click", (e) => {
        if (e.target.closest(".item-actions")) return;
        togglePlaylistExpand(id);
      });
    }
  });
  list.querySelectorAll(".add-song").forEach((b) =>
    b.addEventListener("click", (e) => { e.stopPropagation(); openAddSongModal(b.dataset.id); })
  );
  list.querySelectorAll(".delete").forEach((b) =>
    b.addEventListener("click", (e) => { e.stopPropagation(); deletePlaylist(b.dataset.id); })
  );
}

async function togglePlaylistExpand(id) {
  const item = qs(`.playlist-item[data-id="${id}"]`);
  const songsEl = qs(`.playlist-songs[data-id="${id}"]`);
  const icon = qs(".expand-icon", item);
  const isExpanded = !songsEl.hidden;

  if (isExpanded) {
    songsEl.hidden = true;
    icon.textContent = "▸";
  } else {
    icon.textContent = "▾";
    songsEl.hidden = false;
    if (!songsEl.innerHTML) {
      songsEl.innerHTML = '<p class="item-meta">Loading…</p>';
      const playlist = await fetchJson(`${API}/playlists/${id}`);
      const songs = playlist.songs ?? [];
      songsEl.innerHTML = songs.length
        ? songs.map((s) => {
            const artist = songArtistName(s);
            const label = artist ? `${s.title} · ${artist}` : s.title;
            return `<p class="playlist-song">${escapeHtml(label)}</p>`;
          }).join("")
        : '<p class="item-meta">No songs yet</p>';
    }
  }
}

async function deletePlaylist(id) {
  if (!confirm("Delete this playlist?")) return;
  await fetchJson(`${API}/playlists/${id}`, { method: "DELETE" });
  loadPlaylists(qs("#playlists-search").value);
}

function openPlaylistModal() {
  qs("#modal-title").textContent = "Add playlist";
  qs("#modal-form").innerHTML = `
    <label>Name</label>
    <input name="name" required placeholder="Playlist name" />
    <label>Description (optional)</label>
    <input name="description" placeholder="Description" />
  `;
  const form = qs("#modal-form");
  form.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    await fetchJson(`${API}/playlists`, {
      method: "POST",
      body: JSON.stringify({ name: fd.get("name"), description: fd.get("description") || "" }),
    });
    closeModal();
    loadPlaylists(qs("#playlists-search").value);
  };
  qs("#modal").classList.remove("hidden");
}

async function openAddSongModal(playlistId) {
  const [playlist, songs] = await Promise.all([
    fetchJson(`${API}/playlists/${playlistId}`),
    fetchJson(`${API}/songs`),
  ]);
  const songOpts = songs
    .filter((s) => !playlist.songs?.some((sp) => (sp._id ?? sp) === s._id))
    .map((s) => `<option value="${s._id}">${escapeHtml(s.title)} · ${escapeHtml(songArtistName(s))}</option>`)
    .join("");
  if (!songOpts) {
    alert("No more songs to add, or all songs are already in this playlist.");
    return;
  }
  qs("#modal-title").textContent = `Add song to ${escapeHtml(playlist.name)}`;
  qs("#modal-form").innerHTML = `
    <label>Song</label>
    <select name="song" required><option value="">Select song</option>${songOpts}</select>
  `;
  const form = qs("#modal-form");
  form.onsubmit = async (e) => {
    e.preventDefault();
    const songId = new FormData(form).get("song");
    await fetchJson(`${API}/playlists/${playlistId}/add-song`, {
      method: "POST",
      body: JSON.stringify({ song: songId }),
    });
    closeModal();
    loadPlaylists(qs("#playlists-search").value);
  };
  qs("#modal").classList.remove("hidden");
}

function formatDate(s) {
  if (!s) return "";
  const d = new Date(s);
  return isNaN(d) ? s : d.toLocaleDateString();
}

function closeModal() {
  qs("#modal").classList.add("hidden");
}

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s ?? "";
  return div.innerHTML;
}

function loadSection(section) {
  const q = qs(`#${section}-search`)?.value ?? "";
  if (section === "artists") loadArtists(q);
  if (section === "songs") loadSongs(q);
  if (section === "albums") loadAlbums(q);
  if (section === "playlists") loadPlaylists(q);
}

// Init
function init() {
  initNav();
  qs("#modal-cancel").addEventListener("click", closeModal);
  qs("#modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") closeModal();
  });

  qs("#artists-search").addEventListener("input", debounce(() => loadArtists(qs("#artists-search").value), 300));
  qs("#songs-search").addEventListener("input", debounce(() => loadSongs(qs("#songs-search").value), 300));
  qs("#albums-search").addEventListener("input", debounce(() => loadAlbums(qs("#albums-search").value), 300));
  qs("#playlists-search").addEventListener("input", debounce(() => loadPlaylists(qs("#playlists-search").value), 300));

  qs("#artist-add").addEventListener("click", () => openArtistModal());
  qs("#song-add").addEventListener("click", () => openSongModal());
  qs("#album-add").addEventListener("click", () => openAlbumModal());
  qs("#playlist-add").addEventListener("click", () => openPlaylistModal());

  loadArtists();
}

function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

init();
