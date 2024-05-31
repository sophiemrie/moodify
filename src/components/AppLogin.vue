<template>
  <div class="login-container">
    <h1>Login with Spotify</h1>
    <button @click="loginWithSpotify">Login</button>
  </div>
</template>

<script>
export default {
  methods: {
    loginWithSpotify() {
      const clientId = process.env.VUE_APP_SPOTIFY_CLIENT_ID;
      const redirectUri = 'http://localhost:8080/callback';
      const scopes = 'user-read-private user-read-email playlist-modify-private playlist-read-private playlist-modify-public playlist-read-collaborative';
      const authEndpoint = 'https://accounts.spotify.com/authorize';

      const url = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=token&show_dialog=true`;
      window.location = url;
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f0f0f0;
}
h1 {
  color: #4da6ff;
}
button {
  background-color: #ffcc5c;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #e6b34b;
}
</style>
