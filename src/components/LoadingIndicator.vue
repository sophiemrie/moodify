<template>
    <div class="loading-dots">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoadingIndicator'
  };
  </script>
  
  <style scoped>
  .loading-dots {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  
  .dot {
    width: 15px;
    height: 15px;
    margin: 5px;
    border-radius: 50%;
    background-color: #FFAA2B;
    animation: bounce 1.5s infinite ease-in-out;
  }
  
  .dot:nth-child(2) {
    animation-delay: -0.3s;
  }
  
  .dot:nth-child(3) {
    animation-delay: -0.6s;
  }
  
  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
  </style>
  