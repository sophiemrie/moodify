<template>
  <div class="playlist-container">
    <Header :user="user" />
    <div v-if="token">
      <h2>Your Playlists</h2>
      <div class="playlist-item-container">
        <div v-if="isLoading" class="loading-indicator">
          <LoadingIndicator />
        </div>
        <div class="playlist-list">
          <div v-for="playlist in paginatedPlaylists" :key="playlist.id" class="playlist-item"
            @click="goToDetail(playlist.id)">
            <div class="playlist-image-container">
              <img :src="getPlaylistImage(playlist)" alt="Playlist Image" class="playlist-image" />
            </div>
            <div class="playlist-name">{{ playlist.name }}</div>
          </div>
        </div>
      </div>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Prev</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './AppHeader.vue';
import axios from 'axios';
import LoadingIndicator from './LoadingIndicator.vue';

const defaultImagePath = require('../assets/images/logo-blau.png');

export default {
  components: {
    Header,
    LoadingIndicator
  },
  data() {
    return {
      token: null,
      user: null,
      playlists: [],
      currentPage: 1,
      pageSize: 16
    };
  },
  computed: {
    paginatedPlaylists() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      return this.playlists.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.playlists.length / this.pageSize);
    }
  },
  methods: {
    async fetchUser() {
      if (!this.token) return;
      try {
        const response = await axios.get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        this.user = response.data;
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    async fetchPlaylists() {
      if (!this.token) return;
      this.isLoading = true;
      try {
        let response = await axios.get('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          params: {
            limit: 50 // Maximum number of playlists to fetch per request
          }
        });

        // Fetch additional playlists if there are more than 50
        let allPlaylists = response.data.items;
        this.isLoading = false;
        while (response.data.next) {
          response = await axios.get(response.data.next, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          });
          allPlaylists = allPlaylists.concat(response.data.items);
        }

        this.playlists = allPlaylists;
      } catch (error) {
        console.error('Error fetching playlists:', error);
        this.isLoading = false;
      }
    },
    getPlaylistImage(playlist) {
      if (playlist.images != null && playlist.images.length > 0) {
        return playlist.images[0].url;
      } else {
        return defaultImagePath; 
      }
    },
    goToDetail(id) {
      this.$router.push({ name: 'PlaylistDetail', params: { id } });
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  },
  created() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    this.token = params.get('access_token');
    if (this.token) {
      localStorage.setItem('spotify_token', this.token);
      this.fetchUser();
      this.fetchPlaylists();
    } else {
      this.token = localStorage.getItem('spotify_token');
      if (this.token) {
        this.fetchUser();
        this.fetchPlaylists();
      }
    }
  }
};
</script>

<style scoped>
.playlist-container {
  padding: 20px;
  background: #f0f0f0;
  min-height: 100vh;
}

.playlist-item-container{
  height: 612px;
}

.playlist-item-container .loading-indicator {
  height: 100%;
}


.playlist-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.playlist-item {
  background: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.playlist-image-container {
  width: 200px;
  height: 200px;
  overflow: hidden;
  border-radius: 5px;
}

.playlist-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 5px;
}

.playlist-item:hover {
  transform: translateY(-5px);
  transition: transform 0.3s ease;
}

.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination button {
  background-color: #6482F4;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 16px;
  border-radius: 16px;
  cursor: pointer;
  margin: 0 5px;
  width: 5em;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination span {
  font-size: 16px;
}

.playlist-name {
  color: #333;
  text-decoration: none;
  font-size: 18px;
  margin-top:10px;
}
</style>
