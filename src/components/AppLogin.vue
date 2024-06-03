<template>
  <div class="login-container">
    <img src="@/assets/images/logo-blau.png" />
    <h1>Welcome to moodify</h1>
    <button @click="loginWithSpotify">Login with Spotify</button>
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
  background: #FFF9E8;
}

.login-container img{
  height: 250px;
}

</style>
